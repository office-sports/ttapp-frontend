<template>
  <div class="round-container">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="txt-col-darker">Tournament group standings simulation</span>
    </div>
  </div>
  <template v-for="group in groups" v-bind:key="group.group_id">
    <div
      class="round-container mart20"
      v-if="parseInt(group.group_id) === parseInt(this.groupId)"
      :id="'group-' + group.group_id"
    >
      <div
        class="round-container-dark-small flex txt-col-darker flex-full-width"
      >
        <span class="txt-col-darker">{{ group.group_name }}</span>
      </div>
      <div class="pad10">
        <TournamentPredictor
          :group="group"
          :positions="this.positions"
          :tournament="this.tournament"
          :recaps="this.recaps"
          :locked-pos="this.lockedPos"
          :locked-playoffs="this.lockedPlayoffs"
        />
      </div>
    </div>
  </template>
</template>

<script>
import axios from "axios";
import _ from "underscore";
import TournamentPredictor from "@/components/tournament/TournamentPredictor.vue";

export default {
  name: "TournamentGroupPredictor",
  components: { TournamentPredictor },
  data() {
    return {
      tournament: null,
      groups: [],
      performances: [],
      recaps: [],
      securedPos: [],
      lockedPos: [],
      lockedPlayoffs: [],
      togglePerformanceGroups: [],
      positions: [],
      groupId: null,
    };
  },
  methods: {},
  mounted() {
    axios
      .all([
        axios.get("/api/tournaments/" + this.$route.params.id),
        axios.get("/api/tournaments/" + this.$route.params.id + "/standings"),
        axios.get("/api/tournaments/" + this.$route.params.id + "/info"),
        axios.get("/api/tournaments/" + this.$route.params.id + "/performance"),
      ])
      .then(
        axios.spread((t, s, i, p) => {
          this.tournament = t.data;
          this.groups = s.data;
          this.performances = p.data;
          this.recaps = _.indexBy(i.data, "id");

          _.each(this.recaps, (elem) => {
            _.each(elem.player_info, (pi) => {
              this.positions[pi.id] = -1 * pi.position_movement;
              if (pi.position_min === pi.position_max) {
                if (this.lockedPos[elem.id] === undefined) {
                  this.lockedPos[elem.id] = [pi.id];
                } else {
                  this.lockedPos[elem.id].push(pi.id);
                }
              }

              if (pi.position_min <= elem.group_promotions) {
                if (this.lockedPlayoffs[elem.id] === undefined) {
                  this.lockedPlayoffs[elem.id] = [pi.id];
                } else {
                  this.lockedPlayoffs[elem.id].push(pi.id);
                }
              }
            });
          });

          this.groupId = this.$route.params.group;
        })
      )
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped lang="less">
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

.lnk {
  cursor: pointer;
}
</style>
