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
    ])
  },

  mounted() {
    let vid = this.$route.query.vid; //use params instead of query to use forwars
    axios.get(this.API_URL + "/api/video?id=" + vid).then(video => {
      this.title = video.data.title;
      this.chapterList = video.data.chapterMarks;
      this.questionList = video.data.questions;
      this.watermark = video.data.watermark;
      this.splashDuration = video.data.splashDuration;
      this.src = this.API_URL + "/api/video/file?id=" + vid;
      this.thumbnail = this.API_URL + "/api/video/splash?id=" + vid;
      axios
        .get(this.API_URL + "/api/video/watermark?id=" + vid)
        .then(result => {
          if (result)
            this.watermark.file =
              this.API_URL + "/api/video/watermark?id=" + vid;
        });
    });
    let uid = "5dfb38e7f77174033c7b032b";
    vid = "5dfaf16e7287010c140bfa3d";
    axios
      .get(this.API_URL + "/api/insight/user?uid=" + uid + "&vid=" + vid)
      .then(result => {
        console.log(result);
        let userInsight = result.data.questions;
        //alter objects
        let tempQuestionList = [];
        this.questionList.forEach(question => {
          userInsight.forEach(questionInsight => {
            let q = {
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
          });
          this.questionList = tempQuestionList;
          console.log(this.questionList);
        });
      });
  }
};
</script>

<style></style>
