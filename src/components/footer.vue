<template>
  <p class="footer-new">

  </p>
</template>
<script>
export default {
  data() {
    return {
      // b: ''
    };
  },
  computed: {
    // isFromC() {
    //     return this.$store.state.isFromC
    // }
  },
  mounted() {
    // let that = this
    // var scrollH = document.documentElement.scrollHeight
    // var clientH = document.documentElement.clientHeight
    // //1280屏高的基准点
    // var bH = 984;
    // if (clientH > bH) {
    //     bH = clientH
    // }
    // let getB = () => {
    //     scrollH = document.documentElement.scrollHeight
    //     that.b = scrollH - bH + 'px'
    // }
    // getB();
    // window.onresize = () => {
    //     setTimeout(getB, 400)
    // }
  },
};
</script>
<style scoped>
.footer-new {
  cursor: default;
  height: 60px;
  line-height: 60px;
  text-align: center;
  padding: 0;
  margin: 0;
  color: #858687;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  opacity: 0.6;
}
</style>