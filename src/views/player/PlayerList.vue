<template>
  <div class="round-container">
    <div class="round-container-dark-small flex txt-col-darker flex-full-width">
      <span class="text-white">Player list</span>
      <span @click="this.toggleShowInactive()" class="cur-pointer">
        <span v-if="!this.showInactive">show inactive players</span>
        <span v-else>hide inactive players</span>
      </span>
    </div>
    <div>
      <div v-if="visiblePlayers.length > 0" class="pad10">
        <table class="tbl-fixtures">
          <tbody>
            <tr class="table-th">
              <td>&nbsp;</td>
              <td class="cur-pointer" @click="sortColumn('name')">name</td>
              <td class="cur-pointer" @click="sortColumn('elo')">elo</td>
              <td
                class="cur-pointer text-center"
                @click="sortColumn('elo_change')"
              >
                change
              </td>
              <td
                class="cur-pointer text-center"
                @click="sortColumn('games_played')"
              >
                played
              </td>
              <td class="text-center">wins / draws / losses</td>
              <td
                class="cur-pointer text-center"
                @click="sortColumn('win_percentage')"
              >
                winning %
              </td>
              <td class="cur-pointer text-center" @click="sortColumn('pps')">
                PPS
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
                <td class="text-center">
                  {{ player.elo - player.old_elo }}
                  <span class="ml-2.5">
                    <span
                      class="text-red-600"
                      v-if="player.elo - player.old_elo <= -100"
                    >
                      <i class="fas fa-angle-double-down"></i>
                    </span>
                    <span
                      class="text-red-600"
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
                <td class="text-center">{{ player.games_played }}</td>
                <td class="text-center">
                  {{ player.wins }} / {{ player.draws }} / {{ player.losses }}
                </td>
                <td class="text-center">
                  {{ player.win_percentage.toFixed(2) }}
                </td>
                <td class="text-center txt-col-darker">
                  {{ player.pps.toFixed(2) }}
                </td>
              </tr>
            </template>
          </tbody>
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
        pps: "asc",
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
</script>
