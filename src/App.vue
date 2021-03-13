<template>
  <div id="app" class="mx-auto overflow-hidden">
    <Header />
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  background-color: #fafafa;
}
#app {
  margin: 0;
}
</style>
