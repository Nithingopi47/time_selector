<template>
  <div id="app">
    <WebinarManager />
  </div>
</template>

<script>
import WebinarManager from './components/WebinarManager.vue'

export default {
  name: 'App',
  components: {
    WebinarManager
  }
}
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
