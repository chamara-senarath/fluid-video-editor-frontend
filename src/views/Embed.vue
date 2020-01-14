<template>
  <v-responsive aspect-ratio="16/9">
    <div v-if="is_loading">Loading</div>
    <Player
      v-if="this.src != null && !is_loading"
      :title="title"
      :src="src"
      :thumbnail="thumbnail"
      :splashDuration="splashDuration"
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
      is_loading: false,
      uid: null,
      vid: null,
      timer: "",
      title: "",
      src: null,
      thumbnail: null,
      splashDuration: null,
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
    async saveLog() {
      let obj = {
        uid: this.uid,
        vid: this.vid,
        questions: this.questionList,
        checkpoints: []
      };
      await axios.post(this.API_URL + "/api/insight/user", obj);
    },
    initQuestionList(questionList) {
      let tempList = [];
      questionList.forEach(question => {
        let q = {
          ...question,
          is_answered: false,
          is_skipped: false,
          is_correct: false,
          earn: 0
        };
        tempList.push(q);
      });
      return tempList;
    },

    async fetchQuestions(uid, vid) {
      try {
        let result = await axios.get(
          this.API_URL + "/api/insight/user?uid=" + uid + "&vid=" + vid
        );
        let userInsight = result.data.questions;
        this.questionList = userInsight;
      } catch (e) {
        console.log(e + "error");
      }
    }
  },

  async mounted() {
    this.is_loading = true;
    this.vid = this.$route.query.vid;
    this.uid = "5e0ebe88823ecb188470de07"; //this.$route.query.uid;
    let video = await axios.get(this.API_URL + "/api/video?id=" + this.vid);
    this.title = video.data.title;
    this.chapterList = video.data.chapterMarks;
    this.questionList = this.initQuestionList(video.data.questions);
    this.watermark = video.data.watermark;
    this.splashDuration = video.data.splashDuration;
    this.src = this.API_URL + "/api/video/file?id=" + this.vid;
    this.thumbnail = this.API_URL + "/api/video/splash?id=" + this.vid;

    this.fetchQuestions(this.uid, this.vid);

    let result = await axios.get(
      this.API_URL + "/api/video/watermark?id=" + this.vid
    );

    if (result) {
      this.watermark.file =
        this.API_URL + "/api/video/watermark?id=" + this.vid;
    }

    //post video insight to increment view count
    await axios.post(this.API_URL + "/api/insight/video", {
      vid: this.vid,
      uid: this.uid
    });

    this.timer = setInterval(this.saveLog, 2000);
    this.is_loading = false;
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style></style>
