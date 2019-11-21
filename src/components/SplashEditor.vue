<template>
  <v-container fluid>
    <v-layout row>
      <v-flex md10>
        <div ref="canvas">
          <v-card outlined elevation="4" width="1280px" height="720px">
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

      <v-flex md2>
        <v-layout column align-center>
          <v-layout mb-10>
            <v-text-field
              label="Duration"
              suffix="seconds"
              v-model="duration"
              type="number"
            ></v-text-field>
          </v-layout>
          <v-layout
            v-for="title in titleList"
            :key="title.id"
            row
            align-center
            justify-space-around
          >
            <v-flex md8>
              <v-form ref="form">
                <v-text-field
                  color="green darken-3"
                  prepend-icon="fa fa-edit"
                  label="Text"
                  v-model="title.text"
                  clearable
                  autofocus
                  :rules="rules.title"
                ></v-text-field>
              </v-form>
            </v-flex>

            <v-flex md2>
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
          <v-layout>
            <v-btn dark color="green darken-3" block @click="addNewTitle"
              >Add New Title <v-icon right>fa fa-plus</v-icon></v-btn
            >
          </v-layout>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import Moveable from "vue-moveable";
import { Frame } from "scenejs";
import { mapMutations } from "vuex";

export default {
  components: {
    Moveable
  },
  data: () => ({
    text: null,
    titleList: [],
    rules: {
      title: [value => (value && value.length > 0) || "Title can not be empty"]
    },
    moveable: {
      draggable: true,
      throttleDrag: 1
    },
    canvasData: null,
    duration: 0
  }),
  methods: {
    ...mapMutations(["setSplashScreenObject"]),
    create_UUID() {
      var dt = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },

    handleDrag({ target, left, top }) {
      this.$frame.set("left", `${left}px`);
      this.$frame.set("top", `${top}px`);
      this.setTransform(target);
    },
    setTransform(target) {
      target.style.cssText = this.$frame.toCSS();
    },
    addNewTitle() {
      if (this.titleList.length != 0) {
        if (!this.$refs.form[this.titleList.length - 1].validate()) {
          return;
        }
      }
      let id = this.create_UUID();
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
    },

    validate() {
      //TODO Validate this

      if (this.titleList.length != 0) {
        if (!this.$refs.form[this.titleList.length - 1].validate()) {
          return;
        }
      }
      this.canvasToData().then(() => {
        this.setSplashScreenObject({
          data: this.canvasData,
          duration: this.duration
        });
      });
      return true;
    }
  },
  mounted() {
    this.$frame = new Frame();
  }
};
</script>

<style lang="scss">
.moveable {
  position: relative;
  text-align: center;
  font-size: 40px;
  font-weight: 100;
  letter-spacing: 1px;
}

.moveable span {
  position: absolute;
  white-space: nowrap;
}
</style>
