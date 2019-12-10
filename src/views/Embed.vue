<template>
  <v-responsive aspect-ratio="16/9">
    <Player
      v-if="this.src != null"
      :title="title"
      :src="src"
      :thumbnail="thumbnail"
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
      title: "",
      src: null,
      thumbnail: null,
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
    downloadEmbedCode() {}
  },

  mounted() {
    let vid = this.$route.query.vid; //use params instead of query to use forwars
    axios.get(this.API_URL + "/api/video?id=" + vid).then(video => {
      this.title = video.data.title;
      this.chapterList = video.data.chapterMarks;
      this.questionList = video.data.questions;
      this.src = this.API_URL + "/api/video/file?id=" + vid;
      this.thumbnail = this.API_URL + "/api/video/splash?id=" + vid;
      this.watermark = this.API_URL + "/api/video/watermark?id=" + vid;
    });
  }
};
</script>

<style></style>
