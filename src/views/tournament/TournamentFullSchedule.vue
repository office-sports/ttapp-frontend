<template>
  <div class="round-container mart20 marb20">
    <TournamentSchedule
      :fixture-count="0"
      :tournament-id="this.$route.params.id"
    />
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
};
</script>
