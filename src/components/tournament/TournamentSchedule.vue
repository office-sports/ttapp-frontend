<template>
  <div
    class="round-container-dark-small flex items-center justify-between txt-col-darker w-full px-4"
  >
    <div>
      <span class="ml-2.5" v-if="fixtureCount > 0"
        >Tournament schedule (next {{ fixtureCount }})</span
      >
      <span v-else class="text-white">Full tournament schedule</span>
    </div>
    <div>
      <div v-if="fixtureCount === 0" class="text-white">
        <span>
          <form @submit.prevent="nameSearch" style="display: inline-block">
            <input
              v-model="searchName"
              placeholder="name"
              type="text"
              class="textInput text-left"
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
      <div v-else>
        <div class="ml-auto w-32">
          <router-link :to="'/tournament/' + this.tournamentId + '/schedule'">
            <div class="cursor-pointer rounded-md bg-gray-700 text-center py-1">
              show all
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <div v-if="matches.length > 0">
    <template v-for="(group, name) in this.groupedMatches" v-bind:key="name">
      <div class="mt-2.5">
        <div
          class="round-container-dark-small flex items-center justify-between txt-col-darker w-full px-4"
        >
          {{ name }}
        </div>
        <div class="p-2.5">
          <table class="tbl-fixtures">
            <tbody>
              <tr class="table-th">
                <td>date of match</td>
                <td>&nbsp;</td>
              </tr>
              <template v-for="(match, index) in group" v-bind:key="index">
                <tr class="tr-row" v-show="isShown(match)">
                  <td class="txt-col-darker">{{ match.date_of_match }}</td>
                  <td>
                    <GameVersusTable :match="match" />
                  </td>
                  <td>
                    <router-link
                      :to="{
                        name: 'GameScoring',
                        params: { id: match.match_id },
                      }"
                      ><i class="far fa-play-circle"></i
                    ></router-link>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import GameVersusTable from "@/components/tournament/GameVersusTable.vue";
import _ from "underscore";

export default {
  name: "TournamentSchedule",
  components: { GameVersusTable },
  props: ["fixtureCount", "officeId", "tournamentId"],
  data() {
    return {
      groupedMatches: [],
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
          this.groupedMatches = _.groupBy(res.data, function (item) {
            return item.group_name;
          });
          console.log(this.groupedMatches);
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
<script setup lang="ts"></script>
