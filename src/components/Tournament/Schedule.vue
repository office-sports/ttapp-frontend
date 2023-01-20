<template>
  <div class="txtSmall">
    <div v-if="matches.length">
      <table>
        <tr
            v-for="match in filteredMatches.slice(0, 20)"
            v-bind:key="match.id"
            class="row-data row-schedule"
        >
          <td>
            {{ match.date_of_match }}
          </td>
          <td>
            {{ match.group_name }}
          </td>
          <td class="txtr col-white">
            <router-link :to="'/player/' + match.home_player_id + '/profile'">{{
                match.home_player_name
              }}
            </router-link>
          </td>
          <td>-</td>
          <td class="col-white">
            <router-link :to="'/player/' + match.away_player_id + '/profile'">{{
                match.away_player_name
              }}
            </router-link>
          </td>
          <td class="col-grey">
            <i class="far fa-play-circle"></i>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <div class="mainMatchContainer">
    <div v-if="matches.length">
      <table>
        <tr
            v-for="match in filteredMatches.slice(0, 20)"
            v-bind:key="match.id"
            class="row-data row-schedule"
        >

          <td class="playerName txt-right">
            <!--            <router-link :to="'/player/' + match.home_player_id + '/info'">{{-->
            <!--                match.home_player_name-->
            <!--              }}-->
            <!--            </router-link>-->
          </td>
          <td class="playerName">
            <!--            <router-link :to="'/player/' + match.away_player_id + '/info'">{{-->
            <!--                match.away_player_name-->
            <!--              }}-->
            <!--            </router-link>-->
          </td>
          <td style="text-align: right; color: white">
            <div>
              <!--              <router-link-->
              <!--                  :to="{ name: 'MatchView', params: { id: match.matchId } }"-->
              <!--              ><i class="fas fa-play-circle"></i-->
              <!--              ></router-link>-->
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="containerLink" v-if="filteredMatches.length">
      <i class="fas fa-arrow-circle-right"></i>
      <!--      <router-link-->
      <!--          :to="'/tournament/' + filteredMatches[0].tournamentId + '/match/list'"-->
      <!--      >show full schedule-->
      <!--      </router-link-->
      <!--      >-->
    </div>
    <div v-else>no schedule</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TournamentSchedule",
  data() {
    return {
      matches: [],
      currentTournament: 0,
      officeId: 1,
    };
  },
  mounted() {
    axios.get("/api/tournaments/0/schedule/20").then((res) => {
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

