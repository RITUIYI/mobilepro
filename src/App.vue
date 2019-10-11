<template>
  <div id="app">
    <keep-alive include="tabbar">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
window.onload = function() {
  document.addEventListener("touchstart", function(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });
  document.addEventListener("gesturestart", function(event) {
    event.preventDefault();
  });
};
</script>
<style lang="less">
</style>
