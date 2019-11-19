<template>
  <v-container fluid>
    <v-snackbar color="blue darken-3" top v-model="snackbar">
      <v-icon color="white">fa fa-check</v-icon>
      {{ snackbarMessage }}
      <v-btn color="yellow darken-3" text @click="snackbar = false"
        >Close</v-btn
      >
    </v-snackbar>
    <v-card class="mb-12" outlined height="400px">
      <v-card-title>
        <v-layout align-center justify-center>
          <v-form ref="form">
            <v-alert v-if="feedback" type="error">{{ feedback }}</v-alert>
            <v-text-field
              color="green darken-3"
              prepend-icon="fa fa-edit"
              label="Video Title"
              v-model="video.title"
              :rules="rules.videoTitle"
            ></v-text-field>
            <v-file-input
              ref="videoSelect"
              clearable
              color="green darken-3"
              :rules="rules.videoData"
              accept="video/mp4, video/avi"
              placeholder="Select a Video"
              prepend-icon="fa fa-video"
              label="Upload Video"
              @change="uploadVideo"
            ></v-file-input>
            <v-btn @click="clickUpload" class="primary" block
              >Upload<v-icon small right>fa fa-upload</v-icon></v-btn
            >
          </v-form>
        </v-layout>
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      snackbarMessage: null,
      snackbar: false,
      feedback: null,
      video: {
        title: null,
        data: null
      },
      rules: {
        videoTitle: [
          value => (value && value.length > 0) || "Video Title can not be empty"
        ],
        videoData: [
          value => {
            if (value && value.name) {
              return (
                ["mp4", "avi"].includes(value.name.split(".")[1]) ||
                "Invalid File Type"
              );
            }
            return false;
          },
          value =>
            !value ||
            value.size < 2000000 * 100 || //2MB * 100
            "Video size should be less than 200 MB!"
        ]
      }
    };
  },
  methods: {
    uploadVideo(file) {
      if (
        file &&
        file.name &&
        ["mp4", "avi"].includes(file.name.split(".")[1])
      ) {
        this.video.data = file;
      }
    },
    clickUpload() {
      if (!this.$refs.form.validate()) {
        return;
      }
    },
    validate() {
      return true; //TODO implement validation
    }
  }
};
</script>
