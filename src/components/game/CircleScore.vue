<template>
  <span class="fa-stack" style="font-size: 15px">
    <i v-if="isWinner" class="fas fa-circle fa-stack-2x txt-col-green"></i>
    <i v-else class="fas fa-circle fa-stack-2x col-txt-white"> </i>
    <i class="fas fa-stack-1x circle-score">
      <slot name="score" />
    </i>
  </span>
</template>

<script>
export default {
  props: ["isWinner"],
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
