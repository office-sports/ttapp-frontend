<template>
  <div class="slider" :class="this.state === true ? 'on' : 'off'">
    <span style="font-size: 15px; color: #fff">
      <i class="fas fa-circle"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: ["state"],
};
</script>

<style>
.slider {
  width: 40px;
  border-radius: 15px;
  padding: 0px 5px;
  border: 1px solid #454545;
}

.on {
  text-align: right;
  background: #454545;
}

.off {
  text-align: left;
  background: #000;
}
</style>
