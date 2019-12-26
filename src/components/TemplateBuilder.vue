<template>
  <v-row justify="center">
    <v-layout
      v-if="templates.length == 0 || templates == null"
      column
      align-center
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
      <span>Loading...</span>
    </v-layout>
    <v-dialog :value="chooseTemplate" persistent max-width="60vw">
      <v-card>
        <v-card-title
          class="headline blue-grey darken-3
 white--text"
          style="position: -webkit-sticky;
  position: sticky;
  top: 0;z-index:1000"
        >
          <v-layout row>
            <v-flex>
              Choose a Template
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
                      >Choose</v-btn
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
          <v-layout row>
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
          src: "/template1.png"
        },
        {
          name: "Template 4",
          src: "/template1.png"
        }
      ]
    };
  },
  methods: {
    close() {
      this.selectedTemplate = this.currentTemplate;
      this.$emit("setTemplate", null);
    },
    buildTemplate() {
      let template = null;
      this.currentTemplate = this.selectedTemplate;
      if (this.selectedTemplate == 0) {
        let text1 = {
          text: "Your title here",
          position: {
            x: "center",
            y: "top"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H1"
        };
        let text2 = {
          text: "Your footer here",
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
          text: "Your title here",
          position: {
            x: "center",
            y: "top"
          },
          font: {
            id: 1,
            name: "Open Sans"
          },
          size: "H1"
        };
        let text2 = {
          text: "Your middle text here",
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
          text: "Your footer here",
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
      this.$emit("setTemplate", template);
    }
  }
};
</script>
