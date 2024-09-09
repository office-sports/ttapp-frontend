<template>
  <template v-if="this.game && this.gameDetails">
    <div class="round-container">
      <div
        class="round-container-dark-small flex txt-col-darker flex-full-width"
      >
        <span>
          <span class="text-white">Game detailed summary</span>
          <span class="pl-2.5">{{
            this.gameDetails.summary.tournamentName
          }}</span>
          <span class="pl-2.5">{{ this.gameDetails.summary.groupName }}</span>
        </span>
        <span v-if="this.game.isWalkover === true" class="text-white">
          <span class="pr-2.5">WALKOVER</span>
          <i class="fas fa-flag text-white"></i>
        </span>
      </div>
      <div class="pad10">
        <table class="tbl-fixed">
          <tbody>
            <tr>
              <td class="w200"></td>
              <td class="text-center txt-col-darker">ELO</td>
              <td class="text-center txt-col-darker">SCORE</td>
              <td
                class="text-center txt-col-darker"
                v-for="(set, index) in this.game.scores"
                v-bind:key="index"
              >
                SET {{ index + 1 }}
              </td>
              <td class="text-center txt-col-darker">POINTS</td>
            </tr>
            <tr>
              <td :class="isWinner(game.homePlayerId) ? 'col-winner' : ''">
                {{ game.homePlayerName }}
              </td>
              <td class="text-center">
                <span v-if="game.newHomeElo > 0">
                  {{ game.newHomeElo }}
                  (<span v-if="game.homeEloDiff > 0">+</span
                  >{{ game.homeEloDiff }})
                </span>
              </td>
              <td
                class="text-center"
                :class="isWinner(game.homePlayerId) ? 'col-winner' : ''"
              >
                {{ game.homeScoreTotal }}
              </td>
              <td
                class="text-center"
                v-for="(set, index) in this.game.scores"
                v-bind:key="index"
                :class="set.home > set.away ? 'txt-col-green' : ''"
              >
                {{ set.home }}
              </td>
              <td class="text-center txt-col-darkest">
                <span
                  :class="
                    isWinner(game.homePlayerId) ? 'txt-col-green' : 'text-white'
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
              <td class="text-center">
                {{ game.newAwayElo }}
                (<span v-if="game.awayEloDiff > 0">+</span
                >{{ game.awayEloDiff }})
              </td>
              <td
                class="text-center"
                :class="isWinner(game.awayPlayerId) ? 'col-winner' : ''"
              >
                {{ game.awayScoreTotal }}
              </td>
              <td
                class="text-center"
                v-for="(set, index) in this.game.scores"
                v-bind:key="index"
                :class="set.home < set.away ? 'txt-col-green' : ''"
              >
                {{ set.away }}
              </td>
              <td class="text-center txt-col-darkest">
                <span
                  :class="
                    isWinner(game.awayPlayerId) ? 'txt-col-green' : 'text-white'
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
          </tbody>
        </table>
      </div>
    </div>
  </template>
  <template v-if="this.game">
    <template v-if="this.homeResults && this.awayResults">
      <div class="round-container mart20">
        <div v-if="this.commonResults">
          These players competed
          <span class="num-info">
            {{ this.commonResults.length }}
          </span>
          times before current game.
          <span class="num-info">
            {{ this.game.homePlayerName }}
          </span>
          played
          <span class="num-info">
            {{ this.homeResults.length }}
          </span>
          games in total,
          <span class="num-info">
            {{ this.game.awayPlayerName }}
          </span>
          completed
          <span class="num-info"> {{ this.awayResults.length }} </span>.
        </div>
        <div
          v-if="this.commonResults.length > 0"
          class="round-container-dark-small mart10"
        >
          <PlayerVsPlayerFormTable
            :game="this.game"
            :common-results="this.commonResults"
          />
        </div>
        <div v-if="this.homeResults.length > 0 && this.awayResults.length > 0">
          <div class="mart10">
            Individual performance of each player (last
            {{ this.maxCount }} games, excluding current one).
          </div>
          <div class="round-container-dark-small mart10">
            <PlayerFormTable
              :game="game"
              :home-player-results="this.homeResults.slice(0, 10)"
              :away-player-results="this.awayResults.slice(0, 10)"
              :max-count="this.maxCount"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-if="this.game.hasPoints">
      <div class="round-container mart20">
        <div v-for="(set, index) in this.gameDetails.sets" v-bind:key="index">
          <div class="round-container-dark-small">SET {{ index }}</div>
          <div class="pad10">
            <table>
              <tbody>
                <tr>
                  <td rowspan="2" class="w200">&nbsp;</td>
                  <td
                    v-for="(pbp, index2) in set.events"
                    v-bind:key="index2"
                    class="text-center w-pbp"
                  >
                    <span
                      v-if="pbp.current_server == pbp.home_player_id"
                      class="serve-paddle text-center"
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
                    class="text-center txt-col-darker"
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
                    class="text-center"
                  >
                    <span class="point">
                      <i
                        :class="
                          pbp.is_home_point ? 'fas fa-circle' : 'far fa-circle'
                        "
                      ></i>
                    </span>
                  </td>
                  <td class="text-right">
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
                    class="text-center"
                  >
                    <span class="point">
                      <i
                        :class="
                          pbp.is_away_point ? 'fas fa-circle' : 'far fa-circle'
                        "
                      ></i>
                    </span>
                  </td>
                  <td class="text-right">
                    {{ set.set_summary.away_points }}
                  </td>
                </tr>

                <tr>
                  <td rowspan="2"></td>
                  <td
                    v-for="(pbp, index2) in set.events"
                    v-bind:key="index2"
                    class="text-center txt-col-darker"
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
                    class="text-center w-pbp"
                  >
                    <span
                      v-if="pbp.current_server == pbp.away_player_id"
                      class="serve-paddle text-center"
                    >
                      <i class="fas fa-table-tennis"></i>
                    </span>
                  </td>
                  <td rowspan="2"></td>
                </tr>
              </tbody>
            </table>
            <div
              style="
                border-top: 1px solid #4a4a4a;
                margin-top: 10px;
                padding: 10px;
              "
            >
              <table class="tbl-compact">
                <tbody>
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
                    <td class="text-left w200">{{ game.homePlayerName }}</td>
                    <td class="text-center">
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
                    <td class="text-left">{{ game.awayPlayerName }}</td>
                    <td class="text-center">
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
  </template>
