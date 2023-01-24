import { createRouter, createWebHistory } from "vue-router";
import IndexPage from "../components/IndexPage.vue";
import PlayerProfile from "../components/Player/Profile.vue";
import PlayerList from "../components/Player/List.vue";
import TournamentList from "../components/Tournament/List.vue";
import Ladders from "../components/Tournament/Ladders.vue";
import TheUpdates from "../components/TheUpdates.vue";
import TournamentStandings from "@/components/Tournament/Standings.vue";
import GameSummary from "@/components/Game/TheSummary.vue";
import GameView from "@/components/Game/TheView.vue";
import TournamentSchedule from "@/components/Tournament/FullSchedule.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "IndexPage",
      component: IndexPage,
    },
    {
      path: "/player/:id/profile",
      name: "PlayerProfile",
      component: PlayerProfile,
    },
    { path: "/player/list", name: "PlayerList", component: PlayerList },
    { path: "/updates", name: "TheUpdates", component: TheUpdates },
    {
      path: "/tournament/list",
      name: "TournamentList",
      component: TournamentList,
    },
    { path: "/tournaments/:id/ladders", name: "Ladders", component: Ladders },
    {
      path: "/tournament/:id/standings",
      name: "TournamentStandings",
      component: TournamentStandings,
    },
    {
      path: "/tournament/:id/schedule",
      name: "TournamentSchedule",
      component: TournamentSchedule,
    },
    {
      path: "/games/:id/summary",
      name: "GameSummary",
      component: GameSummary,
    },
    {
      path: "/games/:id/view",
      name: "GameView",
      component: GameView,
    },
  ],
});

export default router;
