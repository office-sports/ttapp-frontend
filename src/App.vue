<template>
  <div id="app">
    <TopMenu/>
    <div id="contentWrapper">
      <router-view :key="$route.name + ($route.params.id || '')"/>
    </div>
  </div>
</template>

<script>
import TopMenu from "@/components/TopMenu.vue";

export default {
  name: "App",
  components: {
    TopMenu,
  },
  mounted() {
    if (localStorage.getItem("ttappOfficeId") === null) {
      localStorage.setItem("ttappOfficeId", "1");
    }
  },
};
</script>

<style scoped>
#contentWrapper {
  max-width: var(--width-content);
  margin: 0 auto;
  padding-top: 20px;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
