<template>
  <div>
    <table class="tbl-fixtures tbl-standings">
      <tbody>
        <tr>
          <td class="text-left padl10">name</td>
          <td class="text-center">performance</td>
          <td class="text-center" colspan="3">elo</td>
          <td class="text-center">games left</td>
          <td class="text-left w230">
            <div class="padl20">
              <i class="fas fa-long-arrow-alt-left"></i> form (last 6 games)
            </div>
          </td>
          <th class="text-center" colspan="2">points</th>
        </tr>
        <tr
          v-for="(player, index) in this.performance.players"
          v-bind:key="player.playerId"
          class="group-container txt-col-darker"
        >
          <td>
            <div class="level flex-full-width">
              <span class="level-span">
                <span class="txt-col-darer">{{ index + 1 }}. </span>
                <router-link :to="'/player/' + player.player_id + '/profile'"
                  >{{ player.player_name }}
                </router-link>
              </span>
            </div>
          </td>
          <td class="text-center col-winner">{{ player.performance }}</td>
          <td class="text-right">{{ player.starting_elo }} *</td>
          <td class="w15 text-center text-white">|</td>
          <td class="text-left">{{ player.last_elo }} **</td>
          <td class="text-center">{{ player.unfinished }}</td>
          <td class="text-center flex">
            <div class="padl20 flex" v-if="player.form">
              <span
                class="span-form"
                v-for="(form, idx) in player.form.slice(0, 6)"
                v-bind:key="idx"
              >
                <PlayerFormLabel
                  :player-id="player.player_id"
                  :winner-id="form"
                />
              </span>
            </div>
          </td>
          <td class="text-right">
            <div class="accuracy-bar-wrapper mart10">
              <span
                class="accuracy-bar"
                v-bind:style="
                  'width:' +
                  (
                    (player.points / player.total_points) *
                    this.barWidth
                  ).toFixed(0) +
                  'px'
                "
                >&nbsp;</span
              >
            </div>
          </td>
          <td class="text-right w50">
            {{ player.points }} / {{ player.total_points }}
          </td>
        </tr>
        <tr>
          <td colspan="8">
            <div class="padt20 txt-col-darker">
              * player's ELO at the beginning of tournament / ** latest player's
              ELO for this tournament
            </div>
            <div class="padt10">
              Group's average ELO:
              <span class="txt-col-green">
                {{ performance.group_avg_elo }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import PlayerFormLabel from "@/components/game/PlayerFormLabel.vue";

export default {
  components: { PlayerFormLabel },
  props: ["performance", "group-id", "positions", "tournament", "recaps"],
  data() {
    return {
      barWidth: 100,
    };
  },
  methods: {},
};
</script>

<style scoped lang="less">
.level {
  border-radius: 5px;
  padding: 2px 0 2px 10px;
}

.level-span > a {
  color: white;
}

.level-span > a:hover {
  color: #0e3c46;
}

.group-container > td:first-child {
  border-radius: 7px;
  border: 0px solid #1e1e26;
}

.tbl-standings > tr:first-child {
  color: white;
}

.tbl-standings td {
  padding: 1px;
}

.span-form {
  padding-right: 5px;
}

.item-comma:not(:first-child)::before {
  color: white;
  content: ", ";
}

.item-comma:last-child::before {
  color: white;
  content: " and ";
}

.item-comma:first-child:last-child::before {
  content: "";
}

.lbl-recap {
  cursor: pointer;
}

.lbl-recap:hover {
  color: #808082;
}

.accuracy-bar {
  display: block;
  border-radius: 10px 10px 10px 10px;
  height: 10px;
  background: var(--color-green);
}

.accuracy-bar-wrapper {
  width: 100px;
  border-radius: 10px;
  height: 10px;
  background: #303030;
  margin: 0 auto;
}
</style>
