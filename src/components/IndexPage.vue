<template>
  <div>
    <table>
      <tr>
        <td colspan="2">
          <div class="roundWrapper marb20">
            <div class="txtHeader col-dark-green">
              <i class="fas fa-bullseye col-dark-green"></i>
              <span class="padl10">Ongoing tournament </span>
              <span style="font-weight: bold"
                >{{ this.tournament.name }}, {{ tournament.phase }} phase</span
              >
            </div>
            <div class="padt10">
              <span class="col-txt-green">
                {{ tournament.participants }}
              </span>
              participants
              <span class="col-txt-green">
                {{ tournament.scheduled }}
              </span>
              games scheduled
              <span class="col-txt-green">
                {{ tournament.finished }}
              </span>
              games played
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="wp50pc padr10 valignTop">
          <div class="roundWrapper">
            <div class="txtHeader col-dark-green">
              <i class="fas fa-bullseye col-dark-green"></i>
              <span class="padl10">Tournament schedule (next 20)</span>
            </div>
            <div class="padt20">
              <TournamentSchedule />
            </div>
          </div>
        </td>
        <td class="wp50pc padl10 valignTop">
          <div class="roundWrapper">
            <div class="txtHeader col-blue">
              <i class="fas fa-bullseye"></i>
              <span class="padl10">Tournament results (last 20)</span>
            </div>
            <div class="padt20">
              <TournamentResults />
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import TournamentSchedule from "./Tournament/Schedule.vue";
import TournamentResults from "@/components/Tournament/Results.vue";
import axios from "axios";

export default {
  name: "IndexPage",
  components: {
    TournamentResults,
    TournamentSchedule,
  },
  data() {
    return {
      tournament: {},
    };
  },
  mounted() {
    axios.get("/api/tournaments/live").then((res) => {
      this.tournament = res.data.pop();
    });
  },
};
</script>
