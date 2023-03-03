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
    <div class="padt20">
      <div
        style="
          height: 300px;
          width: 600px;
          margin: 0 auto;
          border: 0px solid #efefef;
          position: relative;
          display: flex;
        "
      >
        <div id="midtable" class="grd tbl-midside">&nbsp;</div>
        <div id="ltable" class="tbl-lside">&nbsp;</div>
        <div id="rtable" class="tbl-rside">&nbsp;</div>
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
.tbl-rside {
  animation: animRight 5s forwards;
  width: 280px !important;
  height: 200px;
  border-radius: 0 3px 3px 0;
  border-top: 2px solid white;
  border-left: none;
  border-bottom: 2px solid white;
  border-right: 2px solid white;
  position: relative;
}

.tbl-lside {
  animation: animLeft 5s forwards;
  width: 280px !important;
  height: 200px;
  border-radius: 3px 0 0 3px;
  border-top: 2px solid white;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  border-right: none;
  position: relative;
}

.tbl-midside {
  animation: animMid 5s forwards;
}

@keyframes animLeft {
  0% {
    transform: skew(0deg);
    /* background-color: #2399b5;*/
  }
  50% {
    /* background-color: transparent;*/
  }
  100% {
    height: 50px;
    transform: skew(-20deg);
    /*background-color: #2399b5;*/
  }
}

@keyframes animMid {
  0% {
  }
  100% {
    height: 50px;
  }
}

@keyframes animRight {
  0% {
    transform: skew(0deg);
    /* background-color: #2399b5;*/
  }
  50% {
    /* background-color: transparent;*/
  }
  100% {
    height: 50px;
    transform: skew(20deg);
    /*background-color: #2399b5;*/
  }
}

.grd {
  background: linear-gradient(
    0deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(116, 136, 186, 1) 0%,
    rgba(82, 99, 155, 1) 100%
  );
}

#midtable {
  position: absolute;
  left: 50%;
  width: 500px;
  margin-left: -250px;
  height: 200px;
  border-top: 2px solid white;
  border-bottom: 2px solid white;
}

#ltable {
  min-width: 300px;
  background: linear-gradient(
    0deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(116, 136, 186, 1) 0%,
    rgba(82, 99, 155, 1) 100%
  );
  transform: skew(10deg);
}

#rtable {
  min-width: 300px;
  background: linear-gradient(
    0deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(116, 136, 186, 1) 0%,
    rgba(82, 99, 155, 1) 100%
  );
  transform: skew(10deg);
}

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
