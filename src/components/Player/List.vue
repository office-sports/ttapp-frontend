<template>
  <div class="roundWrapper">
    <div class="txtHeader col-dark-green">
      <i class="fas fa-bullseye"></i> <span class="padl10">Player list</span>
    </div>
    <div class="txtSmall">
      <table class="table-player-list">
        <tr class="row-header">
          <th>&nbsp;</th>
          <th class="txtl"><a @click="nameSort()">name</a></th>
          <th class="txtr"><a @click="eloSort()">elo</a></th>
          <th class="txtr" style="width: 100px">
            <a @click="eloChangeSort()">change</a>
          </th>
          <th class="txtc"><a @click="gameSort()">m.played</a></th>
          <th class="txtc">m.won / m.drawn / m.lost</th>
          <th class="txtc"><a @click="winSort()">m.win%</a></th>
        </tr>
        <tr
          v-for="(player, index) in this.filteredPlayers"
          v-bind:key="player.id"
          class="row-data"
        >
          <td>{{ index + 1 }}</td>
          <td class="txtl player-link">
            <router-link :to="'/player/' + player.id + '/profile'"
              >{{ player.name }}
            </router-link>
          </td>
          <td class="txtr">
            <span v-if="player.games_played >= 15" style="color: white">{{
              player.elo
            }}</span>
            <span v-else>?</span>
          </td>
          <td class="txtr">
            {{ player.elo - player.old_elo }}
            <span style="margin-left: 10px">
              <span
                style="color: red"
                v-if="player.elo - player.old_elo <= -100"
              >
                <i class="fas fa-angle-double-down"></i>
              </span>
              <span
                style="color: red"
                v-else-if="player.elo - player.old_elo < 0"
              >
                <i class="fas fa-angle-down"></i>
              </span>
              <span
                style="color: green"
                v-else-if="player.elo - player.old_elo > 100"
              >
                <i class="fas fa-angle-double-up"></i>
              </span>
              <span
                style="color: green"
                v-else-if="player.elo - player.old_elo > 0"
              >
                <i class="fas fa-angle-up"></i>
              </span>
              <span v-else>
                <i style="color: #4a4a4a" class="fas fa-caret-left"></i>
              </span>
            </span>
          </td>
          <td class="txtc">{{ player.games_played }}</td>
          <td class="txtc">
            {{ player.wins }} / {{ player.draws }} / {{ player.losses }}
          </td>
          <td class="txtc">{{ player.win_percentage.toFixed(2) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  name: "App",
  data() {
    return {
      players: [],
      eloOrder: "asc",
      eloChangeOrder: "asc",
      nameOrder: "desc",
      gamesPlayedOrder: "asc",
      winOrder: "asc",
      officeId: 1,
    };
  },
  mounted() {
    axios.get("/api/players").then((res) => {
      this.players = res.data;
      this.nameSort();
      if (localStorage.getItem("ttappOfficeId") === null) {
        this.officeId = 1;
      } else {
        this.officeId = localStorage.getItem("ttappOfficeId");
      }
    });
  },
  computed: {
    filteredPlayers: function () {
      return this.players.filter((player) => {
        return parseInt(player.office_id) === parseInt(this.officeId);
      });
    },
  },
  methods: {
    eloChangeSort() {
      if (this.eloChangeOrder === "desc") {
        this.eloChangeOrder = "asc";
      } else {
        this.eloChangeOrder = "desc";
      }
      this.players = _.orderBy(this.players, "elo_change", this.eloChangeOrder);
    },
    eloSort() {
      if (this.eloOrder === "desc") {
        this.eloOrder = "asc";
      } else {
        this.eloOrder = "desc";
      }
      this.players = _.orderBy(this.players, "elo", this.eloOrder);
    },
    nameSort() {
      if (this.nameOrder === "desc") {
        this.nameOrder = "asc";
      } else {
        this.nameOrder = "desc";
      }
      this.players = _.orderBy(this.players, "name", this.nameOrder);
    },
    gameSort() {
      if (this.gamesPlayedOrder === "desc") {
        this.gamesPlayedOrder = "asc";
      } else {
        this.gamesPlayedOrder = "desc";
      }
      this.players = _.orderBy(
        this.players,
        "gamesPlayed",
        this.gamesPlayedOrder
      );
    },
    winSort() {
      if (this.winOrder === "desc") {
        this.winOrder = "asc";
      } else {
        this.winOrder = "desc";
      }
      this.players = _.orderBy(this.players, "win_percentage", this.winOrder);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.mainContainer {
  padding: 20px 25px;
}

.table-player-list {
  border-collapse: collapse;
  margin-top: 20px;
  width: 100%;

  .row-data {
    border-top: 1px solid #0e3c46;
    height: 25px;
    line-height: 25px;
  }
}

.row-header {
  th {
    color: white;
  }
}

.player-link {
  a {
    color: white;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
}
</style>
