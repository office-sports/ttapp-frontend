<template>
  <template v-if="this.game && this.gameDetails">
    <div class="round-container">
      <div class="round-container-dark-small flex txt-col-darker">
        <span class="txt-col-white">Game detailed summary</span>
        <span class="padl10">{{
          this.gameDetails.summary.tournamentName
        }}</span>
        <span class="padl10">{{ this.gameDetails.summary.groupName }}</span>
      </div>
      <div class="pad10">
        <table class="tbl-fixed">
          <tr>
            <td class="w200"></td>
            <td class="txtc txt-col-darker">SCORE</td>
            <td
              class="txtc txt-col-darker"
              v-for="(set, index) in this.game.scores"
              v-bind:key="index"
            >
              SET {{ index + 1 }}
            </td>
            <td class="txtc txt-col-darker">POINTS</td>
          </tr>
          <tr>
            <td :class="isWinner(game.homePlayerId) ? 'col-winner' : ''">
              {{ game.homePlayerName }}
            </td>
            <td
              class="txtc"
              :class="isWinner(game.homePlayerId) ? 'col-winner' : ''"
            >
              {{ game.homeScoreTotal }}
            </td>
            <td
              class="txtc"
              v-for="(set, index) in this.game.scores"
              v-bind:key="index"
              :class="set.home > set.away ? 'txt-col-green' : ''"
            >
              {{ set.home }}
            </td>
            <td class="txtc txt-col-darkest">
              <span
                :class="
                  isWinner(game.homePlayerId)
                    ? 'txt-col-green'
                    : 'txt-col-white'
                "
              >
                {{ gameDetails.summary.homeTotalPoints }}
              </span>
              /
              <span class="txt-col-darker">
                {{ gameDetails.summary.homePointsPerc }}%
              </span>
            </td>
          </tr>
          <tr>
            <td :class="isWinner(game.awayPlayerId) ? 'col-winner' : ''">
              {{ game.awayPlayerName }}
            </td>
            <td
              class="txtc"
              :class="isWinner(game.awayPlayerId) ? 'col-winner' : ''"
            >
              {{ game.awayScoreTotal }}
            </td>
            <td
              class="txtc"
              v-for="(set, index) in this.game.scores"
              v-bind:key="index"
              :class="set.home < set.away ? 'txt-col-green' : ''"
            >
              {{ set.away }}
            </td>
            <td class="txtc txt-col-darkest">
              <span
                :class="
                  isWinner(game.awayPlayerId)
                    ? 'txt-col-green'
                    : 'txt-col-white'
                "
              >
                {{ gameDetails.summary.awayTotalPoints }}
              </span>
              /
              <span class="txt-col-darker">
                {{ gameDetails.summary.awayPointsPerc }}%
              </span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </template>
  <template v-if="this.game && this.game.hasPoints">
    <div class="round-container mart20">
      <div v-for="(set, index) in this.gameDetails.sets" v-bind:key="index">
        <div class="round-container-dark-small">SET {{ index }}</div>
        <div class="pad10">
          <table>
            <tr>
              <td rowspan="2" class="w200">&nbsp;</td>
              <td
                v-for="(pbp, index2) in set.events"
                v-bind:key="index2"
                class="txtc w-pbp"
              >
                <span
                  v-if="pbp.current_server == pbp.home_player_id"
                  class="serve-paddle txtc"
                >
                  <i class="fas fa-table-tennis"></i>
                </span>
              </td>
              <td rowspan="2"></td>
            </tr>
            <tr>
              <td
                v-for="(pbp, index2) in set.events"
                v-bind:key="index2"
                class="txtc txt-col-darker"
              >
                <span>
                  {{ pbp.home_points_scored }}
                </span>
              </td>
            </tr>

            <tr>
              <td>
                <span
                  :class="
                    parseInt(set.set_summary.home_points) >
                    parseInt(set.set_summary.away_points)
                      ? 'col-winner'
                      : ''
                  "
                >
                  {{ game.homePlayerName }}
                </span>
              </td>
              <td
                v-for="(pbp, index2) in set.events"
                v-bind:key="index2"
                class="txtc"
              >
                <span class="point">
                  <i
                    :class="
                      pbp.is_home_point ? 'fas fa-circle' : 'far fa-circle'
                    "
                  ></i>
                </span>
              </td>
              <td class="txtr">
                {{ set.set_summary.home_points }}
              </td>
            </tr>

            <tr>
              <td>
                <span
                  :class="
                    parseInt(set.set_summary.home_points) <
                    parseInt(set.set_summary.away_points)
                      ? 'col-winner'
                      : ''
                  "
                >
                  {{ game.awayPlayerName }}
                </span>
              </td>
              <td
                v-for="(pbp, index2) in set.events"
                v-bind:key="index2"
                class="txtc"
              >
                <span class="point">
                  <i
                    :class="
                      pbp.is_away_point ? 'fas fa-circle' : 'far fa-circle'
                    "
                  ></i>
                </span>
              </td>
              <td class="txtr">
                {{ set.set_summary.away_points }}
              </td>
            </tr>

            <tr>
              <td rowspan="2"></td>
              <td
                v-for="(pbp, index2) in set.events"
                v-bind:key="index2"
                class="txtc txt-col-darker"
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
                class="txtc w-pbp"
              >
                <span
                  v-if="pbp.current_server == pbp.away_player_id"
                  class="serve-paddle txtc"
                >
                  <i class="fas fa-table-tennis"></i>
                </span>
              </td>
              <td rowspan="2"></td>
            </tr>
          </table>
          <div
            style="
              border-top: 1px solid #4a4a4a;
              margin-top: 10px;
              padding: 10px;
            "
          >
            <table class="tbl-compact">
              <tr class="txt-col-darker">
                <td>duration</td>
                <td>&nbsp;</td>
                <td>serve pts / serves / efficiency</td>
              </tr>
              <tr>
                <td rowspan="2" class="v-mid w200">
                  {{
                    String(
                      Math.floor(
                        (set.set_summary.end_timestamp -
                          set.set_summary.start_timestamp) /
                          60
                      )
                    ).padStart(2, "0")
                  }}:{{
                    String(
                      (set.set_summary.end_timestamp -
                        set.set_summary.start_timestamp) %
                        60
                    ).padStart(2, "0")
                  }}
                </td>
                <td class="txtl w200">{{ game.homePlayerName }}</td>
                <td class="txtc">
                  {{ set.set_summary.home_serve_points }} /
                  {{ set.set_summary.home_serves }} /
                  {{
                    (
                      (set.set_summary.home_serve_points /
                        set.set_summary.home_serves) *
                      100
                    ).toFixed(2)
                  }}%
                </td>
              </tr>
              <tr>
                <td class="txtl">{{ game.awayPlayerName }}</td>
                <td class="txtc">
                  {{ set.set_summary.away_serve_points }} /
                  {{ set.set_summary.away_serves }} /
                  {{
                    (
                      (set.set_summary.away_serve_points /
                        set.set_summary.away_serves) *
                      100
                    ).toFixed(2)
                  }}%
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import axios from "axios";
import { DetailedSummary } from "@/models/DetailedSummary";
import { Game } from "@/models/Game";

export default {
  data() {
    return {
      game: null,
      gameDetails: null,
      statusMessage: null,
    };
  },
  methods: {
    isWinner(playerId) {
      return playerId === this.game.winnerId;
    },
  },
  mounted() {
    console.log(import.meta.env.TTAPP_SLACK_KEY);
    axios
      .all([
        axios.get("/api/games/" + this.$route.params.id),
        axios.get("/api/games/" + this.$route.params.id + "/details"),
      ])
      .then(
        axios.spread((game, gameDetails) => {
          this.game = new Game(game.data);
          this.gameDetails = new DetailedSummary(gameDetails.data);
        })
      )
      .catch((error) => {
        console.log("Error when getting game result " + error);
      });
  },
};
</script>

<style>
.serve-paddle {
  color: #636363;
  font-size: 14pt;
  text-align: center;
}

.w-pbp {
  width: 30px;
}

table td {
  border: 0px solid #000000;
}
</style>
