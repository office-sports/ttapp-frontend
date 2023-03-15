<template>
  <div class="round-container marb20">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="txt-col-white">All time best W / L ratio</span>
    </div>
    <div class="flex-full-width padt20">
      <div v-for="(p, idx) in this.leadersWLRatio" v-bind:key="idx">
        <table>
          <tr>
            <td>
              <div class="cutoutPicSmall">
                <img :src="p.profile_pic_url" class="pic" />
              </div>
              <CircleNumber>
                <template #value>
                  {{ idx + 1 }}
                </template>
              </CircleNumber>
            </td>
          </tr>
          <tr>
            <td class="txtc col-winner num-big">
              {{ (p.g_won / p.g_lost).toFixed(2) }}
            </td>
          </tr>
          <tr>
            <td class="txtc">{{ p.player_name }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <div class="round-container marb20">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="txt-col-white">Most points scored</span>
    </div>
    <div class="flex-full-width padt20">
      <div v-for="(p, idx) in this.leadersPoints" v-bind:key="idx">
        <table>
          <tr>
            <td>
              <div class="cutoutPicSmall">
                <img :src="p.profile_pic_url" class="pic" />
              </div>
              <CircleNumber>
                <template #value>
                  {{ idx + 1 }}
                </template>
              </CircleNumber>
            </td>
          </tr>
          <tr>
            <td class="txtc col-winner num-big">
              {{ p.p_won }}
            </td>
          </tr>
          <tr>
            <td class="txtc">{{ p.player_name }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <div class="round-container marb20">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="txt-col-white">Most sets won</span>
    </div>
    <div class="flex-full-width padt20">
      <div v-for="(p, idx) in this.leadersSets" v-bind:key="idx">
        <table>
          <tr>
            <td>
              <div class="cutoutPicSmall">
                <img :src="p.profile_pic_url" class="pic" />
              </div>
              <CircleNumber>
                <template #value>
                  {{ idx + 1 }}
                </template>
              </CircleNumber>
            </td>
          </tr>
          <tr>
            <td class="txtc col-winner num-big">
              {{ p.s_won }}
            </td>
          </tr>
          <tr>
            <td class="txtc">{{ p.player_name }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "underscore";
import CircleNumber from "@/components/game/CircleNumber.vue";

export default {
  components: { CircleNumber },
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
