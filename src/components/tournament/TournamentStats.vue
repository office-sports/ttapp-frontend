<template>
  <div class="round-container-dark-small flex txt-col-darker">
    <span class="txt-col-white">Tournament statistics</span>
    <span v-if="this.statistics" class="txt-col-green padl10">{{
      this.statistics.name
    }}</span>
  </div>
  <div class="padt20 padl10 padr10 flex" v-if="this.statistics">
    <div class="padr20">
      <table class="tbl-compact">
        <tr>
          <td>Participants</td>
          <td class="padl20 col-winner">
            {{ this.statistics.participants }}
          </td>
        </tr>
        <tr>
          <td>Divisions</td>
          <td class="padl20 col-winner">
            {{ this.statistics.divisions }}
          </td>
        </tr>
        <tr>
          <td>Games scheduled</td>
          <td class="padl20 col-winner">
            {{ this.statistics.scheduled }}
          </td>
        </tr>
        <tr>
          <td>Games played</td>
          <td class="padl20 col-winner">
            {{ this.statistics.played }}
          </td>
        </tr>
        <tr>
          <td>Sets played</td>
          <td class="padl20 col-winner">
            {{ this.statistics.sets_played }}
          </td>
        </tr>
        <tr>
          <td>Points scored</td>
          <td class="padl20 col-winner">
            {{ this.statistics.points_scored }}
          </td>
        </tr>
        <tr>
          <td>Avg. points per set</td>
          <td class="padl20 col-winner">
            {{ parseFloat(this.statistics.avg_points_per_match).toFixed(2) }}
          </td>
        </tr>
      </table>
    </div>
    <div class="txtl padl20">
      <table class="tbl-compact">
        <tr>
          <td>Most points scored (single game)</td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.most_points_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.most_points_gid },
              }"
              ><i class="txt-col-white padl10 far fa-play-circle"></i
            ></router-link>
          </td>
          <td class="padl20 col-winner">
            {{ this.playersStatistics.most_points_in_game }}
            <span class="txt-col-recap-player padl10"
              >({{
                this.playersStatistics.most_points_in_game_player_name
              }})</span
            >
          </td>
        </tr>
        <tr>
          <td>Least points lost (single game)</td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.least_points_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.least_points_gid },
              }"
              ><i class="txt-col-white padl10 far fa-play-circle"></i
            ></router-link>
          </td>
          <td class="padl20 col-winner">
            {{ this.playersStatistics.least_points_lost_in_game }}
            <span class="txt-col-recap-player padl10"
              >({{
                this.playersStatistics.least_points_lost_in_game_player_name
              }})</span
            >
          </td>
        </tr>
        <tr>
          <td>Biggest ELO increase (single game)</td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.most_elo_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.most_elo_gid },
              }"
              ><i class="txt-col-white padl10 far fa-play-circle"></i
            ></router-link>
          </td>
          <td class="padl20 col-winner">
            {{ this.playersStatistics.most_elo_gain }}
            <span class="txt-col-recap-player padl10"
              >({{ this.playersStatistics.most_elo_gain_player_name }})</span
            >
          </td>
        </tr>
        <tr>
          <td>Biggest ELO drop (single game)</td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.most_elo_lost_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.most_elo_lost_gid },
              }"
              ><i class="txt-col-white padl10 far fa-play-circle"></i
            ></router-link>
          </td>
          <td class="padl20 col-winner">
            {{ this.playersStatistics.most_elo_lost }}
            <span class="txt-col-recap-player padl10"
              >({{ this.playersStatistics.most_elo_lost_player_name }})</span
            >
          </td>
        </tr>
        <tr>
          <td>Game with most points</td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.most_points_game_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.most_points_game_gid },
              }"
              ><i class="txt-col-white padl10 far fa-play-circle"></i
            ></router-link>
          </td>
          <td class="padl20 col-winner">
            {{ this.playersStatistics.most_points_game }}
            <span class="txt-col-recap-player padl10"
              >({{ this.playersStatistics.most_points_game_home_name }}
              <span class="txt-col-darkest">vs</span>
              {{ this.playersStatistics.most_points_game_away_name }})</span
            >
          </td>
        </tr>
        <tr>
          <td>Game with least points</td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.least_points_game_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.least_points_game_gid },
              }"
              ><i class="txt-col-white padl10 far fa-play-circle"></i
            ></router-link>
          </td>
          <td class="padl20 col-winner">
            {{ this.playersStatistics.least_points_game }}
            <span class="txt-col-recap-player padl10"
              >({{ this.playersStatistics.least_points_game_home_name }}
              <span class="txt-col-darkest">vs</span>
              {{ this.playersStatistics.least_points_game_away_name }})</span
            >
          </td>
        </tr>
        <tr>
          <td>Longest set winning streak</td>
          <td class="w30"></td>
          <td class="padl20 col-winner">
            {{ this.playersStatistics.max_set_streak }}
            <span
              class="padl20 txt-col-darker"
              v-if="this.playersStatistics.max_set_streak_players"
            >
              <span
                v-for="(player, index) in this.playersStatistics
                  .max_set_streak_players"
                v-bind:key="index"
              >
                {{ player.name
                }}<span
                  v-if="
                    index + 1 <
                    this.playersStatistics.max_set_streak_players.length
                  "
                  >,
                </span>
              </span>
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "underscore";

export default {
  name: "TournamentStats",
  props: ["resultCount", "officeId", "tournamentId"],
  data() {
    return {
      statistics: [],
      playersStatistics: [],
    };
  },
  mounted() {
    axios
      .all([
        axios.get("/api/tournaments/" + this.tournamentId + "/statistics"),
        axios.get(
          "/api/tournaments/" + this.tournamentId + "/players_statistics"
        ),
      ])
      .then(
        axios.spread((t, p) => {
          this.statistics = _.find(t.data, (elem) => {
            return parseInt(elem.id) === parseInt(this.tournamentId);
          });
          this.playersStatistics = p.data;
        })
      )
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
.btn-link:hover {
  background: #737373;
}
</style>
