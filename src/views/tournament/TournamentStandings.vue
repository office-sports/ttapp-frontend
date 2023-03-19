<template>
  <div class="round-container">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="txt-col-darker">Tournament standings</span>
      <span v-for="group in groups" v-bind:key="group.group_id" class="marl20">
        <a href="#" v-scroll-to="'#group-' + group.group_id">{{
          group.group_name
        }}</a>
      </span>
    </div>
  </div>
  <template v-for="group in groups" v-bind:key="group.group_id">
    <div class="round-container mart20" :id="'group-' + group.group_id">
      <div class="round-container-dark-small flex txt-col-darker">
        <span class="txt-col-darker">{{ group.group_name }}</span>
      </div>
      <div class="pad10">
        <table class="tbl-fixtures tbl-standings">
          <tr>
            <td class="txtl">name</td>
            <td class="txtc">played</td>
            <td class="txtc">w / d / l</td>
            <td class="txtc">sets</td>
            <td class="txtc">+/-</td>
            <th class="txtc">rallies</th>
            <td class="txtc">+/-</td>
            <td class="txtc">points</td>
          </tr>
          <tr
            v-for="(player, index) in group.players"
            v-bind:key="player.playerId"
            class="group-container txt-col-darker"
          >
            <td>
              <div :class="['level', 'level-c' + player.pos_color]">
                <span class="txt-col-darkest padl10">{{ index + 1 }}. </span>
                <router-link :to="'/player/' + player.player_id + '/profile'"
                  >{{ player.player_name }}
                </router-link>
              </div>
            </td>
            <td class="txtc">{{ player.played }}</td>
            <td class="txtc">
              {{ player.wins }} - {{ player.draws }} - {{ player.losses }}
            </td>
            <td class="txtc">
              {{ player.sets_for }} - {{ player.sets_against }}
            </td>
            <td class="txtc">{{ player.sets_diff }}</td>
            <td class="txtc">
              {{ player.rallies_for }} - {{ player.rallies_against }}
            </td>
            <td class="txtc">{{ player.rallies_diff ?? 0 }}</td>
            <td class="txtc">{{ player.points }}</td>
          </tr>
        </table>
      </div>
    </div>
  </template>
</template>

<script>
import axios from "axios";

export default {
  name: "TournamentStandings",
  data() {
    return {
      tournament: null,
      groups: [],
    };
  },
  mounted() {
    axios
      .get("/api/tournaments/" + this.$route.params.id + "/standings")
      .then((res) => {
        this.groups = res.data;
      });
  },
};
</script>

<style scoped lang="less">
.level {
  border-radius: 5px;
  padding: 2px 0;
}

.level > a {
  color: black;
}

.level > a:hover {
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
</style>
