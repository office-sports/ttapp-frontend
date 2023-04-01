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
      <div
        class="round-container-dark-small flex txt-col-darker flex-full-width"
      >
        <span class="txt-col-darker">{{ group.group_name }}</span>
        <span>
          <span
            class="lnk"
            :class="
              !isGroupPerformanceToggled(group.group_id) ? 'col-winner' : ''
            "
            @click="this.toggleGroupPerformance(group.group_id)"
            >Standings</span
          >
          |
          <span
            class="lnk"
            :class="
              isGroupPerformanceToggled(group.group_id) ? 'col-winner' : ''
            "
            @click="this.toggleGroupPerformance(group.group_id)"
            >Performance</span
          >
        </span>
      </div>
      <div class="pad10" v-if="!this.isGroupPerformanceToggled(group.group_id)">
        <StandingsTable
          :group="group"
          :positions="this.positions"
          :tournament="this.tournament"
          :recaps="this.recaps"
        />
      </div>
      <div class="pad10" v-if="this.isGroupPerformanceToggled(group.group_id)">
        <PerformanceTable :performance="this.performances[group.group_id]" />
      </div>
    </div>
  </template>
</template>

<script>
import axios from "axios";
import _ from "underscore";
import StandingsTable from "@/components/tournament/StandingsTable.vue";
import PerformanceTable from "@/components/tournament/PerformanceTable.vue";

export default {
  name: "TournamentStandings",
  components: { PerformanceTable, StandingsTable },
  data() {
    return {
      tournament: null,
      groups: [],
      performances: [],
      recaps: [],
      securedPos: [],
      togglePerformanceGroups: [],
      positions: [],
    };
  },
  methods: {
    toggleGroupPerformance(id) {
      if (
        this.togglePerformanceGroups.indexOf(id) !== undefined &&
        this.togglePerformanceGroups.indexOf(id) >= 0
      ) {
        this.togglePerformanceGroups.splice(
          this.togglePerformanceGroups.indexOf(id),
          1
        );
      } else {
        this.togglePerformanceGroups.push(id);
      }
    },
    isGroupPerformanceToggled(id) {
      return (
        this.togglePerformanceGroups.indexOf(id) !== undefined &&
        this.togglePerformanceGroups.indexOf(id) >= 0
      );
    },
  },
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
