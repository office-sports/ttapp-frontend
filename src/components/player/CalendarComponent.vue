<template>
  <div class="flex justify-center">
    <div class="space-y-8">
      <div v-for="(month, index) in months" :key="index">
        <h2 class="text-lg font-semibold text-gray-400 mb-2 text-center">
          {{ month.label }}
        </h2>
        <div class="grid grid-cols-7 gap-[2px]">
          <!-- Weekday headers -->
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-center font-medium text-gray-500 text-sm py-1"
          >
            {{ day }}
          </div>

          <!-- Empty cells for offset -->
          <div
            v-for="n in month.firstDayOffset"
            :key="`empty-${n}`"
            class="w-16 h-8"
          ></div>

          <!-- Day cells -->
          <div
            v-for="day in month.days"
            :key="day.date"
            class="w-16 h-8 flex items-center justify-center text-sm font-medium cursor-pointer rounded-sm"
            :class="{
              'hover:bg-blue-100': day.isWithinRange && !day.isPlayerDate,
              'text-gray-400': day.isPast,
              'pointer-events-none opacity-50': !day.isWithinRange,
              'bg-green-500 text-white': day.isPlayerDate, // Player-specific availability
              'border-gray-500 border border-dashed': day.isPotentialMatch, // Opponent availability
              'border-gray-500': !day.isPotentialMatch && !day.isPlayerDate, // Default border if not marked
            }"
            @click="toggleDate(day, month)"
          >
            {{ day.date }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "underscore";

export default {
  props: ["officeId", "playerId"],
  data() {
    return {
      playerDates: [],
      allPlayersAvailability: [],
      upcomingGames: [],
      months: [],
      weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      today: new Date(new Date().setHours(0, 0, 0, 0)),
      lastGameDate: null,
    };
  },
  async created() {
    await this.fetchLastGameDate();
    await this.fetchPlayerDates();
    await this.fetchUpcomingGames();
    this.generateMonthlyCalendars();
  },
  methods: {
    async fetchLastGameDate() {
      try {
        const response = await axios.get(
          `/api/tournaments/office/${this.officeId}/group/games`
        );
        const data = response.data;

        const allGames = _.flatten(_.map(data, (group) => group.game_schedule));
        if (allGames.length) {
          this.lastGameDate = new Date(
            _.max(
              allGames,
              (game) => new Date(game.date_of_match)
            ).date_of_match
          );
        }
      } catch (error) {
        console.error("Error fetching game dates:", error);
      }
    },

    async fetchPlayerDates() {
      if (!this.playerId) return;

      try {
        const response = await axios.get(`/api/players/availability`);
        const data = response.data;

        this.allPlayersAvailability = data;

        // Find the specific player's availability
        const player = _.find(data, (p) => p.id === parseInt(this.playerId));
        if (player) {
          this.playerDates = player.dates.map((d) => {
            const parts = d.date.split("-");
            const utcDate = new Date(
              Date.UTC(parts[0], parts[1] - 1, parts[2])
            );
            return utcDate.toISOString().split("T")[0];
          });
        }
      } catch (error) {
        console.error("Error fetching player dates:", error);
      }
    },

    async fetchUpcomingGames() {
      try {
        const response = await axios.get(
          `/api/tournaments/office/${this.officeId}/group/games`
        );
        const data = response.data;

        // Keep only unfinished games
        this.upcomingGames = _.flatten(
          _.map(data, (group) => group.game_schedule)
        ).filter((game) => !game.is_finished);
      } catch (error) {
        console.error("Error fetching upcoming games:", error);
      }
    },

    isPotentialMatch(dayString) {
      const playerId = parseInt(this.playerId);

      // Find games where the current player is playing
      const playerGames = this.upcomingGames.filter(
        (game) =>
          game.home_player_id === playerId || game.away_player_id === playerId
      );

      // Check if any opponent is available on the same date
      return playerGames.some((game) => {
        const opponentId =
          game.home_player_id === playerId
            ? game.away_player_id
            : game.home_player_id;

        // Find opponent availability
        const opponent = _.find(
          this.allPlayersAvailability,
          (p) => p.id === opponentId
        );

        // Dashed border should appear if opponent selected the date, regardless of current player availability
        return opponent?.dates.some((d) => d.date === dayString);
      });
    },

    async toggleDate(day, month) {
      if (!day.isWithinRange) return;

      const dayString = new Date(
        Date.UTC(
          new Date(month.label).getFullYear(),
          new Date(month.label).getMonth(),
          day.date
        )
      )
        .toISOString()
        .split("T")[0];

      if (this.playerDates.includes(dayString)) {
        // Remove date
        try {
          await axios.delete(`/api/players/availability`, {
            data: { player_id: parseInt(this.playerId), date: dayString },
          });
          this.playerDates = this.playerDates.filter(
            (date) => date !== dayString
          );
          day.isPlayerDate = false;
          day.isPotentialMatch = this.isPotentialMatch(dayString);
        } catch (error) {
          console.error("Failed to remove date:", error);
        }
      } else {
        // Add date
        try {
          await axios.post(`/api/players/availability`, {
            player_id: parseInt(this.playerId),
            date: dayString,
          });
          this.playerDates.push(dayString);
          day.isPlayerDate = true;
          day.isPotentialMatch = this.isPotentialMatch(dayString);
        } catch (error) {
          console.error("Failed to add date:", error);
        }
      }
    },

    generateMonthlyCalendars() {
      if (!this.lastGameDate) return;

      const currentMonth = this.today.getMonth();
      const currentYear = this.today.getFullYear();

      const months = [];
      let date = new Date(currentYear, currentMonth, 1);

      while (date <= this.lastGameDate) {
        const firstDayOffset = date.getDay();
        const daysInMonth = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDate();

        const days = Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), day)
          );
          const dayString = dayDate.toISOString().split("T")[0];

          const isWithinRange =
            dayDate >= this.today && dayDate <= this.lastGameDate;

          const isPlayerDate = this.playerDates.includes(dayString);
          const isPotentialMatch = this.isPotentialMatch(dayString);

          return {
            date: day,
            isPast: dayDate < this.today,
            isWithinRange,
            isPlayerDate,
            isPotentialMatch,
          };
        });

        months.push({
          label: date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          }),
          firstDayOffset,
          days,
        });

        date.setMonth(date.getMonth() + 1);
      }

      this.months = months;
    },
  },
};
</script>
