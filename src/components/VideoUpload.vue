<template>
  <v-container>
    <v-layout column align-center>
      <v-snackbar color="blue darken-3" top v-model="snackbar">
        <v-icon color="white">fa fa-check</v-icon>
        {{ snackbarMessage }}
        <v-btn color="yellow darken-3" text @click="snackbar = false"
          >Close</v-btn
        >
      </v-snackbar>
      <v-flex>
        <v-img src="uploadFile.png" width="300"></v-img>
      </v-flex>
    </v-layout>
    <v-overlay :value="overlay">
      <v-layout column align-center>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <span>Uploading...</span>
      </v-layout>
    </v-overlay>
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
import axios from "axios";

export default {
  data() {
    return {
      snackbarMessage: null,
      snackbar: false,
      feedback: null,
      overlay: false,
      video: {
        title: null,
        file: null
      },
      uploaded: false,
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
            value.size < 2000000 * 512 || //2MB * 512
            "Video size should be less than 1 GB!"
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
        this.video.title = file.name.split(".")[0];
        this.video.file = file;
      }
    },
    async clickUpload() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        this.overlay = true;
        this.uploaded = false;
        let res = await axios.post("http://10.16.1.77/api/video", {
          title: this.video.title
        });

        const formData = new FormData();
        formData.append("videoFile", this.video.file);
        await axios.post("http://10.16.1.77/api/video/file", formData, {
          params: {
            id: res.data.id
          }
        });

        let videoURL = "http://10.16.1.77/api/video/file?id=" + res.data.id;

        let video = {
          id: res.data.id,
          title: res.data.title,
          file: videoURL
        };
        this.setVideoObject(video);
        this.overlay = false;
        this.uploaded = true;
        this.snackbarMessage = "Video Uploaded Successfully";
        this.snackbar = true;
        this.$emit("uploaded", true);
      } catch (error) {
        console.log(error);
        this.feedback = error;
        this.overlay = false;
        this.uploaded = false;
      }
    },
    validate() {
      if (!this.uploaded) {
        this.snackbarMessage = "Please Upload a video to continue";
        return;
      }
      return true; //TODO implement validation
    }
  }
};
</script>
