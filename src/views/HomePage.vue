<template>
  <div class="round-container">
    <TournamentResults :result-count="10" />
  </div>
  <div class="round-container mart20 marb20">
    <TournamentSchedule :fixture-count="10" />
  </div>
</template>

<script>
import axios from "axios";
import TournamentResults from "@/components/tournament/TournamentResults.vue";
import TournamentSchedule from "@/components/tournament/TournamentSchedule.vue";

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
