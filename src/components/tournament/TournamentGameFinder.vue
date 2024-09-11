<template>
  <div
    class="round-container-dark-small flex items-center justify-between txt-col-darker w-full px-4"
  >
    <div>
      <span class="ml-2.5">Find your scheduled matches</span>
      <span class="ml-2.5">
        <form @submit.prevent="nameSearch" style="display: inline-block">
          <input
            v-model="searchName"
            placeholder="player name"
            type="text"
            class="textInput text-left min-w-40"
          />
        </form>
        <span
          class="pl-2.5"
          v-if="this.searchName !== '' && this.searchName.length >= 3"
        >
          <i @click="this.clearSearchName" class="far fa-times-circle"></i>
        </span>
      </span>
    </div>
    <div>
      <div class="text-white ml-auto w-32">
        <router-link :to="'/tournament/' + this.tournamentId + '/schedule'">
          <div class="cursor-pointer rounded-md bg-gray-700 text-center py-1">
            show all
          </div>
        </router-link>
      </div>
    </div>
  </div>

  <div
    v-if="
      matches.length > 0 &&
      this.searchName !== '' &&
      this.searchName.length >= 3
    "
    class="pad10"
  >
    <table class="tbl-fixtures">
      <tbody>
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
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import GameVersusTable from "@/components/tournament/GameVersusTable.vue";

export default {
  name: "TournamentGameFinder",
  components: { GameVersusTable },
  props: ["officeId", "tournamentId"],
  data() {
    return {
      matches: [],
      searchName: "",
      fixtureCount: 0,
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
      return false;
    },
  },
};
</script>

<style>
.tbl-nopad td {
  padding: 0;
}
</style>
