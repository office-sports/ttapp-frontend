<template>
  <div class="round-container" v-if="this.matches.length > 0">
    <template v-for="(match, index) in this.matches" v-bind:key="index">
      <div class="round-container-dark-small flex txt-col-darker">
        {{ match.group_name }}, game id: {{ match.match_id }}
      </div>
      <div class="pad10">
        <span class="txt-col-darker padr10">home player:</span>
        <span v-if="match.home_player_name">{{ match.home_player_name }}</span>
        <span v-else>TBD</span>
        <span class="txt-col-darker padl10 padr10">away player:</span>
        <span v-if="match.away_player_name">{{ match.away_player_name }}</span>
        <span v-else>TBD</span>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TournamentResults",
  // components: { GameVersusTable },
  data() {
    return {
      matches: [],
    };
  },
  mounted() {
    axios
      .get("/api/tournaments/" + this.$route.params.id + "/games")
      .then((res) => {
        if (res.data.length > 0) {
          this.matches = res.data;
        }
      });
  },
};
</script>
