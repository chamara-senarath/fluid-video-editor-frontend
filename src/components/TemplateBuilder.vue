<template>
  <v-row justify="center">
    <v-dialog :value="chooseTemplate" persistent max-width="60vw">
      <v-card>
        <v-card-title
          class="headline blue-grey darken-3
 white--text"
          style="position: -webkit-sticky;
  position: sticky;
  top: 0;z-index:1000"
        >
          <v-layout row wrap>
            <v-flex>
              {{ $t("Choose a Template") }}
            </v-flex>
            <v-flex>
              <v-layout column align-end>
                <v-row>
                  <v-flex>
                    <v-btn
                      :disabled="selectedTemplate == null"
                      :dark="selectedTemplate != null"
                      small
                      color="green darken-1"
                      @click="buildTemplate"
                      >{{ $t("Choose") }}</v-btn
                    >
                  </v-flex>
                  <v-flex mx-3>
                    <v-icon @click="close" color="red"
                      >fa fa-times-circle</v-icon
                    >
                  </v-flex>
                </v-row>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex
              xs12
              md6
              pa-2
              v-for="(template, index) in templates"
              :key="index"
            >
              <v-card elevation="6" @click="selectedTemplate = index">
                <v-card-title>
                  <v-layout row justify-center>
                    <div class="title">{{ template.name }}</div>
                    <v-icon
                      v-if="selectedTemplate == index ? true : false"
                      color="green"
                      right
                      small
                      >fa fa-check-circle</v-icon
                    >
                  </v-layout>
                </v-card-title>
                <v-card-text>
                  <v-img :src="template.src"></v-img>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["chooseTemplate"],
  data() {
    return {
      selectedTemplate: null,
      currentTemplate: 1,
      templates: [
        {
          name: "Template 1",
          src: "/template1.png"
        },
        {
          name: "Template 2",
          src: "/template2.png"
        },
        {
          name: "Template 3",
          src: "/template3.png"
        },
        {
          name: "Template 4",
          src: "/template4.png"
        }
      ]
    };
  },
  methods: {
    ...mapGetters(["getVideoObject"]),
    close() {
      this.selectedTemplate = this.currentTemplate;
      this.$emit("setTemplate", null);
    },
    buildTemplate() {
      let template = null;
      this.currentTemplate = this.selectedTemplate;
      if (this.selectedTemplate == 0) {
        let text1 = {
          text: this.getVideoObject().title,
          position: {
            x: "center",
            y: "top"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H4"
        };
        let text2 = {
          text: this.getVideoObject().authors.join(" , "),
          position: {
            x: "center",
            y: "bottom"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H6"
        };

        template = [text1, text2];
      }

      if (this.selectedTemplate == 1) {
        let text1 = {
          text: this.getVideoObject().title,
          position: {
            x: "center",
            y: "top"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H3"
        };
        let text2 = {
          text: this.getVideoObject().tags.toString(),
          position: {
            x: "center",
            y: "center"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H4"
        };
        let text3 = {
          text: this.getVideoObject().authors.toString(),
          position: {
            x: "center",
            y: "bottom"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H6"
        };

        template = [text1, text2, text3];
      }
      if (this.selectedTemplate == 2) {
        let text1 = {
          text: this.getVideoObject().title,
          position: {
            x: "center",
            y: "center-50"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H3"
        };
        let text2 = {
          text: this.getVideoObject().authors.toString(),
          position: {
            x: "center",
            y: "bottom"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H4"
        };
        let text3 = {
          text: this.getVideoObject().tags.toString(),
          position: {
            x: "center",
            y: "center"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H6"
        };

        template = [text1, text2, text3];
      }
      if (this.selectedTemplate == 3) {
        let text1 = {
          text: this.getVideoObject().title,
          position: {
            x: "center",
            y: "center-50"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H3"
        };
        let text2 = {
          text: this.getVideoObject().authors.toString(),
          position: {
            x: "center",
            y: "center50"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H4"
        };
        let text3 = {
          text: this.getVideoObject().tags.toString(),
          position: {
            x: "center",
            y: "center"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H6"
        };

        template = [text1, text2, text3];
      }
      this.$emit("setTemplate", template);
    }
  }
};
</script>
