<template>
  <template v-if="this.matches.length !== 0">
    <div class="round-container-green">
      <div
        class="round-container-green-small flex txt-col-darker flex-full-width"
      >
        <span class="txt-col-white">
          <i class="fas fa-trophy marr10"></i>
          {{ this.tournament.name }}</span
        >
        <span class="padr10">
          <router-link
            :to="{
              name: 'Ladders',
              params: { id: this.tournament.id },
            }"
            >View ladder
          </router-link>
        </span>
      </div>
    </div>

    <div v-if="this.tournament.is_finished && false">
      <div class="mart20 round-container">
        <div class="round-container-dark-small shine">
          Final standings Premier League
        </div>
        <div class="padt20">
          <table class="tbl-fixed txtc" style="font-size: 20pt">
            <tr>
              <td class="col-winner"></td>
              <td class="col-winner"></td>
              <td class="col-winner"></td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div class="round-container mart20">
      <div class="round-container-dark-small">Games by order of play</div>
      <div class="pad10">
        <table>
          <template v-for="(match, index) in this.matches" v-bind:key="index">
            <tr v-if="index === 0">
              <td>
                <div class="round-container-dgreen">
                  {{ match.group_name }}
                </div>
              </td>
            </tr>
            <tr
              v-else-if="
                match.group_name !== this.matches[index - 1].group_name
              "
            >
              <td>
                <div class="round-container-dgreen">
                  {{ match.group_name }}
                </div>
              </td>
            </tr>
            <tr>
              <td :class="match.is_final_game === 1 ? 'td-final' : ''">
                <div
                  :class="
                    parseInt(this.selectedGame) === match.game_id
                      ? 'round-container-lighter'
                      : 'round-container-light'
                  "
                >
                  <table>
                    <tr class="tr-playoff-row">
                      <td
                        v-if="match.winner_id !== 0"
                        rowspan="2"
                        class="td-winner-indicator"
                      ></td>
                      <td
                        v-else-if="
                          isLive(match) &&
                          parseInt(match.game_id) === parseInt(this.liveMatchId)
                        "
                        rowspan="2"
                        class="indicator-anim"
                      >
                        <div class="pong">&nbsp;</div>
                      </td>
                      <td
                        v-else
                        rowspan="2"
                        :class="
                          parseInt(this.selectedGame) === match.game_id
                            ? 'td-indicator-white'
                            : 'td-indicator'
                        "
                      ></td>
                      <td class="padl10 w30">#{{ match.order }}</td>
                      <td class="w_game_name">{{ match.game_name }}</td>
                      <td>
                        <GameVersusTable :match="match" />
                      </td>
                      <td class="txtl" style="width: 280px">
                        <span v-if="match.winner_id !== 0">
                          {{ match.home_score_total }} -
                          {{ match.away_score_total }}
                        </span>
                        <span class="padl20">
                          <template v-if="match.winner_id !== 0">
                            <span
                              v-for="score in match.scores"
                              v-bind:key="score.set"
                              class="sets-score"
                            >
                              {{ score.home }}:{{ score.away }}</span
                            >
                          </template>
                          <span v-if="match.is_walkover === 1" class="padl10"
                            ><i class="fas fa-flag"></i
                          ></span>
                        </span>
                      </td>
                      <td class="txtc w-playoff-options">
                        <div
                          v-if="match.announced === 0 && match.winner_id === 0"
                        >
                          scheduled
                        </div>
                        <div
                          v-else-if="
                            isLive(match) &&
                            parseInt(match.game_id) ===
                              parseInt(this.liveMatchId)
                          "
                          class="col-winner"
                        >
                          live
                        </div>
                        <div class="txt-col-darker" v-else>finished</div>
                      </td>
                      <td class="txtr padr10 w-playoff-options">
                        <div
                          v-if="
                            match.announced === 0 &&
                            match.winner_id === 0 &&
                            match.home_player_id !== 0 &&
                            match.away_player_id !== 0
                          "
                        >
                          <router-link
                            :to="{
                              name: 'GameScoring',
                              params: { id: match.game_id },
                            }"
                            >play
                          </router-link>
                        </div>
                        <div
                          v-if="
                            isLive(match) &&
                            parseInt(match.game_id) ===
                              parseInt(this.liveMatchId)
                          "
                        >
                          <router-link
                            :to="{
                              name: 'GameSpectate',
                              params: { id: match.game_id },
                            }"
                            >spectate
                          </router-link>
                        </div>
                        <div v-if="match.winner_id !== 0">
                          <router-link
                            :to="{
                              name: 'GameResult',
                              params: { id: match.game_id },
                            }"
                            >result
                          </router-link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" class="padl10 txt-col-darker">
                        Outcome: {{ match.level }}
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </template>
</template>

<script>
import axios from "axios";
import _ from "underscore";
import GameVersusTable from "@/components/tournament/GameVersusTable.vue";
import { SocketHandler } from "@/models/SocketHandler";

