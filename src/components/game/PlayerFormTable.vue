<template>
  <table class="tbl-border tbl-compact">
    <tr>
      <td colspan="2">&nbsp;</td>
      <td :colspan="this.currentTournamentHome">
        <div class="span-line">&nbsp;</div>
      </td>
      <td :colspan="this.maxCount * 2 - this.currentTournamentHome">&nbsp;</td>
    </tr>
    <tr>
      <td class="w200">{{ this.game.homePlayerName }}</td>
      <td class="txtr">
        <i class="fas fa-long-arrow-alt-left"></i>
      </td>
      <template v-for="(g, i) in this.homeResults" v-bind:key="i">
        <td class="pad5 txtc">
          <PlayerFormLabel
            :player-id="game.homePlayerId"
            :winner-id="g.winner_id"
          />
        </td>
        <td>
          <i class="fas fa-minus" v-if="i < this.hCount - 1"></i>
        </td>
      </template>
    </tr>
    <tr class="form-row">
      <td class="w200">{{ this.game.awayPlayerName }}</td>
      <td class="txtr">
        <i class="fas fa-long-arrow-alt-left"></i>
      </td>
      <template v-for="(g, i) in this.awayResults" v-bind:key="i">
        <td class="pad5 txtc">
          <PlayerFormLabel
            :player-id="game.awayPlayerId"
            :winner-id="g.winner_id"
          />
        </td>
        <td>
          <i class="fas fa-minus" v-if="i < this.aCount - 1"></i>
        </td>
      </template>
    </tr>
    <tr>
      <td colspan="2">&nbsp;</td>
      <td :colspan="this.currentTournamentAway">
        <div class="span-line">&nbsp;</div>
      </td>
      <td :colspan="this.maxCount * 2 - this.currentTournamentAway">&nbsp;</td>
    </tr>
    <tr>
      <td colspan="2">
        <i class="fas fa-circle circle"></i>
        current tournament
      </td>
      <td :colspan="this.maxCount * 2" class="legend"></td>
    </tr>
  </table>
</template>

<script>
import PlayerFormLabel from "@/components/game/PlayerFormLabel.vue";
import _ from "underscore";

export default {
  data() {
    return {
      homeResults: [],
      awayResults: [],
      currentTournamentHome: 0,
      currentTournamentAway: 0,
      hCount: 0,
      aCount: 0,
    };
  },
  components: { PlayerFormLabel },
  props: ["game", "homePlayerResults", "awayPlayerResults", "maxCount"],
  mounted() {
    this.hCount = this.homePlayerResults.length;
    this.aCount = this.awayPlayerResults.length;
    this.homeResults = this.homePlayerResults;
    this.awayResults = this.awayPlayerResults;
    for (let i = 0; i < this.maxCount - this.hCount; i++) {
      this.homeResults.push({ winner_id: -1 });
    }
    for (let i = 0; i < this.maxCount - this.aCount; i++) {
      this.awayResults.push({ winner_id: -1 });
    }
    this.currentTournamentHome =
      _.filter(this.homeResults, (elem) => {
        return elem.tournament_id === this.game.tournamentId;
      }).length *
        2 -
      1;
    this.currentTournamentAway =
      _.filter(this.awayResults, (elem) => {
        return elem.tournament_id === this.game.tournamentId;
      }).length *
        2 -
      1;
  },
  unmounted() {
    this.currentTournamentHome = 0;
    this.currentTournamentAway = 0;
  },
};
</script>

<style>
.legend {
  vertical-align: middle;
}

.circle {
  color: #40c502;
}

.span-line {
  background: #40c502;
  width: 100%;
  height: 5px;
  border-radius: 5px;
}
</style>
