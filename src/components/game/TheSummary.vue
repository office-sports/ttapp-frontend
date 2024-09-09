<template>
  <div v-if="this.matchData">
    <div class="roundWrapper">
      <div>
        <span class="col-green">MATCH SUMMARY</span> :
        <span class="col-blue">
          {{ homeName }} <span style="color: #8a8a8a">vs</span> {{ awayName }}
        </span>
      </div>
      <div class="col-white">{{ tournamentName }}, {{ groupName }}</div>
      <div class="padt20">
        <table>
          <tbody>
            <tr style="height: 40px; line-height: 40px">
              <td></td>
              <td
                class="text-center"
                style="min-width: 100px; color: white; font-weight: 600"
              >
                SCORE
              </td>
              <td
                class="text-center"
                style="min-width: 100px; color: #8e8e8e; font-weight: 600"
                v-for="(set, index) in this.setsData"
                v-bind:key="index"
              >
                SET {{ index }}
              </td>
              <td style="min-width: 150px; color: white; font-weight: 600">
                POINTS
              </td>
              <td style="min-width: 250px; color: white; font-weight: 600">
                SERVICE POINTS / EFFICIENCY
              </td>
            </tr>
            <tr>
              <td>
                <span
                  v-if="
                    parseInt(matchData.home_total_score) >
                    parseInt(matchData.away_total_score)
                  "
                  class="col-winner"
                >
                  {{ homeName }}
                </span>
                <span v-else class="col-white">
                  {{ homeName }}
                </span>
              </td>
              <td class="text-center" style="font-weight: 600">
                {{ matchData.home_total_score }}
              </td>
              <td
                class="text-center"
                style="min-width: 100px"
                v-for="(set, index) in this.setsData"
                v-bind:key="index"
              >
                {{ set.set_summary.home_points }}
              </td>
              <td>
                {{ matchData.home_total_points }}
                <span style="color: #8e8e8e"
                  >( {{ matchData.home_points_perc }}% )</span
                >
              </td>
              <td>
                {{ matchData.home_own_serve_points_total }} /
                {{ matchData.home_serves_total }}
                <span style="color: #8e8e8e"
                  >( {{ matchData.home_serve_points_perc }}% )</span
                >
              </td>
            </tr>
            <tr>
              <td>
                <span
                  v-if="
                    parseInt(matchData.home_total_score) <
                    parseInt(matchData.away_total_score)
                  "
                  class="col-winner"
                >
                  {{ awayName }}
                </span>
                <span v-else class="col-white">
                  {{ awayName }}
                </span>
              </td>
              <td class="text-center" style="font-weight: 600">
                {{ matchData.away_total_score }}
              </td>
              <td
                class="text-center"
                style="min-width: 100px"
                v-for="(set, index) in this.setsData"
                v-bind:key="index"
              >
                {{ set.set_summary.away_points }}
              </td>
              <td style="min-width: 100px">
                {{ matchData.away_total_points }}
                <span style="color: #8e8e8e"
                  >( {{ matchData.away_points_perc }}% )</span
                >
              </td>
              <td>
                {{ matchData.away_own_serve_points_total }} /
                {{ matchData.away_serves_total }}
                <span style="color: #8e8e8e"
                  >( {{ matchData.away_serve_points_perc }}% )</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <table>
        <tbody>
          <tr v-for="(set, index) in this.setsData" v-bind:key="index">
            <td class="padt20">
              <div class="roundWrapper">
                <div class="group-header">
                  <table>
                    <tr>
                      <td>SET {{ index }}</td>
                    </tr>
                  </table>
                </div>
                <div>
                  <table>
                    <tr>
                      <td rowspan="2" class="setPointsScored"></td>
                      <td
                        v-for="(pbp, index2) in set.events"
                        v-bind:key="index2"
                        class="text-center w40"
                      >
                        <span
                          v-if="pbp.current_server == pbp.home_player_id"
                          class="serve text-center"
                        >
                          <i class="fas fa-table-tennis"></i>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        v-for="(pbp, index2) in set.events"
                        v-bind:key="index2"
                        class="pointsScored"
                      >
                        <span>
                          {{ pbp.home_points_scored }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td class="player_name">
                        <span
                          v-if="
                            parseInt(set.set_summary.home_points) >
                            parseInt(set.set_summary.away_points)
                          "
                          class="winnerColor"
                        >
                          {{ homeName }}
                        </span>
                        <span v-else>
                          {{ homeName }}
                        </span>
                      </td>
                      <td
                        v-for="(pbp, index2) in set.events"
                        v-bind:key="index2"
                        class="text-center"
                      >
                        <span v-if="index2 === 0">
                          <span v-if="pbp.is_home_point" class="point">
                            <i class="fas fa-circle"></i>
                          </span>
                          <span v-else>
                            <i class="far fa-circle"></i>
                          </span>
                        </span>
                        <span v-else>
                          <span
                            v-if="pbp.is_home_point"
                            class="point tool"
                            v-bind:data-tip="
                              'Rally length: ' + pbp.rallySeconds + ' seconds'
                            "
                          >
                            <i class="fas fa-circle"></i>
                          </span>
                          <span v-else>
                            <i class="far fa-circle"></i>
                          </span>
                        </span>
                      </td>
                      <td class="lastPointsResult">
                        {{ set.set_summary.home_points }}
                      </td>
                    </tr>

                    <tr>
                      <td class="player_name">
                        <span
                          v-if="
                            parseInt(set.set_summary.home_points) <
                            parseInt(set.set_summary.away_points)
                          "
                          class="winnerColor"
                        >
                          {{ awayName }}
                        </span>
                        <span v-else>
                          {{ awayName }}
                        </span>
                      </td>
                      <td
                        v-for="(pbp, index2) in set.events"
                        v-bind:key="index2"
                        class="text-center"
                      >
                        <span v-if="index2 === 0">
                          <span v-if="pbp.is_away_point" class="point">
                            <i class="fas fa-circle"></i>
                          </span>
                          <span v-else>
                            <i class="far fa-circle"></i>
                          </span>
                        </span>
                        <span v-else>
                          <span
                            v-if="pbp.is_away_point"
                            class="point tool"
                            v-bind:data-tip="
                              'Rally length: ' + pbp.rallySeconds + ' seconds'
                            "
                          >
                            <i class="fas fa-circle"></i>
                          </span>
                          <span v-else>
                            <i class="far fa-circle"></i>
                          </span>
                        </span>
                      </td>
                      <td class="lastPointsResult">
                        {{ set.set_summary.away_points }}
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="2" class="setPointsScored"></td>
                      <td
                        v-for="(pbp, index2) in set.events"
                        v-bind:key="index2"
                        class="pointsScored"
                      >
                        <span>
                          {{ pbp.away_points_scored }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        v-for="(pbp, index2) in set.events"
                        v-bind:key="index2"
                        class="text-center w40"
                      >
                        <span
                          v-if="pbp.current_server == pbp.away_player_id"
                          class="serve text-center"
                        >
                          <i class="fas fa-table-tennis"></i>
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="padt20 mart20 set_summary">
                  <table>
                    <tr>
                      <td class="noborder text-center" style="color: #9a9a9a">
                        duration
                      </td>
                      <td class="noborder text-center"></td>
                      <td
                        class="noborder text-center"
                        style="padding: 0px 20px; color: #9a9a9a"
                      >
                        serve pts / serves / efficiency
                      </td>
                      <td
                        class="noborder text-center"
                        style="padding: 0px 20px; color: #9a9a9a"
                      >
                        max points in a row
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          padding: 0px 20px;
                          font-size: 20pt;
                          border-right: 1px solid #02252e;
                        "
                      >
                        {{ set.set_summary.durationMinutes }}:{{
                          set.set_summary.durationSeconds
                        }}
                      </td>
                      <td
                        style="
                          padding: 0px 20px;
                          border-right: 1px solid #02252e;
                        "
                      >
                        <div>{{ homeName }}</div>
                        <div>{{ awayName }}</div>
                      </td>
                      <td
                        style="
                          padding: 0px 20px;
                          border-right: 1px solid #02252e;
                          text-align: center;
                        "
                      >
                        <div>
                          {{ set.set_summary.home_serve_points }}
                          <span style="color: #9a9a9a">/</span>
                          {{ set.set_summary.home_serves }}
                          <span style="color: #9a9a9a">/</span>
                          {{ set.set_summary.home_serve_points_perc }}%
                        </div>
                        <div>
                          {{ set.set_summary.away_serve_points }}
                          <span style="color: #9a9a9a">/</span>
                          {{ set.set_summary.away_serves }}
                          <span style="color: #9a9a9a">/</span>
                          {{ set.set_summary.away_serve_points_perc }}%
                        </div>
                      </td>
                      <td
                        style="
                          padding: 0px 20px;
                          border-right: 1px solid #02252e;
                          text-align: center;
                        "
                      >
                        <div>{{ set.set_summary.homeStreak }}</div>
                        <div>{{ set.set_summary.awayStreak }}</div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GameSummary",
  data() {
    return {
      setsData: [],
      homeName: null,
      awayName: null,
      groupName: null,
      tournamentName: null,
      matchData: null,
      ticks: [],
    };
  },
  mounted() {
    this.idle = false;
    axios
      .get("/api/games/" + this.$route.params.id + "/timeline")
      .then((res) => {
        this.setsData = res.data.sets;
        this.homeName = res.data.summary.home_name;
        this.awayName = res.data.summary.away_name;
        this.groupName = res.data.summary.group_name;
        this.tournamentName = res.data.summary.tournament_name;
        this.matchData = res.data.summary;
      });
  },
  methods: {
    range: function (min, max) {
      var array = [];
      var j = 0;
      for (var i = min; i <= max; i++) {
        array[j] = i;
        j++;
      }
      return array;
    },
    resetScores() {
      this.homeScore = 0;
      this.awayScore = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.group-header {
  background: rgb(41, 137, 136);
  padding: 10px 20px;
  color: white;
  letter-spacing: 3px;
  font-weight: 300;
  margin-bottom: 5px;
  border-radius: 5px;
}

.w40 {
  width: 40px;
}

.lastPointsResult {
  min-width: 60px;
  border: none;
  text-align: right;
  font-weight: 600;
  color: white;
  padding-right: 20px;
}

.chartSpectators {
  height: 300px;
}

.noborder {
  border: none;
}

.text-center {
  text-align: center;
}

.summaryFacts {
  margin-top: 20px;
  background-color: #105869;
  padding: 10px;
  text-align: left;
  color: white;
}

.point {
  color: white;
}

.setPointsScored {
  text-align: left;
  font-size: 20pt;
  font-weight: 600;
}

.serve {
  color: #636363;
  font-size: 14pt;
  text-align: center;
}

.pointsScored {
  color: #9091a5;
  text-align: center;
}

.mainContainer {
  margin-top: 20px;
  text-align: center;
}

.setContainer {
  background: #0e3c46;
  padding: 20px;
  width: 95%;
  margin: 30px auto;
}

.player_name {
  text-align: left;
  color: white;
  width: 250px;
  padding-right: 20px;
}

.winnerColor {
  color: #40c500;
}

.container-mid {
  margin-left: auto;
  margin-right: auto;
  width: 20%;
  text-align: center;

  .midInfoHeader {
    text-transform: uppercase;
    font-size: 20px;
    font-weight: 600;
  }

  .midInfoValue {
    padding-top: 0px;
    font-size: 40px;
    color: #555;
  }
}

.rallyScore {
  width: 95%;
  font-size: 400px;
  line-height: 400px;
  font-weight: 900;
  color: white;
}

.endSet {
  font-size: 50px;
  color: white;
  font-weight: 600;
  position: absolute;
  background: #666666ed;
  left: 0;
  right: 0;
  padding: 50px 0px;
}

.rallyScoreWinner {
  width: 95%;
  font-size: 400px;
  line-height: 400px;
  font-weight: 900;
  color: #40c500;
}

.set_summary {
  border-top: 1px solid #3e474f;
}

.scoreContainer {
  width: 40%;
  vertical-align: top;
  text-align: center;
}

.scoreLeft {
  border-right: 1px solid #222;
}

.scoreRight {
  border-left: 1px solid #222;
}

.submit-button {
  font-size: 16px;
  padding: 10px 20px;
  background: #909090;
  color: white;
  font-weight: 600;
}

.span-score {
  min-width: 100px;
  margin-right: 30px;

  input {
    max-width: 30px;
    padding: 10px 10px;
    margin: 0px 3px;
    text-align: center;
  }
}

.server {
  font-size: 70px;
  color: white;
}

.header-title {
  font-size: 40px;
  color: #40c500;
}

.header-title-players {
  font-size: 20px;
  color: white;
}

.header-title-group {
  font-size: 40px;
  color: white;
  text-transform: uppercase;
}

.colWinner {
  color: #40c500;
}

.result-button {
  background-color: #666666ed;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  margin-top: 10px;
}

.fl {
  float: left;
}

.result-dialog {
  color: white;
  width: 100%;
  height: 100%;
  background-color: #000000ed;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

/*== start of code for tooltips ==*/
.tool {
  cursor: help;
  position: relative;
}

/*== common styles for both parts of tool tip ==*/
.tool::before,
.tool::after {
  left: 50%;
  opacity: 0;
  position: absolute;
  z-index: -100;
}

.tool:hover::before,
.tool:focus::before,
.tool:hover::after,
.tool:focus::after {
  opacity: 1;
  transform: scale(1) translateY(0);
  z-index: 100;
}

/*== pointer tip ==*/
.tool::before {
  border-style: solid;
  border-width: 1em 0.75em 0 0.75em;
  border-color: #3e474f transparent transparent transparent;
  bottom: 100%;
  content: "";
  margin-left: -0.5em;
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26),
    opacity 0.65s 0.5s;
  transform: scale(0.6) translateY(-90%);
}

.tool:hover::before,
.tool:focus::before {
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26) 0.2s;
}

/*== speech bubble ==*/
.tool::after {
  font-size: 12pt;
  background: #3e474f;
  border-radius: 0.25em;
  bottom: 180%;
  color: #edeff0;
  content: attr(data-tip);
  margin-left: -8.75em;
  padding: 1em;
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26) 0.2s;
  transform: scale(0.6) translateY(50%);
  width: 17.5em;
}

.tool:hover::after,
.tool:focus::after {
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26);
}

@media (max-width: 760px) {
  .tool::after {
    font-size: 0.75em;
    margin-left: -5em;
    width: 10em;
  }
}
</style>
