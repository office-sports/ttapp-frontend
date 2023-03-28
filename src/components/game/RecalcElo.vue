<template>
  <div>{{ this.completed }}</div>
</template>

<script>
import axios from "axios";

export default {
  name: "GameSummary",
  data() {
    return {
      completed: false,
    };
  },
  mounted() {
    axios.get("/api/games/recalc").then((res) => {
      if (res.status === 200) {
        this.completed = true;
      }
    });
  },
};
</script>
