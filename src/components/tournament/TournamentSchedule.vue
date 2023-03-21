<template>
  <div class="round-container-dark-small flex txt-col-darker flex-full-width">
    <table class="tbl-nopad">
      <tr>
        <td class="padl10">
          <span v-if="fixtureCount === 0" class="txt-col-white">
            Full tournament schedule
          </span>
          <span v-else class="txt-col-white">Tournament schedule</span>
          <span class="marl10" v-if="fixtureCount > 0"
            >(next {{ fixtureCount }})</span
          >
        </td>
        <td class="txtr padr10" style="padding: 0">
          <template v-if="fixtureCount === 0">
            <form @submit.prevent="nameSearch" style="display: inline-block">
              <input
                v-model="searchName"
                placeholder="name"
                type="text"
                class="textInput txtl"
              />
            </form>
            <span
              class="padl10"
              v-if="this.searchName !== '' && this.searchName.length >= 3"
            >
              <i @click="this.clearSearchName" class="far fa-times-circle"></i>
            </span>
          </template>
        </td>
      </tr>
    </table>
  </div>

  <div v-if="matches.length > 0" class="pad10">
    <table class="tbl-fixtures">
      <tr class="table-th">
        <td>date of match</td>
        <td>group name</td>
        <td>&nbsp;</td>
      </tr>
      <template v-for="(match, index) in this.matches" v-bind:key="index">
        <tr class="tr-row" v-show="isShown(match)">
          <td class="txt-col-darker">{{ match.date_of_match }}</td>
          <td>{{ match.group_name }}</td>
          <td>
            <GameVersusTable :match="match" />
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
import GameVersusTable from "@/components/tournament/GameVersusTable.vue";

export default {
  name: "TournamentSchedule",
  components: { GameVersusTable },
  props: ["fixtureCount", "officeId", "tournamentId"],
  data() {
    return {
      matches: [],
      searchName: "",
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
  methods: {
    clearSearchName() {
      this.searchName = "";
    },
    isShown(game) {
      // By default, do not hide (hide = false)
      if (this.searchName !== "" && this.searchName.length >= 3) {
        // get game players
        let names = (
          game.home_player_name +
          " " +
          game.away_player_name
        ).toLowerCase();
        return names.indexOf(this.searchName.toLowerCase()) > -1;
      }
      return true;
    },
  },
};
</script>

<style>
.btn-link:hover {
  background: #737373;
}

.tbl-nopad td {
  padding: 0;
}
</style>
