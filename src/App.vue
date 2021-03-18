<template>
  <div id="app" class="relative">
    <router-view />
  </div>
</template>

<script>
let resizePage = null;
export default {
  components: {},
  name: "app",
  computed: {},
  methods: {
    countRem() {
      let [wref, ww] = [100 / 1280, window.innerWidth];
      let rem = wref * ww;
      $("html").css("font-size", rem + "px");
    },
  },
  mounted() {
    const that = this;
    this.countRem();
    window.addEventListener(
      "resize",
      (resizePage = this.debounce(() => {
        that.countRem();
      }, 200))
    );
  },
  beforeDestroy() {
    window.removeEventListener("resize", resizePage);
  },
};
</script>
<style>
#app {
  height: 100%;
  min-width: 1000px;
}
</style>