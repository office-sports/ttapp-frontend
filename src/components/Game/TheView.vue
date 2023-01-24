<template>
  <div class="roundWrapper">
    <table v-if="game" class="table-game-view">
      <tr>
        <td
          class="txtc player-name"
          v-bind:class="
            game.winner_id == game.home_player_id ? 'col-winner' : 'col-white'
          "
        >
          {{ game.home_player_name }}
        </td>
        <td rowspan="2" class="txtc valignTop">
          <div>MATCH MODE</div>
          <div class="col-winner marb20">BO{{ game.max_sets }}</div>
          <div>GAME STATUS</div>
          <div class="col-winner">
            <div v-if="!game.winner_id">SCHEDULED</div>
            <div v-else-if="game.winner_id">FINISHED</div>
          </div>
          <div class="mart20" v-if="game.scores">
            <div>SET SCORES</div>
            <div
              v-for="(score, index) in game.scores"
              v-bind:key="index"
              class="rowData mart10"
            >
              <span class="fa-stack" style="font-size: 15px">
                <i
                  v-if="parseInt(score.home) > parseInt(score.away)"
                  class="fas fa-circle fa-stack-2x"
                  style="color: #40c500"
                ></i>
                <i
                  v-else
                  class="fas fa-circle fa-stack-2x"
                  style="color: white"
                ></i>
                <i
                  class="fas fa-stack-1x"
                  style="
                    color: black;
                    font-family: 'Poppins', 'Avenir', Helvetica, Arial,
                      sans-serif;
                  "
                  >{{ score.home }}</i
                >
              </span>
              <span class="fa-stack" style="font-size: 15px">
                <i
                  v-if="parseInt(score.away) > parseInt(score.home)"
                  class="fas fa-circle fa-stack-2x"
                  style="color: #40c500"
                ></i>
                <i
                  v-else
                  class="fas fa-circle fa-stack-2x"
                  style="color: white"
                ></i>
                <i
                  class="fas fa-stack-1x"
                  style="
                    color: black;
                    font-family: 'Poppins', 'Avenir', Helvetica, Arial,
                      sans-serif;
                  "
                  >{{ score.away }}</i
                >
              </span>
            </div>
          </div>
          <div class="mart20">
            <button
              class="enter-scores-button"
              @click="this.toggleVisibility()"
            >
              EDIT SCORES
            </button>
          </div>
        </td>
        <td
          class="txtc player-name"
          v-bind:class="
            game.winner_id == game.away_player_id ? 'col-winner' : 'col-white'
          "
        >
          {{ game.away_player_name }}
        </td>
      </tr>
      <tr>
        <td
          class="score-font"
          v-bind:class="
            game.winner_id == game.home_player_id ? 'col-winner' : 'col-white'
          "
        >
          {{ game.home_score_total }}
        </td>
        <td
          class="score-font"
          v-bind:class="
            game.winner_id == game.away_player_id ? 'col-winner' : 'col-white'
          "
        >
          {{ game.away_score_total }}
        </td>
      </tr>
    </table>
  </div>
  <div class="roundWrapper mart20" v-if="formVisible">
    <form
      class="mart10"
      v-bind:key="'form_' + game.match_id"
      method="post"
      @submit.prevent="postResults"
    >
      <input type="hidden" name="match_id" :value="game.match_id" />
      <table class="marb25">
        <tr>
          <td colspan="3" class="txtc col-white">
            Manual scores entry. Remember to use points score, e.g. 11 - 5, 3 -
            11, 13 - 11, not total set scores for game.
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
          v-for="i in range(1, game.max_sets)"
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
          <td colspan="3" class="txtc padt40">
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
</template>

<script>
import axios from "axios";

export default {
  name: "GameView",
  data() {
    return {
      game: [],
      formVisible: false,
      errors: [],
    };
  },
  methods: {
    createPayload(event) {
      const payload = {};
      let homeElement, awayElement, hKey, aKey, hVal, aVal;
      payload["game_id"] = parseInt(event.target.elements["match_id"].value);
      for (let i = 1; i <= 7; i++) {
        homeElement = event.target.elements["home_set_" + i];
        awayElement = event.target.elements["away_set_" + i];
        hKey = "s" + i + "hp";
        aKey = "s" + i + "ap";

        console.log(homeElement, awayElement);
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
      let minimumSets = Math.ceil(this.game.max_sets / 2);
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

      console.log(homeScore, awayScore);
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
                name: "GameView",
                params: { id: this.game.game_id },
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
  },
  mounted() {
    this.idle = false;
    axios.get("/api/games/" + this.$route.params.id).then((res) => {
      this.game = res.data;
      console.log(this.game);
    });
  },
};
</script>

<style scoped lang="less">
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

.table-game-view {
  table-layout: fixed;

  td {
    text-align: center;
  }

  .score-font {
    font-size: 60pt;
  }

  .player-name {
    text-transform: uppercase;
    font-size: 20pt;
  }
}

.tbl-fixed {
  table-layout: fixed;
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
  margin: 0px;
}
</style>
