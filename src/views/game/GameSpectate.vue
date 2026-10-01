<template>
  <template v-if="game && gameDetails">
    <div class="round-container spectate-shell">
      <div class="round-container-dark-small spectate-header">
        <div class="spectate-header-copy">
          <span class="text-white">Game detailed summary</span>
          <span>{{ gameDetails.summary.tournamentName }}</span>
          <span>{{ gameDetails.summary.groupName }}</span>
        </div>
      </div>

      <div class="spectate-score-panel">
        <div
          class="spectate-player spectate-player-home"
          :class="{ 'is-serving': currentServerId === game.homePlayerId }"
        >
          <div class="player-avatar">{{ initials(game.homePlayerName) }}</div>
          <div class="player-copy">
            <div class="player-name">{{ game.homePlayerName }}</div>
            <div class="player-meta">
              <span>Sets</span>
              <strong>{{ homeScoreTotal }}</strong>
            </div>
          </div>
        </div>

        <div class="spectate-current">
          <div class="current-set-label">SET {{ setNumber }}</div>

          <div class="current-score">
            <div
              class="current-score-number"
              :class="{ 'is-serving-score': currentServerId === game.homePlayerId }"
            >
              {{ homeScore }}
            </div>
            <div class="current-score-separator">–</div>
            <div
              class="current-score-number"
              :class="{ 'is-serving-score': currentServerId === game.awayPlayerId }"
            >
              {{ awayScore }}
            </div>
          </div>

          <div class="serve-status" v-if="currentServerName">
            <i class="fas fa-table-tennis"></i>
            <span>{{ currentServerName }} to serve</span>
            <span class="serve-status-separator">•</span>
            <span>{{ serveText }}</span>
          </div>
        </div>

        <div
          class="spectate-player spectate-player-away"
          :class="{ 'is-serving': currentServerId === game.awayPlayerId }"
        >
          <div class="player-copy player-copy-away">
            <div class="player-name">{{ game.awayPlayerName }}</div>
            <div class="player-meta player-meta-away">
              <span>Sets</span>
              <strong>{{ awayScoreTotal }}</strong>
            </div>
          </div>
          <div class="player-avatar">{{ initials(game.awayPlayerName) }}</div>
        </div>
      </div>

      <div class="recent-points-panel">
        <div class="recent-points-label">Recent points</div>
        <div class="recent-points-list">
          <span
            v-for="(point, index) in recentPoints"
            :key="index"
            class="recent-point"
            :class="point"
            :title="point === 'home' ? game.homePlayerName : game.awayPlayerName"
          ></span>
          <span v-if="recentPoints.length === 0" class="recent-points-empty">
            No points yet
          </span>
        </div>
      </div>

      <div class="set-strip">
        <div
          v-for="setIndex in game.maxSets"
          :key="setIndex"
          class="set-card"
          :class="{ current: setIndex === setNumber }"
        >
          <div class="set-card-label">Set {{ setIndex }}</div>
          <div v-if="setIndex <= setNumber" class="set-card-score">
            <span :class="{ won: isSetWinner(setIndex, 'home') }">
              {{ setHome(setIndex) }}
            </span>
            <span>–</span>
            <span :class="{ won: isSetWinner(setIndex, 'away') }">
              {{ setAway(setIndex) }}
            </span>
          </div>
          <div v-else class="set-card-score set-card-empty">–</div>
        </div>
      </div>
    </div>

    <div class="spectate-table-stage">
      <img
        src="@/assets/images/ttapp-spectate-table.webp"
        alt="Table tennis table"
        class="spectate-table-image"
      />
    </div>

    <div class="spectator-panel">
      <i class="fas fa-users"></i>
      <strong>{{ spectators }}</strong>
      <span>{{ spectators === 1 ? "spectator" : "spectators" }}</span>
    </div>
  </template>
</template>

<script>
import axios from "axios";
import { DetailedSummary } from "@/models/DetailedSummary";
import { Game } from "@/models/Game";
import { SocketHandler } from "@/models/SocketHandler";

