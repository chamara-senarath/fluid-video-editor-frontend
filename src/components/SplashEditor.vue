<template>
  <v-container fluid>
    <v-layout row justify-space-between>
      <v-flex md9>
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
                  <span :class="convertFontSize(title.size)">{{
                    title.text
                  }}</span>
                </Moveable>
                <Moveable class="moveable" v-bind="moveable" @drag="handleDrag">
                  <span><img ref="logoImage" :src="logo"/></span>
                </Moveable>
              </v-layout>
            </v-container>
          </v-card>
        </div>
      </v-flex>

      <v-flex md2>
        <v-layout column>
          <v-layout mb-4>
            <v-text-field
              label="Duration"
              suffix="seconds"
              v-model="duration"
              type="number"
            ></v-text-field>
          </v-layout>
          <v-layout mb-10>
            <v-layout column justify-center>
              <v-layout>
                <v-form>
                  <v-file-input
                    ref="logoSelect"
                    clearable
                    color="green darken-3"
                    :rules="rules.logo"
                    accept="image/png, image/jpeg"
                    placeholder="Select a Logo"
                    prepend-icon="mdi-camera"
                    label="Logo"
                    @change="selectLogo"
                    v-model="logofile"
                  ></v-file-input>
                </v-form>
              </v-layout>
              <v-layout v-if="logo != null">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="primary"
                  @click="resizeLogo('+')"
                >
                  <v-icon dark>mdi-plus</v-icon> </v-btn
                ><v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="primary"
                  @click="resizeLogo('-')"
                >
                  <v-icon dark>mdi-minus</v-icon>
                </v-btn>
              </v-layout>
            </v-layout>
          </v-layout>
          <v-card
            outlined
            elevation="4"
            v-for="title in titleList"
            :key="title.id"
          >
            <v-layout column ma-2>
              <v-layout>
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
              </v-layout>
              <v-layout row justify-space-around align-center>
                <v-flex md8>
                  <v-overflow-btn
                    :items="fontSizes"
                    value="H1"
                    v-model="title.size"
                    label="Font Size"
                    editable
                    item-value="text"
                  ></v-overflow-btn>
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
            </v-layout>
          </v-card>
          <v-layout my-3>
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
    fontSizes: ["H1", "H2", "H3", "H4", "H5", "H6"],
    logofile: null,
    logo: null,
    aspectRatio: null,
    rules: {
      title: [value => (value && value.length > 0) || "Title can not be empty"],
      logo: [
        value => {
          if (value && value.name) {
            return (
              ["jpg", "jpeg", "png"].includes(value.name.split(".")[1]) ||
              "Invalid File Type"
            );
          }
          return false;
        },
        value =>
          !value ||
          value.size < 2000000 ||
          "Logo size should be less than 2 MB!"
      ]
    },
    moveable: {
      draggable: true,
      throttleDrag: 1,
      resizable: false,
      throttleResize: 1,
      keepRatio: false
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
    convertFontSize(size) {
      switch (size) {
        case "H1":
          return "display-3";
        case "H2":
          return "display-2";
        case "H3":
          return "display-1";
        case "H4":
          return "headline";
        case "H5":
          return "title";
        case "H6":
          return "subtitle-1";
      }
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
        text: "Enter your text here",
        size: "H1"
      };
      this.titleList.push(title);
    },
    deleteTitle(id) {
      this.titleList = this.titleList.filter(title => title.id != id);
    },
    selectLogo(file) {
      if (
        file &&
        file.name &&
        ["jpg", "jpeg", "png"].includes(file.name.split(".")[1])
      ) {
        this.logo = URL.createObjectURL(file);
      }
    },
    resizeLogo(type) {
      let width = this.$refs.logoImage.width;
      let height = this.$refs.logoImage.height;
      this.aspectRatio = width / height;
      let newWidth;
      let newHeight;
      if (type == "+") {
        newWidth = this.$refs.logoImage.width + 10;
        newHeight = this.$refs.logoImage.height + 10;
      }
      if (type == "-") {
        newWidth = this.$refs.logoImage.width - 10;
        newHeight = this.$refs.logoImage.height - 10;
      }
      this.$refs.logoImage.width = newHeight * this.aspectRatio;
      this.$refs.logoImage.height = newWidth / this.aspectRatio;
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
  watch: {
    logofile(value) {
      if (value == null) {
        this.logo = null;
      }
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
