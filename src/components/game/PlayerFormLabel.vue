<template>
  <span v-if="this.getOutcome === 'W'" class="lbl lbl-win">
    {{ this.getOutcome }}
  </span>
  <span v-else-if="this.getOutcome === 'D'" class="lbl lbl-draw">
    {{ this.getOutcome }}
  </span>
  <span v-else-if="this.getOutcome === 'L'" class="lbl lbl-lose">
    {{ this.getOutcome }}
  </span>
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

<style>
.lbl {
  display: block;
  color: black;
  padding: 2px 6px;
  border-radius: 6px;
  width: 15px;
  text-align: center;
  font-weight: bold;
}

.lbl-win {
  background: #64a63c;
  color: white;
}

.lbl-lose {
  background: #3c3f41;
  color: white;
}

.lbl-draw {
  background: #949494;
}
</style>
