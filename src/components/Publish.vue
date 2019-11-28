<template>
  <v-container>
    <v-layout row>
      <v-layout>
        <v-container>
          <Player
            v-if="this.thumbnail != null"
            :title="title"
            :src="src"
            :thumbnail="thumbnail"
            :chapterList="chapterList"
            :user="{
              name: 'Chamara Senarath',
              avatar:
                'https://icon-library.net/images/avatar-icon-png/avatar-icon-png-8.jpg'
            }"
          ></Player>
        </v-container>
      </v-layout>
      <v-layout column align-center justify-center>
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
      title: "",
      src: null,
      thumbnail: null,
      chapterList: []
    };
  },
  methods: {
    ...mapGetters([
      "getChapterMarks",
      "getSplashScreenObject",
      "getVideoObject"
    ]),
    downloadEmbedCode() {}
  },

  mounted() {
    this.title = this.getVideoObject().title;
    this.src = this.getVideoObject().file;
    this.chapterList = this.getChapterMarks();
    this.thumbnail = this.getSplashScreenObject().data;
  }
};
</script>
