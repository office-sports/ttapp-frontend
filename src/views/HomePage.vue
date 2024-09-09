<template>
  <div class="rounded-2xl p-5 bg-container mb-5" v-if="!this.tournament">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="text-white">No live tournaments</span>
    </div>
  </div>
  <div v-else>
    <template v-if="!tournament.is_playoffs">
      <div class="rounded-2xl p-5 bg-container mb-5" v-if="this.tournament">
        <TournamentPanel :tournament="this.tournament" />
      </div>
      <div class="rounded-2xl p-5 bg-container" v-if="this.tournament">
        <TournamentResults
          :result-count="10"
          :tournament-id="this.tournament.id"
        />
      </div>
      <div
        class="rounded-2xl p-5 bg-container mt-5 mb-5"
        v-if="this.tournament"
      >
        <TournamentSchedule
          :fixture-count="10"
          :tournament-id="this.tournament.id"
        />
      </div>
    </template>
    <template v-else>
      <div>
        <PlayoffsGames :tournament="this.tournament" />
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import TournamentResults from "@/components/tournament/TournamentResults.vue";
import TournamentSchedule from "@/components/tournament/TournamentSchedule.vue";
import TournamentPanel from "@/components/tournament/TournamentPanel.vue";
import _ from "underscore";
import PlayoffsGames from "@/components/tournament/PlayoffsGames.vue";

export default {
  name: "IndexPage",
  components: {
    PlayoffsGames,
    TournamentPanel,
    TournamentResults,
    TournamentSchedule,
  },
  data() {
    return {
      officeId: 0,
      tournament: null,
    };
  },
  mounted() {
    this.officeId = localStorage.getItem("officeId");
    axios
      .all([axios.get("/api/tournaments/live")])
      .then(
        axios.spread((t) => {
          // findWhere returns FIRST tournament
          this.tournament = _.findWhere(t.data, {
            office_id: parseInt(this.officeId),
          });
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
