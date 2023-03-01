<template>
  <div v-if="this.gh.game">
    <div class="round-container marb20">
      <div class="round-container-dark-small flex-full-width txt-col-darker">
        <div class="txt-col-white">
          {{ this.gh.game.groupName }} game, best of
          {{ this.gh.game.maxSets }}
        </div>
        <div v-if="!formVisible">
          <SliderOnOff :state="this.manualScoringEnabled" />
        </div>
      </div>
    </div>
    <div class="flex" v-bind:class="this.gh.isFlipped ? 'con-flipped' : ''">
      <div class="con txtc">
        <div class="round-container-header">
          {{ this.gh.game.homePlayerName }}
        </div>
        <div class="fnt-big-score">{{ this.gh.game.currentHomePoints }}</div>
        <template v-if="this.manualScoringEnabled">
          <div
            class="serve-paddles"
            v-if="this.gh.serve.currentServerId === this.gh.game.homePlayerId"
          >
            <span v-for="index in this.gh.serve.numServes" :key="index">
              <i class="fas fa-table-tennis"></i>
            </span>
          </div>
        </template>
      </div>
      <div class="con-mid round-container txtc">
        <div>MATCH MODE</div>
        <div class="col-winner marb20">BO{{ this.gh.game.maxSets }}</div>
        <div
          v-if="this.gh.game.homeScoreTotal + this.gh.game.awayScoreTotal > 0"
        >
          <div>SET SCORES</div>
          <div class="marb20">
            <div class="marb20" v-if="this.gh.game.scores"></div>
            <div
              v-for="(score, index) in this.gh.game.scores"
              v-bind:key="index"
              class="rowData mart10 flex-center"
              v-bind:class="this.gh.isFlipped ? 'con-flipped' : ''"
            >
              <template
                v-if="
                  index <
                  this.gh.game.homeScoreTotal + this.gh.game.awayScoreTotal
                "
              >
                <CircleScore
                  :is-winner="parseInt(score.home) > parseInt(score.away)"
                >
                  <template #score>
                    {{ score.home }}
                  </template>
                </CircleScore>
                <CircleScore
                  :is-winner="parseInt(score.away) > parseInt(score.home)"
                >
                  <template #score>
                    {{ score.away }}
                  </template>
                </CircleScore>
              </template>
            </div>
          </div>
        </div>
        <div v-if="this.statusMessage">
          <div>GAME STATUS</div>
          {{ this.statusMessage }}
        </div>
        <div v-show="!this.manualScoringEnabled">
          <button class="enter-scores-button" @click="this.toggleVisibility()">
            EDIT SCORES
          </button>
        </div>
      </div>
      <div class="con txtc">
        <div class="round-container-header">
          {{ this.gh.game.awayPlayerName }}
        </div>
        <div class="fnt-big-score">{{ this.gh.game.currentAwayPoints }}</div>
        <template v-if="this.manualScoringEnabled">
          <div
            class="serve-paddles"
            v-if="this.gh.serve.currentServerId === this.gh.game.awayPlayerId"
          >
            <span v-for="index in this.gh.serve.numServes" :key="index">
              <i class="fas fa-table-tennis"></i>
            </span>
          </div>
        </template>
      </div>
    </div>

    <div class="round-container mart20" v-if="formVisible">
      <form
        class="mart10"
        v-bind:key="'form_' + this.gh.game.id"
        method="post"
        @submit.prevent="postResults"
      >
        <input type="hidden" name="match_id" :value="this.gh.game.id" />
        <table class="marb25">
          <tr>
            <td colspan="3" class="txtc col-white">
              Manual scores entry. Remember to use points score, e.g. 11 - 5, 3
              - 11, 13 - 11, not total set scores for game.<br />
              Important: this will overwrite existing live scoring.
            </td>
          </tr>
          <tr v-if="this.errors">
            <td colspan="3" class="errors">
              <div v-for="(error, index) in this.errors" v-bind:key="index">
                {{ error }}
              </div>
            </td>
          </tr>
          <tr
            v-for="i in range(1, this.gh.game.maxSets)"
            v-bind:key="i"
            class="span-score"
          >
            <td class="txtr padt20" style="width: 45%">
              <input
                autocomplete="off"
                :name="'home_set_' + i"
                value=""
                @keypress="isNumber($event)"
              />
            </td>
            <td class="txtc padt20" style="width: 10%">SET {{ i }}</td>
            <td class="txtl padt20" style="width: 45%">
              <input
                autocomplete="off"
                :name="'away_set_' + i"
                value=""
                @keypress="isNumber($event)"
              />
            </td>
          </tr>
          <tr>
            <td colspan="3" class="txtc padt20">
              <input class="enter-scores-button" type="submit" value="SAVE" />
              <button
                class="cancel-button marl20"
                @click="this.toggleVisibility()"
              >
                CANCEL
              </button>
            </td>
          </tr>
        </table>
      </form>
    </div>
  </div>
  <div v-show="this.gh.game && this.gh.isEndSet" class="end-set-overlay">
    <div>Press [=] to confirm set score.</div>
  </div>
