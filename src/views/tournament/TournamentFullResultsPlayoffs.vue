<template>
  <div v-if="this.tournament">
    <PlayoffsGames :tournament="this.tournament" />
  </div>
</template>

<script>
import axios from "axios";
import PlayoffsGames from "@/components/tournament/PlayoffsGames.vue";

export default {
  name: "IndexPage",
  components: {
    PlayoffsGames,
  },
  data() {
    return {
      tournament: null,
    };
  },
  mounted() {
    axios
      .all([axios.get("/api/tournaments/" + this.$route.params.id)])
      .then(
        axios.spread((t) => {
          this.tournament = t.data;
        })
      )
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
table td {
  padding: 5px 0;
}
</style>
