<template>
  <div class="round-container" v-if="this.player">
    <table class="tbl-fixed dsp-block marb20">
      <tr>
        <td class="txtl padl10">
          <div class="cutoutPic">
            <img :src="playerPicUrl" class="pic" />
          </div>
        </td>
        <td class="txtl">
          <div class="round-container-header padl20">
            <span class="txt-col-green">{{ player.name }}</span>
          </div>
          <div class="padl20">
            <table>
              <tr>
                <td class="w200 txtc">
                  <span class="num-big col-winner">
                    {{ player.elo }}
                  </span>
                </td>
                <td class="w200 txtc">
                  <span class="num-big">
                    {{ player.win_percentage.toFixed(2) }}%
                  </span>
                </td>
                <td class="w200 txtc">
                  <span class="num-big">
                    {{ player.draw_percentage.toFixed(2) }}%
                  </span>
                </td>
                <td class="w200 txtc">
                  <span class="num-big">
                    {{ player.loss_percentage.toFixed(2) }}%
                  </span>
                </td>
                <td class="w200 txtc">
                  <span class="num-big"> {{ player.pps.toFixed(2) }} </span>
                </td>
              </tr>
              <tr>
                <td class="txt-col-player">
                  <div class="txt-bold txtc">ELO</div>
                </td>
                <td class="txt-col-player">
                  <div class="txt-bold txtc">Win percentage</div>
                </td>
                <td class="txt-col-player">
                  <div class="txt-bold txtc">Draw precentage</div>
                </td>
                <td class="txt-col-player">
                  <div class="txt-bold txtc">Loss percentage</div>
                </td>
                <td class="txt-col-player">
                  <div class="txt-bold txtc">Avg. points per set</div>
                </td>
              </tr>
              <tr>
                <td class="txtc v-bottom pad0">
                  last change:
                  <span v-if="this.eloChange < 0">
                    {{ this.eloChange }}
                    <i class="fas fa-arrow-alt-circle-down"></i>
                  </span>
                  <span class="lbl-pos" v-else-if="this.eloChange > 0">
                    +{{ this.eloChange }}
                    <i class="fas fa-arrow-alt-circle-up"></i>
                  </span>
                  <span v-else>{{ this.eloChange }}</span>
                </td>
                <td class="txtc">
                  <div class="accuracy-bar-wrapper mart10">
                    <span
                      class="accuracy-bar"
                      v-bind:style="
                        'width:' +
                        (
                          (player.win_percentage * this.accuracyBarWidth) /
                          100
                        ).toFixed(0) +
                        'px'
                      "
                      >&nbsp;</span
                    >
                  </div>
                </td>
                <td class="txtc">
                  <div class="accuracy-bar-wrapper mart10">
                    <span
                      class="accuracy-bar"
                      v-bind:style="
                        'width:' +
                        (
                          (player.draw_percentage * this.accuracyBarWidth) /
                          100
                        ).toFixed(0) +
                        'px'
                      "
                      >&nbsp;</span
                    >
                  </div>
                </td>
                <td class="txtc">
                  <div class="accuracy-bar-wrapper mart10">
                    <span
                      class="accuracy-bar"
                      v-bind:style="
                        'width:' +
                        (
                          (player.loss_percentage * this.accuracyBarWidth) /
                          100
                        ).toFixed(0) +
                        'px'
                      "
                      >&nbsp;</span
                    >
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
    <div class="round-container-dark-small flex txt-col-darker">
      <span>Games played:</span>
      <span class="marl10 txt-col-white">{{ player.games_played }}</span>
    </div>
    <div class="pad10 mart10">
      <table>
        <tr>
          <td class="w200 padr20 v-top">
            <div class="btn-link" @click="setActiveTab(1)">ELO progression</div>
            <div class="btn-link mart10" @click="setActiveTab(2)">
              Games history
            </div>
            <div class="btn-link mart10" @click="setActiveTab(3)">
              Upcoming games
            </div>
            <div class="btn-link mart10" @click="setActiveTab(4)">
              Opponents
            </div>
          </td>
          <td>
            <div v-show="this.activeTab === 1">
              <GChart
                type="AreaChart"
                :data="lineChartData"
                :options="lineChartOptions"
                class="chartElo"
              />
            </div>
            <div v-show="this.activeTab === 2">
              <div style="font-size: 20px">GAMES HISTORY</div>
              <table v-if="results" class="tbl-fixtures">
                <tr>
                  <td>date played</td>
                  <td>home player</td>
                  <td>away player</td>
                  <td colspan="3">score</td>
                  <td class="txtr">set scores</td>
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
                    <td class="txtr">
                      <span v-if="result.is_walkover == '1'"> walkover </span>
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
              </table>
            </div>
            <div v-show="this.activeTab === 3">
              <div class="padb10" style="font-size: 20px; color: white">
                UPCOMING TOURNAMENT MATCHES
              </div>
              <table class="tbl-fixtures">
                <tr>
                  <td>planned date</td>
                  <td>opponent</td>
                  <td class="txtc">opponent's ELO rating</td>
                  <td class="txtc">ELO diff</td>
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
                  <td class="txtc" v-if="event.home_player_id == player.id">
                    <span style="color: white">{{ event.away_elo }}</span>
                  </td>
                  <td class="txtc" v-else>
                    <span style="color: white">{{ event.home_elo }}</span>
                  </td>
                  <td class="txtc" v-if="event.home_player_id == player.id">
                    <span v-if="player.elo - event.away_elo < 0">
                      {{ event.away_elo - player.elo }}
                    </span>
                    <span v-else>
                      {{ event.away_elo - player.elo }}
                    </span>
                  </td>
                  <td class="txtc" v-else>
                    <span v-if="player.elo - event.home_elo < 0 < 0">
                      {{ event.home_elo - player.elo }}
                    </span>
                    <span v-else>
                      {{ event.home_elo - player.elo }}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            <div v-show="this.activeTab === 4">
              <div style="font-size: 20px">OPPONENTS</div>
              <table v-if="this.opponents" class="tbl-fixed mart20">
                <tr>
                  <td class="w200">Opponent</td>
                  <td class="txtc">Games vs</td>
                  <td class="txtc">Wins</td>
                  <td class="txtc">Draws</td>
                  <td class="txtc">Losses</td>
                  <td class="txtc">WO player</td>
                  <td class="txtc">WO opponent</td>
                </tr>
                <tr
                  v-for="opponent in opponents"
                  v-bind:key="opponent.opponent_id"
                  class="tr-row"
                >
                  <td class="txtl">
                    <!--                    <span @click="this.switchPlayer(opponent.opponent_id)">{{-->
                    <!--                      opponent.opponent_name-->
                    <!--                    }}</span>-->
                    <router-link
                      :to="'/player/' + opponent.opponent_id + '/profile'"
                    >
                      {{ opponent.opponent_name }}
                    </router-link>
                  </td>
                  <td class="txtc txt-col-green">{{ opponent.games }}</td>
                  <td
                    :class="opponent.wins === 0 ? 'txt-col-darkest' : ''"
                    class="txtc"
                  >
                    {{ opponent.wins }}
                  </td>
                  <td
                    :class="opponent.draws === 0 ? 'txt-col-darkest' : ''"
                    class="txtc"
                  >
                    {{ opponent.draws }}
                  </td>
                  <td
                    :class="opponent.losses === 0 ? 'txt-col-darkest' : ''"
                    class="txtc"
                  >
                    {{ opponent.losses }}
                  </td>
                  <td class="txtc">
                    <span
                      :class="
                        opponent.player_walkovers === 0 ? 'txt-col-darkest' : ''
                      "
                    >
                      {{ opponent.player_walkovers }}
                    </span>
                  </td>
                  <td class="txtc">
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
              </table>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import _, { forEach } from "underscore";
