<template>
  <div>
    <table class="tbl-fixtures tbl-standings">
      <tr>
        <td class="txtl w400">name</td>
        <td class="txtc" colspan="2" v-if="!this.tournament.is_finished">
          change
        </td>
        <td class="txtc">played</td>
        <td class="txtc">w / d / l</td>
        <td class="txtc">sets</td>
        <td class="txtc">+/-</td>
        <th class="txtc">rallies</th>
        <td class="txtc">+/-</td>
        <td class="txtc">points</td>
      </tr>
      <tr
        v-for="(player, index) in group.players"
        v-bind:key="player.playerId"
        class="group-container txt-col-darker"
      >
        <td>
          <div
            :class="['level', 'level-c' + player.pos_color]"
            class="flex-full-width"
          >
            <span class="level-span">
              <span class="txt-col-darkest padl10">{{ index + 1 }}. </span>
              <router-link :to="'/player/' + player.player_id + '/profile'"
                >{{ player.player_name }}
              </router-link>
            </span>
            <span
              class="padr10 txt-col-darkest"
              v-if="this.lockedPos || this.lockedPlayoffs"
            >
              <span
                v-if="
                  this.lockedPos[group.group_id] &&
                  this.lockedPos[group.group_id].includes(player.player_id)
                "
              >
                <i class="fas fa-lock"></i>
              </span>
              <span
                v-else-if="
                  this.lockedPlayoffs[group.group_id] &&
                  this.lockedPlayoffs[group.group_id].includes(player.player_id)
                "
              >
                <i class="fas fa-lock-open"></i>
              </span>
            </span>
          </div>
        </td>
        <td class="txtr w50" v-if="!this.tournament.is_finished">
          <span class="lbl-pos" v-if="this.positions[player.player_id] < 0">
            {{ this.positions[player.player_id] }}
          </span>
          <span
            class="lbl-pos"
            v-else-if="this.positions[player.player_id] > 0"
          >
            +{{ this.positions[player.player_id] }}
          </span>
          <span v-else>&nbsp;</span>
        </td>
        <td class="txtl" v-if="!this.tournament.is_finished">
          <span class="lbl-pos" v-if="this.positions[player.player_id] < 0">
            <i class="fas fa-arrow-alt-circle-down"></i>
          </span>
          <span
            class="lbl-pos"
            v-else-if="this.positions[player.player_id] > 0"
          >
            <i class="fas fa-arrow-alt-circle-up"></i>
          </span>
          <span
            class="lbl-pos"
            v-else-if="this.positions[player.player_id] === 0"
          >
            <i class="fas fa-stop-circle"></i>
          </span>
        </td>
        <td class="txtc">{{ player.played }}</td>
        <td class="txtc">
          {{ player.wins }} - {{ player.draws }} - {{ player.losses }}
        </td>
        <td class="txtc">{{ player.sets_for }} - {{ player.sets_against }}</td>
        <td class="txtc">{{ player.sets_diff }}</td>
        <td class="txtc">
          {{ player.rallies_for }} - {{ player.rallies_against }}
        </td>
        <td class="txtc">{{ player.rallies_diff ?? 0 }}</td>
        <td class="txtc">{{ player.points }}</td>
      </tr>
    </table>
  </div>
  <div class="padt10" v-if="!this.tournament.is_finished">
    <div class="txt-col-darker">
      <i class="fas fa-lock"></i> Secured current position in playoffs
      <i class="marl10 fas fa-lock-open"></i> Playoffs secured, position TBD
    </div>
    <div class="padt10">
      <span @click="this.toggleGroup(group.group_id)" class="lbl-recap">
        <i
          class="fas fa-arrow-alt-circle-down"
          v-if="this.isGroupToggled(group.group_id)"
        ></i>
        <i class="fas fa-arrow-alt-circle-right" v-else></i>
        Recap of last finished game week
      </span>
    </div>
    <div>
      <div v-show="this.isGroupToggled(group.group_id)">
        <div class="padt10">
          <template
            v-for="(msg, ind) in this.formatMessage(
              this.recaps[group.group_id].stats_message
            )"
            v-bind:key="ind"
          >
            <span v-if="Array.isArray(msg)" class="list-comma">
              <template v-for="(m, i) in msg" v-bind:key="i">
                <span class="txt-col-green item-comma">{{ m }}</span>
              </template>
            </span>
            <span v-else>{{ msg }}</span>
          </template>
        </div>
        <div class="padt10 list-comma">
          <template
            v-for="(msg, ind) in this.formatMessage(
              this.recaps[group.group_id].candidates_message
            )"
            v-bind:key="ind"
          >
            <span v-if="Array.isArray(msg)" class="list-comma">
              <template v-for="(m, i) in msg" v-bind:key="i">
                <span class="txt-col-green item-comma">{{ m }}</span>
              </template>
            </span>
            <span v-else>{{ msg }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "underscore";

export default {
  props: [
    "group",
    "positions",
    "tournament",
    "recaps",
    "lockedPos",
    "lockedPlayoffs",
  ],
  data() {
    return {
      toggleGroups: [],
    };
  },
  methods: {
    isGroupToggled(id) {
      return (
        this.toggleGroups.indexOf(id) !== undefined &&
        this.toggleGroups.indexOf(id) >= 0
      );
    },
    toggleGroup(id) {
      if (
        this.toggleGroups.indexOf(id) !== undefined &&
        this.toggleGroups.indexOf(id) >= 0
      ) {
        this.toggleGroups.splice(this.toggleGroups.indexOf(id), 1);
      } else {
        this.toggleGroups.push(id);
      }
    },
    formatMessage(msg) {
      let msgParts = msg.split("|");
      msgParts = _.map(msgParts, (elem) => {
        if (elem.startsWith("=")) {
          let e = elem.replaceAll("=", "");
          return e.split(",");
        } else {
          return elem;
        }
      });

      return msgParts;
    },
  },
};
</script>

<style scoped lang="less">
.level {
  border-radius: 5px;
  padding: 2px 0;
}

.level-span > a {
  color: black;
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

.lbl-pos {
  background: #1e1e26;
  padding: 0 5px;
  border-radius: 20px;
  display: block;
  color: white;
}
</style>
