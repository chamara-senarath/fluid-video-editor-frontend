<template>
  <v-layout row>
    <v-flex>
      <div ref="canvas">
        <v-card
          class="mb-12"
          outlined
          elevation="4"
          width="1280px"
          height="720px"
        >
          <v-container>
            <v-layout>
              <Moveable
                v-for="title in titleList"
                :key="title.id"
                class="moveable"
                v-bind="moveable"
                @drag="handleDrag"
              >
                <span>{{ title.text }}</span>
              </Moveable>
            </v-layout>
          </v-container>
        </v-card>
      </div>
    </v-flex>
    <v-flex>
      <v-layout v-for="title in titleList" :key="title.id" row align-center>
        <v-flex>
          <v-text-field
            color="green darken-3"
            prepend-icon="fa fa-edit"
            label="Text"
            v-model="title.text"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-btn
            @click="deleteTitle(title.id)"
            dark
            color="red darken-3"
            class="mx-2"
            fab
            small
            ><v-icon small dark>fa fa-trash-alt</v-icon></v-btn
          >
        </v-flex>
      </v-layout>
      <v-btn dark color="green darken-3" block @click="addNewTitle"
        >Add New Title <v-icon right>fa fa-plus</v-icon></v-btn
      >
    </v-flex>
  </v-layout>
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
    text: null,
    titleList: [],

    moveable: {
      draggable: true,
      throttleDrag: 1
    },
    canvasData: null
  }),
  methods: {
    handleDrag({ target, left, top }) {
      this.$frame.set("left", `${left}px`);
      this.$frame.set("top", `${top}px`);
      this.setTransform(target);
    },
    setTransform(target) {
      target.style.cssText = this.$frame.toCSS();
    },
    addNewTitle() {
      let id = Math.floor(Date.now() / 1000);
      let title = {
        id: id,
        text: "Enter your text here"
      };
      this.titleList.push(title);
    },
    deleteTitle(id) {
      this.titleList = this.titleList.filter(title => title.id != id);
    },
    async canvasToData() {
      const canvas = this.$refs.canvas;
      const options = {
        type: "dataURL"
      };
      this.canvasData = await this.$html2canvas(canvas, options);
    }
  },
  mounted() {
    this.$frame = new Frame({
      left: "0px",
      top: "0px"
    });
  }
};
</script>

<style lang="scss">
.moveable {
  position: relative;
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
