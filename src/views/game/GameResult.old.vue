<template>
  <div class="round-container">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="txt-col-white">Game result</span>
    </div>
  </div>
  <div class="mart20" v-if="this.game">
    <div class="flex">
      <div
        class="con txtc"
        :class="isWinner(this.game.homePlayerId) ? 'col-winner' : ''"
      >
        <div class="round-container-header">
          {{ this.game.homePlayerName }}
        </div>
        <div class="fnt-big-score">{{ this.game.homeScoreTotal }}</div>
      </div>
      <div class="con-mid round-container txtc">
        <div>MATCH MODE</div>
        <div class="col-winner marb20">BO{{ this.game.maxSets }}</div>
        <div class="mart20" v-if="game.scores">
          <div>SET SCORES</div>
          <div
            v-for="(score, index) in game.scores"
            v-bind:key="index"
            class="rowData mart10"
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
          </div>
        </div>
      </div>
      <div
        class="con txtc"
        :class="isWinner(this.game.awayPlayerId) ? 'col-winner' : ''"
      >
        <div class="round-container-header">
          {{ this.game.awayPlayerName }}
        </div>
        <div class="fnt-big-score">{{ this.game.awayScoreTotal }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Game } from "@/models/Game";
import CircleScore from "@/components/game/CircleScore.vue";

export default {
  components: { CircleScore },
  data() {
    return {
      game: {},
      statusMessage: null,
    };
  },
  methods: {
    isWinner(playerId) {
      return playerId === this.game.winnerId;
    },
  },
  mounted() {
    axios
      .all([axios.get("/api/games/" + this.$route.params.id)])
      .then(
        axios.spread((game) => {
          this.game = new Game(game.data);
          if (this.game.hasPoints) {
            this.$router.push({
              name: "GameResultDetailed",
              params: { id: this.game.id },
            });
          }
        })
      )
      .catch((error) => {
        console.log("Error when getting game result " + error);
      });
  },
};
</script>
