<template>
  <div class="round-container-dark-small flex txt-col-darker">
    <span v-if="fixtureCount === 0" class="txt-col-white"
      >Full tournament schedule</span
    >
    <span v-else class="txt-col-white">Tournament schedule</span>
    <span class="marl10" v-if="fixtureCount > 0"
      >(next {{ fixtureCount }})</span
    >
  </div>

  <div v-if="matches.length > 0" class="pad10">
    <table class="tbl-fixtures">
      <tr class="table-th">
        <td>date of match</td>
        <td>group name</td>
        <td class="txtr">home player</td>
        <td>&nbsp;</td>
        <td class="txtl">away player</td>
      </tr>
      <template v-for="(match, index) in this.matches" v-bind:key="index">
        <tr class="tr-row">
          <td class="txt-col-darker">{{ match.date_of_match }}</td>
          <td>{{ match.group_name }}</td>
          <td class="txtr">
            <router-link :to="'/player/' + match.homePlayerId + '/profile'"
              >{{ match.home_player_name }}
            </router-link>
          </td>
          <td class="txtc">-</td>
          <td>
            <router-link :to="'/player/' + match.away_player_id + '/profile'"
              >{{ match.away_player_name }}
            </router-link>
          </td>
          <td>
            <router-link
              :to="{ name: 'GameScoring', params: { id: match.match_id } }"
              ><i class="far fa-play-circle"></i
            ></router-link>
          </td>
        </tr>
      </template>
    </table>
    <div class="mart20" v-if="fixtureCount > 0">
      <router-link :to="'/tournament/' + this.tournamentId + '/schedule'">
        <div class="btn-link">show all</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TournamentSchedule",
  props: ["fixtureCount", "officeId", "tournamentId"],
  data() {
    return {
      matches: [],
    };
  },
  mounted() {
    axios
      .get(
        "/api/tournaments/" +
          this.tournamentId +
          "/schedule/" +
          this.fixtureCount
      )
      .then((res) => {
        if (res.data.length > 0) {
          this.matches = res.data;
        }
      });
  },
};
</script>

<style>
.btn-link:hover {
  background: #737373;
}
</style>
