<template>
  <div class="round-container mart20 marb20">
    <TournamentResults
      :result-count="0"
      :tournament-id="this.$route.params.id"
    />
  </div>
</template>

<script>
import TournamentResults from "@/components/tournament/TournamentResults.vue";

export default {
  name: "TournamentFullResults",
  components: {
    TournamentResults,
  },
  data() {
    return {
      tournament: null,
    };
  },
};
</script>
