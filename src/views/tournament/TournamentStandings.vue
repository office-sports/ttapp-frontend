<template>
  <div class="round-container">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="txt-col-darker">Tournament standings</span>
      <span v-for="group in groups" v-bind:key="group.group_id" class="marl20">
        <a href="#" v-scroll-to="'#group-' + group.group_id">{{
          group.group_name
        }}</a>
      </span>
    </div>
  </div>
  <template v-for="group in groups" v-bind:key="group.group_id">
    <div class="round-container mart20" :id="'group-' + group.group_id">
      <div class="round-container-dark-small flex txt-col-darker">
        <span class="txt-col-darker">{{ group.group_name }}</span>
      </div>
      <div class="pad10">
        <table class="tbl-fixtures tbl-standings">
          <tr>
            <td class="txtl">name</td>
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
                <span class="marr5 txt-col-darkest">
                  <span
                    class="lbl-pos"
                    v-if="this.positions[player.player_id] < 0"
                  >
                    {{ this.positions[player.player_id] }}
                    <i class="fas fa-arrow-alt-circle-down"></i>
                  </span>
                  <span
                    class="lbl-pos"
                    v-else-if="this.positions[player.player_id] > 0"
                  >
                    +{{ this.positions[player.player_id] }}
                    <i class="fas fa-arrow-alt-circle-up"></i>
                  </span>
                  <!--                  <span v-else>-->
                  <!--                    <i class="fas fa-dot-circle"></i>-->
                  <!--                  </span>-->
                </span>
              </div>
            </td>
            <td class="txtc">{{ player.played }}</td>
            <td class="txtc">
              {{ player.wins }} - {{ player.draws }} - {{ player.losses }}
            </td>
            <td class="txtc">
              {{ player.sets_for }} - {{ player.sets_against }}
            </td>
            <td class="txtc">{{ player.sets_diff }}</td>
            <td class="txtc">
              {{ player.rallies_for }} - {{ player.rallies_against }}
            </td>
            <td class="txtc">{{ player.rallies_diff ?? 0 }}</td>
            <td class="txtc">{{ player.points }}</td>
          </tr>
        </table>
        <div class="padt20" v-if="!this.tournament.is_finished">
          <div>
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
      </div>
    </div>
  </template>
</template>

<script>
import axios from "axios";
import _ from "underscore";

export default {
  name: "TournamentStandings",
  data() {
    return {
      tournament: null,
      groups: [],
      recaps: [],
      securedPos: [],
      toggleGroups: [],
      positions: [],
    };
  },
  methods: {
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
    isGroupToggled(id) {
      return (
        this.toggleGroups.indexOf(id) !== undefined &&
        this.toggleGroups.indexOf(id) >= 0
      );
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
  mounted() {
    axios
      .all([
        axios.get("/api/tournaments/" + this.$route.params.id),
        axios.get("/api/tournaments/" + this.$route.params.id + "/standings"),
        axios.get("/api/tournaments/" + this.$route.params.id + "/info"),
      ])
      .then(
        axios.spread((t, s, i) => {
          this.tournament = t.data;
          this.groups = s.data;
          this.recaps = _.indexBy(i.data, "id");

          _.each(this.recaps, (elem) => {
            _.each(elem.player_info, (pi) => {
              this.positions[pi.id] = -1 * pi.position_movement;
            });
          });
        })
      )
      .catch((error) => {
        console.log(error);
      });
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
  width: 38px;
  background: #1e1e26;
  padding: 0 5px;
  border-radius: 20px;
  display: block;
  color: white;
  text-align: end;
}
</style>
