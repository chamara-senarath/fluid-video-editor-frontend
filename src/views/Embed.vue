<template>
  <v-responsive aspect-ratio="16/9">
    <Player
      v-if="this.src != null"
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
    saveLog() {
      let obj = {
        uid: this.uid,
        vid: this.vid,
        questions: this.questionList,
        checkpoints: []
      };
      // console.log(obj);
      if (this.questionList.length != 0) {
        axios.post(this.API_URL + "/api/insight/user", obj);
      }
    },
    async fetchQuestions(uid, vid) {
      let result = await axios.get(
        this.API_URL + "/api/insight/user?uid=" + uid + "&vid=" + vid
      );

      let userInsight = result.data.questions;
      //alter objects
      let tempQuestionList = [];
      this.questionList.forEach(question => {
        userInsight.forEach(questionInsight => {
          if (question._id == questionInsight.qid) {
            let q = {
              qid: questionInsight.qid,
              question: question.question,
              options: question.options,
              answer: question.answer,
              duration: question.duration,
              startTime: question.startTime,
              points: question.points,
              is_answered: questionInsight.is_answered,
              is_skipped: questionInsight.is_skipped,
              is_correct: questionInsight.is_correct,
              isTimed: question.duration == null || 0 ? false : true
            };
            tempQuestionList.push(q);
          }
          this.questionList = tempQuestionList;
        });
      });
      this.timer = setInterval(this.saveLog, 2000);
    }
  },

  async mounted() {
    this.vid = this.$route.query.vid;
    this.uid = "5e0ebe92823ecb188470de12"; //this.$route.query.uid;
    let video = await axios.get(this.API_URL + "/api/video?id=" + this.vid);
    this.title = video.data.title;
    this.chapterList = video.data.chapterMarks;
    this.questionList = video.data.questions;
    this.watermark = video.data.watermark;
    this.splashDuration = video.data.splashDuration;
    this.src = this.API_URL + "/api/video/file?id=" + this.vid;
    this.thumbnail = this.API_URL + "/api/video/splash?id=" + this.vid;
    let result = await axios.get(
      this.API_URL + "/api/video/watermark?id=" + this.vid
    );

    if (result)
      this.watermark.file =
        this.API_URL + "/api/video/watermark?id=" + this.vid;

    this.fetchQuestions(this.uid, this.vid);
    await axios.post(this.API_URL + "/api/insight/video", {
      vid: this.vid,
      uid: this.uid
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style></style>
