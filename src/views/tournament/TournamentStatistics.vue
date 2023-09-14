<template>
  <div class="round-container mart20 marb20">
    <TournamentStats :tournament-id="this.$route.params.id" />
    <!--    <TournamentStatistics-->
    <!--      :result-count="0"-->
    <!--      :tournament-id="this.$route.params.id"-->
    <!--    />-->
  </div>
</template>

<script>
import TournamentStats from "@/components/tournament/TournamentStats.vue";

export default {
  name: "TournamentStatistics",
  components: {
    TournamentStats,
  },
  data() {
    return {
      tournament: null,
    };
  },
};
</script>
