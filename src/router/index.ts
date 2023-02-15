import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import PlayerList from "@/views/player/PlayerList.vue";
import TournamentFullSchedule from "@/views/tournament/TournamentFullSchedule.vue";
import TournamentFullResults from "@/views/tournament/TournamentFullResults.vue";
import TournamentList from "@/views/tournament/TournamentList.vue";
import TournamentStandings from "@/views/tournament/TournamentStandings.vue";
import PlayerProfile from "@/views/player/PlayerProfile.vue";
import Ladders from "@/views/tournament/TournamentLadders.vue";
import GameScoring from "@/views/game/GameScoring.vue";
import GameResult from "@/views/game/GameResult.vue";
import GameResultDetailed from "@/views/game/GameResultDetailed.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "HomePage",
      component: HomePage,
    },
    { path: "/players", name: "PlayerList", component: PlayerList },
    {
      path: "/tournament/:id/schedule",
      name: "TournamentFullSchedule",
      component: TournamentFullSchedule,
    },
    {
      path: "/tournament/:id/results",
      name: "TournamentFullResults",
      component: TournamentFullResults,
    },
    {
      path: "/tournaments",
      name: "TournamentList",
      component: TournamentList,
    },
    {
      path: "/tournament/:id/standings",
      name: "TournamentStandings",
      component: TournamentStandings,
    },
    { path: "/tournament/:id/ladders", name: "Ladders", component: Ladders },
    {
      path: "/player/:id/profile",
      name: "PlayerProfile",
      component: PlayerProfile,
    },
    {
      path: "/game/:id/scoring",
      name: "GameScoring",
      component: GameScoring,
    },
    {
      path: "/game/:id/result",
      name: "GameResult",
      component: GameResult,
    },
    {
      path: "/game/:id/details",
      name: "GameResultDetailed",
      component: GameResultDetailed,
    },
  ],
});

export default router;
