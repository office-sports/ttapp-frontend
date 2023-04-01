<template>
  <div class="round-container" v-if="this.matches.length > 0">
    <template v-for="(match, index) in this.matches" v-bind:key="index">
      <div class="round-container-dark-small flex txt-col-darker">
        {{ match.group_name }}, game id: {{ match.match_id }}
      </div>
      <div class="pad10">
        <span class="txt-col-darker padr10">home player:</span>
        <span v-if="match.home_player_name">{{ match.home_player_name }}</span>
        <span v-else>TBD</span>
        <span class="txt-col-darker padl10 padr10">away player:</span>
        <span v-if="match.away_player_name">{{ match.away_player_name }}</span>
        <span v-else>TBD</span>
      </div>
    </template>
  </div>

  <!--  <div class="round-container-dark-small flex txt-col-darker">-->
  <!--    <span v-if="resultCount === 0" class="txt-col-white"-->
  <!--      >All tournament results</span-->
  <!--    >-->
  <!--    <span v-else class="txt-col-white">Tournament results</span>-->
  <!--    <span class="marl10" v-if="resultCount > 0"-->
  <!--      >(latest {{ resultCount }})</span-->
  <!--    >-->
  <!--  </div>-->

  <!--  <div v-if="matches.length > 0" class="pad10">-->
  <!--    <table class="tbl-fixtures">-->
  <!--      <tr class="table-th">-->
  <!--        <td>played</td>-->
  <!--        <td class="txtc">&nbsp;</td>-->
  <!--        <td class="txtc">score</td>-->
  <!--        <td class="txtl">set scores</td>-->
  <!--      </tr>-->
  <!--      <template v-for="(match, index) in this.matches" v-bind:key="index">-->
  <!--        <tr class="tr-row">-->
  <!--          <td class="txt-col-darker">{{ match.date_played }}</td>-->
  <!--          <td>-->
  <!--            <GameVersusTable :match="match" />-->
  <!--          </td>-->
  <!--          <td class="txtc">-->
  <!--            <span v-if="parseInt(match.is_walkover) === 1"> walkover </span>-->
  <!--            <span v-else>-->
  <!--              {{ match.home_score_total }} - -->
  <!--              {{ match.away_score_total }}-->
  <!--            </span>-->
  <!--          </td>-->
  <!--          <td>-->
  <!--            <span-->
  <!--              v-for="score in match.scores"-->
  <!--              v-bind:key="score.set"-->
  <!--              class="sets-score"-->
  <!--            >-->
  <!--              {{ score.home }}:{{ score.away }}</span-->
  <!--            >-->
  <!--          </td>-->
  <!--          <td class="txtr">-->
  <!--            <span v-if="match.has_points" class="marr10 txt-col-darkest">-->
  <!--              <i class="fas fa-keyboard"></i>-->
  <!--            </span>-->
  <!--            <router-link-->
  <!--              :to="{ name: 'GameResult', params: { id: match.match_id } }"-->
  <!--              ><i class="far fa-play-circle"></i-->
  <!--            ></router-link>-->
  <!--          </td>-->
  <!--        </tr>-->
  <!--      </template>-->
  <!--    </table>-->
  <!--    <div class="mart20" v-if="resultCount > 0">-->
  <!--      <router-link :to="'/tournament/' + this.tournamentId + '/results'">-->
  <!--        <div class="btn-link">show all</div>-->
  <!--      </router-link>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<script>
import axios from "axios";
import GameVersusTable from "@/components/tournament/GameVersusTable.vue";

export default {
  name: "TournamentResults",
  // components: { GameVersusTable },
  data() {
    return {
      matches: [],
    };
  },
  mounted() {
    axios
      .get("/api/tournaments/" + this.$route.params.id + "/games")
      .then((res) => {
        if (res.data.length > 0) {
          this.matches = res.data;
        }
      });
  },
};
</script>
