<template>
  <div id="app">
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<script>
/* jshint esversion: 6 */
  export default {
    name: 'app'
  }
</script>

<style lang="scss" type="text/scss">
  @import "./assets/css/form.scss";
  @import "./assets/css/common.scss";
  @import "./assets/css/TableLayout.scss";
  @import "./assets/css/pager.scss";
  @import "./assets/css/mapScreen.scss";
  @import "./assets/css/index.scss";
  $fontFamilys: "Microsoft YaHei";
  $font: "SimSun";
  #app {
    width: 100%;
    height: 100%;
  }
  .slide-fade-enter-active {
    transition: all 0.5s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.5s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(340px);
  }
  .table-caozuo{
    color: #2f81eb;
    cursor: pointer;
  }
  .addji{
    cursor: pointer;
    text-align: center;
    padding: 5px 10px;
    &:hover{
      background: #eef6ff;
    }
  }
</style>
