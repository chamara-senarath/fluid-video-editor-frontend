<template>
  <v-responsive aspect-ratio="16/9">
    <v-overlay :value="is_loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Player
      v-if="this.src != null && !is_loading"
      :title="title"
      :src="src"
      :thumbnail="thumbnail"
      :splashDuration="splashDuration"
      :watermark="watermark"
      :chapterList="chapterList"
      :questionList="this.questionList"
      :user="{
        name: 'Chamara Senarath',
        avatar:
          'https://icon-library.net/images/avatar-icon-png/avatar-icon-png-8.jpg'
      }"
    ></Player>
  </v-responsive>
</template>

<script>
import axios from "axios";

import { mapGetters } from "vuex";

import Player from "@/components/Player";
export default {
  components: {
    Player
  },
  data() {
    return {
      is_loading: false,
      uid: null,
      vid: null,
      timer: "",
      title: "",
      src: null,
      thumbnail: null,
      splashDuration: null,
      watermark: null,
      chapterList: [],
      questionList: []
    };
  },
  methods: {
    ...mapGetters([
      "getChapterMarks",
      "getSplashScreenObject",
      "getVideoObject",
      "getQuestionMarks"
    ]),
    async saveLog() {
      let obj = {
        uid: this.uid,
        vid: this.vid,
        questions: this.questionList,
        checkpoints: []
      };
      if (obj.questions && obj.questions.length != 0) {
        await axios.post(this.API_URL + "/api/insight/user", obj);
      }
    }
  },

  async mounted() {
    this.is_loading = true;
    this.vid = this.$route.query.vid;
    this.uid = "5dfb38e7f77174033c7b032b"; //this.$route.query.uid;
    let video = await axios.get(this.API_URL + "/api/video?id=" + this.vid);
    this.title = video.data.title;
    this.chapterList = video.data.chapterMarks;
    let qlist = await axios.get(
      this.API_URL + "/api/insight/user?uid=" + this.uid + "&vid=" + this.vid
    );

    this.questionList = qlist.data;
    this.watermark = video.data.watermark;
    this.splashDuration = video.data.splashDuration;
    this.src = this.API_URL + "/api/video/file?id=" + this.vid;
    this.thumbnail = this.API_URL + "/api/video/splash?id=" + this.vid;

    let result = await axios.get(
      this.API_URL + "/api/video/watermark?id=" + this.vid
    );

    if (result) {
      this.watermark.file =
        this.API_URL + "/api/video/watermark?id=" + this.vid;
    }

    // post video insight to increment view count
    await axios.post(this.API_URL + "/api/insight/video", {
      vid: this.vid,
      uid: this.uid
    });

    this.timer = setInterval(this.saveLog, 1000);

    this.is_loading = false;
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style></style>
