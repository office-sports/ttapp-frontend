<template>
  <div class="round-container-dark-small flex txt-col-darker">
    <span class="txt-col-white">Tournament statistics</span>
    <span v-if="this.statistics" class="txt-col-green padl10">{{
      this.statistics.name
    }}</span>
  </div>
  <div class="padt20 padl10 padr10" v-if="this.statistics && this.tournament">
    <div>
      <table>
        <tr>
          <td>
            Participants
            <span class="col-winner txtl padl10">
              {{ this.tournament.participants }}
            </span>
          </td>
          <td>
            Divisions
            <span class="col-winner padl10">
              {{ this.statistics.divisions }}
            </span>
          </td>
          <td>
            Games scheduled
            <span class="col-winner padl10">
              {{ this.tournament.scheduled }}
            </span>
          </td>
          <td>
            Games played
            <span class="col-winner padl10">
              {{ this.tournament.finished }}
            </span>
          </td>
          <td>
            Sets played
            <span class="col-winner padl10">
              {{ this.statistics.sets_played }}
            </span>
          </td>
          <td>
            Points scored
            <span class="col-winner padl10">
              {{ this.statistics.points_scored }}
            </span>
          </td>
          <td>
            Avg. points per game
            <span class="col-winner padl10">
              {{ parseFloat(this.statistics.avg_points_per_match).toFixed(2) }}
            </span>
          </td>
        </tr>
      </table>
    </div>
    <div>
      <hr class="line" />
    </div>
    <div class="w100pc">
      <table>
        <tr>
          <td>Most points scored (single game)</td>
          <td>
            <span class="txt-col-recap-player">{{
              this.playersStatistics.most_points_in_game_player_name
            }}</span>
          </td>
          <td class="col-winner txtr padr20">
            {{ this.playersStatistics.most_points_in_game }}
          </td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.most_points_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.most_points_gid },
              }"
              ><i class="padl10 far fa-play-circle"></i
            ></router-link>
          </td>
        </tr>
        <tr>
          <td>Least points lost (single game)</td>
          <td>
            <span class="txt-col-recap-player">{{
              this.playersStatistics.least_points_lost_in_game_player_name
            }}</span>
          </td>
          <td class="col-winner txtr padr20">
            {{ this.playersStatistics.least_points_lost_in_game }}
          </td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.least_points_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.least_points_gid },
              }"
              ><i class="padl10 far fa-play-circle"></i
            ></router-link>
          </td>
        </tr>
        <tr>
          <td>Biggest ELO increase (single game)</td>
          <td>
            <span class="txt-col-recap-player">{{
              this.playersStatistics.most_elo_gain_player_name
            }}</span>
          </td>
          <td class="col-winner txtr padr20">
            {{ this.playersStatistics.most_elo_gain }}
          </td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.most_elo_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.most_elo_gid },
              }"
              ><i class="padl10 far fa-play-circle"></i
            ></router-link>
          </td>
        </tr>
        <tr>
          <td>Biggest ELO drop (single game)</td>
          <td>
            <span class="txt-col-recap-player">{{
              this.playersStatistics.most_elo_lost_player_name
            }}</span>
          </td>
          <td class="col-winner padr20 txtr">
            {{ this.playersStatistics.most_elo_lost }}
          </td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.most_elo_lost_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.most_elo_lost_gid },
              }"
              ><i class="padl10 far fa-play-circle"></i
            ></router-link>
          </td>
        </tr>
        <tr>
          <td>Game with most points</td>
          <td>
            <span class="txt-col-recap-player"
              >{{ this.playersStatistics.most_points_game_home_name }}
              <span class="txt-col-darkest">vs</span>
              {{ this.playersStatistics.most_points_game_away_name }}</span
            >
          </td>
          <td class="col-winner padr20 txtr">
            {{ this.playersStatistics.most_points_game }}
          </td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.most_points_game_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.most_points_game_gid },
              }"
              ><i class="padl10 far fa-play-circle"></i
            ></router-link>
          </td>
        </tr>
        <tr>
          <td>Game with least points</td>
          <td>
            <span class="txt-col-recap-player"
              >{{ this.playersStatistics.least_points_game_home_name }}
              <span class="txt-col-darkest">vs</span>
              {{ this.playersStatistics.least_points_game_away_name }}</span
            >
          </td>
          <td class="col-winner txtr padr20">
            {{ this.playersStatistics.least_points_game }}
          </td>
          <td class="w30">
            <router-link
              v-if="this.playersStatistics.least_points_game_gid"
              :to="{
                name: 'GameResult',
                params: { id: this.playersStatistics.least_points_game_gid },
              }"
              ><i class="padl10 far fa-play-circle"></i
            ></router-link>
          </td>
        </tr>
        <tr>
          <td>Longest set winning streak</td>
          <td>
            <span
              class="txt-col-darker"
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
          <td class="col-winner txtr padr20">
            {{ this.playersStatistics.max_set_streak }}
          </td>
        </tr>
      </table>
    </div>
    <div>
      <hr class="line" />
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
      tournament: null,
    };
  },
  mounted() {
    axios
      .all([
        axios.get("/api/tournaments/" + this.tournamentId + "/statistics"),
        axios.get(
          "/api/tournaments/" + this.tournamentId + "/players_statistics"
        ),
        axios.get("/api/tournaments/" + this.tournamentId),
      ])
      .then(
        axios.spread((t, p, trn) => {
          this.statistics = _.find(t.data, (elem) => {
            return parseInt(elem.id) === parseInt(this.tournamentId);
          });
          this.playersStatistics = p.data;
          this.tournament = trn.data;
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

.line {
  border: none;
  border-bottom: 1px solid #343434;
}
</style>
