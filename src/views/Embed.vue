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
    let vid = this.$route.params.vid;
    this.src = "http://10.16.1.77/api/video/file?id=" + vid;
    this.title = this.getVideoObject().title;
    this.chapterList = this.getChapterMarks();
    this.questionList = this.getQuestionMarks();
    this.thumbnail = this.getSplashScreenObject().data;
    console.log(this.$route.params);
  }
};
</script>