export default {
  data() {
    return {
      homeScore: 0,
      awayScore: 0,
      homeScoreTotal: 0,
      awayScoreTotal: 0,
      currentServerId: 0,
      numServes: 0,
      socketHandler: {},
      setNumber: 1,
      game: null,
      gameDetails: null,
      spectators: 0,
      recentPoints: [],
    };
  },
  computed: {
    currentServerName() {
      if (!this.game) return "";
      if (this.currentServerId === this.game.homePlayerId) {
        return this.game.homePlayerName;
      }
      if (this.currentServerId === this.game.awayPlayerId) {
        return this.game.awayPlayerName;
      }
      return "";
    },
    serveText() {
      if (!this.numServes) return "serve";
      return `${this.numServes} ${this.numServes === 1 ? "serve" : "serves"} left`;
    },
  },
  methods: {
    initials(name) {
      return (name || "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
    },
    setScore(setIndex) {
      if (setIndex === this.setNumber) {
        return { home: this.homeScore, away: this.awayScore };
      }

      const set = this.game?.scores?.[setIndex - 1];
      if (!set || setIndex > this.setNumber) {
        return { home: "-", away: "-" };
      }

      return { home: set.home, away: set.away };
    },
    setHome(setIndex) {
      return this.setScore(setIndex).home;
    },
    setAway(setIndex) {
      return this.setScore(setIndex).away;
    },
    isSetWinner(setIndex, side) {
      if (setIndex >= this.setNumber) return false;

      const score = this.setScore(setIndex);
      const home = parseInt(score.home);
      const away = parseInt(score.away);

      if (Number.isNaN(home) || Number.isNaN(away)) return false;
      return side === "home" ? home > away : away > home;
    },
    syncRecentPoints(details) {
      const sets = details?.sets ?? {};
      const currentSet = sets[this.setNumber] ?? sets[String(this.setNumber)];
      const events = currentSet?.events ?? [];

      this.recentPoints = events
        .slice(-10)
        .map((event) => (event.is_home_point === 1 ? "home" : "away"));
    },
    appendRecentPoint(side) {
      this.recentPoints = [...this.recentPoints, side].slice(-10);
    },
  },
  mounted() {
    this.socketHandler = new SocketHandler();
    this.socketHandler.setAppSocket();
    this.socketHandler.setGameSocket(this.$route.params.id);

    axios
      .all([
        axios.get("/api/games/" + this.$route.params.id),
        axios.get("/api/games/" + this.$route.params.id + "/details"),
        axios.get("/api/games/" + this.$route.params.id + "/serve"),
      ])
      .then(
        axios.spread((game, gameDetails, serve) => {
          if (game.data.winner_id !== 0) {
            this.$router.push({
              name: "GameResult",
              params: { id: game.data.match_id },
            });
            return;
          }

          this.game = new Game(game.data);
          this.gameDetails = new DetailedSummary(gameDetails.data);

          this.homeScore = this.game.currentHomePoints;
          this.awayScore = this.game.currentAwayPoints;
          this.homeScoreTotal = this.game.homeScoreTotal;
          this.awayScoreTotal = this.game.awayScoreTotal;
          this.setNumber = serve.data.set_number;
          this.currentServerId = serve.data.current_server_id;
          this.numServes = serve.data.num_serves;

          this.syncRecentPoints(gameDetails.data);
        })
      )
      .catch((error) => {
        console.log("Error when getting game result " + error);
      })
      .finally(() => {
        this.socketHandler.appSocket.on("MSG_GAME_FINISHED", (data) => {
          this.$router.push({
            name: "GameResult",
            params: { id: data.id },
          });
        });

        this.socketHandler.gameSocket.on("MESSAGE", (data) => {
          const previousHome = this.homeScore;
          const previousAway = this.awayScore;
          const previousSet = this.setNumber;

          const nextSet =
            data.currentSet ??
            data.homeScoreTotal + data.awayScoreTotal + 1;

          if (nextSet !== previousSet) {
            this.recentPoints = [];
          } else if (data.score.homeScore > previousHome) {
            this.appendRecentPoint("home");
          } else if (data.score.awayScore > previousAway) {
            this.appendRecentPoint("away");
          } else if (
            data.score.homeScore < previousHome ||
            data.score.awayScore < previousAway
          ) {
            axios
              .get("/api/games/" + this.$route.params.id + "/details")
              .then((details) => this.syncRecentPoints(details.data))
              .catch(() => {});
          }

          this.homeScore = data.score.homeScore;
          this.awayScore = data.score.awayScore;
          this.homeScoreTotal = data.homeScoreTotal;
          this.awayScoreTotal = data.awayScoreTotal;
          this.currentServerId = data.currentServerId;
          this.numServes = data.numServes;
          this.setNumber = nextSet;
          this.game.scores = data.setScores;
        });

        this.socketHandler.gameSocket.on("CONNECTIONS", (data) => {
          this.spectators = data;
        });
      });
  },
  unmounted() {
    if (this.socketHandler?.gameSocket) {
      this.socketHandler.gameSocket.disconnect();
    }
    if (this.socketHandler?.appSocket) {
      this.socketHandler.appSocket.disconnect();
    }
  },
};
</script>

<style scoped>
.spectate-shell {
  padding: 20px;
}

.spectate-header {
  display: flex;
  align-items: center;
  min-height: 48px;
}

.spectate-header-copy {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #85858c;
}

.spectate-score-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(330px, 0.9fr) minmax(0, 1fr);
  align-items: stretch;
  margin-top: 14px;
  background: #11121a;
  border: 1px solid #262833;
  border-radius: 14px;
  overflow: hidden;
}

.spectate-player {
  min-height: 168px;
  padding: 30px 34px;
  display: flex;
  align-items: center;
  gap: 22px;
  position: relative;
}

.spectate-player-home {
}

.spectate-player-away {
  justify-content: flex-end;
}

.spectate-player.is-serving {
  background: linear-gradient(
    90deg,
    rgba(38, 154, 71, 0.08),
    rgba(38, 154, 71, 0)
  );
}

