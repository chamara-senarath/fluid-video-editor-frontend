<template>
  <v-container>
    <v-layout row>
      <v-flex md9 mr-10 ml-3>
        <div ref="canvas">
          <v-sheet
            style="outline-style: dotted;"
            tile
            @click.ctrl="selectedElement = 'bg'"
            :color="backgroundColor"
          >
            <v-responsive :aspect-ratio="16 / 9">
              <v-layout>
                <Moveable
                  v-for="title in titleList"
                  :key="title.id"
                  :class="title.edit ? 'fixed' : 'moveable'"
                  v-bind="moveable"
                  @drag="handleDrag"
                >
                  <span
                    :ref="title.id"
                    v-show="!title.edit"
                    @dblclick="title.edit = true"
                    @click="changeTitleColor(title.id)"
                    :class="convertFontSize(title.size)"
                    :style="
                      `color:${title.color};font-family:${title.font.font}`
                    "
                    >{{ title.text }}</span
                  >

                  <v-layout
                    column
                    v-show="title.edit"
                    @mouseleave="title.edit = false"
                  >
                    <v-layout>
                      <v-text-field
                        v-model="title.text"
                        clearable
                        autofocus
                        outlined
                        @focus="
                          title.text == 'Enter your text here'
                            ? (title.text = '')
                            : (title.text = title.text)
                        "
                        @keypress.enter="changeTitle(title)"
                      ></v-text-field>
                    </v-layout>

                    <v-layout style="z-index:10000;">
                      <v-menu offset-x>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            class="mx-2"
                            depressed
                            dark
                            small
                            block
                            color="primary"
                            v-on="on"
                          >
                            <v-icon left>mdi-format-size</v-icon
                            >{{ title.size }}</v-btn
                          >
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(item, index) in fontSizes"
                            :key="index"
                            @click="title.size = item"
                            @mouseover="title.size = item"
                          >
                            <v-list-item-title>{{ item }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-layout>

                    <v-layout mt-1 style="z-index:10000;">
                      <v-menu offset-x>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            block
                            class="mx-2"
                            depressed
                            dark
                            small
                            color="primary"
                            v-on="on"
                          >
                            <v-icon left>fa fa-font</v-icon
                            >{{ title.font.name }}</v-btn
                          >
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(font, index) in fontFamilies"
                            :key="index"
                            @click="title.font = font"
                            @mouseover="title.font = font"
                          >
                            <v-list-item-title>{{
                              font.name
                            }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-layout>

                    <v-layout mt-1 style="z-index:10000;">
                      <v-btn
                        block
                        @click="deleteTitle(title.id)"
                        dark
                        color="red darken-3"
                        class="mx-2"
                        small
                        ><v-icon small dark>fa fa-trash-alt</v-icon></v-btn
                      >
                    </v-layout>
                  </v-layout>
                </Moveable>
                <Moveable
                  v-for="(image, index) in imageList"
                  :key="image.id"
                  class="moveable"
                  v-bind="moveable"
                  @drag="handleDrag"
                >
                  <span @mousewheel="resizeLogo($event, index)"
                    ><img class="logo" :ref="`image${index}`" :src="image.data"
                  /></span>
                  <v-layout v-if="false">
                    <v-btn
                      block
                      @click="deleteTitle(title.id)"
                      dark
                      color="red darken-3"
                      class="mx-2"
                      small
                      ><v-icon small dark>fa fa-trash-alt</v-icon></v-btn
                    >
                  </v-layout>
                </Moveable>
              </v-layout>
            </v-responsive>
          </v-sheet>
        </div>
      </v-flex>

      <v-flex md2>
        <v-layout column justify-center wrap>
          <v-layout>
            <v-btn dark color="blue darken-3" block @click="addNewTitle"
              >Add New Title <v-icon right>fa fa-plus</v-icon></v-btn
            >
          </v-layout>
          <v-layout my-3>
            <v-file-input
              ref="imageSelect"
              :rules="rules.logo"
              accept="image/png, image/jpeg"
              placeholder="Add New Image"
              @change="addNewImage"
              hidden
            ></v-file-input>
          </v-layout>
          <v-layout mb-4>
            <v-layout column>
              <span class="caption">Color Picker</span>
              <v-color-picker v-model="selectedColor"></v-color-picker>
            </v-layout>
          </v-layout>
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
                    color="blue darken-3"
                    :rules="rules.logo"
                    accept="image/png, image/jpeg"
                    placeholder="Select a Logo"
                    prepend-icon="mdi-camera"
                    label="Logo"
                    @change="selectLogo"
                    v-model="logofile"
                  ></v-file-input>
                  <v-switch
                    v-if="logo != null"
                    v-model="enableWatermark"
                    label="Make the logo as the video watermark"
                    value
                    input-value="true"
                    hide-details
                  ></v-switch>
                </v-form>
              </v-layout>
            </v-layout>
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
    imageList: [],
    fontSizes: ["H1", "H2", "H3", "H4", "H5", "H6"],
    fontFamilies: [
      {
        name: "Roboto",
        font: "'Roboto', sans-serif;"
      },
      {
        name: "Open Sans",
        font: "'Open Sans', sans-serif;"
      },
      {
        name: "Lato",
        font: "'Lato', sans-serif;"
      }
    ],
    logofile: null,
    logo: null,
    enableWatermark: false,
    aspectRatio: null,
    selectedElement: "bg",
    backgroundColor: "white",

    //
    types: ["hex", "hexa", "rgba", "hsla", "hsva"],
    type: "hex",
    hex: "#FFFFFF",
    hexa: "#FF00FFFF",
    rgba: { r: 0, g: 0, b: 0, a: 1 },
    hsla: { h: 300, s: 1, l: 0.5, a: 1 },
    hsva: { h: 300, s: 1, v: 1, a: 1 },
    //
    rules: {
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
  computed: {
    selectedColor: {
      get() {
        return this[this.type];
      },
      set(v) {
        this[this.type] = v;
      }
    }
  },
  methods: {
    ...mapMutations(["setSplashScreenObject", "setWatermark"]),
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
      let id = this.create_UUID();
      let title = {
        id: id,
        text: "Enter your text here",
        size: "H1",
        font: {
          name: "Open Sans",
          font: "'Open Sans', sans-serif;"
        },
        edit: false
      };
      this.titleList.push(title);
    },
    changeTitle(title) {
      if (title.text == null) {
        this.deleteTitle(title.id);
      }
      title.edit = false;
    },
    changeTitleColor(id) {
      this.selectedElement = id;
    },
    changeTitleFont() {},
    deleteTitle(id) {
      this.titleList = this.titleList.filter(title => title.id != id);
    },
    addNewImage(file) {
      if (
        file &&
        file.name &&
        ["jpg", "jpeg", "png"].includes(file.name.split(".")[1])
      ) {
        let img = {
          id: this.create_UUID(),
          data: URL.createObjectURL(file),
          edit: false
        };
        this.imageList.push(img);
      }
    },
    deleteImage(id) {
      this.imageList = this.imageList.filter(image => image.id != id);
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
    resizeLogo(e, id) {
      let element = eval("this.$refs.image" + id);
      if (e.shiftKey && e.wheelDeltaY > 0) {
        element[0].width = element[0].width + 10;
      }
      if (e.shiftKey && e.wheelDeltaY < 0 && element[0].width > 20) {
        element[0].width = element[0].width - 10;
      }
    },
    async canvasToData() {
      const canvas = this.$refs.canvas;
      const options = {
        type: "dataURL"
      };
      this.canvasData = await this.$html2canvas(canvas, options);
    },

    validate() {
      this.canvasToData().then(() => {
        this.setSplashScreenObject({
          data: this.canvasData,
          duration: this.duration
        });
        if (this.enableWatermark) {
          this.setWatermark(this.logo);
        } else {
          this.setWatermark(null);
        }
      });
      return true;
    }
  },
  watch: {
    logofile(value) {
      if (value == null) {
        this.logo = null;
      }
    },
    selectedColor(value) {
      if (this.selectedElement == "bg") {
        this.backgroundColor = value;
      } else {
        for (let i = 0; i < this.titleList.length; i++) {
          if (this.titleList[i].id == this.selectedElement) {
            this.titleList[i].color = value;
          }
        }
      }
    }
  },
  mounted() {
    this.$frame = new Frame();
  }
};
</script>

<style scoped>
.moveable {
  position: relative;
  text-align: center;
  color: black;
  font-size: 40px;
  font-weight: 100;
  letter-spacing: 1px;
}
.fixed {
  position: absolute;
}

.moveable span {
  position: absolute;

  white-space: nowrap;
}
.logo {
  display: block;
  height: auto;
}
</style>
