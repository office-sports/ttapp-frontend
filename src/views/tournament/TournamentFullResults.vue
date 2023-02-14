<template>
  <div class="round-container mart20 marb20">
    <TournamentResults :result-count="0" />
  </div>
</template>

<script>
import axios from "axios";
import TournamentResults from "@/components/tournament/TournamentResults.vue";

export default {
  name: "TournamentFullResults",
  components: {
    TournamentResults,
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
