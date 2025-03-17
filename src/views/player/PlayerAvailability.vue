<template>
  <div class="round-container">
    <div class="round-container-dark-small flex txt-col-darker flex-full-width">
      <span class="text-white">
        <template v-if="parseInt(this.currentPlayerId) !== 0">
          <span class="txt-col-green">{{ this.getCurrentPlayerName() }}</span> -
          you are editing your availability calendar.
          <a href="#" class="ml-4" @click="this.setPlayer(0)">[not you?]</a>
        </template>
        <template v-else> Availability calendar </template>
      </span>
    </div>
    <div v-if="parseInt(this.currentPlayerId) === 0">
      <div class="my-8">
        To select dates when you are available to play, select your name from
        the list. Your player id will be stored in your browser.
      </div>
      <template
        v-for="(group, index) in this.groupedPlayers"
        v-bind:key="index"
      >
        <div class="mt-2.5">
          <div
            class="round-container-dark-small flex items-center justify-between txt-col-darker w-full px-4"
          >
            {{ group.groupName }}
          </div>
          <div class="pt-4 pb-4">
            <template
              v-for="(player, index) in group.players"
              v-bind:key="index"
            >
              <p class="inline-block px-4 py-2">
                <a href="#" @click="this.setPlayer(player.id)">{{
                  player.name
                }}</a>
              </p>
            </template>
          </div>
        </div>
      </template>
    </div>
    <div v-else class="mt-8 mb-8 w-full">
      <div class="ml-4 mb-4">
        You can define your availability for playing table tennis matches by
        clicking on the dates in the calendar (toggle).
      </div>
      <div class="ml-4 mb-8 border-b border-gray-600 pb-8">
        <span class="inline-block rounded-sm h-8 w-16 bg-green-500 mr-4"
          >&nbsp;</span
        >
        <span class="inline-block text-gray-400"
          >You are available to play that day</span
        >

        <span
          class="inline-block rounded-sm h-8 w-16 mr-4 ml-8 border-gray-500 border border-dashed"
          >&nbsp;</span
        >
        <span class="inline-block text-gray-400">
          Some of your opponents are available to play that day (hover to see)
        </span>
      </div>
      <CalendarComponent
        :office-id="this.officeId"
        :player-id="this.currentPlayerId"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "underscore";
import CalendarComponent from "@/components/player/CalendarComponent.vue";

export default {
  name: "TournamentResults",
  components: { CalendarComponent },
  data() {
    return {
      officeId: localStorage.getItem("officeId") ?? 1,
      currentPlayerId: localStorage.getItem("playerId") ?? 0,
      groupGames: [],
      groupedPlayers: [],
      allPlayers: [],
    };
  },
  methods: {
    setPlayer(playerId) {
      localStorage.setItem("playerId", playerId);
      window.location.reload();
    },
    getCurrentPlayerName() {
      return _.find(this.allPlayers, (player) => {
        return parseInt(player.id) === parseInt(this.currentPlayerId);
      })?.name;
    },
  },
  mounted() {
    axios
      .get("/api/tournaments/office/" + this.officeId + "/group/games")
      .then((res) => {
        if (res.data.length > 0) {
          this.groupGames = res.data;

          this.groupedPlayers = _.map(res.data, (group) => {
            // Combine home and away players into one list
            const allPlayers = group.game_schedule.flatMap((game) => [
              {
                id: game.home_player_id,
                name: game.home_player_name,
                slackName: game.home_player_slack_name,
              },
              {
                id: game.away_player_id,
                name: game.away_player_name,
                slackName: game.away_player_slack_name,
              },
            ]);

            // Remove duplicates by player id
            const uniquePlayers = _.uniq(allPlayers, (player) => player.id);

            this.allPlayers.push(...uniquePlayers);

            return {
              groupName: group.name,
              players: uniquePlayers,
            };
          });
        }
      });
  },
};
</script>
