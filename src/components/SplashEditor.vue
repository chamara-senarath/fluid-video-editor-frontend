<template>
  <v-container>
    <TemplateBuilder
      @setTemplate="setTemplate"
      :chooseTemplate="chooseTemplate"
    ></TemplateBuilder>
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
                  :style="`${title.align.style}`"
                  v-for="(title, titleIndex) in titleList"
                  :key="title.id"
                  :class="title.edit ? 'fixed' : 'moveable'"
                  v-bind="moveable"
                  @drag="handleDrag"
                >
                  <span
                    @dblclick="title.edit = true"
                    @click="changeTitleColor(title.id)"
                    :class="convertSize(title.size)"
                    :style="`color:${title.color};`"
                    ><span
                      :ref="`title${titleIndex}`"
                      :style="
                        `outline-style: ${
                          selectedElement == title.id && title.text
                            ? 'dotted'
                            : 'none'
                        };outline-color:red;`
                      "
                      :class="`font${title.font.id}`"
                      >{{ title.text }}</span
                    ></span
                  >

                  <v-layout
                    mt-3
                    column
                    v-show="title.edit"
                    @mouseleave="hideEdit(title)"
                    @mouseover="disableTimer"
                  >
                    <v-layout style="z-index:2147483638;">
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

                    <v-layout style="z-index:2147483638;">
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
                            :style="
                              title.size == item
                                ? 'background-color:rgba(13, 71, 161,0.8)'
                                : ''
                            "
                          >
                            <v-list-item-title>{{ item }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-layout>

                    <v-layout mt-1 style="z-index:2147483638;">
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
                            :style="
                              title.font == font
                                ? 'background-color:rgba(13, 71, 161,0.8)'
                                : ''
                            "
                          >
                            <v-list-item-title>{{
                              font.name
                            }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-layout>

                    <v-layout mt-1 style="z-index:2147483638;">
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
                            <v-icon left
                              >fa fa-align-{{ title.align.value }}</v-icon
                            >{{ title.align.value }}</v-btn
                          >
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(item, index) in alignments"
                            :key="index"
                            @click="setTextAlignment(titleIndex, item, null)"
                            :style="
                              title.align.value == item
                                ? 'background-color:rgba(13, 71, 161,0.8)'
                                : ''
                            "
                          >
                            <v-list-item-title>{{ item }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-layout>

                    <v-layout mt-1 style="z-index:2147483638;">
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
                  <span
                    @dblclick="image.edit = true"
                    @click="image.edit = false"
                    @mousewheel="resizeLogo($event, index)"
                    ><img class="logo" :ref="`image${index}`" :src="image.data"
                  /></span>
                  <v-layout v-if="image.edit == true">
                    <v-btn
                      fab
                      @click="deleteImage(image.id)"
                      dark
                      color="red darken-3"
                      class="mx-2"
                      small
                      ><v-icon small dark>fa fa-trash-alt</v-icon></v-btn
                    >
                  </v-layout>
                </Moveable>
                <Moveable
                  v-if="logo.file"
                  class="moveable"
                  :style="
                    `position: absolute;top: 8px;right: ${logo.width + 10}px;`
                  "
                  v-bind="moveable"
                  @drag="handleDrag"
                >
                  <span @mousewheel="resizeWatermark"
                    ><img
                      ref="watermark"
                      :width="`${logo.width}`"
                      :style="`opacity:${logo.opacity / 100}`"
                      class="logo"
                      :src="logo.file"
                  /></span>
                </Moveable>
              </v-layout>
            </v-responsive>
          </v-sheet>
        </div>
      </v-flex>

      <v-flex md2>
        <v-layout column justify-center wrap>
          <v-layout row justify-start>
            <v-flex xs2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    depressed
                    small
                    fab
                    dark
                    color="blue darken-3"
                    @click="addNewTitle"
                    ><v-icon small>fa fa-heading</v-icon></v-btn
                  >
                </template>
                <span>Add new title</span>
              </v-tooltip>
            </v-flex>

            <v-flex xs2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <input
                    type="file"
                    ref="file"
                    accept=".png,.jpg,.jpeg/image"
                    style="display: none"
                    @change="addNewImage"
                  />
                  <v-btn
                    v-on="on"
                    small
                    depressed
                    fab
                    dark
                    color="blue darken-3"
                    @click="$refs.file.click()"
                    ><v-icon small>fa fa-image</v-icon></v-btn
                  >
                </template>
                <span>Add new image</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs2>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    depressed
                    small
                    fab
                    dark
                    color="blue darken-3"
                    @click="chooseTemplate = true"
                    ><v-icon small>fa fa-film</v-icon></v-btn
                  >
                </template>
                <span>Choose a Template</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout mt-4>
            <v-file-input
              ref="logoSelect"
              clearable
              color="blue darken-3"
              :rules="rules.logo"
              accept="image/png, image/jpeg"
              placeholder="Select a Watermark"
              prepend-icon="mdi-camera"
              label="Watermark (Optional)"
              @change="selectLogo"
              v-model="logofile"
            ></v-file-input>
          </v-layout>
          <v-layout>
            <v-slider
              v-if="this.logo.file != null"
              v-model="logo.opacity"
              prepend-icon="fa fa-adjust"
            ></v-slider>
          </v-layout>
          <v-layout>
            <v-text-field
              label="Duration"
              suffix="seconds"
              v-model="duration"
              type="number"
              min="1"
            ></v-text-field>
          </v-layout>
          <v-layout row justify-center>
            <v-chip label class="mt-1" color="indigo" text-color="white">
              <v-avatar left>
                <v-icon small>fa fa-pencil-alt</v-icon>
              </v-avatar>
              <span
                style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
              >
                Selected Element :
                {{ selectedElementText | truncate(20, "...") }}
              </span>
            </v-chip>
          </v-layout>
          <v-layout mt-3>
            <v-layout column>
              <span class="caption">Color Picker</span>
              <v-color-picker
                hide-mode-switch
                hide-inputs
                v-model="selectedColor"
              ></v-color-picker>
            </v-layout>
          </v-layout>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import Moveable from "vue-moveable";
import TemplateBuilder from "@/components/TemplateBuilder";
import { Frame } from "scenejs";
import { mapMutations,mapGetters } from "vuex";
export default {
  components: {
    Moveable,
    TemplateBuilder
  },
  data: () => ({
    timer: null,
    chooseTemplate: false,
    fontSize: "display-2",
    fontFamiy: "font2",
    text: null,
    titleList: [],
    imageList: [],
    alignments: ["left", "center", "right"],
    fontSizes: ["H1", "H2", "H3", "H4", "H5", "H6"],
    fontFamilies: [
      {
        id: 1,
        name: "Lato"
      },
      {
        id: 2,
        name: "Lora"
      },
      {
        id: 3,
        name: "Montserrat Alternates"
      },
      {
        id: 4,
        name: "Oswald"
      },
      {
        id: 5,
        name: "Open Sans"
      },
      {
        id: 6,
        name: "PT Sans"
      },
      {
        id: 7,
        name: "Raleway"
      },
      {
        id: 8,
        name: "Slabo 27px"
      }
    ],
    imageFile: null,
    logofile: null,
    logo: {
      file: null,
      opacity: 100,
      width: 100,
      widthRatio: 1,
      position: null
    },
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
    },
    selectedElementText() {
      let text = "None";
      if (this.selectedElement == "bg") {
        text = "Background";
      } else {
        let el = this.titleList.filter(
          title => title.id == this.selectedElement
        );
        if (el[0] != null) {
          text = el[0].text;
        }
      }
      return text;
    }
  },
  methods: {
    ...mapMutations(["setSplashScreenObject", "setWatermark"]),
    ...mapGetters(['getSplashScreenObject']),
    create_UUID() {
      var dt = new Date().getTime();
      var uuid = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
      return uuid;
    },
    setTemplate(template) {
      if (template == null) {
        this.chooseTemplate = false;
        return;
      }
      this.titleList = [];
      template.forEach(text => {
        let id = this.create_UUID();
        let title = {
          id: id,
          text: text.text,
          size: text.size,
          font: text.font,
          align: {
            value: null,
            style: null
          },
          edit: false
        };
        this.titleList.push(title);
      });
      for (let i = 0; i < template.length; i++) {
        this.$nextTick(() => {
          this.setTextAlignment(
            i,
            template[i].position.x,
            template[i].position.y
          );
        });
      }
      this.chooseTemplate = false;
    },
    handleDrag({ target, left, top }) {
      this.$frame.set("left", `${left}px`);
      this.$frame.set("top", `${top}px`);
      this.setTransform(target);
    },
    setTransform(target) {
      target.style.cssText = this.$frame.toCSS();
    },
    convertSize(size) {
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
          id: 1,
          name: "Open Sans"
        },
        align: {
          value: "left",
          style: null
        },
        edit: false
      };
      this.titleList.push(title);
    },
    hideEdit(title) {
      this.timer = setTimeout(() => {
        title.edit = false;
      }, 300);
    },
    disableTimer() {
      clearInterval(this.timer);
    },
    setTextAlignment(index, alignX, alignY) {
      let textItem = this.titleList[index];
      let el = eval("this.$refs.title" + index + "[0]");
      let elWidth = el.getBoundingClientRect().width;
      let elHeight = el.getBoundingClientRect().height;
      let canvasWidth = this.$refs.canvas.getBoundingClientRect().width;
      let canvasHeight = this.$refs.canvas.getBoundingClientRect().height;

      if (alignX == "left") {
        textItem.align.value = "left";
        textItem.align.style = "left:0px;";
      }
      if (alignX == "right") {
        let right = canvasWidth - elWidth;
        textItem.align.value = "right";
        textItem.align.style = "left:" + right + "px;";
      }
      if (alignX == "center") {
        let center = canvasWidth / 2 - elWidth / 2;
        textItem.align.value = "center";
        textItem.align.style = "left:" + center + "px;";
      }
      if (alignY == "top") {
        textItem.align.style = textItem.align.style + "top:0px;";
      }
      if (alignY == "bottom") {
        let bottom = canvasHeight - elHeight;
        textItem.align.style = textItem.align.style + "top:" + bottom + "px;";
      }
      if (alignY == "center") {
        let bottom = (canvasHeight - elHeight) / 2;
        textItem.align.style = textItem.align.style + "top:" + bottom + "px;";
      }
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
    deleteTitle(id) {
      this.titleList = this.titleList.filter(title => title.id != id);
    },
    addNewImage(event) {
      let file = event.srcElement.files[0];
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
        this.$refs.file.value = "";
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
        this.logo.file = URL.createObjectURL(file);
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
    resizeWatermark(e) {
      //TODO change the logic
      if (e.shiftKey && e.wheelDeltaY > 0) {
        this.$refs.watermark.width = this.$refs.watermark.width + 10;
      }
      if (e.shiftKey && e.wheelDeltaY < 0) {
        this.$refs.watermark.width = this.$refs.watermark.width - 10;
      }
    },
    genarateRatio() {
      let canvasWidth = this.$refs.canvas.getBoundingClientRect().width;
      let canvasHeight = this.$refs.canvas.getBoundingClientRect().height;

      let objWidth = this.$refs.watermark.getBoundingClientRect().width;
      let objLeft =
        this.$refs.watermark.getBoundingClientRect().left -
        this.$refs.canvas.getBoundingClientRect().left;
      let objTop =
        this.$refs.watermark.getBoundingClientRect().top -
        this.$refs.canvas.getBoundingClientRect().top;

      let leftRatio = objLeft / canvasWidth;
      let topRatio = objTop / canvasHeight;
      let widthRatio = objWidth / canvasWidth;
      let position = {
        leftRatio: leftRatio,
        topRatio: topRatio
      };
      return {
        position: position,
        widthRatio: widthRatio
      };
    },
    async canvasToData() {
      const canvas = this.$refs.canvas;
      const options = {
        type: "dataURL"
      };
      this.canvasData = await this.$html2canvas(canvas, options);
    },

    validate() {
      this.selectedElement = null;
      let watermarkPosition = null;
      let watermarkWidthRatio = null;
      if (this.logo.file) {
        watermarkPosition = this.genarateRatio().position;
        watermarkWidthRatio = this.genarateRatio().widthRatio;
      }
      this.canvasToData().then(() => {
        this.setSplashScreenObject({
          data: this.canvasData,
          duration: this.duration
        });
        if ( this.logo.file) {
          let logo = {
            ...this.logo,
            position: watermarkPosition,
            widthRatio: watermarkWidthRatio
          };
          this.setWatermark(logo);
        } else {
          this.setWatermark(null);
        }
      });
      return true;
    }
  },

  watch: {
    imageList(val) {
      console.log(val);
    },
    logofile(value) {
      if (value == null) {
        this.logo.file = null;
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
    if(this.getSplashScreenObject().duration!=null){
      this.duration = this.getSplashScreenObject().duration
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Lato|Lora|Montserrat+Alternates|Open+Sans|Oswald|PT+Sans|Raleway|Slabo+27px&display=swap");

.font1 {
  font-family: "Lato", sans-serif;
}
.font2 {
  font-family: "Lora", serif;
}
.font3 {
  font-family: "Montserrat Alternates", sans-serif;
}
.font4 {
  font-family: "Oswald", sans-serif;
}
.font5 {
  font-family: "Open Sans", sans-serif;
}
.font6 {
  font-family: "PT Sans", sans-serif;
}
.font7 {
  font-family: "Raleway", sans-serif;
}
.font8 {
  font-family: "Slabo 27px", serif;
}

.moveable {
  position: relative;
  color: black;
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