</template>

<script>
import axios from "axios";
import { DetailedSummary } from "@/models/DetailedSummary";
import { Game } from "@/models/Game";
import _ from "underscore";
import PlayerFormTable from "@/components/game/PlayerFormTable.vue";
import PlayerVsPlayerFormTable from "@/components/game/PlayerVsPlayerFormTable.vue";

export default {
  components: { PlayerFormTable, PlayerVsPlayerFormTable },
  data() {
    return {
      maxCount: 10,
      game: null,
      gameDetails: null,
      statusMessage: null,
      homeResults: [],
      awayResults: [],
      commonResults: [],
    };
  },
  methods: {
    isWinner(playerId) {
      return playerId === this.game.winnerId;
    },
  },
  mounted() {
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
      })
      .finally(() => {
        // load other info if there is no detailed data
        axios
          .all([
            axios.get("/api/players/" + this.game.homePlayerId + "/results"),
            axios.get("/api/players/" + this.game.awayPlayerId + "/results"),
          ])
          .then(
            axios.spread((hr, ar) => {
              this.homeResults = hr.data;
              this.awayResults = ar.data;
              this.commonResults = _.filter(this.homeResults, (item) => {
                return (
                  item.match_id !== this.game.id &&
                  ((item.home_player_id === this.game.homePlayerId &&
                    item.away_player_id === this.game.awayPlayerId) ||
                    (item.away_player_id === this.game.homePlayerId &&
                      item.home_player_id === this.game.awayPlayerId))
                );
              });
            })
          )
          .catch((error) => {
            console.log("Error when getting game result " + error);
          });
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

.num-info {
  color: #64a63c;
  font-weight: 900;
}

.tbl-border td {
  border: 0px solid white;
}
</style>
