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
    <div class="mid-current-score">{{ homeScore }} : {{ awayScore }}</div>
    <div class="padt20" style="margin-top: 100px">
      <div class="table-wrapper">
        <div class="ball"></div>
        <div class="ball-shadow"></div>
        <div id="midtablenet">&nbsp;</div>
        <div id="midtable" class="grd">&nbsp;</div>
        <div id="ltable">&nbsp;</div>
        <div id="rtable">&nbsp;</div>
      </div>
    </div>
  </template>
</template>

<script>
import axios from "axios";
import { DetailedSummary } from "@/models/DetailedSummary";
import { Game } from "@/models/Game";
import { SocketHandler } from "@/models/SocketHandler";

export default {
  data() {
    return {
      homeScore: 0,
      awayScore: 0,
      socketHandler: {},
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
    this.socketHandler = new SocketHandler(this.$route.params.id);
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
        })
      )
      .catch((error) => {
        console.log("Error when getting game result " + error);
      })
      .finally(() => {
        this.socketHandler.socket.on("MESSAGE", (data) => {
          this.homeScore = data.score.homeScore;
          this.awayScore = data.score.awayScore;
          // if (this.isFinished === 0) {
          //   this.homeScore = data.message.score.homeScore;
          //   this.awayScore = data.message.score.awayScore;
          //   this.matchScores = data.message.setScores;
          //   this.currentSet = data.message.currentSet;
          //   this.isFinished = data.message.isFinished;
          //   this.currentServerId = data.message.currentServerId;
          //   this.currentNumServes = data.message.currentNumServes;
          //   this.homeScoreTotal = data.message.homeScoreTotal;
          //   this.awayScoreTotal = data.message.awayScoreTotal;
          //   console.log(this.currentNumServes);
          // }
        });
      });
  },
};
</script>

<style>
.table-wrapper {
  height: 300px;
  width: 600px;
  margin: 0 auto;
  border: 0px solid #efefef;
  position: relative;
  display: flex;
}

.mid-current-score {
  margin: 0 auto;
  text-align: center;
  font-size: 30pt;
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
    transform: skew(-45deg);
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
    transform: skew(45deg);
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

@keyframes animNet {
  0% {
    height: 250px;
  }
  100% {
    height: 70px;
  }
}

#midtablenet {
  animation: animNet 5s forwards;
  left: 50%;
  border: 1px solid white;
  margin: 0 auto;
  text-align: center;
  position: relative;
  height: 70px;
  top: -20px;
  z-index: 1;
  width: 0px;
}

#midtable {
  animation: animMid 5s forwards;
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

#rtable {
  min-width: 300px;
  background: linear-gradient(
    0deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(116, 136, 186, 1) 0%,
    rgba(82, 99, 155, 1) 100%
  );
  transform: skew(10deg);
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

.ball {
  opacity: 0;
  animation: animBall linear 3s infinite;
  animation-delay: 5s;
  background-color: #fff;
  border-radius: 50%;
  height: 1rem;
  position: absolute;
  width: 1rem;
  z-index: 5;
  top: -50px;
}

.ball-shadow {
  opacity: 0;
  animation: animBallShadow linear 3s infinite;
  animation-delay: 5s;
  background-color: #000;
  border-radius: 50%;
  height: 1rem;
  position: absolute;
  width: 1rem;
  z-index: 3;
  top: 23px;
  transform: scale(1.5, 0.4);
}

@keyframes animBallShadow {
  0% {
    opacity: 0.5;
    left: 0px;
  }
  40% {
    top: 23px;
  }
  50% {
    left: 600px;
    opacity: 0.5;
  }
  90% {
    top: 23px;
  }
  100% {
    left: 0px;
    opacity: 0.5;
  }
}

@keyframes animBall {
  0% {
    opacity: 1;
    left: 0px;
    top: -50px;
  }
  40% {
    opacity: 1;
    top: 20px;
  }
  50% {
    opacity: 1;
    left: 600px;
    top: -50px;
  }
  90% {
    opacity: 1;
    top: 20px;
  }
  100% {
    opacity: 1;
    left: 0px;
    top: -50px;
  }
}
</style>
