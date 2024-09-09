<template>
  <div
    v-if="this.getOutcome === 'W'"
    class="bg-lbl_win text-white rounded-md min-w-6 font-extrabold"
  >
    {{ this.getOutcome }}
  </div>
  <div
    v-else-if="this.getOutcome === 'D'"
    class="bg-lbl_lose text-white rounded-md min-w-6 font-extrabold"
  >
    {{ this.getOutcome }}
  </div>
  <div
    v-else-if="this.getOutcome === 'L'"
    class="bg-lbl_lose text-white rounded-md min-w-6 font-extrabold"
  >
    {{ this.getOutcome }}
  </div>
</template>

<script>
export default {
  props: ["playerId", "winnerId"],
  data() {
    return {
      outcome: "",
    };
  },
  mounted() {
    if (this.winnerId === -1) {
      this.outcome = "";
    } else if (parseInt(this.winnerId) === 0) {
      this.outcome = "D";
    } else if (parseInt(this.playerId) === this.winnerId) {
      this.outcome = "W";
    } else {
      this.outcome = "L";
    }
  },
  computed: {
    // computed property that auto-updates when the prop changes
    getOutcome() {
      if (this.winnerId === -1) {
        return "";
      } else if (parseInt(this.winnerId) === 0) {
        return "D";
      } else if (parseInt(this.playerId) === this.winnerId) {
        return "W";
      } else {
        return "L";
      }
    },
  },
};
</script>
