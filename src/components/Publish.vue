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
import axios from "axios";

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
    preview() {},
    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || "";
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (
        var offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }
  },

  async mounted() {
    let id = this.getVideoObject().id;
    this.title = this.getVideoObject().title;
    this.src = this.getVideoObject().file;
    this.chapterList = this.getChapterMarks();
    this.questionList = this.getQuestionMarks();
    this.thumbnail = this.getSplashScreenObject().data;
    this.watermark = this.getWatermark();

    let Obj = {
      id: id,
      splashDuration: this.getSplashScreenObject().duration,
      chapterMarks: this.chapterList,
      questions: this.questionList
    };
    await axios.patch("http://10.16.1.77/api/video", Obj);

    var ImageURL = this.thumbnail;
    var block = ImageURL.split(";");
    var contentType = block[0].split(":")[1];
    var realData = block[1].split(",")[1];

    // Convert it to a blob to upload
    var blob = this.b64toBlob(realData, contentType);

    const formData = new FormData();
    formData.append("splash", blob);
    await axios.post("http://10.16.1.77/api/video/splash", formData, {
      params: {
        id: id
      }
    });
  }
};
</script>
