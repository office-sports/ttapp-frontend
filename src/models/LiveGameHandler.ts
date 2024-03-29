import axios from "axios";
// @ts-ignore
import { Serve } from "@/models/Serve";
// @ts-ignore
import { Game } from "@/models/Game";
import io from "socket.io-client";
import { SocketHandler } from "@/models/SocketHandler";

export class LiveGameHandler {
  public socketHandler;
  isFlipped: boolean;
  isIdle: boolean;
  isEndSet: boolean;
  isGameStarted: boolean;
  statusMessage: string;
  game: Game;
  serve: Serve;

  public constructor(isFlipped: boolean, game: Game, serve: Serve) {
    this.isFlipped = isFlipped;
    this.game = game;
    this.serve = serve;
    this.isIdle = true;
    this.isEndSet = false;
    this.isGameStarted = false;
    this.statusMessage = "";

    this.socketHandler = new SocketHandler();
    this.socketHandler.setGameSocket(game.id);
    this.socketHandler.setAppSocket();
  }

  public sendMessage() {
    this.socketHandler.gameSocket.emit(
      "SEND_MESSAGE",
      this.getMessagePayload()
    );
  }

  public loadGameData(gid: number) {
    axios
      .all([
        axios.get("/api/games/" + gid),
        axios.get("/api/games/" + gid + "/serve"),
      ])
      .then(
        axios.spread((game, serve) => {
          if (game.data.is_finished) {
            const gd = game.data;
            this.socketHandler.appSocket.emit("MSG_GAME_FINISHED", {
              homeScoreTotal: gd.home_score_total,
              awayScoreTotal: gd.away_score_total,
              setScores: gd.scores,
              id: gd.match_id,
              winnerId: gd.winner_id,
            });
            if (game.data.play_order > 0) {
              window.location.replace(window.location.origin);
            } else {
              window.location.reload();
            }
          } else {
            this.game = new Game(game.data);
            this.serve = new Serve(serve.data);
            this.sendMessage();
          }
        })
      )
      .catch((error) => {
        console.log("Error when getting live game data " + error);
      });
  }

  public flipSides() {
    this.isFlipped = !this.isFlipped;
  }

  // changes initial game server, all following serves
  // are calculated and returned through API
  public changeServer() {
    // allow only if in the idle state
    if (!this.isIdle) {
      return false;
    }

    // set idle state to false, sending change request to API
    axios
      .post("/api/games/changeserver", {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        game_id: this.game.id,
        server_id:
          this.serve.firstGameServer === this.game.homePlayerId
            ? this.game.awayPlayerId
            : this.game.homePlayerId,
      })
      .then((res) => {
        this.serve = new Serve(res.data);
        this.isIdle = true;
      })
      .catch((error) => {
        this.isIdle = true;
        console.log("error while changing server: " + error.response);
      });
  }

  public checkIsEnded() {
    if (
      this.game.currentHomePoints >= 11 ||
      this.game.currentAwayPoints >= 11
    ) {
      this.isEndSet =
        Math.abs(this.game.currentHomePoints - this.game.currentAwayPoints) >=
        2;
    } else {
      this.isEndSet = false;
    }
  }

  getMessagePayload() {
    return {
      score: {
        homeScore: this.game ? this.game.currentHomePoints : 0,
        awayScore: this.game ? this.game.currentAwayPoints : 0,
      },
      currentServerId: this.serve.currentServerId,
      numServes: this.serve.numServes,
      homeScoreTotal: this.game.homeScoreTotal,
      awayScoreTotal: this.game.awayScoreTotal,
      setScores: this.game.scores,
      currentSet: this.serve.setNumber,
      isFinished: this.game.winnerId !== 0,
    };
  }

  private savePoint(homePoint: number, awayPoint: number) {
    // allow only when idle
    if (!this.isIdle) {
      return false;
    }

    // set state
    this.isIdle = false;
    axios
      .post("/api/points/add", {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        game_id: this.game.id,
        is_home_point: homePoint,
        is_away_point: awayPoint,
      })
      .then((res) => {
        this.serve = new Serve(res.data);
        this.isIdle = true;
        this.sendMessage();
      })
      .catch((error) => {
        this.isIdle = true;
        console.log("error while adding point: " + error.response);
      });
  }

  private delPoint(homePoint: number, awayPoint: number) {
    // allow only when idle
    if (!this.isIdle) {
      return false;
    }

    // set state
    this.isIdle = false;
    axios
      .post("/api/points/del", {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        game_id: this.game.id,
        is_home_point: homePoint,
        is_away_point: awayPoint,
      })
      .then((res) => {
        this.serve = new Serve(res.data);
        this.isIdle = true;
        this.sendMessage();
      })
      .catch((error) => {
        this.isIdle = true;
        console.log("error while adding point: " + error.response);
      });
  }

  public addPointLeft() {
    if (!this.isEndSet && this.isIdle) {
      if (this.isFlipped) {
        this.game.currentAwayPoints++;
        this.savePoint(0, 1);
      } else {
        this.game.currentHomePoints++;
        this.savePoint(1, 0);
      }
      this.checkIsEnded();
    }
  }

  subPointLeft() {
    if (this.isIdle) {
      let cHP = this.game.currentHomePoints;
      let cAP = this.game.currentAwayPoints;
      if (this.isFlipped) {
        if (this.isEndSet && cAP < cHP) {
          return;
        }
        if (cAP > 0) {
          this.game.currentAwayPoints = cAP - 1 < 0 ? cAP : --cAP;
          this.delPoint(0, 1);
        }
      } else {
        // check if the set is ended, if so, do not subtract lower number
        if (this.isEndSet && cHP < cAP) {
          return;
        }
        if (cHP > 0) {
          this.game.currentHomePoints = cHP - 1 < 0 ? cHP : --cHP;
          this.delPoint(1, 0);
        }
      }
      this.checkIsEnded();
    }
  }

  public addPointRight() {
    if (!this.isEndSet && this.isIdle) {
      if (this.isFlipped) {
        this.game.currentHomePoints++;
        this.savePoint(1, 0);
      } else {
        this.game.currentAwayPoints++;
        this.savePoint(0, 1);
      }
      this.checkIsEnded();
    }
  }

  subPointRight() {
    if (this.isIdle) {
      let cHP = this.game.currentHomePoints;
      let cAP = this.game.currentAwayPoints;

      if (this.isFlipped) {
        if (this.isEndSet && cHP < cAP) {
          return;
        }
        if (cHP > 0) {
          this.game.currentHomePoints = cHP - 1 < 0 ? cHP : --cHP;
          this.delPoint(1, 0);
        }
      } else {
        if (this.isEndSet && cAP < cHP) {
          return;
        }
        if (cAP > 0) {
          this.game.currentAwayPoints = cAP - 1 < 0 ? cAP : --cAP;
          this.delPoint(0, 1);
        }
      }
      this.checkIsEnded();
    }
  }
}
