<template>
  <div class="round-container-green">
    <div
      class="round-container-green-small flex txt-col-darker flex-full-width"
    >
      <span class="text-white"> Hall of fame</span>
    </div>
  </div>
  <div class="round-container marb20 mart20">
    <table class="tbl-fixed">
      <tbody>
        <tr>
          <td>
            <div class="round-container-dark-small txt-col-darker">
              <span class="text-white">All time best W / L ratio</span>
            </div>
            <div>
              <table class="ml-2.5">
                <tbody>
                  <tr v-for="(p, idx) in this.leadersWLRatio" v-bind:key="idx">
                    <td>{{ idx + 1 }}.</td>
                    <td class="text-left">{{ p.player_name }}</td>
                    <td class="text-right col-winner padr20">
                      {{ (p.g_won / p.g_lost).toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
          <td class="w15">&nbsp;</td>
          <td>
            <div class="round-container-dark-small flex txt-col-darker">
              <span class="text-white">Most points scored</span>
            </div>
            <div>
              <table class="ml-2.5">
                <tbody>
                  <tr v-for="(p, idx) in this.leadersPoints" v-bind:key="idx">
                    <td>{{ idx + 1 }}.</td>
                    <td class="text-left">{{ p.player_name }}</td>
                    <td class="text-right col-winner padr20">
                      {{ p.p_won }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
          <td class="w15">&nbsp;</td>
          <td>
            <div class="round-container-dark-small flex txt-col-darker">
              <span class="text-white">Most sets won</span>
            </div>
            <div>
              <table class="ml-2.5">
                <tbody>
                  <tr v-for="(p, idx) in this.leadersPoints" v-bind:key="idx">
                    <td>{{ idx + 1 }}.</td>
                    <td class="text-left">{{ p.player_name }}</td>
                    <td class="text-right col-winner padr20">
                      {{ p.s_won }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import _ from "underscore";

export default {
  data() {
    return {
      leaders: [],
      leadersWLRatio: [],
      leadersPoints: [],
      leadersSets: [],
      officeId: localStorage.getItem("officeId") ?? "1",
    };
  },
  methods: {
    filterPlayers(data) {
      return _.filter(data, (p) => {
        return parseInt(p.office_id) === parseInt(this.officeId);
      });
    },
  },
  mounted() {
    axios.get("/api/leaders").then((res) => {
      const leaders = this.filterPlayers(res.data);
      this.filterPlayers(res.data);
      this.leadersWLRatio = _.sortBy(leaders, function (l) {
        return l.g_won / l.g_lost;
      })
        .reverse()
        .slice(0, 5);
      this.leadersPoints = _.sortBy(leaders, function (l) {
        return l.p_won;
      })
        .reverse()
        .slice(0, 5);
      this.leadersSets = _.sortBy(leaders, function (l) {
        return l.s_won;
      })
        .reverse()
        .slice(0, 5);
      this.filterPlayers();
    });
  },
};
</script>

<style>
.idx-font {
  font-size: 40pt;
  min-width: 40px;
  vertical-align: middle;
  text-align: center;
}
</style>
