<template>
  <nav>
    <RouterLink to="/"
      ><img src="@/assets/images/favicon.ico" class="logo" /> TTAPP
    </RouterLink>
    <RouterLink to="/tournaments">tournaments</RouterLink>
    <RouterLink to="/players">players</RouterLink>
    <RouterLink to="/leaders">leaders</RouterLink>
  </nav>
</template>

<style>
.logo {
  width: 16px;
  height: 16px;
}
</style>
