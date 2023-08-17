<template>
  <div class="round-container">
    <div class="round-container-dark-small flex txt-col-darker flex-full-width">
      <span class="txt-col-white">Player list</span>
      <span @click="this.toggleShowInactive()" class="cur-pointer">
        <span v-if="!this.showInactive">show inactive players</span>
        <span v-else>hide inactive players</span>
      </span>
    </div>
    <div>
      <div v-if="visiblePlayers.length > 0" class="pad10">
        <table class="tbl-fixtures">
          <tr class="table-th">
            <td>&nbsp;</td>
            <td class="cur-pointer" @click="sortColumn('name')">name</td>
            <td class="cur-pointer" @click="sortColumn('elo')">elo</td>
            <td class="cur-pointer txtc" @click="sortColumn('elo_change')">
              change
            </td>
            <td class="cur-pointer txtc" @click="sortColumn('games_played')">
              played
            </td>
            <td class="txtc">wins / draws / losses</td>
            <td class="cur-pointer txtc" @click="sortColumn('win_percentage')">
              winning %
            </td>
          </tr>
          <template
            v-for="(player, index) in this.visiblePlayers"
            v-bind:key="index"
          >
            <tr
              class="tr-row"
              v-if="(this.showInactive && !player.active) || player.active"
            >
              <td class="txt-col-darker">
                {{ index + 1 }}
              </td>
              <td>
                <router-link :to="'/player/' + player.id + '/profile'"
                  >{{ player.name }}
                </router-link>
              </td>
              <td>
                <span v-if="player.games_played >= 10">{{ player.elo }}</span>
                <span v-else class="txt-col-darker">?</span>
              </td>
              <td class="txtc">
                {{ player.elo - player.old_elo }}
                <span class="marl10">
                  <span
                    class="txt-col-red"
                    v-if="player.elo - player.old_elo <= -100"
                  >
                    <i class="fas fa-angle-double-down"></i>
                  </span>
                  <span
                    class="txt-col-red"
                    v-else-if="player.elo - player.old_elo < 0"
                  >
                    <i class="fas fa-angle-down"></i>
                  </span>
                  <span
                    class="txt-col-green"
                    v-else-if="player.elo - player.old_elo > 100"
                  >
                    <i class="fas fa-angle-double-up"></i>
                  </span>
                  <span
                    class="txt-col-green"
                    v-else-if="player.elo - player.old_elo > 0"
                  >
                    <i class="fas fa-angle-up"></i>
                  </span>
                  <span v-else>
                    <i class="fas fa-caret-left txt-col-darkest"></i>
                  </span>
                </span>
              </td>
              <td class="txtc">{{ player.games_played }}</td>
              <td class="txtc">
                {{ player.wins }} / {{ player.draws }} / {{ player.losses }}
              </td>
              <td class="txtc">{{ player.win_percentage.toFixed(2) }}</td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "underscore";

export default {
  data() {
    return {
      visiblePlayers: [],
      players: [],
      sorts: {
        elo: "asc",
        elo_change: "asc",
        name: "asc",
        games_played: "asc",
        win_percentage: "asc",
      },
      showInactive: false,
      officeId: localStorage.getItem("officeId") ?? "1",
    };
  },
  methods: {
    sortColumn(v) {
      this.sorts.v = this.sorts.v === "asc" ? "desc" : "asc";
      this.visiblePlayers = _.sortBy(this.visiblePlayers, v);
      if (this.sorts.v === "desc") {
        this.visiblePlayers.reverse();
      }
    },
    filterPlayers() {
      this.players = _.filter(this.players, (p) => {
        return parseInt(p.office_id) === parseInt(this.officeId);
      });
    },
    filterVisiblePlayers() {
      this.visiblePlayers = _.filter(this.players, (p) => {
        if (this.showInactive === false) {
          return p.active === 1;
        } else {
          return p.active === 0 || p.active === 1;
        }
      });
    },
    toggleShowInactive() {
      this.showInactive = !this.showInactive;
      this.filterVisiblePlayers();
    },
  },
  mounted() {
    axios.get("/api/players").then((res) => {
      this.players = res.data;
      this.filterPlayers();
      this.filterVisiblePlayers();
    });
  },
};
// import axios from "axios";
// import _ from "lodash";
//
// export default {
//   data() {
//     return {

//       players: [],

//       officeId: localStorage.getItem("officeId") ?? 1,
//     };
//   },

//   methods: {
//     toggleShowInactive() {
//       this.showInactive = !this.showInactive;
//     },
//     eloChangeSort() {
//       if (this.eloChangeOrder === "desc") {
//         this.eloChangeOrder = "asc";
//       } else {
//         this.eloChangeOrder = "desc";
//       }
//       this.players = _.orderBy(this.players, "elo_change", this.eloChangeOrder);
//     },
//     eloSort() {
//       if (this.eloOrder === "desc") {
//         this.eloOrder = "asc";
//       } else {
//         this.eloOrder = "desc";
//       }
//       this.players = _.orderBy(this.players, "elo", this.eloOrder);
//     },
//     nameSort() {
//       if (this.nameOrder === "desc") {
//         this.nameOrder = "asc";
//       } else {
//         this.nameOrder = "desc";
//       }
//       this.players = _.orderBy(this.players, "name", this.nameOrder);
//     },
//     gameSort() {
//       if (this.gamesPlayedOrder === "desc") {
//         this.gamesPlayedOrder = "asc";
//       } else {
//         this.gamesPlayedOrder = "desc";
//       }
//       this.players = _.orderBy(
//         this.players,
//         "gamesPlayed",
//         this.gamesPlayedOrder
//       );
//     },
//     winSort() {
//       if (this.winOrder === "desc") {
//         this.winOrder = "asc";
//       } else {
//         this.winOrder = "desc";
//       }
//       this.players = _.orderBy(this.players, "win_percentage", this.winOrder);
//     },
//   },
// };
</script>
