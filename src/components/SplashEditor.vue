<template>
  <v-card class="mb-12" color="grey lighten-1" height="400px">
    <Moveable class="moveable" v-bind="moveable" @drag="handleDrag">
      <span>Vue Moveable</span>
    </Moveable>
  </v-card>
</template>
<script>
import Moveable from "vue-moveable";
import { Frame } from "scenejs";

export default {
  name: "app",
  components: {
    Moveable
  },
  data: () => ({
    moveable: {
      draggable: true,
      throttleDrag: 1
    }
  }),
  methods: {
    handleDrag({ target, left, top }) {
      this.$frame.set("left", `${left}px`);
      this.$frame.set("top", `${top}px`);
      this.setTransform(target);
    },
    setTransform(target) {
      target.style.cssText = this.$frame.toCSS();
    }
  },
  watch: {
    currentState(newState) {
      this.clearAllStates();
      this.moveable[newState] = true;
    }
  },
  mounted() {
    this.$frame = new Frame({
      width: "300px",
      height: "200px",
      left: "0px",
      top: "0px",
      transform: {
        rotate: "0deg",
        scaleX: 1,
        scaleY: 1,
        matrix3d: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
      }
    });
  }
};
</script>

<style lang="scss">
.moveable {
  position: relative;
  width: 300px;
  height: 200px;
  text-align: center;
  font-size: 40px;
  margin: 0 auto;
  font-weight: 100;
  letter-spacing: 1px;
}

.moveable span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}
</style>