export default {
  name: "PlayoffsSchedule",
  components: { GameVersusTable },
  props: ["tournament"],
  data() {
    return {
      liveMatchId: 0,
      matches: [],
      socketHandler: {},
      interval: null,
      selectedGame: 0,
    };
  },
  methods: {
    isLive(match) {
      return match.announced === 1 && match.winner_id === 0;
    },
    getData() {
      axios
        .all([
          axios.get("/api/tournaments/" + this.tournament.id + "/ladders"),
          axios.get("/api/tournaments/" + this.tournament.id + "/live_games"),
        ])
        .then(
          axios.spread((ladders, games) => {
            let matchData = [];
            for (let i = 0; i < ladders.data.length; i++) {
              matchData.push(...ladders.data[i].ladder_group);
            }
            matchData = _.sortBy(matchData, function (elem) {
              return elem.order;
            });
            if (games.data.length > 0) {
              this.liveMatchId = _.first(games.data).id;
            }
            this.matches = matchData;
          })
        )
        .catch((error) => {
          console.log("Error fetching tournament ladder " + error);
        })
        .finally(() => {
          this.socketHandler.appSocket.on("MSG_GAME_FINISHED", (data) => {
            for (let i = 0; i < this.matches.length; i++) {
              if (this.matches[i].game_id === parseInt(data.id)) {
                this.matches[i].winner_id = data.winnerId;
                this.matches[i].home_score_total = data.homeScoreTotal;
                this.matches[i].away_score_total = data.awayScoreTotal;
                this.matches[i].scores = data.setScores;
              }
            }
            this.liveMatchId = data.id;
          });
          this.socketHandler.appSocket.on("MSG_GAME_STARTED", (data) => {
            for (let i = 0; i < this.matches.length; i++) {
              if (this.matches[i].game_id === parseInt(data.id)) {
                this.matches[i].announced = 1;
              }
            }
            this.liveMatchId = data.id;
          });
        });
    },
    getScheduledGames() {
      let games = _.filter(this.matches, function (elem) {
        return (
          elem.winner_id === 0 &&
          elem.home_player_id !== 0 &&
          elem.away_player_id !== 0
        );
      });
      return _.keys(_.indexBy(games, "game_id"));
    },
    selectUp() {
      let ids = this.getScheduledGames();

      if (ids.length === 0) {
        return;
      }

      // if there is no game selected yet, take first one
      if (this.selectedGame === 0) {
        this.selectedGame = ids[0];
        return;
      }

      let idx = _.indexOf(ids, this.selectedGame);

      // if the first one is selected, do nothing
      if (idx !== 0) {
        this.selectedGame = ids[idx - 1];
      }
    },
    selectDown() {
      let ids = this.getScheduledGames();

      if (ids.length === 0) {
        return;
      }

      // if there is no game selected yet, take first one
      if (this.selectedGame === 0) {
        this.selectedGame = ids[0];
        return;
      }

      let idx = _.indexOf(ids, this.selectedGame);
      // if the first one is selected, do nothing
      if (idx !== ids.length - 1) {
        this.selectedGame = ids[idx + 1];
      }
    },
    keyPressHandler(e) {
      if (this.tournament.is_finished) {
        e.preventDefault();
        return;
      }

      switch (e.keyCode) {
        case 56:
          this.selectUp();
          break;
        case 53:
          this.selectDown();
          break;
        case 13:
          if (this.tournament.is_finished === 0 && this.selectedGame !== 0) {
            this.$router.push({
              name: "GameScoring",
              params: { id: this.selectedGame },
            });
          }
          break;
      }
    },
  },
  mounted() {
    this.getData();
    this.interval = setInterval(() => {
      this.getData();
    }, 10000);
    this.socketHandler = new SocketHandler();
    this.socketHandler.setAppSocket();
  },
  unmounted() {
    clearInterval(this.interval);
    window.removeEventListener("keypress", this.keyPressHandler);
  },
  created() {
    window.addEventListener("keypress", this.keyPressHandler);
  },
};
</script>

<style lang="less">
table tr td {
  border: 0px solid white;
  vertical-align: middle;
}

.td-winner-indicator {
  background: green;
  width: 10px;
  border-radius: 5px;
}

.td-indicator {
  width: 10px;
  border-radius: 5px;
  background: #4e4e4e;
}

.td-final .td-indicator {
  width: 10px;
  border-radius: 5px;
  background: #1e1e26;
}

.td-final .round-container-light {
  background: #324d2a;
}

.td-indicator-white {
  width: 10px;
  border-radius: 5px;
  background: #fff;
}

.w_game_name {
  width: 150px;
}

.w-playoff-options {
  width: 70px;
}

.indicator-anim {
  width: 10px;
  vertical-align: top;
  //border-radius: 5px;
  //animation: anim-blink 3s infinite;

  .pong {
    width: 10px;
    background: white;
    height: 10px;
    border-radius: 100%;
    animation: bounce 0.5s;
    animation-direction: alternate;
    animation-timing-function: cubic-bezier(0.5, 0.05, 1, 0.5);
    animation-iteration-count: infinite;
  }
}

@keyframes bounce {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, 50px, 0);
  }
}

@keyframes anim-blink {
  0% {
    background: #30323c;
  }
  50% {
    background: green;
  }
  100% {
    background: #30323c;
  }
}
</style>
