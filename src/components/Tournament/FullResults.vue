<template>
  <div class="roundWrapper" v-if="this.tournament">
    <div class="txtHeader col-dark-green">
      <i class="fas fa-bullseye col-dark-green"></i>
      <span class="padl10">Tournament {{ tournament.name }} all results</span>
    </div>
    <div class="mart20">
      <div class="txtSmall">
        <div v-if="matches.length">
          <table class="table-games-list">
            <tr class="row-header">
              <th class="txtl">date played</th>
              <th class="txtl">group name</th>
              <th class="txtr">home player</th>
              <th class="txtc"></th>
              <th class="txtl">away player</th>
              <th class="txtl">set scores</th>
              <th class="txtc">options</th>
            </tr>
            <tr
              v-for="match in filteredMatches"
              v-bind:key="match.id"
              class="row-data row-schedule"
            >
              <td>{{ match.date_played }}</td>
              <td>{{ match.group_name }}</td>
              <td
                class="txtr"
                v-bind:class="
                  match.winner_id === match.home_player_id ? 'col-winner' : ''
                "
              >
                <router-link :to="'/player/' + match.homePlayerId + '/profile'"
                  >{{ match.home_player_name }}
                </router-link>
              </td>
              <td class="w50px txtc">
                {{ match.home_score_total }} -
                {{ match.away_score_total }}
              </td>
              <td
                v-bind:class="
                  match.winner_id === match.away_player_id ? 'col-winner' : ''
                "
              >
                <router-link
                  :to="'/player/' + match.away_player_id + '/profile'"
                  >{{ match.away_player_name }}
                </router-link>
              </td>
              <td>
                <span
                  v-for="score in match.scores"
                  v-bind:key="score.set"
                  class="score"
                >
                  {{ score.home }} : {{ score.away }}</span
                >
              </td>
              <td class="txtc col-grey">
                <router-link
                  :to="{ name: 'GameView', params: { id: match.match_id } }"
                  >view
                </router-link>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TournamentResults",
  data() {
    return {
      tournament: null,
      matches: [],
      currentTournament: 0,
      officeId: 1,
    };
  },
  mounted() {
    axios
      .all([
        axios.get("/api/tournaments/" + this.$route.params.id),
        axios.get("/api/tournaments/0/results/0"),
      ])
      .then(
        axios.spread((tournament, schedule) => {
          if (tournament.data) {
            this.tournament = tournament.data;
            this.matches = schedule.data;
            this.currentTournament = schedule.data[0].tournament_id;
          }
        })
      )
      .catch((error) => {
        console.log("Error when getting data for matches " + error);
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

<style scoped lang="less">
.w50px {
  width: 50px;
}

.score + .score:before {
  content: " | ";
  color: white;
}

.header-title {
  color: white;
  font-size: 30px;
  font-weight: 600;
}

.table-games-list {
  border-collapse: collapse;
  margin-top: 20px;
  width: 100%;

  .row-header {
    color: white;
  }

  .row-data {
    border-top: 1px solid #0e3c46;
    height: 25px;
    line-height: 25px;
  }
}
</style>
