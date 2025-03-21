import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import PlayerList from "@/views/player/PlayerList.vue";
import PlayerLeaders from "@/views/player/PlayerLeaders.vue";
import TournamentFullSchedule from "@/views/tournament/TournamentFullSchedule.vue";
import TournamentFullResults from "@/views/tournament/TournamentFullResults.vue";
import TournamentList from "@/views/tournament/TournamentList.vue";
import TournamentStandings from "@/views/tournament/TournamentStandings.vue";
import PlayerProfile from "@/views/player/PlayerProfile.vue";
import Ladders from "@/views/tournament/TournamentLadders.vue";
import GameScoring from "@/views/game/GameScoring.vue";
import GameResult from "@/views/game/GameResult.vue";
import GameSpectate from "@/views/game/GameSpectate.vue";
import TournamentManagement from "@/views/tournament/TournamentManagement.vue";
import TournamentFullResultsPlayoffs from "@/views/tournament/TournamentFullResultsPlayoffs.vue";
import GameObs from "@/views/game/GameObs.vue";
import TournamentStatistics from "@/views/tournament/TournamentStatistics.vue";
import TournamentGroupPredictor from "@/views/tournament/TournamentGroupPredictor.vue";
import TournamentPlayers from "@/views/tournament/TournamentPlayers.vue";
import PlayerBadges from "@/views/player/PlayerBadges.vue";
import PlayerAvailability from "@/views/player/PlayerAvailability.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "HomePage",
      component: HomePage,
    },
    { path: "/players", name: "PlayerList", component: PlayerList },
    { path: "/leaders", name: "PlayerLeaders", component: PlayerLeaders },
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
      path: "/tournament/:id/results_playoffs",
      name: "TournamentFullResultsPlayoffs",
      component: TournamentFullResultsPlayoffs,
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
    {
      path: "/tournament/:id/predictor/:group",
      name: "TournamentGroupPredictor",
      component: TournamentGroupPredictor,
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
      path: "/game/:id/spectate",
      name: "GameSpectate",
      component: GameSpectate,
    },
    {
      path: "/tournament/:id/manage",
      name: "TournamentManagement",
      component: TournamentManagement,
    },
    {
      path: "/tournament/:id/statistics",
      name: "TournamentStatistics",
      component: TournamentStatistics,
    },
    {
      path: "/game/:id/obs",
      name: "GameObs",
      component: GameObs,
    },
    {
      path: "/tournament/:id/players",
      name: TournamentPlayers,
      component: TournamentPlayers,
    },
    {
      path: "/badges",
      name: PlayerBadges,
      component: PlayerBadges,
    },
    {
      path: "/availability",
      name: "PlayerAvailability",
      component: PlayerAvailability,
    },
  ],
});

export default router;
