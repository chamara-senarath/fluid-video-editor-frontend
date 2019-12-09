<template>
  <v-container>
    <v-layout row>
      <v-layout>
        <v-row justify="center">
          <v-dialog v-model="embedDialog" persistent max-width="400">
            <v-card>
              <v-card-title class="headline"
                >Your Embed Code is here!</v-card-title
              >
              <v-card-text>{{ embedCode }}</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="embedDialog = false"
                  >Done</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

        <v-responsive :aspect-ratio="16 / 9">
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
        </v-responsive>
      </v-layout>
      <v-layout mt-3 column align-center justify-center>
        <v-layout>
          <v-btn dark color="green darken-3" @click="preview"
            >Preview <v-icon right>fa fa-play-circle</v-icon></v-btn
          >
        </v-layout>
        <v-layout mt-2>
          <v-btn dark color="blue darken-3" @click="downloadEmbedCode"
            >Download Embed Code <v-icon right>fa fa-download</v-icon></v-btn
          >
        </v-layout>
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
      embedDialog: false,
      embedCode: "<href='fdsfsdfsd'>",
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
    downloadEmbedCode() {
      this.embedDialog = true;
    },
    preview() {}
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
