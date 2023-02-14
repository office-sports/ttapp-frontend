<template>
  <div class="round-container">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="txt-col-white">Tournament list</span>
    </div>
    <div>
      <div v-if="filteredTournaments.length > 0" class="pad10">
        <table class="tbl-fixtures">
          <tr class="table-th">
            <td>name</td>
            <td>phase</td>
            <td class="txtc">participants</td>
            <td class="txtc">games played</td>
            <td class="txtc">games scheduled</td>
            <td class="txtc">options</td>
          </tr>
          <template
            v-for="(tournament, index) in this.filteredTournaments"
            v-bind:key="index"
          >
            <tr class="tr-row">
              <td class="txtl">{{ tournament.name }}</td>
              <td class="txtl txt-col-darker">{{ tournament.phase }}</td>
              <td class="txtc">{{ tournament.participants }}</td>
              <td class="txtc">{{ tournament.finished }}</td>
              <td class="txtc">{{ tournament.scheduled }}</td>
              <td class="txtc">
                <span v-if="tournament.is_playoffs == 0">
                  <router-link
                    :to="'/tournament/' + tournament.id + '/standings'"
                    >standings</router-link
                  >
                  <span v-if="tournament.is_finished == 0">
                    .
                    <router-link
                      :to="'/tournament/' + tournament.id + '/schedule'"
                      >schedule</router-link
                    >
                  </span>
                  <span v-if="tournament.is_finished == 1">
                    .
                    <router-link
                      :to="'/tournament/' + tournament.id + '/results'"
                      >results</router-link
                    >
                  </span>
                </span>
                <span v-else>
                  <router-link :to="'/tournament/' + tournament.id + '/ladders'"
                    >ladder</router-link
                  >
                </span>
              </td>
            </tr>
          </template>
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
