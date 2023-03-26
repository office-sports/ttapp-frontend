<template>
  <div class="round-container marb20">
    <div class="round-container-dark-small flex txt-col-darker">
      <span class="txt-col-darker">Tournament ladders</span>&nbsp;
      <span class="txt-col-green">{{ tournament.name }}</span>
    </div>
  </div>
  <template v-for="ladder in this.ladders" v-bind:key="ladder.id">
    <div class="round-container">
      <span class="txt-col-green">{{ ladder.group_name }} Ladder</span>
    </div>
    <div>
      <table class="tbl-fixed mart10" id="tbl-ladder">
        <tr>
          <td v-for="i in stages" v-bind:key="i" class="pad10">
            <div>
              <div v-for="match in ladder.ladder_group" v-bind:key="match.id">
                <div v-if="match.stage === i" class="match-container marb20">
                  <table class="ladder-table">
                    <tr>
                      <td rowspan="3" class="match-order">
                        <span class="fa-stack">
                          <i class="fas fa-circle fa-stack-2x stack-shield"></i>
                          <i class="fas fa-stack-2x stack-star match-num">{{
                            match.order
                          }}</i>
                        </span>
                      </td>
                      <td
                        class="match-name padl20"
                        colspan="2"
                        v-if="match.winner_id == 0"
                      >
                        <span>{{ match.game_name }}</span>
                      </td>
                      <td class="match-name-done" colspan="2" v-else>
                        <span>{{ match.game_name }}</span>
                        <span v-if="match.is_walkover" class="float-r">
                          <i class="fas fa-flag"></i>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        v-bind:class="
                          match.winner_id != 0 &&
                          match.winner_id == match.home_player_id
                            ? 'txt-col-green match-player'
                            : 'match-player'
                        "
                      >
                        <span
                          style="color: #aaa"
                          v-if="match.home_player_id == 0"
                          >{{ match.home_player_name }}</span
                        >
                        <span v-else>{{ match.home_player_name }}</span>
                      </td>
                      <td class="txtr match-player">
                        <span v-if="match.winner_id != 0">
                          {{ match.home_score_total }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        v-bind:class="
                          match.winner_id != 0 &&
                          match.winner_id == match.away_player_id
                            ? 'txt-col-green match-player'
                            : 'match-player'
                        "
                      >
                        <span
                          style="color: #aaa"
                          v-if="match.away_player_id == 0"
                          >{{ match.away_player_name }}</span
                        >
                        <span v-else>{{ match.away_player_name }}</span>
                      </td>
                      <td class="txtr match-player">
                        <span v-if="match.winner_id != 0">
                          {{ match.away_score_total }}
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </template>
</template>

<script>
import axios from "axios";

export default {
  name: "PlayoffsMatchList",
  data() {
    return {
      tournament: {},
      matches: [],
      stages: 4,
      division: null,
      playoffs: false,
      ladders: [],
      interval: null,
    };
  },
  mounted() {
    this.getData();
    this.interval = setInterval(() => {
      this.getData();
    }, 10000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    getData() {
      axios
        .all([
          axios.get("/api/tournaments/" + this.$route.params.id + "/ladders"),
          axios.get("/api/tournaments/" + this.$route.params.id),
        ])
        .then(
          axios.spread((ladders, tournament) => {
            this.ladders = ladders.data;
            this.tournament = tournament.data;
          })
        )
        .catch((error) => {
          console.log("Error when getting ladders data " + error);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.ladder-table > td {
  padding: 10px 10px;
}

.match-order {
  background-color: black;
  color: white;
  width: 50px;
  text-align: center;
  border-radius: 5px 0 5px 5px;
  vertical-align: middle;
}

.match-num {
  color: black;
  font-family: inherit;
  font-size: 13pt;
  margin-top: 6px;
}

.match-name {
  background-color: brown;
  border-radius: 0 5px 5px 0;
  padding: 5px 10px;
}

.match-name-done {
  background-color: #6b8e42;
  padding: 5px 10px;
  border-radius: 0 5px 5px 0;
}

.match-player {
  padding: 7px 10px;
}

#tbl-ladder {
  td {
    vertical-align: middle;
  }
}
</style>
