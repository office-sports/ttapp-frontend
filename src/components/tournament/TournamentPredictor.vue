<template>
  <div>
    <table class="tbl-fixtures tbl-standings">
      <tr>
        <td class="txtl w400">name</td>
        <td class="txtc">played</td>
        <td class="txtc">w / d / l</td>
        <td class="txtc">sets</td>
        <td class="txtc">+/-</td>
        <th class="txtc">rallies</th>
        <td class="txtc">+/-</td>
        <td class="txtc">points</td>
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
                  this.lockedPlayoffs[group.group_id].includes(player.player_id)
                "
              >
                <i class="fas fa-lock-open"></i>
              </span>
            </span>
          </div>
        </td>
        <td class="txtc">{{ player.played }}</td>
        <td class="txtc">
          {{ player.wins }} - {{ player.draws }} - {{ player.losses }}
        </td>
        <td class="txtc">{{ player.sets_for }} - {{ player.sets_against }}</td>
        <td class="txtc">{{ player.sets_diff }}</td>
        <td class="txtc">
          {{ player.rallies_for }} - {{ player.rallies_against }}
        </td>
        <td class="txtc">{{ player.rallies_diff ?? 0 }}</td>
        <td class="txtc">{{ player.points }}</td>
      </tr>
    </table>
  </div>

  <div class="mart20">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="marl10" v-if="matches.length > 0">Predictions</span>
    </div>
  </div>

  <div v-if="matches.length > 0" class="pad10">
    <table class="tbl-fixtures">
      <tr class="table-th">
        <td>played</td>
        <td class="txtc">&nbsp;</td>
        <td class="txtl">set scores</td>
      </tr>
      <template v-for="(match, index) in this.matches" v-bind:key="index">
        <tr class="tr-row">
          <td class="txt-col-darker">{{ match.date_played }}</td>
          <td>
            <GameVersusTable :match="match" />
          </td>
          <td>
            <div>
              <span v-for="i in match.mode" v-bind:key="i" class="padr20">
                <input
                  type="text"
                  :value="0"
                  class="textInputPredictor"
                  :id="'game-' + match.match_id + '-h' + i"
                  :ref="'game-' + match.match_id + '-h' + i" />
                :
                <input
                  type="text"
                  :value="0"
                  class="textInputPredictor"
                  :id="'game-' + match.match_id + '-a' + i"
                  :ref="'game-' + match.match_id + '-a' + i"
              /></span>
            </div>
            <div>
              <span
                :ref="'game-' + match.match_id + '-error'"
                class="txt-col-red"
              >
              </span>
            </div>
          </td>
          <td class="txtr">
            <div class="btn-link" @click="this.checkLock(match.match_id)">
              lock
            </div>
          </td>
        </tr>
      </template>
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
    };
  },
  methods: {
    checkLock(gameId) {
      let hasErrors = false;
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
        setHomePoints = this.$refs["game-" + gameId + "-h" + i][0].value;
        setAwayPoints = this.$refs["game-" + gameId + "-a" + i][0].value;
        homePoints += parseInt(setHomePoints);
        awayPoints += parseInt(setAwayPoints);

        // check if required wins is correct
        if (homeSets === requiredWins || awaySets === requiredWins) {
          break;
        }

        // check if the score is set
        if (
          (parseInt(setHomePoints) === 0 && parseInt(setAwayPoints) === 0) || // shoukd be moved
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
          hasErrors = true;
          break;
        }
      }

      console.log(hasErrors);
      if (hasErrors === true) {
        return;
      }

      // We have correct game scores,

      // Find home player
      let homePlayer = _.findWhere(this.alteredGroup.players, {
        player_id: game.home_player_id,
      });

      homePlayer.played++;
      homePlayer.rallies_for =
        homePlayer.rallies_for == null
          ? homePoints
          : homePlayer.rallies_for + homePoints;
      homePlayer.rallies_against =
        homePlayer.rallies_against == null
          ? awayPoints
          : homePlayer.rallies_against + awayPoints;
      homePlayer.rallies_diff =
        homePlayer.rallies_for - homePlayer.rallies_against;

      //this.alteredGroup.players[0].draws = 100;
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
    console.log(this.alteredGroup);
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
</style>
