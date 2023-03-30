<template>
  <span v-if="this.outcome === 'W'" class="lbl lbl-win">
    {{ this.outcome }}
  </span>
  <span v-else-if="this.outcome === 'D'" class="lbl lbl-draw">
    {{ this.outcome }}
  </span>
  <span v-else-if="this.outcome === 'L'" class="lbl lbl-lose">
    {{ this.outcome }}
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
