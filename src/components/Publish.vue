<template>
  <v-container>
    <v-layout column>
      <v-layout>
        <Player
          v-if="this.thumbnail != null"
          :src="src"
          :thumbnail="thumbnail"
          :chapterList="chapterList"
          :user="{
            name: 'Chamara Senarath',
            avatar:
              'https://icon-library.net/images/avatar-icon-png/avatar-icon-png-8.jpg'
          }"
        ></Player>
      </v-layout>
      <v-layout column align-center>
        <v-btn dark color="green darken-3" @click="downloadEmbedCode"
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
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnail: null,
      chapterList: []
    };
  },
  methods: {
    ...mapGetters(["getChapterMarks", "getSplashScreenObject"]),
    downloadEmbedCode() {}
  },

  mounted() {
    this.chapterList = this.getChapterMarks();
    this.thumbnail = this.getSplashScreenObject().data;
  }
};
</script>
