<template>
  <div id="app">
    <AppHeader :key="$route.fullPath" />
    <router-view />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
export default {
  name: "App",
  components: {
    AppHeader
  }
};
</script>

<style lang="sass">
@import "./assets/css/style.sass"
</style>
