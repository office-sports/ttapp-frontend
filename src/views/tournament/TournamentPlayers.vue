<template>
  <div class="round-container">
    <div class="round-container-dark-small flex txt-col-darker flex-full-width">
      <span class="text-white">Tournament players list</span>
    </div>
    <div>
      <div v-if="this.players.length > 0" class="pad10">
        <table class="tbl-fixtures">
          <tbody>
            <tr class="table-th">
              <td class="cur-pointer" @click="sortColumn('player_name')">
                name
              </td>
              <td class="cur-pointer" @click="sortColumn('group_name')">
                league
              </td>
              <td class="cur-pointer" @click="sortColumn('starting_elo')">
                elo.start
              </td>
              <td
                class="cur-pointer text-center"
                @click="sortColumn('last_elo')"
              >
                elo.last
              </td>
              <td
                class="cur-pointer text-center"
                @click="sortColumn('elo_change')"
              >
                elo.change
              </td>
              <td class="text-center">W / D / L</td>
              <td class="text-left">
                <div class="padl20">
                  <i class="fas fa-long-arrow-alt-left"></i> form (last 6 games)
                </div>
              </td>
              <td class="text-center" @click="sortColumn('finished')">
                played
              </td>
              <td class="text-center" @click="sortColumn('unfinished')">tbd</td>
            </tr>
            <template
              v-for="(player, index) in this.players"
              v-bind:key="index"
            >
              <tr class="tr-row">
                <td>
                  <router-link :to="'/player/' + player.player_id + '/profile'"
                    >{{ player.player_name }}
                  </router-link>
                </td>
                <td class="txt-col-darker">
                  {{ player.group_name }}
                </td>
                <td class="text-center">
                  {{ player.starting_elo }}
                </td>
                <td class="text-center">
                  {{ player.last_elo }}
                </td>
                <td class="text-center">
                  {{ player.last_elo - player.starting_elo }}
                  <span class="ml-2.5">
                    <span
                      class="text-red-600"
                      v-if="player.last_elo - player.starting_elo <= -100"
                    >
                      <i class="fas fa-angle-double-down"></i>
                    </span>
                    <span
                      class="text-red-600"
                      v-else-if="player.last_elo - player.starting_elo < 0"
                    >
                      <i class="fas fa-angle-down"></i>
                    </span>
                    <span
                      class="txt-col-green"
                      v-else-if="player.last_elo - player.starting_elo > 100"
                    >
                      <i class="fas fa-angle-double-up"></i>
                    </span>
                    <span
                      class="txt-col-green"
                      v-else-if="player.last_elo - player.starting_elo > 0"
                    >
                      <i class="fas fa-angle-up"></i>
                    </span>
                    <span v-else>
                      <i class="fas fa-caret-left txt-col-darkest"></i>
                    </span>
                  </span>
                </td>
                <td class="text-center">
                  {{ player.won }} / {{ player.draw }} / {{ player.lost }}
                </td>
                <td class="text-center flex">
                  <div class="padl20 flex" v-if="player.form">
                    <span
                      class="span-form"
                      v-for="(f, idx) in player.form.slice(0, 6)"
                      v-bind:key="idx"
                    >
                      <PlayerFormLabel
                        :playerId="player.player_id"
                        :winnerId="f"
                      />
                    </span>
                  </div>
                </td>
                <td class="text-center">{{ player.finished }}</td>
                <td class="text-center">{{ player.unfinished }}</td>
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
import PlayerFormLabel from "@/components/game/PlayerFormLabel.vue";

export default {
  name: "TournamentPlayers",
  components: { PlayerFormLabel },
  data() {
    return {
      tournament: null,
      performances: [],
      players: [],
      sorts: {
        player_name: "asc",
        group_name: "asc",
        starting_elo: "asc",
        last_elo: "asc",
        elo_change: "asc",
        finished: "asc",
        unfinished: "asc",
      },
    };
  },
  methods: {
    sortColumn(v) {
      this.sorts.v = this.sorts.v === "asc" ? "desc" : "asc";
      this.players = _.sortBy(this.players, v);
      if (this.sorts.v === "desc") {
        this.players.reverse();
      }
    },
  },
  mounted() {
    axios
      .all([
        axios.get("/api/tournaments/" + this.$route.params.id),
        axios.get("/api/tournaments/" + this.$route.params.id + "/performance"),
      ])
      .then(
        axios.spread((t, p) => {
          this.tournament = t.data;
          this.performances = p.data;

          _.each(this.performances, (elem) => {
            _.each(elem.players, (pl) => {
              pl["elo_change"] = pl.last_elo - pl.starting_elo;
              this.players.push(pl);
            });
          });

          this.sortColumn("player_name");
        })
      )
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
.span-form {
  padding-right: 5px;
}
</style>
