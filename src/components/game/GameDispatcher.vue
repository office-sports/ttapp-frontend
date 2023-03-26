<template><span></span></template>
<script>
import axios from "axios";

/**
 * The purpose of this component is to dispatch the match to correct route.
 * Using game/:id route can end up in different views, depending on
 * whether the match is finished, ongoing, etc.
 */
export default {
  data() {
    return {
      gameId: 0,
    };
  },
  created() {
    this.gameId = this.$route.params.id;
  },
  mounted() {
    axios
      .get(`/api/games/` + this.gameId)
      .then((res) => {
        let gameData = res.data;
        if (!!gameData.is_finished === true) {
          // game finished
          if (gameData.has_points) {
            // TODO redirect to detailed summary view
          } else {
            // redirect to regular result view
            this.$router.push({
              name: "GameResult",
              params: { id: this.gameId },
            });
          }
        } else {
          // game not finished
          // redirect to scoring page
          this.$router.push({
            name: "GameScoring",
            params: { id: this.gameId },
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
