<template>
  <div class="round-container-dark-small flex txt-col-darker flex-full-width">
    <span v-if="fixtureCount === 0" class="txt-col-white"
      >Full tournament schedule</span
    >
    <span v-else class="txt-col-white">Tournament schedule</span>
    <span class="marl10" v-if="fixtureCount > 0"
      >(next {{ fixtureCount }})</span
    >
    <!--    <template v-if="fixtureCount === 0">-->
    <!--      <form @submit.prevent="nameSearch" style="display: inline-block">-->
    <!--        <input-->
    <!--          v-model="searchName"-->
    <!--          placeholder="name"-->
    <!--          type="text"-->
    <!--          class="textInput"-->
    <!--          @keyup="this.filterName()"-->
    <!--        />-->
    <!--      </form>-->
    <!--      <span class="pl10" v-if="this.searchName && this.searchName.length >= 3">-->
    <!--        <i @click="this.clearSearchName" class="fa-solid fa-circle-xmark"></i>-->
    <!--      </span>-->
    <!--    </template>-->
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
    filterName: function () {
      // remove all filters
      this.toggleAll();
    },
    toggleAll() {
      // this.finishedOnly = false;
      // this.unfinishedOnly = false;
      // this.betsOnly = false;
    },
    hasPlayerName(game) {
      // get game players
      let names = (
        game.home_player_name +
        " " +
        game.away_player_name
      ).toLowerCase();
      return names.indexOf(this.searchName.toLowerCase()) > -1;
    },
    isShown(game) {
      // By default, do not hide (hide = false)
      if (this.searchName !== "" && this.searchName.length >= 3) {
        return !this.hasPlayerName(game);
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
</style>
