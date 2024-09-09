<script setup lang="ts">
import { RouterView } from "vue-router";
import TopMenu from "./components/menus/TopMenu.vue";
</script>

<template>
  <div v-if="this.$route['name'] === 'GameObs'">
    <RouterView />
  </div>
  <div v-else>
    <div class="content-wrapper">
      <TopMenu />
    </div>

    <div class="clear"></div>

    <div class="content-wrapper">
      <RouterView :key="$route.fullPath" />
    </div>
  </div>
</template>

<style>
@import "assets/main.css";
@import "assets/base.css";
@import "assets/base-obs.css";
@import "assets/spaces.css";
@import "assets/colors.css";
</style>
