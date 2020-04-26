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
        <v-img src="uploadFile.gif" width="26vw"></v-img>
      </v-flex>
    </v-layout>
    <v-overlay :value="overlay">
      <v-layout column align-center>
        <v-card>
          <v-col class="subtitle-1 text-center" cols="12">
            {{ $t("Uploading your files") }}
          </v-col>
          <v-col cols="12">
            <v-progress-linear
              color="green accent-4"
              indeterminate
              rounded
              height="12"
            ></v-progress-linear>
          </v-col>

          <v-card-text
            ><v-layout column align-center
              >{{ $t("Uploading") }}...</v-layout
            ></v-card-text
          >
        </v-card>
      </v-layout>
    </v-overlay>
    <v-form ref="form">
      <v-alert v-if="feedback" type="error">{{ feedback }}</v-alert>
      <v-file-input
        v-if="!$route.params.is_edit"
        ref="videoSelect"
        clearable
        color="blue darken-3"
        :rules="rules.videoData"
        accept="video/mp4, video/avi"
        :placeholder="$t('Select a Video')"
        prepend-icon="fa fa-video"
        :label="$t('Upload Video')"
        @change="uploadVideo"
      ></v-file-input>
      <v-text-field
        color="blue darken-3"
        prepend-icon="fa fa-edit"
        :label="$t('Video Title')"
        v-model="video.title"
        :rules="rules.videoTitle"
      ></v-text-field>

      <v-combobox
        v-model="authors"
        prepend-icon="fa fa-feather-alt"
        :label="$t('Author')"
        multiple
        persistent-hint
        chips
        :rules="rules.author"
      ></v-combobox>

      <v-combobox
        prepend-icon="fa fa-tag"
        :hide-selected="true"
        v-model="tags"
        :items="tagList"
        :label="$t('Tag')"
        multiple
        chips
        :rules="rules.tags"
      >
        <template v-slot:selection="data">
          <v-chip
            :key="JSON.stringify(data.item)"
            v-bind="data.attrs"
            :input-value="data.selected"
            close
            @click="data.select"
            @click:close="data.parent.selectItem(data.item)"
          >
            <v-avatar
              class="accent white--text"
              left
              v-text="data.item.slice(0, 1).toUpperCase()"
            ></v-avatar>
            {{ data.item | upperFirst }}
          </v-chip>
        </template>
      </v-combobox>

      <v-flex>
        <v-btn
          @click="clickUpload"
          :class="this.$route.params.is_edit ? 'success' : 'primary'"
          block
          >{{ $t(this.$route.params.is_edit ? "Edit" : "Upload")
          }}<v-icon small right>{{
            this.$route.params.is_edit ? "fa fa-edit" : "fa fa-upload"
          }}</v-icon></v-btn
        >
      </v-flex>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      autoUpdate: true,
      authors: [],
      tags: [],
      tagList: ["C#", "Java", "Python"],
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
          value =>
            (value && value.length > 0) ||
            this.$t("Video Title can not be empty")
        ],
        author: [
          () =>
            this.authors.length > 0 || this.$t("Author Name can not be empty")
        ],
        tags: [() => this.tags.length > 0 || this.$t("Tags can not be empty")],
        videoData: [
          value => {
            if (value && value.name) {
              return (
                ["mp4", "webm"].includes(value.name.split(".").reverse()[0]) ||
                this.$t("Invalid File Type")
              );
            }
            return false;
          },
          value =>
            !value ||
            value.size < 2000000 * 512 || //2MB * 512
            this.$t("Video size should be less than 1 GB!")
        ]
      }
    };
  },
  methods: {
    ...mapMutations([
      "setVideoObject",
      "setSplashScreenObject",
      "setVideoDefault"
    ]),
    ...mapGetters(["getVideoObject", "getChapterMarks", "getProfile"]),
    uploadVideo(file) {
      if (
        file &&
        file.name &&
        ["mp4", "webm"].includes(file.name.split(".").reverse()[0])
      ) {
        let fileName = file.name.split(".");
        fileName.pop();
        this.video.title = fileName.join("");
        this.video.file = file;
      }
    },
    async clickUpload() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (this.getVideoObject().file != null) {
        let video = {
          ...this.getVideoObject(),
          title: this.video.title,
          authors: this.authors,
          tags: this.tags
        };
        this.setVideoObject(video);
        this.$emit("uploaded", true);
        return;
      }

      try {
        this.overlay = true;
        this.uploaded = false;
        let res = await axios.post(this.API_URL + "/api/video", {
          title: this.video.title,
          authors: this.authors,
          tags: this.tags,
          group: this.getProfile().group
        });

        const formData = new FormData();
        formData.append("videoFile", this.video.file);
        await axios.post(this.API_URL + "/api/video/file", formData, {
          params: {
            id: res.data.id
          }
        });

        let videoURL = this.API_URL + "/api/video/file?id=" + res.data.id;

        let video = {
          id: res.data.id,
          title: res.data.title,
          file: videoURL,
          authors: res.data.authors,
          tags: res.data.tags
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
    },
    remove(arr, item) {
      const index = arr.indexOf(item.name);
      if (index >= 0) arr.splice(index, 1);
    }
  },
  mounted() {
    if (!this.$route.params.is_edit) {
      this.setVideoDefault();

      return;
    }
    if (this.getVideoObject != null) {
      this.video.title = this.getVideoObject().title;
      if (this.getVideoObject().authors.length != 0) {
        this.authors = this.getVideoObject().authors;
      }
      if (this.getVideoObject().tags.length != 0) {
        this.tags = this.getVideoObject().tags;
      }
    }
  }
};
</script>
