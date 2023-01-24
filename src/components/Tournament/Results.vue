<template>
  <div class="txtSmall">
    <div v-if="matches.length">
      <table class="table-list">
        <tr
          v-for="match in filteredMatches"
          v-bind:key="match.id"
          class="row-data row-schedule"
        >
          <td>{{ match.date_played }}</td>
          <td
            class="txtr"
            v-bind:class="
              match.winner_id === match.home_player_id ? 'col-winner' : ''
            "
          >
            <router-link :to="'/player/' + match.homePlayerId + '/profile'">{{
              match.home_player_name
            }}</router-link>
          </td>
          <td class="txtc">-</td>
          <td
            v-bind:class="
              match.winner_id === match.away_player_id ? 'col-winner' : ''
            "
          >
            <router-link :to="'/player/' + match.away_player_id + '/profile'"
              >{{ match.away_player_name }}
            </router-link>
          </td>
          <td>
            <span v-if="match.is_walkover === '1'"> walkover </span>
            <span v-else class="totalScore">
              {{ match.home_score_total }} -
              {{ match.away_score_total }}&nbsp;&nbsp;
              <i class="far fa-question-circle tooltip">
                <span class="tooltiptext">
                  <span class="setScores">
                    <span
                      v-for="score in match.scores"
                      v-bind:key="score.set"
                      class="score"
                    >
                      {{ score.home }}:{{ score.away }}</span
                    >
                  </span>
                </span>
              </i>
            </span>
          </td>
          <td v-if="parseInt(match.has_points) > 0" style="color: #fff">
            <router-link :to="'/games/' + match.match_id + '/summary'"
              ><i class="far fa-play-circle"></i
            ></router-link>
          </td>
          <td v-else></td>
        </tr>
      </table>
    </div>
    <div class="padt20" v-if="filteredMatches.length">
      <i class="fas fa-arrow-circle-right"></i>&nbsp;&nbsp;
      <router-link
        :to="'/tournament/' + filteredMatches[0].tournament_id + '/match/list'"
        >show all results
      </router-link>
    </div>
    <div v-else>no results</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TournamentResults",
  data() {
    return {
      matches: [],
      currentTournament: 0,
      officeId: 1,
    };
  },
  mounted() {
    axios.get("/api/tournaments/0/results/20").then((res) => {
      if (res.data.length > 0) {
        this.matches = res.data;
        this.currentTournament = res.data[0].tournament_id;
      }
    });
  },
  computed: {
    filteredMatches: function () {
      return this.matches.filter((match) => {
        return match.office_id === this.officeId;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.txtSmall {
  font-size: 10pt;
}

.score + .score:before {
  content: ", ";
}
</style>