import axios from "axios";
import { GChart } from "vue-google-charts";
import results from "@/components/tournament/TournamentResults.vue";

export default {
  name: "PlayerProfile",
  methods: {
    setActiveTab(data) {
      this.activeTab = data;
    },
  },
  components: { GChart },
  data() {
    return {
      tournaments: [],
      opponents: [],
      accuracyBarWidth: 150,
      accuracyValues: [],
      activeTab: 1,
      player: null,
      playerPicUrl: null,
      winPercentage: 0,
      drawPercentage: 0,
      lossPercentage: 0,
      pps: 0,
      resultsByGroup: [],
      results: [],
      schedule: [],
      eloChange: 0,
      strokeDashArrayWins: "0 100",
      strokeDashArrayDraws: "0 100",
      strokeDashArrayLosses: "0 100",
      lineChartData: null,
      lineChartOptions: {
        vAxis: {
          baselineColor: "#aaa",
          textStyle: {
            color: "white",
            fontSize: 13,
          },
          minorGridLines: {
            count: 3,
          },
          gridlines: {
            count: 2,
            color: "#aaa",
          },
        },
        hAxis: {
          baselineColor: "#aaa",
          textStyle: {
            color: "white",
            fontSize: 13,
          },
          minorGridLines: {
            count: 3,
          },
          gridlines: {
            count: 2,
            color: "#aaa",
          },
        },
        height: 300,
        lineWidth: 2,
        pointSize: 10,
        pointShape: {
          type: "circle",
        },
        pointsVisible: true,
        legend: {
          position: "top",
          textStyle: {
            color: "white",
            fontSize: 13,
          },
        },
        fontName: "Quicksand",
        backgroundColor: "#1e1e26",
        chart: {
          title: "ELO progression",
        },
        chartArea: {
          backgroundColor: "#28293d",
        },
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
</style>
