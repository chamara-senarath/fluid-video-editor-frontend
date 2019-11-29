<template>
  <Player
    v-if="this.thumbnail != null"
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
</template>

<script>
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
    this.title = this.getVideoObject().title;
    this.src =
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    this.chapterList = this.getChapterMarks();
    this.questionList = this.getQuestionMarks();
    this.thumbnail = this.getSplashScreenObject().data;
  }
};
</script>
