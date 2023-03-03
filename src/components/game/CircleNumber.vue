<template>
  <span class="fa-stack c-number">
    <i class="fas fa-circle fa-stack-2x col-txt-white"> </i>
    <i class="fas fa-stack-1x circle-score">
      <slot name="value" />
    </i>
  </span>
</template>

<style>
.c-number {
  left: 50%;
  margin-left: -65px;
  position: relative;
  margin-top: -196px;
  font-size: 15px;
}

.circle-score {
  color: black;
  font-family: "Poppins", "Avenir", Helvetica, Arial, sans-serif;
  font-size: 10pt;
  font-weight: 900;
}
</style>
