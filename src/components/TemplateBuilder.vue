<template>
  <v-row justify="center">
    <v-dialog :value="chooseTemplate" persistent max-width="60vw">
      <v-card>
        <v-card-title class="headline">
          <v-layout row>
            <v-flex>
              Choose a Template
            </v-flex>
            <v-flex>
              <v-layout column align-end>
                <v-btn
                  :disabled="selectedTemplate == null"
                  :dark="selectedTemplate != null"
                  small
                  color="green darken-1"
                  @click="buildTemplate"
                  >Choose</v-btn
                >
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
                  <v-img height="40vh" :src="template.src"></v-img>
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
      templates: [
        {
          name: "Template 1",
          src: "https://picsum.photos/id/179/800/800"
        },
        {
          name: "Template 1",
          src: "https://picsum.photos/id/179/800/800"
        },
        {
          name: "Template 1",
          src: "https://picsum.photos/id/179/800/800"
        },
        {
          name: "Template 1",
          src: "https://picsum.photos/id/179/800/800"
        }
      ]
    };
  },
  methods: {
    buildTemplate() {
      this.$emit("setTemplate");
    }
  }
};
</script>
