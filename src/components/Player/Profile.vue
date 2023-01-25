<template>
  <div class="roundWrapper">
    <table v-if="this.player">
      <tr>
        <td class="profileLeftCol txtc valignTop">
          <div class="cutoutPic">
            <img :src="playerPicUrl" class="pic" />
          </div>
          <div class="padt20">
            <span class="playerName">{{ player.name }}</span>
          </div>
          <div class="txtBig">
            ELO rating: <span class="col-green">{{ player.elo }}</span>
          </div>
          <div class="txtBig">
            Games played:
            <span class="col-green">{{ player.games_played }}</span>
          </div>
          <div class="bar txtBig">
            <span
              >W:
              <span class="col-dark-green"
                >{{ player.win_percentage.toFixed(2) }}%</span
              ></span
            >
            |
            <span
              >D:
              <span class="col-dark-green"
                >{{ player.draw_percentage.toFixed(2) }}%</span
              ></span
            >
            |
            <span
              >L:
              <span class="col-dark-green"
                >{{ player.loss_percentage.toFixed(2) }}%</span
              ></span
            >
          </div>
        </td>
        <td class="valignTop">
          <div id="eloChart">
            <GChart
              type="AreaChart"
              :data="lineChartData"
              :options="lineChartOptions"
              class="chartElo"
            />
          </div>
          <div class="inlineContainer padl30">
            <div @click="this.setActiveTab(1)">GAME HISTORY</div>
            <div @click="this.setActiveTab(2)">UPCOMING GAMES</div>
          </div>
          <div id="tabHistory" v-bind:class="activeTab === 1 ? 'show' : 'hide'">
            <div style="padding: 10px 0px; font-size: 20px; color: white">
              LAST TOURNAMENT MATCHES
            </div>
            <table v-if="results" style="width: 100%">
              <tr
                v-for="result in results"
                v-bind:key="result.id"
                class="row-data"
              >
                <td>
                  {{ result.date_played }}
                </td>
                <td class="w30pc">
                  <span
                    v-bind:class="
                      result.winner_id == result.home_player_id
                        ? 'winner-color'
                        : ''
                    "
                  >
                    {{ result.home_player_name }}
                  </span>
                </td>
                <td class="w30pc">
                  <span
                    v-bind:class="
                      result.winner_id == result.away_player_id
                        ? 'winner-color'
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
                <td style="text-align: right">
                  <span v-if="result.is_walkover == '1'"> walkover </span>
                  <span v-else class="setScores">
                    (
                    <span
                      v-for="score in result.scores"
                      v-bind:key="score.set"
                      class="score"
                    >
                      {{ score.home }} - {{ score.away }}
                    </span>
                    )
                  </span>
                </td>
              </tr>
            </table>
          </div>
          <div
            id="tabUpcoming"
            v-bind:class="activeTab === 2 ? 'show' : 'hide'"
          >
            <div style="padding: 10px 0px; font-size: 20px; color: white">
              UPCOMING TOURNAMENT MATCHES
            </div>
            <table style="width: 100%">
              <tr
                v-for="event in schedule"
                v-bind:key="event.id"
                class="row-data"
              >
                <td style="width: 200px">
                  {{ event.date_of_match }}
                </td>
                <td v-if="event.home_player_id == player.id">
                  {{ event.away_player_name }}
                </td>
                <td v-else>
                  {{ event.home_player_name }}
                </td>
                <td v-if="event.home_player_id == player.id">
                  ELO rating
                  <span style="color: white">{{ event.away_elo }}</span>
                </td>
                <td v-else>
                  ELO rating
                  <span style="color: white">{{ event.home_elo }}</span>
                </td>
                <td v-if="event.home_player_id == player.id">
                  <span v-if="event.away_elo_diff < 0">
                    <i class="fas fa-chevron-circle-down"></i>
                    {{ event.away_elo_diff }}
                  </span>
                  <span v-else>
                    <i class="fas fa-chevron-circle-up"></i>
                    {{ event.away_elo_diff }}
                  </span>
                </td>
                <td v-else>
                  <span v-if="event.home_elo_diff < 0">
                    <i class="fas fa-chevron-circle-down"></i>
                    {{ event.home_elo_diff }}
                  </span>
                  <span v-else>
                    <i class="fas fa-chevron-circle-up"></i>
                    {{ event.home_elo_diff }}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { GChart } from "vue-google-charts";
import results from "@/components/Tournament/Results.vue";

export default {
  name: "PlayerProfile",
  methods: {
    results() {
      return results;
    },
    setActiveTab(data) {
      this.activeTab = data;
    },
  },
  components: { GChart },
  data() {
    return {
      activeTab: 1,
      player: null,
      playerPicUrl: null,
      winPercentage: 0,
      drawPercentage: 0,
      lossPercentage: 0,
      strokeDashArrayWins: "0 100",
      strokeDashArrayDraws: "0 100",
      strokeDashArrayLosses: "0 100",
      lineChartData: null,
      lineChartOptions: {
        vAxis: {
          baselineColor: "#aaa",
          textStyle: {
            color: "white",
            fontSize: 16,
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
            fontSize: 16,
          },
          minorGridLines: {
            count: 3,
          },
          gridlines: {
            count: 2,
            color: "#aaa",
          },
        },
        lineWidth: 4,
        pointSize: 10,
        pointShape: "circle",
        pointsVisible: true,
        legend: {
          position: "top",
          textStyle: {
            color: "white",
            fontSize: 16,
          },
        },
        backgroundColor: "#28293d",
        curveType: "function",
        chart: {
          title: "Player's ELO history",
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
      ])
      .then(
        axios.spread((player, results, schedule) => {
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
          this.lineChartData = [
            ["order", "ELO history"],
            ...player.data.elo_history,
          ];
          this.results = results.data;
          this.schedule = schedule.data;
        })
      )
      .catch((error) => {
        console.log("Error when getting data for matches " + error);
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.show {
  visibility: visible;
}

.hide {
  visibility: hidden;
  display: none;
}

#tabHistory,
#tabUpcoming,
#eloChart {
  padding-left: 30px;
}

.inlineContainer {
  margin-bottom: 20px;

  div {
    display: inline-block;
    width: 180px;
    margin-right: 10px;
    padding: 5px;
    text-align: center;
    background-color: #9090a7;
    border-radius: 5px;
    color: white;
  }
}

div.cutoutPic {
  width: 154px;
  height: 154px;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
}

div.cutoutPic:before {
  content: "";
  position: absolute;
  bottom: 0;
  width: 146px;
  height: 146px;
  border-radius: 100%;
  border: 2px solid white;
  box-shadow: 0px 200px 0px 300px var(--color-wrapper);
}

.playerName {
  font-size: 25px;
  color: white;
}

.profileLeftCol {
  width: 300px;
}

.txtBig {
  font-size: 14pt;
}

.playerInfoName {
  margin-bottom: 20px;
}

.playerInfo {
  color: #a9a9a9;
  font-size: 18px;
}

.chartElo {
  height: 300px;
}

.pic {
  margin: 0 auto;
  width: 150px;
  margin-top: -20px;
}

.score + .score:before {
  content: ", ";
}

.winner-color {
  color: #40c500;
}
</style>
