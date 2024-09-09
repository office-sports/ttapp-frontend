<template>
  <template v-if="this.game && this.gameDetails">
    <table class="obs-table">
      <tbody>
        <tr style="background: #3f3f3f">
          <td class="w200 pl-2.5">
            {{ this.gameDetails.summary.groupName }} / BO{{ this.game.maxSets }}
          </td>
          <td class="w50 text-center">SCORE</td>
          <td>&nbsp;</td>
          <td class="w50 text-center" style="width: *">SETS</td>
        </tr>
        <tr style="background: #5a5a5a">
          <td class="padl10">{{ game.homePlayerName }}</td>
          <td class="w30 text-center">
            <div class="obs-score-current">
              {{ homeScore }}
            </div>
          </td>
          <td class="obs-tbl-scores">
            <template
              v-for="(set, index) in this.game.scores"
              v-bind:key="index"
            >
              <div
                style="width: 30px"
                v-if="index + 1 < this.setNumber"
                :class="
                  parseInt(set.home) > parseInt(set.away)
                    ? 'text-center obs-set-won'
                    : 'text-center obs-set-lost'
                "
              >
                {{ set.home }}
              </div>
            </template>
          </td>
          <td class="text-center">
            <div class="obs-score-total">
              {{ this.homeScoreTotal }}
            </div>
          </td>
        </tr>
        <tr style="background: #5a5a5a">
          <td class="pl-2.5">{{ game.awayPlayerName }}</td>
          <td class="w30 text-center">
            <div class="obs-score-current">
              {{ awayScore }}
            </div>
          </td>
          <td class="obs-tbl-scores">
            <template
              v-for="(set, index) in this.game.scores"
              v-bind:key="index"
            >
              <div
                style="width: 30px"
                v-if="index + 1 < this.setNumber"
                :class="
                  parseInt(set.home) < parseInt(set.away)
                    ? 'text-center obs-set-won'
                    : 'text-center obs-set-lost'
                "
              >
                {{ set.away }}
              </div>
            </template>
          </td>
          <td class="text-center">
            <div class="obs-score-total">
              {{ this.awayScoreTotal }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>

<script>
import axios from "axios";
import { DetailedSummary } from "@/models/DetailedSummary";
import { Game } from "@/models/Game";
import { SocketHandler } from "@/models/SocketHandler";

export default {
  name: "GameObs",
  beforeCreate() {
    document.body.className = "obs-body";
  },
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
      statusMessage: null,
      spectators: 0,
    };
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
    isWinner(playerId) {
      return playerId === this.game.winnerId;
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
      ])
      .then(
        axios.spread((game, gameDetails) => {
          this.game = new Game(game.data);
          this.gameDetails = new DetailedSummary(gameDetails.data);

          this.homeScore = this.game.currentHomePoints;
          this.awayScore = this.game.currentAwayPoints;

          this.setNumber =
            this.game.homeScoreTotal + this.game.awayScoreTotal + 1;

          if (game.data.winner_id !== 0) {
            this.homeScore = 0;
            this.awayScore = 0;
            this.homeScoreTotal = this.game.homeScoreTotal;
            this.awayScoreTotal = this.game.awayScoreTotal;
          }
        })
      )
      .catch((error) => {
        console.log("Error when getting game result " + error);
      })
      .finally(() => {
        this.socketHandler.gameSocket.on("MESSAGE", (data) => {
          this.homeScore = data.score.homeScore;
          this.awayScore = data.score.awayScore;

          this.homeScoreTotal = data.homeScoreTotal;
          this.awayScoreTotal = data.awayScoreTotal;

          this.currentServerId = data.currentServerId;

          this.numServes = data.numServes;
          this.setNumber = this.homeScoreTotal + this.awayScoreTotal + 1;

          this.game.scores = data.setScores;
        });
        this.socketHandler.gameSocket.on("CONNECTIONS", (data) => {
          this.spectators = data;
        });
      });
  },
};
</script>

<style scoped>
table td {
  border: 0px solid #fff;
}
</style>
