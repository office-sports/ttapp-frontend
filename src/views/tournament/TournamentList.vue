<template>
  <div class="round-container">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="text-white">Tournament list</span>
    </div>
    <div>
      <div v-if="filteredTournaments.length > 0" class="pad10">
        <table class="tbl-fixtures">
          <tbody>
            <tr class="table-th">
              <td>name</td>
              <td>phase</td>
              <td class="text-center">participants</td>
              <td class="text-center">games played</td>
              <td class="text-center">games scheduled</td>
              <td class="text-center" colspan="4">options</td>
            </tr>
            <template
              v-for="(tournament, index) in this.filteredTournaments"
              v-bind:key="index"
            >
              <tr class="tr-row">
                <td class="text-left">{{ tournament.name }}</td>
                <td class="text-left txt-col-darker">{{ tournament.phase }}</td>
                <td class="text-center">{{ tournament.participants }}</td>
                <td class="text-center">{{ tournament.finished }}</td>
                <td class="text-center">{{ tournament.scheduled }}</td>
                <td class="text-right padr10">
                  <span v-if="tournament.is_playoffs === 0">
                    <router-link
                      :to="'/tournament/' + tournament.id + '/standings'"
                      >standings</router-link
                    >
                  </span>
                  <span v-else>
                    <router-link
                      :to="'/tournament/' + tournament.id + '/ladders'"
                      >ladder</router-link
                    >
                  </span>
                </td>
                <td class="text-center">
                  <span
                    v-if="
                      tournament.is_finished === 0 &&
                      tournament.is_playoffs === 0
                    "
                  >
                    <router-link
                      :to="'/tournament/' + tournament.id + '/schedule'"
                      >schedule</router-link
                    >
                  </span>
                  <span v-if="tournament.is_finished === 1">
                    <div v-if="!tournament.is_playoffs">
                      <router-link
                        :to="'/tournament/' + tournament.id + '/results'"
                        >results</router-link
                      >
                    </div>
                    <div v-else>
                      <router-link
                        :to="
                          '/tournament/' + tournament.id + '/results_playoffs'
                        "
                        >results</router-link
                      >
                    </div>
                  </span>
                </td>
                <td class="text-left">
                  <router-link
                    :to="'/tournament/' + tournament.id + '/statistics'"
                    >statistics
                  </router-link>
                </td>
                <td class="text-left">
                  <router-link :to="'/tournament/' + tournament.id + '/players'"
                    >players
                  </router-link>
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
import { Tournament } from "@/models/Tournament";

export default {
  name: "TournamentList",
  data() {
    return {
      tournaments: [],
      officeId: localStorage.getItem("officeId") ?? "1",
    };
  },
  mounted() {
    axios.get("/api/tournaments").then((res) => {
      if (res.data && res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          this.tournaments.push(
            new Tournament(
              res.data[i].finished,
              res.data[i].id,
              res.data[i].is_finished,
              res.data[i].is_playoffs,
              res.data[i].name,
              res.data[i].office_id,
              res.data[i].participants,
              res.data[i].phase,
              res.data[i].scheduled,
              res.data[i].start_time
            )
          );
        }
      }
    });
  },
  computed: {
    filteredTournaments: function () {
      return this.tournaments.filter((tournament) => {
        return parseInt(tournament.office_id) === parseInt(this.officeId);
      });
    },
  },
};
</script>