.spectate-player-away.is-serving {
  background: linear-gradient(
    270deg,
    rgba(38, 154, 71, 0.08),
    rgba(38, 154, 71, 0)
  );
}

.spectate-player.is-serving::before {
  content: "";
  position: absolute;
  top: 18px;
  bottom: 18px;
  width: 3px;
  border-radius: 3px;
  background: #269a47;
}

.spectate-player-home.is-serving::before {
  left: 0;
}

.spectate-player-away.is-serving::before {
  right: 0;
}

.player-avatar {
  width: 86px;
  height: 86px;
  flex: 0 0 86px;
  border: 1px solid #4e5360;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a7abb7;
  font-size: 25px;
  font-weight: 600;
  background: #1d1f28;
}

.is-serving .player-avatar {
  border-color: #269a47;
  color: #c4e9cf;
}

.player-copy-away {
  text-align: right;
}

.player-name {
  font-size: 25px;
  line-height: 1.2;
  color: #f0f0f2;
  font-weight: 600;
}

.player-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 15px;
  color: #8b8b92;
}

.player-meta-away {
  justify-content: flex-end;
}

.player-meta strong {
  min-width: 34px;
  padding: 3px 9px;
  border-radius: 6px;
  background: #242630;
  color: #f5f5f5;
  text-align: center;
  font-size: 19px;
}

.spectate-current {
  min-height: 168px;
  padding: 18px 24px 20px;
  border-left: 1px solid #20222b;
  border-right: 1px solid #20222b;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.current-set-label {
  margin-bottom: 10px;
  color: #85858c;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.current-score {
  display: flex;
  align-items: center;
  gap: 22px;
}

.current-score-number {
  min-width: 84px;
  padding: 7px 15px;
  border: 1px solid #454a58;
  border-radius: 10px;
  background: #1a1c24;
  color: #f7f7f7;
  font-size: 54px;
  line-height: 1.15;
  font-weight: 700;
  text-align: center;
}

.current-score-number.is-serving-score {
  border-color: #269a47;
  background: rgba(38, 154, 71, 0.14);
}

.current-score-separator {
  color: #777b87;
  font-size: 30px;
}

.serve-status {
  margin-top: 13px;
  min-height: 32px;
  padding: 6px 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #373a46;
  border-radius: 17px;
  background: #191b23;
  color: #d8d8dc;
  font-size: 13px;
}

.serve-status i {
  color: #f0f0f0;
}

.serve-status-separator {
  color: #626672;
}

.recent-points-panel {
  width: 100%;
  min-height: 54px;
  margin-top: 14px;
  padding: 11px 18px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 130px 1fr;
  align-items: center;
  background: #0f1017;
  border: 1px solid #242630;
  border-radius: 10px;
}

.recent-points-label {
  color: #d6d6d8;
  font-size: 14px;
}

.recent-points-list {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.recent-point {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: inline-block;
}

.recent-point.home {
  background: #4bdd76;
}

.recent-point.away {
  background: #424755;
}

.recent-points-empty {
  color: #686a72;
  font-size: 13px;
}

.set-strip {
  margin: 12px auto 0;
  display: flex;
  justify-content: center;
  gap: 7px;
  flex-wrap: wrap;
}

.set-card {
  width: 86px;
  min-height: 54px;
  padding: 7px 8px;
  box-sizing: border-box;
  border: 1px solid #373a46;
  border-radius: 7px;
  background: #181a22;
  text-align: center;
}

.set-card.current {
  border-color: #444955;
  background: #20222b;
}

.set-card-label {
  color: #9b9da5;
  font-size: 11px;
}

.set-card-score {
  margin-top: 2px;
  display: flex;
  justify-content: center;
  gap: 5px;
  color: #e4e4e7;
  font-size: 16px;
  font-weight: 600;
}

.set-card-score .won {
  color: #39c45f;
}

.set-card-empty {
  color: #6d707a;
}

.spectate-table-stage {
  margin: 24px auto 0;
  max-width: 1120px;
  overflow: visible;
  background: transparent;
  line-height: 0;
}

.spectate-table-image {
  display: block;
  width: 100%;
  height: auto;
}

.spectator-panel {
  width: fit-content;
  min-width: 180px;
  margin: -18px auto 0;
  padding: 9px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #2b2d36;
  border-radius: 10px;
  background: #0f1017;
  color: #9b9ca3;
  font-size: 13px;
}

.spectator-panel i,
.spectator-panel strong {
  color: #f2f2f2;
}

@media (max-width: 900px) {
  .spectate-score-panel {
    grid-template-columns: 1fr;
  }

  .spectate-current {
    order: -1;
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid #262833;
  }

  .spectate-player {
    min-height: auto;
    padding: 20px 24px;
  }

  .spectate-player-away {
    justify-content: flex-start;
  }

  .player-copy-away,
  .player-meta-away {
    text-align: left;
    justify-content: flex-start;
  }

  .spectate-player-away .player-copy {
    order: 2;
  }

  .spectate-player-away .player-avatar {
    order: 1;
  }

  .recent-points-panel {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .recent-points-list {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
