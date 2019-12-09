<template>
  <v-responsive aspect-ratio="16/9">
    <Player
      v-if="this.src != null"
      :title="title"
      :src="src"
      :thumbnail="thumbnail"
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
    let vid = this.$route.params.vid;
    axios.get("http://10.16.1.77/api/video?id=" + vid).then(video => {
      this.title = video.data.title;
      this.chapterList = video.data.chapterMarks;
      this.questionList = video.data.questions;
      this.src = "http://10.16.1.77/api/video/file?id=" + vid;
      this.thumbnail = null;
    });
  }
};
</script>

<style></style>
