<template>
  <v-container>
    <AreYouSure
      :showConfirmation="showConfirmation"
      :options="confirmationMessage"
      @userAnswer="userAnswer"
    ></AreYouSure>
    <v-layout column align-center>
      <v-snackbar color="blue darken-3" top v-model="snackbar">
        <v-icon color="white">fa fa-check</v-icon>
        {{ snackbarMessage }}
        <v-btn color="yellow darken-3" text @click="snackbar = false"
          >Close</v-btn
        >
      </v-snackbar>
      <v-flex>
        <v-img src="uploadFile.png" width="200"></v-img>
      </v-flex>
    </v-layout>
    <v-overlay :value="overlay">
      <v-layout column align-center>
        <v-card>
          <v-img src="/uploading.gif"></v-img>

          <v-card-text
            ><v-layout column align-center>Uploading...</v-layout></v-card-text
          >
        </v-card>
      </v-layout>
    </v-overlay>
    <v-form ref="form">
      <v-alert v-if="feedback" type="error">{{ feedback }}</v-alert>
      <v-file-input
        v-if="getVideoObject().file == null"
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

      <v-autocomplete
        prepend-icon="fa fa-feather-alt"
        v-model="authors"
        :items="people"
        chips
        color="blue-grey lighten-2"
        label="Author"
        item-text="name"
        item-value="name"
        :rules="rules.author"
        multiple
      >
        <template v-slot:selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            close
            @click="data.select"
            @click:close="remove(authors, data.item)"
          >
            <v-avatar left>
              <v-img :src="data.item.avatar"></v-img>
            </v-avatar>
            {{ data.item.name }}
          </v-chip>
        </template>
        <template v-slot:item="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-item-content v-text="data.item"></v-list-item-content>
          </template>
          <template v-else>
            <v-list-item-avatar>
              <img :src="data.item.avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="data.item.name"></v-list-item-title>
              <v-list-item-subtitle
                v-html="data.item.team"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>

      <v-combobox
        prepend-icon="fa fa-tag"
        v-model="tags"
        :items="tagList"
        label="Tags"
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
          :class="getVideoObject().file != null ? 'success' : 'primary'"
          block
          >{{ getVideoObject().file != null ? "Edit" : "Upload"
          }}<v-icon small right>{{
            getVideoObject().file != null ? "fa fa-edit" : "fa fa-upload"
          }}</v-icon></v-btn
        >
      </v-flex>
      <v-flex mt-2 v-if="getVideoObject().file != null">
        <v-btn @click="uploadNew" block class="primary"
          >Upload New<v-icon small right>fa fa-upload</v-icon></v-btn
        >
      </v-flex>
    </v-form>
  </v-container>
</template>

<script>
import AreYouSure from "@/components/AreYouSure";
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";

export default {
  components: {
    AreYouSure
  },
  data() {
    const srcs = {
      1: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
      2: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
      3: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
      4: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
      5: "https://cdn.vuetifyjs.com/images/lists/5.jpg"
    };
    return {
      showConfirmation: false,
      confirmationMessage: {
        title: "leave this page",
        content:
          "If you go back, your saved sates will be deleted. Are you sure you want to leave this page?",
        yes: "Yes, I am sure",
        no: "No, Keep me here"
      },
      autoUpdate: true,
      authors: [],
      tags: [],
      tagList: ["C#", "Java", "Python"],
      people: [
        { header: "DIPS" },
        { name: "Janaka Peiris", team: "DIPS", avatar: srcs[1] },
        { name: "Kugathasan Shanjeeva", team: "DIPS", avatar: srcs[2] },
        { name: "Lahiru Amarathunga", team: "DIPS", avatar: srcs[2] },
        { name: "Anushka Eranga", team: "DIPS", avatar: srcs[2] },
        { name: "Sajini Danusha", team: "DIPS", avatar: srcs[3] },
        { name: "Madhavi Liyanapathirana", team: "DIPS", avatar: srcs[4] },
        { divider: true },
        { header: "Layup" },
        { name: "Dino Corera", team: "Layup", avatar: srcs[1] },
        { name: "Jane Smith ", team: "Layup", avatar: srcs[5] },
        { name: "Sandra Williams", team: "Layup", avatar: srcs[3] }
      ],
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
        author: [
          () => this.authors.length > 0 || "Author Name can not be empty"
        ],
        tags: [() => this.tags.length > 0 || "Tags can not be empty"],
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
    ...mapGetters(["getVideoObject", "getChapterMarks"]),
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
          tags: this.tags
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
    },
    uploadNew() {
      this.showConfirmation = true;
    },
    async userAnswer(val) {
      this.showConfirmation = false;
      if (val == "yes") {
        if (
          this.getChapterMarks() == null ||
          this.getChapterMarks().length == 0
        ) {
          try {
            await axios.delete(
              this.API_URL + "/api/video/file?id=" + this.getVideoObject().id
            );
          } catch (error) {
            this.feedback = error;
          }
        }
        this.$router.go();
      }
    }
  },
  mounted() {
    if (!this.$route.params.is_edit) {
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
