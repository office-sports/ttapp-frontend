<template>
  <div>
    <table>
      <tr>
        <td class="wp50pc padr10 valignTop">
          <div class="roundWrapper">
            <div class="txtHeader col-dark-green">
              <i class="fas fa-bullseye col-dark-green"></i> <span class="padl10">Tournament schedule</span>
            </div>
            <div class="padt20">
              <TournamentSchedule/>
            </div>
          </div>
        </td>
        <td class="wp50pc padl10 valignTop">
          <div class="roundWrapper">
            <div class="txtHeader col-blue">
              <i class="fas fa-bullseye"></i> <span class="padl10">Tournament results</span>
            </div>
            <div class="padt20">
              <TournamentResults/>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import TournamentSchedule from "./Tournament/Schedule.vue";
import TournamentResults from "@/components/Tournament/Results.vue";

export default {
  name: "IndexPage",
  components: {
    TournamentResults,
    TournamentSchedule
  },
  data() {
    return {};
  },
};
</script>
