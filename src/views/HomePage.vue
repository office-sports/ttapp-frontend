<template>
  <div class="round-container marb20" v-if="!this.tournament">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="txt-col-white">No live tournaments</span>
    </div>
  </div>
  <div v-else>
    <template v-if="!tournament.is_playoffs">
      <div class="round-container marb20" v-if="this.tournament">
        <TournamentPanel :tournament="this.tournament" />
      </div>
      <div class="round-container" v-if="this.tournament">
        <TournamentResults
          :result-count="10"
          :tournament-id="this.tournament.id"
        />
      </div>
      <div class="round-container mart20 marb20" v-if="this.tournament">
        <TournamentSchedule
          :fixture-count="10"
          :tournament-id="this.tournament.id"
        />
      </div>
    </template>
    <template v-else>
      <PlayoffsSchedule :tournament="this.tournament" />
    </template>
  </div>
</template>

<script>
import axios from "axios";
import TournamentResults from "@/components/tournament/TournamentResults.vue";
import TournamentSchedule from "@/components/tournament/TournamentSchedule.vue";
import TournamentPanel from "@/components/tournament/TournamentPanel.vue";
import _ from "underscore";
import PlayoffsSchedule from "@/components/tournament/PlayoffsSchedule.vue";

export default {
  name: "IndexPage",
  components: {
    PlayoffsSchedule,
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
        axios.spread((t, g) => {
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
