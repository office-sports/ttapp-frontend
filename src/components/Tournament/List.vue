<template>
  <div class="roundWrapper">
    <div class="txtHeader col-dark-green">
      <i class="fas fa-bullseye"></i>
      <span class="padl10">List of tournaments</span>
    </div>
    <div>
      <table class="table-tournament-list">
        <tr class="row-header">
          <th class="txtl">name</th>
          <th class="txtc">phase</th>
          <th class="txtc">participants</th>
          <th class="txtc">matches played</th>
          <th class="txtc">matches scheduled</th>
          <th class="txtc">options</th>
        </tr>
        <tr
          v-for="tournament in this.filteredTournaments"
          v-bind:key="tournament.id"
          class="row-data"
        >
          <td class="txtl col-white">{{ tournament.name }}</td>
          <td class="txtc">{{ tournament.phase }}</td>
          <td class="txtc">{{ tournament.participants }}</td>
          <td class="txtc">{{ tournament.finished }}</td>
          <td class="txtc">{{ tournament.scheduled }}</td>
          <td class="txtc">
            <span v-if="tournament.is_playoffs == 0">
              <router-link :to="'/tournament/' + tournament.id + '/standings'"
                >standings</router-link
              >
              <span v-if="tournament.is_finished == 0">
                |
                <router-link :to="'/tournament/' + tournament.id + '/schedule'"
                  >schedule</router-link
                >
              </span>
              <span v-if="tournament.is_finished == 1">
                |
                <router-link :to="'/tournament/' + tournament.id + '/results'"
                  >results</router-link
                >
              </span>
            </span>
            <span v-else>
              <router-link :to="'/tournaments/' + tournament.id + '/ladders'"
                >ladder</router-link
              >
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      tournaments: [],
      officeId: 1,
    };
  },
  mounted() {
    axios.get("/api/tournaments").then((res) => {
      this.tournaments = res.data;
      if (localStorage.getItem("ttappOfficeId") === null) {
        this.officeId = 1;
      } else {
        this.officeId = localStorage.getItem("ttappOfficeId");
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.header-title {
  color: white;
  font-size: 30px;
  font-weight: 600;
}

.table-tournament-list {
  border-collapse: collapse;
  margin-top: 20px;
  width: 100%;

  .row-header {
    color: white;
  }

  .row-data {
    border-top: 1px solid #0e3c46;
    height: 25px;
    line-height: 25px;
  }
}
</style>
