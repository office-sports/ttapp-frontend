<template>
  <div v-if="getOutcome" class="result-badge" :class="'result-' + getOutcome.toLowerCase()">
    {{ getOutcome }}
  </div>
</template>

<script>
export default {
  props: ["playerId", "winnerId"],
  computed: {
    getOutcome() {
      if (this.winnerId === -1) return "";
      if (parseInt(this.winnerId) === 0) return "D";
      if (parseInt(this.playerId) === parseInt(this.winnerId)) return "W";
      return "L";
    },
  },
};
</script>

<style scoped>
.result-badge {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.result-w { background: #64a63c; }
.result-d { background: #3c3f41; }
.result-l { background: #3c3f41; }
</style>
