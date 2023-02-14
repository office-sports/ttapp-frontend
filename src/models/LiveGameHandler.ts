import axios from "axios";
// @ts-ignore
import { Serve } from "@/models/Serve";
// @ts-ignore
import { Game } from "@/models/Game";

export class LiveGameHandler {
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

  private startGameWarning() {
    if (!this.isGameStarted) {
      this.statusMessage = "PRESS START (SPACE)";
      return;
    }
  }

  private checkIsEnded() {
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
        // TODO broadcast point
        // this.sendMessage(this.getPayload());
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
        // TODO broadcast point
        // this.sendMessage(this.getPayload());
      })
      .catch((error) => {
        this.isIdle = true;
        console.log("error while adding point: " + error.response);
      });
  }

  public addPointLeft() {
    this.startGameWarning();
    if (!this.isEndSet && this.isIdle) {
      if (this.isFlipped) {
        this.game.currentAwayPoints++;
        this.savePoint(0, 1);
      } else {
        this.game.currentHomePoints++;
        this.savePoint(1, 0);
      }
      this.checkIsEnded();
      // TODO broadcast points
    }
  }

  subPointLeft() {
    this.startGameWarning();
    if (this.isIdle) {
      if (this.isFlipped) {
        if (this.game.currentAwayPoints > 0) {
          this.game.currentAwayPoints =
            this.game.currentAwayPoints - 1 < 0
              ? this.game.currentAwayPoints
              : --this.game.currentAwayPoints;
          this.delPoint(0, 1);
        }
      } else {
        if (this.game.currentHomePoints > 0) {
          this.game.currentHomePoints =
            this.game.currentHomePoints - 1 < 0
              ? this.game.currentHomePoints
              : --this.game.currentHomePoints;
          this.delPoint(1, 0);
        }
      }
      this.checkIsEnded();
      // TODO broadcast points
      //this.sendMessage(this.getPayload());
    }
  }

  public addPointRight() {
    this.startGameWarning();
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
    // TODO broadcast
  }

  subPointRight() {
    this.startGameWarning();
    if (this.isIdle) {
      if (this.isFlipped) {
        if (this.game.currentHomePoints > 0) {
          this.game.currentHomePoints =
            this.game.currentHomePoints - 1 < 0
              ? this.game.currentHomePoints
              : --this.game.currentHomePoints;
          this.delPoint(1, 0);
        }
      } else {
        if (this.game.currentAwayPoints > 0) {
          this.game.currentAwayPoints =
            this.game.currentAwayPoints - 1 < 0
              ? this.game.currentAwayPoints
              : --this.game.currentAwayPoints;
          this.delPoint(0, 1);
        }
      }
      this.checkIsEnded();
      // TODO - broadcast point
      //this.sendMessage(this.getPayload());
    }
  }

  // TODO - check if necessary
  public loadServeData() {
    axios
      .all([axios.get("/api/games/" + this.game.id + "/serve")])
      .then(
        axios.spread((serve) => {
          this.serve = serve.data;
        })
      )
      .catch((error) => {
        console.log("Error when loading game serve data " + error);
      });
  }
}