</template>

<script>
import axios from "axios";
import { LiveGameHandler } from "@/models/LiveGameHandler";
import { Serve } from "@/models/Serve";
import { Game } from "@/models/Game";
import SliderOnOff from "@/components/items/SliderOnOff.vue";
import CircleScore from "@/components/game/CircleScore.vue";

export default {
  components: { CircleScore, SliderOnOff },
  created() {
    window.addEventListener("keypress", this.keyPressHandler);
  },
  data() {
    return {
      keyPressDelta: 300,
      thisKeypressTime: 0,
      lastKeypressTime: 0,
      manualScoringEnabled: false,
      statusMessage: null,
      formVisible: false,
      errors: [],
      gh: {},
    };
  },
  methods: {
    turnOnManualScoring() {
      this.manualScoringEnabled = true;
      this.gh.game.isGameStarted = true;
      this.gh.checkIsEnded();
    },
    createPayload(event) {
      const payload = {};
      let homeElement, awayElement, hKey, aKey, hVal, aVal;
      payload["game_id"] = parseInt(event.target.elements["match_id"].value);
      for (let i = 1; i <= 7; i++) {
        homeElement = event.target.elements["home_set_" + i];
        awayElement = event.target.elements["away_set_" + i];
        hKey = "s" + i + "hp";
        aKey = "s" + i + "ap";

        // check if element exists
        if (homeElement === undefined || awayElement === undefined) {
          return payload;
        } else if (homeElement.value === "" || awayElement.value === "") {
          return payload;
        } else {
          hVal = parseInt(homeElement.value);
          aVal = parseInt(awayElement.value);
          payload[hKey] = hVal;
          payload[aKey] = aVal;
        }
      }

      return payload;
    },
    validatePayload(payload) {
      this.errors = [];
      let isValid = true;

      // The same as minimum wins
      let minimumSets = Math.ceil(this.gh.game.maxSets / 2);
      let minimumWins = minimumSets;
      let hs = [];
      let as = [];
      let homeScore = 0;
      let awayScore = 0;
      for (let i = 1; i <= 7; i++) {
        hs[i] = payload["s" + i + "hp"];
        as[i] = payload["s" + i + "ap"];

        if (i <= minimumSets) {
          if (hs[i] === undefined || as[i] === undefined) {
            this.errors.push("Invalid set " + i + " score");
            return false;
          } else {
            // Both values present, numeric
            if (hs[i] < 11 && as[i] < 11) {
              this.errors.push(
                "Invalid set " +
                  i +
                  " score. One player has to reach at least 11 points."
              );
              return false;
            }

            if (Math.abs(hs[i] - as[i]) < 2) {
              this.errors.push(
                "Invalid set " +
                  i +
                  " score. Set has to finish with at least 2 points advantage."
              );
              return false;
            }
          }
        }

        if (hs[i] !== undefined && as[i] !== undefined) {
          if (hs[i] > as[i]) {
            homeScore++;
          } else {
            awayScore++;
          }
        }
      }

      let wins = Math.max(homeScore, awayScore);
      if (wins < minimumWins) {
        this.errors.push(
          "Invalid result. The number of sets required to win: " + minimumWins
        );
        return false;
      }

      return isValid;
    },
    postResults(event) {
      let payload = this.createPayload(event);
      let isValidPayload = this.validatePayload(payload);
      if (isValidPayload === true) {
        const json = JSON.stringify(payload);
        axios
          .post("/api/games/save", json)
          .then((res) => {
            this.errors = [];
            if (res.status === 200) {
              this.$router.go({
                name: "GameResult",
                params: { id: this.gh.game.id },
              });
            }
            return true;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log("Invalid input");
      }
    },
    toggleVisibility() {
      this.formVisible = !this.formVisible;
    },
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    range: function (min, max) {
      var array = [];
      var j = 0;
      for (var i = min; i <= max; i++) {
        array[j] = i;
        j++;
      }
      return array;
    },
    checkIsFinished() {
      console.log(this.gh.game);
      // this is the state of finishing current set, so the game
      // has all the data up to the last set
      let isFinished = false;
      let g = this.gh.game;

      // check if we've reached last set
      if (g.awayScoreTotal + g.homeScoreTotal === g.maxSets - 1) {
        isFinished = true;
      }
      // home won
      if (
        g.currentHomePoints > g.currentAwayPoints &&
        g.homeScoreTotal === g.winsRequired - 1
      ) {
        isFinished = true;
      }
      // away won
      if (
        g.currentHomePoints < g.currentAwayPoints &&
        g.awayScoreTotal === g.winsRequired - 1
      ) {
        isFinished = true;
      }

      if (isFinished === true) {
        //window.location.reload();
        // this.$router.push({
        //   name: "GameResult",
        //   params: { id: this.gh.game.id },
        // });
      }
    },
    keyPressHandler(e) {
      if (e.keyCode === 13) {
        this.thisKeypressTime = new Date();
        if (
          this.thisKeypressTime - this.lastKeypressTime <=
          this.keyPressDelta
        ) {
          this.turnOnManualScoring();
          this.thisKeypressTime = 0;
        }
        this.lastKeypressTime = this.thisKeypressTime;
      }

      if (this.manualScoringEnabled) {
        /**
         * NUMPAD SCORING KEY CODES
         * 46 - NUMPAD . (flip sides)
         * 47 - NUMPAD / (flip server)
         * 55 - NUMPAD 7 (left side +1 point)
         * 52 - NUMPAD 4 (left side -1 point)
         * 57 - NUMPAD 9 (right side +1 point)
         * 54 - NUMPAD 6 (right side -1 point)
         *
         * FULL KEYBOARD SCORING KEY CODES
         * 46  - . (flip sides)
         * 47  - / (flip server)
         * 113 - q (left side +1 point)
         * 97  - a (left side -1 point)
         * 101 - e (right side +1 point)
         * 100 - d (right side -1 point)
         */
        switch (e.keyCode) {
          case 46:
            this.gh.flipSides();
            break;
          case 47:
            this.gh.changeServer();
            break;
          case 55:
          case 113:
            this.gh.addPointLeft();
            this.statusMessage = this.gh.statusMessage;
            break;
          case 49:
          case 97:
            this.gh.subPointLeft();
            this.statusMessage = this.gh.statusMessage;
            break;
          case 57:
          case 101:
            this.gh.addPointRight();
            this.statusMessage = this.gh.statusMessage;
            break;
          case 51:
          case 100:
            this.gh.subPointRight();
            this.statusMessage = this.gh.statusMessage;
            break;
          case 61:
            console.log("route id: ", this.$route.params.id);
            this.gh.isEndSet = true;
            this.gh.finalizeSet(parseInt(this.$route.params.id));
            //this.checkIsFinished();
            break;
        }
      }
    },
  },
  mounted() {
    axios
      .all([
        axios.get("/api/games/" + this.$route.params.id),
        axios.get("/api/games/" + this.$route.params.id + "/serve"),
      ])
      .then(
        axios.spread((game, serve) => {
          let s = new Serve(serve.data);
          let g = new Game(game.data);
          this.gh = new LiveGameHandler(false, g, s);
          if (g.winnerId !== 0) {
            this.$router.push({
              name: "GameResult",
              params: { id: g.id },
            });
          }
        })
      )
      .catch((error) => {
        console.log("Error when getting live game data " + error);
      });
  },
};
</script>

<style>
.errors {
  text-align: center;
  padding-top: 20px;
  color: red;
}

.enter-scores-button {
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  background: #40c500;
  color: white;
}

.cancel-button {
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

input[type="submit"] {
  padding: 10px 25px;
  margin: 0;
  font-family: inherit;
  font-size: 10pt;
}

input {
  max-width: 100px;
  padding: 5px;
  border-radius: 5px;
  border: none;
  font-size: 15pt;
  text-align: center;
  font-family: inherit;
  margin: 0;
}

.serve-paddles {
  font-size: 40px;
}

.serve-paddles span:first-child {
  padding-right: 10px;
}

.end-set-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  font-size: 50px;
  text-align: center;
  color: white;
  background: rgba(31, 31, 31, 0.9);
  padding-top: 60px;
}
</style>
