<template>
  <div>
    <table class="tbl-fixtures tbl-standings">
      <tbody>
        <tr>
          <td class="text-left w400">name</td>
          <td class="text-center">played</td>
          <td class="text-center">w / d / l</td>
          <td class="text-center">sets</td>
          <td class="text-center">+/-</td>
          <th class="text-center">rallies</th>
          <td class="text-center">+/-</td>
          <td class="text-center">points</td>
        </tr>
        <tr
          v-for="(player, index) in alteredGroup.players"
          v-bind:key="player.playerId"
          class="group-container txt-col-darker"
        >
          <td>
            <div
              :class="['level', 'level-c' + player.pos_color]"
              class="flex-full-width"
            >
              <span class="level-span">
                <span class="txt-col-darkest padl10">{{ index + 1 }}. </span>
                <router-link :to="'/player/' + player.player_id + '/profile'"
                  >{{ player.player_name }}
                </router-link>
              </span>
              <span
                class="padr10 txt-col-darkest"
                v-if="this.lockedPos || this.lockedPlayoffs"
              >
                <span
                  v-if="
                    this.lockedPos[group.group_id] &&
                    this.lockedPos[group.group_id].includes(player.player_id)
                  "
                >
                  <i class="fas fa-lock"></i>
                </span>
                <span
                  v-else-if="
                    this.lockedPlayoffs[group.group_id] &&
                    this.lockedPlayoffs[group.group_id].includes(
                      player.player_id
                    )
                  "
                >
                  <i class="fas fa-lock-open"></i>
                </span>
              </span>
            </div>
          </td>
          <td class="text-center">{{ player.played }}</td>
          <td class="text-center">
            {{ player.wins }} - {{ player.draws }} - {{ player.losses }}
          </td>
          <td class="text-center">
            {{ player.sets_for }} - {{ player.sets_against }}
          </td>
          <td class="text-center">{{ player.sets_diff }}</td>
          <td class="text-center">
            {{ player.rallies_for }} - {{ player.rallies_against }}
          </td>
          <td class="text-center">{{ player.rallies_diff ?? 0 }}</td>
          <td class="text-center">{{ player.points }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="mart20">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="ml-2.5" v-if="matches.length > 0">Predictions</span>
    </div>
  </div>

  <div v-if="matches.length > 0" class="pad10">
    <table class="tbl-fixtures">
      <tbody>
        <tr class="table-th">
          <td>&nbsp;</td>
          <td class="text-center">players</td>
          <td class="text-center">&nbsp;</td>
          <td class="text-center">set scores</td>
        </tr>
        <template v-for="(match, index) in this.matches" v-bind:key="index">
          <tr class="tr-row">
            <td>
              <div class="flex items-center space-x-1">
                <div
                  v-if="!this.isMatchLocked(match.match_id)"
                  :ref="'lock-home-' + match.match_id"
                  @click="this.setHomeWin(match)"
                  class="cursor-pointer rounded-md bg-gray-700 text-center py-1 min-w-8"
                >
                  H
                </div>
                <div
                  v-else
                  :ref="'lock-home-' + match.match_id"
                  class="cursor-pointer rounded-md bg-black text-center py-1 min-w-8"
                >
                  H
                </div>
                &nbsp;
                <div
                  v-if="!this.isMatchLocked(match.match_id)"
                  :ref="'lock-away-' + match.match_id"
                  @click="this.setAwayWin(match)"
                  class="cursor-pointer rounded-md bg-gray-700 text-center py-1 min-w-8"
                >
                  A
                </div>
                <div
                  v-else
                  :ref="'lock-away-' + match.match_id"
                  class="cursor-pointer rounded-md bg-black text-center py-1 min-w-8"
                >
                  A
                </div>
              </div>
            </td>
            <td>
              <GameVersusTable :match="match" />
            </td>
            <td>
              <div>
                <span v-for="i in match.mode" v-bind:key="i" class="pr-5">
                  <input
                    @keypress="isNumber($event)"
                    :disabled="false"
                    type="text"
                    :value="0"
                    class="max-w-8 border border-gray-400 rounded-md px-2 text-white bg-black text-sm disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-500"
                    :id="'game-' + match.match_id + '-h' + i"
                    :ref="'game-' + match.match_id + '-h' + i" />
                  :
                  <input
                    @keypress="isNumber($event)"
                    :disabled="false"
                    type="text"
                    :value="0"
                    class="max-w-8 border border-gray-400 rounded-md px-2 text-white bg-black text-sm disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-500"
                    :id="'game-' + match.match_id + '-a' + i"
                    :ref="'game-' + match.match_id + '-a' + i"
                /></span>
              </div>
              <div>
                <span
                  :ref="'game-' + match.match_id + '-error'"
                  class="text-red-600"
                >
                </span>
              </div>
            </td>
            <td class="text-right">
              <div
                class="cursor-pointer rounded-md bg-gray-700 text-center py-1 min-w-8"
                @click="this.checkLock(match.match_id)"
                :ref="'lock-' + match.match_id"
              >
                lock
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script>
import _ from "underscore";
import axios from "axios";
import GameVersusTable from "@/components/tournament/GameVersusTable.vue";

export default {
  components: { GameVersusTable },
  props: [
    "group",
    "positions",
    "tournament",
    "recaps",
    "lockedPos",
    "lockedPlayoffs",
  ],
  data() {
    return {
      toggleGroups: [],
      matches: [],
      lockedMatches: [],
      alteredPlayerData: [],
      predictionGroup: [],
      alteredGroup: this.group,
      positionColors: [],
      hasErrors: false,
    };
  },
  methods: {
    setHomeWin(match) {
      let matchId = match.match_id;
      let requiredWins = Math.ceil(match.mode / 2);

      if (!this.isMatchLocked(matchId)) {
        for (let i = 1; i <= requiredWins; i++) {
          this.$refs["game-" + matchId + "-h" + i][0].value = "11";
          this.$refs["game-" + matchId + "-a" + i][0].value = "0";
        }
      }
      this.checkLock(matchId);

      let game = _.findWhere(this.matches, { match_id: matchId });
      game.winner_id = match.home_player_id;
    },
    setAwayWin(match) {
      let matchId = match.match_id;
      let requiredWins = Math.ceil(match.mode / 2);

      if (!this.isMatchLocked(matchId)) {
        for (let i = 1; i <= requiredWins; i++) {
          this.$refs["game-" + matchId + "-a" + i][0].value = "11";
          this.$refs["game-" + matchId + "-h" + i][0].value = "0";
        }
      }
      this.checkLock(matchId);

      let game = _.findWhere(this.matches, { match_id: matchId });
      game.winner_id = match.away_player_id;
    },
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      let charCode = evt.which ? evt.which : evt.keyCode;
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
    isMatchLocked(gameId) {
      return this.lockedMatches.includes(gameId);
    },
    recolor() {
      for (let i = 0; i < this.alteredGroup.players.length; i++) {
        this.alteredGroup.players[i].pos_color = this.positionColors[i];
      }
    },
    unprocessLock(gameId) {
      let game = _.findWhere(this.matches, { match_id: gameId });
      let gameMode = game.mode;
      let requiredWins = Math.ceil(gameMode / 2);
      let homePoints = 0,
        awayPoints = 0,
        setHomePoints = 0,
        setAwayPoints = 0;
      let homeSets = 0,
        awaySets = 0;

      for (let i = 1; i <= gameMode; i++) {
        if (homeSets === requiredWins || awaySets === requiredWins) {
          break;
        }
        setHomePoints = this.$refs["game-" + gameId + "-h" + i][0].value;
        setAwayPoints = this.$refs["game-" + gameId + "-a" + i][0].value;
        homePoints += parseInt(setHomePoints);
        awayPoints += parseInt(setAwayPoints);

        // Check who won and increase the value
        if (parseInt(setHomePoints) > parseInt(setAwayPoints)) {
          homeSets++;
        } else {
          awaySets++;
        }
      }

      // Find home and away player
      let homePlayer = _.findWhere(this.alteredGroup.players, {
        player_id: game.home_player_id,
      });
      let awayPlayer = _.findWhere(this.alteredGroup.players, {
        player_id: game.away_player_id,
      });

      this.updatePlayerData(
        homePlayer,
        homePoints,
        awayPoints,
        homeSets,
        awaySets,
        -1
      );
      this.updatePlayerData(
        awayPlayer,
        awayPoints,
        homePoints,
        awaySets,
        homeSets,
        -1
      );

      game.winner_id = 0;
    },
    processLock(gameId) {
      let game = _.findWhere(this.matches, { match_id: gameId });
      let gameMode = game.mode;
      let requiredWins = Math.ceil(gameMode / 2);
      let homePoints = 0,
        awayPoints = 0,
        setHomePoints = 0,
        setAwayPoints = 0;
      let homeSets = 0,
        awaySets = 0;

      for (let i = 1; i <= gameMode; i++) {
        // check if required wins is correct
        if (homeSets === requiredWins || awaySets === requiredWins) {
          this.hasErrors = false;
          this.$refs["game-" + gameId + "-error"][0].innerHTML = "";
          break;
        }
        setHomePoints = this.$refs["game-" + gameId + "-h" + i][0].value;
        setAwayPoints = this.$refs["game-" + gameId + "-a" + i][0].value;
        homePoints += parseInt(setHomePoints);
        awayPoints += parseInt(setAwayPoints);

        // check if the score is set
        if (
          (parseInt(setHomePoints) < 11 && parseInt(setAwayPoints) < 11) ||
          Math.abs(parseInt(setHomePoints) - parseInt(setAwayPoints)) < 2
        ) {
          this.$refs["game-" + gameId + "-error"][0].innerHTML =
            "Incorrect set " +
            i +
            " score " +
            this.$refs["game-" + gameId + "-h" + i][0].value +
            ":" +
            this.$refs["game-" + gameId + "-a" + i][0].value;
          this.hasErrors = true;
          break;
        }

        // Check who won and increase the value
        if (parseInt(setHomePoints) > parseInt(setAwayPoints)) {
          homeSets++;
        } else {
          awaySets++;
        }
      }

      if (!this.hasErrors === true) {
        // We have correct game scores,

        // Find home and away player
        let homePlayer = _.findWhere(this.alteredGroup.players, {
          player_id: game.home_player_id,
        });
        let awayPlayer = _.findWhere(this.alteredGroup.players, {
          player_id: game.away_player_id,
        });

        this.updatePlayerData(
          homePlayer,
          homePoints,
          awayPoints,
          homeSets,
          awaySets,
          1
        );
        this.updatePlayerData(
          awayPlayer,
          awayPoints,
          homePoints,
          awaySets,
          homeSets,
          1
        );
      }
    },
    toggleRowLock(gameId, lock) {
      let game = _.findWhere(this.matches, { match_id: gameId });
      let gameMode = game.mode;

      this.$refs["lock-" + gameId][0].innerHTML = lock ? "unlock" : "lock";
      for (let i = 1; i <= gameMode; i++) {
        if (lock === true) {
          this.$refs["game-" + gameId + "-h" + i][0].disabled = true;
          this.$refs["game-" + gameId + "-a" + i][0].disabled = true;
        } else {
          this.$refs["game-" + gameId + "-h" + i][0].disabled = false;
          this.$refs["game-" + gameId + "-a" + i][0].disabled = false;
        }
      }
    },
    checkLock(gameId) {
      if (this.isMatchLocked(gameId)) {
        // unlock the button, remove from locked array
        const index = this.lockedMatches.indexOf(gameId);
        this.lockedMatches.splice(index, 1);

        this.unprocessLock(gameId);
        this.toggleRowLock(gameId, false);
      } else {
        this.processLock(gameId);
        if (!this.hasErrors) {
          this.lockedMatches.push(gameId);
          this.toggleRowLock(gameId, true);
        }
      }
      if (!this.hasErrors) {
        this.alteredGroup.players = _(this.alteredGroup.players)
          .chain()
          .sortBy(function (player) {
            return parseInt(player.rallies_diff);
          })
          .sortBy(function (player) {
            return parseInt(player.sets_diff);
          })
          .sortBy(function (player) {
            return parseInt(player.points);
          })
          .reverse()
          .value();

        this.recolor();
      }
    },
    updatePlayerData(
      player,
      pointsFor,
      pointsAgainst,
      setsFor,
      setsAgainst,
      value
    ) {
      player.played += value;
      // rallies
      player.rallies_for =
        player.rallies_for == null
          ? pointsFor
          : player.rallies_for + value * pointsFor;
      player.rallies_against =
        player.rallies_against == null
          ? pointsAgainst
          : player.rallies_against + value * pointsAgainst;
      player.rallies_diff = player.rallies_for - player.rallies_against;
      // sets
      player.sets_for =
        player.sets_for == null ? setsFor : player.sets_for + value * setsFor;
      player.sets_against =
        player.sets_against == null
          ? setsAgainst
          : player.sets_against + value * setsAgainst;
      player.sets_diff = player.sets_for - player.sets_against;
      // w/d/l
      if (setsFor > setsAgainst) {
        player.wins += value;
        player.points += value * 2;
      } else if (setsFor < setsAgainst) {
        player.losses += value;
      } else {
        player.draws += value;
        player.points += value;
      }
    },
  },
  mounted() {
    axios
      .get(
        "/api/tournaments/" +
          this.tournament.id +
          "/group/schedule/" +
          this.group.group_id
      )
      .then((res) => {
        if (res.data.length > 0) {
          this.matches = res.data;
        }
      });
    this.positionColors = _.pluck(this.alteredGroup.players, "pos_color");
  },
};
</script>

<style scoped lang="less">
.level {
  border-radius: 5px;
  padding: 2px 0;
}

.level-span > a {
  color: black;
}

.level-span > a:hover {
  color: #0e3c46;
}

.group-container > td:first-child {
  border-radius: 7px;
  border: 0px solid #1e1e26;
}

.tbl-standings > tr:first-child {
  color: white;
}

.tbl-standings td {
  padding: 1px;
}

.item-comma:not(:first-child)::before {
  color: white;
  content: ", ";
}

.item-comma:last-child::before {
  color: white;
  content: " and ";
}

.item-comma:first-child:last-child::before {
  content: "";
}

.lbl-recap {
  cursor: pointer;
}

.lbl-recap:hover {
  color: #808082;
}

.lbl-pos {
  background: #1e1e26;
  padding: 0 5px;
  border-radius: 20px;
  display: block;
  color: white;
}

.textInputPredictor {
  border: 1px solid rgba(84, 84, 84, 0.65);
  border-radius: 4px;
  padding: 5px 8px;
  background: var(--col-dark);
  color: white;
  font-size: 15px;
  font-family: inherit;
  width: 15px;
}

.textInputPredictor:disabled {
  background-color: #3c3f41;
}
</style>
