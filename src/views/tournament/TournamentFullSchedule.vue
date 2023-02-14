<template>
  <div class="round-container mart20 marb20">
    <TournamentSchedule :fixture-count="0" />
  </div>
</template>

<script>
import axios from "axios";
import TournamentSchedule from "@/components/tournament/TournamentSchedule.vue";

export default {
  name: "TournamentFullSchedule",
  components: {
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
