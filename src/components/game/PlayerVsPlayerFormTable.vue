<template>
  <table class="tbl-border tbl-compact">
    <tr>
      <td class="w200">{{ this.game.homePlayerName }}</td>
      <td class="txtr">
        <i class="fas fa-long-arrow-alt-left"></i>
      </td>
      <template v-for="(g, i) in this.commonResults" v-bind:key="i">
        <td class="pad5 txtc">
          <PlayerFormLabel
            :player-id="game.homePlayerId"
            :winner-id="g.winner_id"
          />
        </td>
        <td>
          <i class="fas fa-minus" v-if="i < this.commonResults.length - 1"></i>
        </td>
      </template>
    </tr>
    <tr class="form-row">
      <td class="w200">{{ this.game.awayPlayerName }}</td>
      <td class="txtr">
        <i class="fas fa-long-arrow-alt-left"></i>
      </td>
      <template v-for="(g, i) in this.commonResults" v-bind:key="i">
        <td class="pad5 txtc">
          <PlayerFormLabel
            :player-id="game.awayPlayerId"
            :winner-id="g.winner_id"
          />
        </td>
        <td>
          <i class="fas fa-minus" v-if="i < this.commonResults.length - 1"></i>
        </td>
      </template>
    </tr>
  </table>
</template>

<script>
import PlayerFormLabel from "@/components/game/PlayerFormLabel.vue";

export default {
  data() {
    return {
      currentTournamentHome: 0,
      currentTournamentAway: 0,
    };
  },
  components: { PlayerFormLabel },
  props: ["game", "commonResults"],
};
</script>
