<template>
  <v-container>
    <v-layout row>
      <v-layout>
        <Player
          v-if="this.thumbnail != null"
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
      </v-layout>
      <v-layout mt-3 column align-center justify-center>
        <v-btn dark color="blue darken-3" @click="downloadEmbedCode"
          >Download Embed Code <v-icon right>fa fa-download</v-icon></v-btn
        >
      </v-layout>
    </v-layout>
  </v-container>
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
      "getQuestionMarks",
      "getWatermark"
    ]),
    downloadEmbedCode() {}
  },

  mounted() {
    this.title = this.getVideoObject().title;
    this.src = this.getVideoObject().file;
    this.chapterList = this.getChapterMarks();
    this.questionList = this.getQuestionMarks();
    this.thumbnail = this.getSplashScreenObject().data;
    this.watermark = this.getWatermark();
  }
};
</script>
