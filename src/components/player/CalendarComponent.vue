<template>
  <div class="flex justify-center">
    <div class="space-y-8 w-full">
      <div
        v-for="(month, index) in months"
        :key="index"
        class="flex items-start gap-8"
      >
        <!-- Left side: Calendar -->
        <div>
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
                'pointer-events-none opacity-40': !day.isWithinRange,
                'bg-green-500 text-white': day.isPlayerDate, // Player-specific availability
                'border-gray-200 border-dashed border': day.isPotentialMatch, // Opponent availability
                'border-gray-500': !day.isPotentialMatch && !day.isPlayerDate, // Default border if not marked
              }"
              @click="toggleDate(day, month)"
            >
              {{ day.date }}
            </div>
          </div>
        </div>

        <!-- Right side: Matchups -->
        <div class="flex-1 pl-10">
          <h2
            v-if="month.matchups.length"
            class="text-lg font-semibold text-gray-400 mb-2 text-left"
          >
            Possible Matchups:
          </h2>
          <ul>
            <li
              v-for="matchup in month.matchups"
              :key="matchup.date"
              class="text-sm"
              :class="{
                'text-yellow-500 font-semibold': matchup.isToday, // Highlight today's date in yellow
                'text-gray-500': !matchup.isToday, // Default color for other dates
              }"
            >
              {{ matchup.date }}:
              <span
                v-for="(opponent, idx) in matchup.opponents"
                :key="opponent"
                class="text-gray-200"
              >
                {{ opponent
                }}{{ idx < matchup.opponents.length - 1 ? ", " : "" }}
              </span>
            </li>
          </ul>
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

        this.upcomingGames = _.flatten(
          _.map(data, (group) => group.game_schedule)
        ).filter((game) => !game.is_finished);
      } catch (error) {
        console.error("Error fetching upcoming games:", error);
      }
    },

    isPotentialMatch(dayString) {
      const playerId = parseInt(this.playerId);

      const playerGames = this.upcomingGames.filter(
        (game) =>
          game.home_player_id === playerId || game.away_player_id === playerId
      );

      return playerGames.some((game) => {
        const opponentId =
          game.home_player_id === playerId
            ? game.away_player_id
            : game.home_player_id;

        const opponent = _.find(
          this.allPlayersAvailability,
          (p) => p.id === opponentId
        );

        return opponent?.dates.some((d) => d.date === dayString);
      });
    },

    async toggleDate(day, month) {
      if (!day.isWithinRange) return;

      const [monthName, year] = month.label.split(" ");
      const monthIndex = new Date(
        Date.parse(monthName + " 1, 2023")
      ).getMonth();
      const dayString = new Date(Date.UTC(year, monthIndex, day.date))
        .toISOString()
        .split("T")[0];

      console.log(dayString);

      if (this.playerDates.includes(dayString)) {
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

      this.generateMonthlyCalendars(); // Refresh matchups after toggling
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

        // Generate possible matchups for this month
        const matchups = this.findPotentialMatchupsForMonth(
          date.getMonth() + 1
        );

        months.push({
          label: date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          }),
          monthIndex: date.getMonth() + 1, // Add month index directly here
          firstDayOffset,
          days,
          matchups,
        });

        date.setMonth(date.getMonth() + 1);
      }

      this.months = months;
    },

    findPotentialMatchupsForMonth(monthIndex) {
      const playerId = parseInt(this.playerId);

      // Create a local version of today's date (without time)
      const today = new Date(
        this.today.getFullYear(),
        this.today.getMonth(),
        this.today.getDate()
      );

      const playerGames = this.upcomingGames.filter(
        (game) =>
          game.home_player_id === playerId || game.away_player_id === playerId
      );

      const matchups = {};

      playerGames.forEach((game) => {
        const opponentId =
          game.home_player_id === playerId
            ? game.away_player_id
            : game.home_player_id;

        const opponent = _.find(
          this.allPlayersAvailability,
          (p) => p.id === opponentId
        );

        if (opponent) {
          opponent.dates.forEach((d) => {
            const date = new Date(d.date);
            const localDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate()
            );

            const localDateString = `${localDate.getFullYear()}-${String(
              localDate.getMonth() + 1
            ).padStart(2, "0")}-${String(localDate.getDate()).padStart(
              2,
              "0"
            )}`;

            // ✅ Skip past dates
            if (
              localDate >= today &&
              this.playerDates.includes(localDateString) &&
              localDate.getMonth() + 1 === monthIndex
            ) {
              const opponentName = opponent.name;

              if (!matchups[localDateString]) {
                matchups[localDateString] = [];
              }

              if (!matchups[localDateString].includes(opponentName)) {
                matchups[localDateString].push(opponentName);
              }
            }
          });
        }
      });

      // Return array of objects for easier rendering
      return Object.keys(matchups)
        .sort()
        .map((date) => {
          const dateParts = date.split("-");
          const dateObject = new Date(
            dateParts[0],
            dateParts[1] - 1,
            dateParts[2]
          );
          return {
            date,
            opponents: matchups[date],
            isToday:
              dateObject.getFullYear() === today.getFullYear() &&
              dateObject.getMonth() === today.getMonth() &&
              dateObject.getDate() === today.getDate(), // ✅ Compare local dates directly
          };
        });
    },
  },
};
</script>
