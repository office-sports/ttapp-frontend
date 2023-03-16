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
            <template
              v-for="(set, index) in this.game.scores"
              v-bind:key="index"
            >
              <td v-if="index + 1 < this.setNumber" class="txtc txt-col-darker">
                SET {{ index + 1 }}
              </td>
            </template>
          </tr>
          <tr>
            <td>
              {{ game.homePlayerName }}
            </td>
            <td class="txtc">
              {{ this.homeScoreTotal }}
            </td>
            <template
              v-for="(set, index) in this.game.scores"
              v-bind:key="index"
            >
              <td
                v-if="index + 1 < this.setNumber"
                :class="
                  parseInt(set.home) > parseInt(set.away)
                    ? 'txtc txt-col-green'
                    : 'txtc'
                "
              >
                {{ set.home }}
              </td>
            </template>
          </tr>
          <tr>
            <td>
              {{ game.awayPlayerName }}
            </td>
            <td class="txtc">
              {{ this.awayScoreTotal }}
            </td>
            <template
              v-for="(set, index) in this.game.scores"
              v-bind:key="index"
            >
              <td
                v-if="index + 1 < this.setNumber"
                :class="
                  parseInt(set.home) < parseInt(set.away)
                    ? 'txtc txt-col-green'
                    : 'txtc'
                "
              >
                {{ set.away }}
              </td>
            </template>
          </tr>
        </table>
      </div>
    </div>
    <div class="round-container mart10">
      <div class="round-container-dark-small flex txt-col-darker">
        {{ this.spectators }} SPECTATORS &nbsp;
        <span v-for="i in range(1, this.spectators)" v-bind:key="i" class="txt-col-white">
          <i class="fas fa-child"></i>&nbsp;
        </span>
      </div>
    </div>
    <div class="mid-current-score flex-center" style="margin-top: 50px; overflow: hidden">
      <div class="score-card">
        {{ homeScore }}
        <div class="score-card-cover"></div>
      </div>&nbsp;
      <div class="score-card">
        {{ awayScore }}
        <div class="score-card-cover"></div>
      </div>
    </div>
    <div class="padt20 mart20">
      <div class="table-wrapper">
        <div class="ball"></div>
        <div class="ball-shadow"></div>
        <div id="midtablenet">&nbsp;</div>
        <div id="midtable" class="grd">&nbsp;</div>
        <div id="ltable">&nbsp;</div>
        <div id="rtable">&nbsp;</div>
        <table class="table-users">
          <tr>
            <td>
              {{ this.game.homePlayerName }}
            </td>
            <td class="txtr">
              {{ this.game.awayPlayerName }}
            </td>
          </tr>
          <tr>
            <td class="txtl">
              <div
                class="serve-paddles"
                v-if="this.currentServerId === this.game.homePlayerId"
              >
                <span v-for="index in this.numServes" :key="index">
                  <i class="fas fa-table-tennis"></i>
                </span>
              </div>
            </td>
            <td class="txtr">
              <div
                class="serve-paddles"
                v-if="this.currentServerId === this.game.awayPlayerId"
              >
                <span v-for="index in this.numServes" :key="index">
                  <i class="fas fa-table-tennis"></i>
                </span>
              </div>
            </td>
          </tr>
        </table>
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
    this.socketHandler = new SocketHandler(this.$route.params.id);
    axios
      .all([
        axios.get("/api/games/" + this.$route.params.id),
        axios.get("/api/games/" + this.$route.params.id + "/details"),
      ])
      .then(
        axios.spread((game, gameDetails) => {
          if (game.data.winner_id !== 0) {
            this.$router.push({
              name: "GameResult",
              params: { id: game.data.match_id },
            });
          } else {
            this.game = new Game(game.data);
            this.gameDetails = new DetailedSummary(gameDetails.data);

            this.homeScore = this.game.currentHomePoints;
            this.awayScore = this.game.currentAwayPoints;

            this.setNumber =
              this.game.homeScoreTotal + this.game.awayScoreTotal + 1;
          }
        })
      )
      .catch((error) => {
        console.log("Error when getting game result " + error);
      })
      .finally(() => {
        this.socketHandler.socket.on("MESSAGE", (data) => {
          if (data.isFinished) {
            this.$router.push({
              name: "GameResult",
              params: { id: this.$route.params.id },
            });
          } else {
            this.homeScore = data.score.homeScore;
            this.awayScore = data.score.awayScore;

            this.homeScoreTotal = data.homeScoreTotal;
            this.awayScoreTotal = data.awayScoreTotal;

            this.currentServerId = data.currentServerId;

            this.numServes = data.numServes;
            this.setNumber = this.homeScoreTotal + this.awayScoreTotal + 1;

            this.game.scores = data.setScores;
          }
        });
        this.socketHandler.socket.on("CONNECTIONS", (data) => {
          this.spectators = data;
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

.mid-spectators {
  margin: 0 auto;
  text-align: center;
  font-size: 20pt;
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

.score-card {
  background: rgb(255 255 255);
  padding: 0 5px;
  color: black;
  border-radius: 5px;
  max-height: 60px;
  overflow: hidden;
  font-weight: 900;
  max-width: 45px;
}

.score-card-cover {
  border-top: 1px solid black;
  top: -32px;
  position: relative;
  width: 55px;
  left: -5px;
  height: 28px;
  background: linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(255,255,255,1) 0%, rgba(166,166,166,1) 100%);
  opacity: 0.4;
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

.table-users {
  position: absolute;
  top: 80px;
  font-size: 20pt;
}

.table-users td {
  width: 50%;
}

#home-player {
  z-index: 0;
  position: absolute;
  top: -130px;
  left: -135px;
}

#away-player {
  z-index: 0;
  position: absolute;
  top: -130px;
  left: 625px;
}

.paddle-right {
  font-size: 40pt;
  rotate: -35deg;
  left: -235px;
  top: -20px;
}
</style>
