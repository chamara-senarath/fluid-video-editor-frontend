<template>
  <v-container>
    <v-layout row>
      <v-flex xs8>
        <v-layout>
          <v-row justify="center">
            <v-dialog v-model="embedDialog" persistent max-width="400">
              <v-card>
                <v-card-title class="headline"
                  >Your Embed Code is here!</v-card-title
                >
                <v-card-text>
                  <v-layout row>
                    <v-layout justify-center>
                      <v-alert
                        v-model="showCopied"
                        dense
                        type="success"
                        mode="appear-class"
                      >
                        Copied Embed code to Clipboard
                      </v-alert>
                    </v-layout>
                    <v-layout justify-end>
                      <v-btn text icon color="pink">
                        <v-icon @click="copyToClipboard"
                          >fa fa-clipboard</v-icon
                        >
                      </v-btn>
                    </v-layout>
                  </v-layout>
                </v-card-text>
                <v-card-text>{{ embedCode }}</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="embedDialog = false"
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
      </v-flex>

      <v-flex xs4>
        <v-layout column pl-3>
          <v-layout>
            <v-btn block dark color="green darken-3" @click="preview"
              >Preview <v-icon right>fa fa-play-circle</v-icon></v-btn
            >
          </v-layout>
          <v-layout mt-2>
            <v-btn block dark color="blue darken-3" @click="downloadEmbedCode"
              >Download Embed Code <v-icon right>fa fa-download</v-icon></v-btn
            >
          </v-layout>
        </v-layout>
      </v-flex>
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
      showCopied: false,
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
      this.showCopied = false;
      let url = this.API_URL + "/embed?vid=" + this.getVideoObject().id;
      let code =
        '<iframe width="300" height="200" allow="fullscreen" src="' +
        url +
        '"></iframe>';
      this.embedCode = code;
      this.embedDialog = true;
    },
    preview() {
      window.open(
        this.API_URL + "/embed?vid=" + this.getVideoObject().id,
        "_blank"
      );
    },
    b64toBlob(ImageURL, sliceSize) {
      var block = ImageURL.split(";");
      var contentType = block[0].split(":")[1];
      var b64Data = block[1].split(",")[1];
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
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.embedCode);
        this.showCopied = true;
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
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
    console.log(this.watermark);
    let Obj = {
      id: id,
      splashDuration: this.getSplashScreenObject().duration,
      watermark: {
        opacity: this.watermark.opacity,
        widthRatio: this.watermark.widthRatio,
        position: this.watermark.position
      },
      chapterMarks: this.chapterList,
      questions: this.questionList
    };
    await axios.patch(this.API_URL + "/api/video", Obj);

    var thumbnailBlob = this.b64toBlob(this.thumbnail);
    //post splash
    const formDataSplash = new FormData();
    formDataSplash.append("splash", thumbnailBlob);
    await axios.post(this.API_URL + "/api/video/splash", formDataSplash, {
      params: {
        id: id
      }
    });

    //post watermark
    if (this.watermark != null) {
      var watermarkBlob = await fetch(this.watermark.file).then(r => r.blob());
      const formDataWatermark = new FormData();
      formDataWatermark.append("watermark", watermarkBlob);
      await axios.post(
        this.API_URL + "/api/video/watermark",
        formDataWatermark,
        {
          params: {
            id: id
          }
        }
      );
    }
  }
};
</script>
