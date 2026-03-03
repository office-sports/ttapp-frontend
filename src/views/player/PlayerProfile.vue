<template>
  <div class="profile-container" v-if="this.player">
    <div class="profile-left">
      <div class="profile-picture">
        <div class="circular-pic">
          <img
            :src="playerPicUrl"
            class="pic"
            @error="imageLoadError = true"
            v-if="!imageLoadError"
          />
          <div v-if="imageLoadError" class="pic-fallback">
            <i class="far fa-user"></i>
          </div>
        </div>
      </div>
      <div class="player-name">{{ player.name }}</div>
      <nav class="sidebar-nav">
        <div class="sidebar-link" :class="{ active: activeTab === 1 }" @click="setActiveTab(1)">
          <i class="far fa-play-circle"></i> Statistics
        </div>
        <div class="sidebar-link" :class="{ active: activeTab === 2 }" @click="setActiveTab(2)">
          <i class="far fa-play-circle"></i> Games history
        </div>
        <div class="sidebar-link" :class="{ active: activeTab === 3 }" @click="setActiveTab(3)">
          <i class="far fa-play-circle"></i> Upcoming games
        </div>
        <div class="sidebar-link" :class="{ active: activeTab === 4 }" @click="setActiveTab(4)">
          <i class="far fa-play-circle"></i> Opponents
        </div>
      </nav>
    </div>
    <div class="profile-content">
      <div v-show="activeTab === 1">
        <div class="stat-hero">
          <div class="stat-hero-item stat-hero-elo-group">
            <div class="stat-hero-elo-main">
              <div class="stat-hero-value">
                {{ player.elo }}
                <span v-if="eloChange !== 0" class="elo-badge" :class="eloChange > 0 ? 'elo-up' : 'elo-down'">
                  {{ eloChange > 0 ? '↑' : '↓' }} {{ Math.abs(eloChange) }}
                </span>
              </div>
              <div class="stat-hero-label">Current ELO</div>
            </div>
          </div>
          <div v-if="peakElo !== null" class="stat-hero-divider"></div>
          <div v-if="peakElo !== null" class="stat-hero-item stat-hero-item-pair">
            <div class="stat-hero-pair-row">
              <div class="stat-hero-sub-value elo-positive">{{ peakElo }}</div>
              <div class="stat-hero-sub-label">Peak ELO</div>
            </div>
            <div class="stat-hero-pair-row">
              <div class="stat-hero-sub-value elo-negative">{{ bottomElo }}</div>
              <div class="stat-hero-sub-label">Bottom ELO</div>
            </div>
          </div>
          <div class="stat-hero-divider"></div>
          <div class="stat-hero-item">
            <div class="stat-hero-value">{{ player.games_played }}</div>
            <div class="stat-hero-label">Games Played</div>
          </div>
          <div class="stat-hero-divider"></div>
          <div class="stat-hero-item">
            <div class="stat-hero-value">{{ player.pps.toFixed(1) }}</div>
            <div class="stat-hero-label">Points Per Set</div>
          </div>
        </div>
        <div class="wdl-bar-section">
          <div class="wdl-bar">
            <div class="wdl-segment wdl-wins" :style="{ width: player.win_percentage + '%' }"></div>
            <div class="wdl-segment wdl-draws" :style="{ width: player.draw_percentage + '%' }"></div>
            <div class="wdl-segment wdl-losses" :style="{ width: player.loss_percentage + '%' }"></div>
          </div>
          <div class="wdl-labels">
            <div class="wdl-label">
              <span class="wdl-dot wdl-dot-wins"></span>
              <span class="wdl-count">{{ player.wins }}</span>
              <span class="wdl-name">Wins</span>
              <span class="wdl-pct">{{ player.win_percentage.toFixed(1) }}%</span>
            </div>
            <div class="wdl-label">
              <span class="wdl-dot wdl-dot-draws"></span>
              <span class="wdl-count">{{ player.draws }}</span>
              <span class="wdl-name">Draws</span>
              <span class="wdl-pct">{{ player.draw_percentage.toFixed(1) }}%</span>
            </div>
            <div class="wdl-label">
              <span class="wdl-dot wdl-dot-losses"></span>
              <span class="wdl-count">{{ player.losses }}</span>
              <span class="wdl-name">Losses</span>
              <span class="wdl-pct">{{ player.loss_percentage.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <div class="stats-insights">
          <div v-if="nemesis" class="stats-insight-item">
            <router-link :to="'/player/' + nemesis.opponent_id + '/profile'" class="insight-value elo-negative insight-link">{{ nemesis.opponent_name }}</router-link>
            <div class="insight-label">Nemesis <span class="insight-sub">({{ nemesis.losses }} losses)</span></div>
          </div>
          <div v-if="favouriteVictim" class="stats-insight-item">
            <router-link :to="'/player/' + favouriteVictim.opponent_id + '/profile'" class="insight-value elo-positive insight-link">{{ favouriteVictim.opponent_name }}</router-link>
            <div class="insight-label">Favourite Victim <span class="insight-sub">({{ favouriteVictim.wins }} wins)</span></div>
          </div>
          <div v-if="mostPlayedOpponent" class="stats-insight-item">
            <router-link :to="'/player/' + mostPlayedOpponent.opponent_id + '/profile'" class="insight-value insight-link">{{ mostPlayedOpponent.opponent_name }}</router-link>
            <div class="insight-label">Most Played <span class="insight-sub">({{ mostPlayedOpponent.games }} games)</span></div>
          </div>
        </div>

        <div v-if="lineChartData" class="elo-chart-section">
          <div class="elo-chart-header">
            <div class="elo-chart-title">ELO Progression</div>
            <div v-if="lastResults.length" class="last-results">
              <template v-for="(winnerId, i) in [...lastResults].reverse()" :key="i">
                <PlayerFormLabel :player-id="player.id" :winner-id="winnerId" />
              </template>
              <i class="fas fa-long-arrow-alt-right form-arrow"></i>
            </div>
          </div>
          <GChart type="AreaChart" :data="lineChartData" :options="lineChartOptions" class="chartElo" />
        </div>
      </div>
              <div v-show="activeTab === 2">
                <div style="font-size: 20px">GAMES HISTORY</div>
                <table v-if="results" class="tbl-fixtures">
                  <tbody>
                    <tr>
                      <td>date played</td>
                      <td>home player</td>
                      <td>away player</td>
                      <td colspan="3">score</td>
                      <td class="text-right">set scores</td>
                    </tr>
                    <template
                      v-for="(result, index) in results"
                      v-bind:key="result.id"
                      class="tr-row"
                    >
                      <tr v-if="index === 0">
                        <td colspan="7">
                          <div class="round-container-light">
                            {{ this.tournaments[result.tournament_id].name }},
                            <span
                              class="txt-col-recap-player"
                              v-if="
                                this.tournaments[result.tournament_id]
                                  .is_playoffs === 1
                              "
                            >
                              {{ result.group_name }} Playoffs</span
                            >
                            <span v-else class="txt-col-recap-player"
                              >{{ result.group_name }} Group</span
                            >
                          </div>
                        </td>
                      </tr>
                      <tr
                        v-else-if="
                          result.tournament_id !==
                          this.results[index - 1].tournament_id
                        "
                      >
                        <td colspan="7">
                          <div class="round-container-light">
                            {{ this.tournaments[result.tournament_id].name }},
                            <span
                              class="txt-col-recap-player"
                              v-if="
                                this.tournaments[result.tournament_id]
                                  .is_playoffs === 1
                              "
                            >
                              {{ result.group_name }} Playoffs</span
                            >
                            <span v-else class="txt-col-recap-player"
                              >{{ result.group_name }} Group</span
                            >
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="txt-col-darker">
                          {{ result.date_played }}
                        </td>
                        <td>
                          <span
                            v-bind:class="
                              result.winner_id === result.home_player_id
                                ? 'col-winner'
                                : ''
                            "
                          >
                            {{ result.home_player_name }}
                          </span>
                        </td>
                        <td>
                          <span
                            v-bind:class="
                              result.winner_id == result.away_player_id
                                ? 'col-winner'
                                : ''
                            "
                          >
                            {{ result.away_player_name }}
                          </span>
                        </td>
                        <td>
                          {{ result.home_score_total }}
                        </td>
                        <td>-</td>
                        <td>
                          {{ result.away_score_total }}
                        </td>
                        <td class="text-right">
                          <span v-if="result.is_walkover == '1'">
                            walkover
                          </span>
                          <span v-else>
                            <span
                              v-for="score in result.scores"
                              v-bind:key="score.set"
                              class="sets-score txt-col-darker"
                            >
                              {{ score.home }} - {{ score.away }}
                            </span>
                          </span>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
              <div v-show="activeTab === 3">
                <div class="padb10" style="font-size: 20px; color: white">
                  UPCOMING TOURNAMENT MATCHES
                </div>
                <table class="tbl-fixtures">
                  <tbody>
                    <tr>
                      <td>planned date</td>
                      <td>opponent</td>
                      <td class="text-center">opponent's ELO rating</td>
                      <td class="text-center">ELO diff</td>
                    </tr>
                    <tr
                      v-for="event in schedule"
                      v-bind:key="event.id"
                      class="row-data"
                    >
                      <td>
                        {{ event.date_of_match }}
                      </td>
                      <td v-if="event.home_player_id == player.id">
                        {{ event.away_player_name }}
                      </td>
                      <td v-else>
                        {{ event.home_player_name }}
                      </td>
                      <td
                        class="text-center"
                        v-if="event.home_player_id == player.id"
                      >
                        <span style="color: white">{{ event.away_elo }}</span>
                      </td>
                      <td class="text-center" v-else>
                        <span style="color: white">{{ event.home_elo }}</span>
                      </td>
                      <td
                        class="text-center"
                        v-if="event.home_player_id == player.id"
                      >
                        <span v-if="player.elo - event.away_elo < 0">
                          {{ event.away_elo - player.elo }}
                        </span>
                        <span v-else>
                          {{ event.away_elo - player.elo }}
                        </span>
                      </td>
                      <td class="text-center" v-else>
                        <span v-if="player.elo - event.home_elo < 0 < 0">
                          {{ event.home_elo - player.elo }}
                        </span>
                        <span v-else>
                          {{ event.home_elo - player.elo }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-show="activeTab === 4">
                <div style="font-size: 20px">OPPONENTS</div>
                <table v-if="opponents" class="tbl-fixed mart20">
                  <tbody>
                    <tr>
                      <td class="w200">Opponent</td>
                      <td class="text-center">Games vs</td>
                      <td class="text-center">Wins</td>
                      <td class="text-center">Draws</td>
                      <td class="text-center">Losses</td>
                      <td class="text-center">WO player</td>
                      <td class="text-center">WO opponent</td>
                    </tr>
                    <tr
                      v-for="opponent in opponents"
                      v-bind:key="opponent.opponent_id"
                      class="tr-row"
                    >
                      <td class="text-left">
                        <!--                    <span @click="this.switchPlayer(opponent.opponent_id)">{{-->
                        <!--                      opponent.opponent_name-->
                        <!--                    }}</span>-->
                        <router-link
                          :to="'/player/' + opponent.opponent_id + '/profile'"
                        >
                          {{ opponent.opponent_name }}
                        </router-link>
                      </td>
                      <td class="text-center txt-col-green">
                        {{ opponent.games }}
                      </td>
                      <td
                        :class="opponent.wins === 0 ? 'txt-col-darkest' : ''"
                        class="text-center"
                      >
                        {{ opponent.wins }}
                      </td>
                      <td
                        :class="opponent.draws === 0 ? 'txt-col-darkest' : ''"
                        class="text-center"
                      >
                        {{ opponent.draws }}
                      </td>
                      <td
                        :class="opponent.losses === 0 ? 'txt-col-darkest' : ''"
                        class="text-center"
                      >
                        {{ opponent.losses }}
                      </td>
                      <td class="text-center">
                        <span
                          :class="
                            opponent.player_walkovers === 0
                              ? 'txt-col-darkest'
                              : ''
                          "
                        >
                          {{ opponent.player_walkovers }}
                        </span>
                      </td>
                      <td class="text-center">
                        <span
                          :class="
                            opponent.opponent_walkovers === 0
                              ? 'txt-col-darkest'
                              : ''
                          "
                        >
                          {{ opponent.opponent_walkovers }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
    </div>
  </div>
</template>

<script>
import _, { forEach } from "underscore";
import axios from "axios";
import { GChart } from "vue-google-charts";
import PlayerFormLabel from "@/components/game/PlayerFormLabel.vue";

export default {
  name: "PlayerProfile",
  methods: {
    setActiveTab(data) {
      this.activeTab = data;
    },
  },
  components: { GChart, PlayerFormLabel },
  data() {
    return {
      tournaments: [],
      opponents: [],
      accuracyBarWidth: 150,
      accuracyValues: [],
      activeTab: 1,
      player: null,
      playerPicUrl: null,
      imageLoadError: false,
      winPercentage: 0,
      drawPercentage: 0,
      lossPercentage: 0,
      pps: 0,
      resultsByGroup: [],
      results: [],
      schedule: [],
      eloChange: 0,
      lastResults: [],
      longestWinStreak: 0,
      nemesis: null,
      favouriteVictim: null,
      mostPlayedOpponent: null,
      peakElo: null,
      bottomElo: null,
      strokeDashArrayWins: "0 100",
      strokeDashArrayDraws: "0 100",
      strokeDashArrayLosses: "0 100",
      lineChartData: null,
      lineChartOptions: {
        vAxis: {
          baselineColor: "#333",
          textStyle: { color: "#555", fontSize: 11 },
          gridlines: { count: 3, color: "#2a2a2a" },
          minorGridlines: { count: 0 },
        },
        hAxis: {
          baselineColor: "#333",
          textStyle: { color: "#555", fontSize: 11 },
          gridlines: { count: 0 },
          minorGridlines: { count: 0 },
        },
        height: 220,
        lineWidth: 2,
        pointSize: 6,
        pointsVisible: true,
        legend: { position: "none" },
        fontName: "Quicksand",
        backgroundColor: "#1e1e26",
        chartArea: { backgroundColor: "#1e1e26", left: 50, right: 20, top: 10, bottom: 30 },
        colors: ["#93c47d"],
        areaOpacity: 0.15,
      },
    };
  },
  mounted() {
    axios
      .all([
        axios.get("/api/players/" + this.$route.params.id),
        axios.get("/api/players/" + this.$route.params.id + "/results"),
        axios.get("/api/players/" + this.$route.params.id + "/schedule"),
        axios.get("/api/players/" + this.$route.params.id + "/opponents"),
        axios.get("/api//tournaments"),
      ])
      .then(
        axios.spread((player, results, schedule, opponents, tournaments) => {
          this.player = player.data;
          this.strokeDashArrayWins =
            player.data.win_percentage + " " + player.data.not_win_percentage;
          this.winPercentage = player.data.winPercentage;
          this.strokeDashArrayDraws =
            player.data.draw_percentage + " " + player.data.not_draw_percentage;
          this.drawPercentage = player.data.drawPercentage;
          this.strokeDashArrayLosses =
            player.data.loss_percentage + " " + player.data.not_loss_percentage;
          this.lossPercentage = player.data.loss_percentage;
          this.playerPicUrl = player.data.profile_pic_url;
          this.pps = player.data.pps;
          this.lineChartData = [
            ["order", "ELO history"],
            ...player.data.elo_history,
          ];
          if (player.data.elo_history.length) {
            const eloValues = player.data.elo_history.map(h => h[1]);
            this.peakElo = Math.max(...eloValues);
            this.bottomElo = Math.min(...eloValues);
          }

          this.results = results.data;
          this.schedule = schedule.data;
          this.opponents = opponents.data;

          this.tournaments = _.indexBy(tournaments.data, function (e) {
            return e.id;
          });

          let playerId = this.player.id;
          if (this.results.length > 0) {
            if (this.results[0].home_player_id === playerId) {
              this.eloChange = this.results[0].home_elo_diff;
            } else {
              this.eloChange = this.results[0].away_elo_diff;
            }
            this.lastResults = this.results.slice(0, 7).map(r => r.winner_id);

            let longest = 0, current = 0;
            for (const r of [...this.results].reverse()) {
              if (Number(r.winner_id) === Number(playerId)) { current++; longest = Math.max(longest, current); }
              else { current = 0; }
            }
            this.longestWinStreak = longest;
          }

          if (this.opponents && this.opponents.length > 0) {
            const opp = this.opponents;
            this.nemesis = opp.reduce((m, o) => o.losses > (m?.losses ?? -1) ? o : m, null);
            this.favouriteVictim = opp.reduce((m, o) => o.wins > (m?.wins ?? -1) ? o : m, null);
            this.mostPlayedOpponent = opp.reduce((m, o) => o.games > (m?.games ?? -1) ? o : m, null);
          }
        })
      )
      .catch((error) => {
        console.log("Error when getting data for matches " + error);
      });
  },
};
</script>

<style>
.elo-chart-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(84, 84, 84, 0.3); }
.elo-chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.elo-chart-title { font-size: 12px; text-transform: uppercase; color: #888; font-weight: 500; letter-spacing: 0.05em; }
.last-results { display: flex; align-items: center; gap: 3px; }
.form-arrow { font-size: 10px; color: white; padding: 0 1px; }

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.sidebar-link {
  padding: 8px 0;
  border-bottom: 1px solid rgba(84, 84, 84, 0.4);
  color: white;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.sidebar-link:last-child { border-bottom: none; }
.sidebar-link i { color: white; font-size: 12px; }
.sidebar-link:hover { color: #269a47; }
.sidebar-link.active { color: #269a47; font-weight: 600; }

.profile-container {
  display: flex;
  flex-direction: row;
  background: var(--color-container);
  border-radius: 20px;
  overflow: hidden;
  padding: 0;
  align-items: stretch;
}

.profile-left {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #0f1017;
}

.profile-picture {
  width: 100%;
  display: flex;
  justify-content: center;
}

.player-name {
  color: white;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
}

.profile-content {
  flex: 1;
  padding: 20px;
  min-width: 0;
}

.stat-hero {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 10px 0 24px 0;
}
.stat-hero-item { display: flex; flex-direction: column; gap: 2px; }
.stat-hero-value { font-size: 48px; font-weight: 800; color: white; line-height: 1; }
.stat-hero-label { font-size: 12px; text-transform: uppercase; color: #888; font-weight: 500; letter-spacing: 0.05em; }
.stat-hero-divider { width: 1px; height: 50px; background: rgba(84,84,84,0.5); }
.elo-badge { font-size: 15px; font-weight: 600; vertical-align: middle; padding: 1px 5px; border-radius: 20px; margin-left: 6px; }
.elo-up { color: #93c47d; background: rgba(147,196,125,0.15); }
.elo-down { color: #d4836e; background: rgba(212,131,110,0.15); }
.elo-positive { color: #93c47d; }
.elo-negative { color: #d4836e; }
.stat-hero-item-pair { display: flex; flex-direction: column; gap: 6px; }
.stat-hero-elo-group { display: flex; flex-direction: row; align-items: center; gap: 12px; }
.stat-hero-elo-main { display: flex; flex-direction: column; gap: 2px; }
.stat-hero-pair-row { display: flex; flex-direction: column; gap: 1px; }
.stat-hero-sub-value { font-size: 24px; font-weight: 700; line-height: 1; }
.stat-hero-sub-label { font-size: 11px; text-transform: uppercase; color: #888; font-weight: 500; letter-spacing: 0.05em; }
.wdl-bar-section { display: flex; flex-direction: column; gap: 14px; }

.stats-insights {
  display: flex;
  gap: 0;
  margin-top: 24px;
  border-top: 1px solid rgba(84, 84, 84, 0.3);
  padding-top: 20px;
  flex-wrap: wrap;
}
.stats-insight-item {
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 16px 0 0;
}
.stats-insight-item:not(:last-child) {
  border-right: 1px solid rgba(84, 84, 84, 0.3);
  margin-right: 16px;
}
.insight-value { font-size: 18px; font-weight: 700; color: white; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.insight-link { text-decoration: none; }
.insight-link:hover { text-decoration: underline; }
.insight-label { font-size: 11px; text-transform: uppercase; color: #888; font-weight: 500; letter-spacing: 0.05em; }
.insight-sub { color: #666; font-weight: 400; text-transform: none; letter-spacing: 0; }
.wdl-bar { display: flex; height: 14px; border-radius: 7px; overflow: hidden; background: rgba(84,84,84,0.3); }
.wdl-segment { height: 100%; transition: width 0.4s ease; }
.wdl-wins   { background: #93c47d; }
.wdl-draws  { background: #d9ead3; }
.wdl-losses { background: #d4836e; }
.wdl-labels { display: flex; gap: 24px; }
.wdl-label { display: flex; align-items: center; gap: 6px; font-size: 14px; }
.wdl-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.wdl-dot-wins   { background: #93c47d; }
.wdl-dot-draws  { background: #d9ead3; }
.wdl-dot-losses { background: #d4836e; }
.wdl-count { color: white; font-weight: 700; }
.wdl-name { color: #aaa; }
.wdl-pct { color: #666; }

.w150 {
  width: 150px;
}

.w200 {
  width: 200px;
}

.accuracy-bar {
  display: block;
  border-radius: 10px 0 0 10px;
  height: 15px;
  background: var(--color-green);
}

.accuracy-bar-wrapper {
  width: 150px;
  border-radius: 10px;
  height: 15px;
  background: #303030;
  margin: 20px auto 0px;
}

.circular-pic {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 3px solid rgba(84, 84, 84, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pic-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-container);
  color: white;
}

.pic-fallback i {
  font-size: 60px;
  color: rgba(200, 200, 200, 0.7);
}
</style>
