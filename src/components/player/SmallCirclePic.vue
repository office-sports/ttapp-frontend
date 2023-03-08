<template>
  <div class="cutoutPicSmall" v-if="this.player">
    <img :src="this.player.profile_pic_url" class="pic" />
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["id"],
  data() {
    return {
      player: null,
    };
  },
  mounted() {
    axios
      .all([axios.get("/api/players/" + this.id)])
      .then(
        axios.spread((player) => {
          this.player = player.data;
        })
      )
      .catch((error) => {
        console.log("Error when getting data for matches " + error);
      });
  },
};
</script>

<style>
.circle-score {
  color: black;
  font-family: "Poppins", "Avenir", Helvetica, Arial, sans-serif;
  font-size: 10pt;
  font-weight: 900;
}
</style>
