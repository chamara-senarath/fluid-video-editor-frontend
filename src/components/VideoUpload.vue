<template>
  <v-container>
    <v-layout column align-center>
      <v-flex>
        <v-img src="uploadFile.png" width="300"></v-img>
      </v-flex>
    </v-layout>

    <v-form ref="form">
      <v-alert v-if="feedback" type="error">{{ feedback }}</v-alert>
      <v-file-input
        ref="videoSelect"
        clearable
        color="blue darken-3"
        :rules="rules.videoData"
        accept="video/mp4, video/avi"
        placeholder="Select a Video"
        prepend-icon="fa fa-video"
        label="Upload Video"
        @change="uploadVideo"
      ></v-file-input>
      <v-text-field
        color="blue darken-3"
        prepend-icon="fa fa-edit"
        label="Video Title"
        v-model="video.title"
        :rules="rules.videoTitle"
      ></v-text-field>

      <v-btn @click="clickUpload" class="primary" block
        >Upload<v-icon small right>fa fa-upload</v-icon></v-btn
      >
    </v-form>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      snackbarMessage: null,
      snackbar: false,
      feedback: null,
      video: {
        title: null,
        file:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
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
    ...mapMutations(["setVideoObject"]),
    uploadVideo(file) {
      if (
        file &&
        file.name &&
        ["mp4", "avi"].includes(file.name.split(".")[1])
      ) {
        this.video.file = file;
      }
    },
    clickUpload() {
      if (!this.$refs.form.validate()) {
        return;
      }
    },
    validate() {
      this.setVideoObject(this.video);
      return true; //TODO implement validation
    }
  }
};
</script>
