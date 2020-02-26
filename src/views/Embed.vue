<template>
  <v-responsive aspect-ratio="16/9">
    <v-overlay :value="is_loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Player
      v-if="this.src != null && !is_loading"
      @calculateWatchPercentage="calculateWatchPercentage"
      @sendComment="sendComment"
      @submitRating="submitRating"
      :title="title"
      :src="src"
      :thumbnail="thumbnail"
      :splashDuration="splashDuration"
      :watermark="watermark"
      :chapterList="chapterList"
      :questionList="this.questionList"
      :commentList="comments"
      :seek="watchPercentage"
      :user="{
        name: user.name,
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
      questionList: [],
      watchPercentage: null,
      postWatchPercentage: null,
      user: {
        name: "Chamara Senarath"
      },
      comments: []
    };
  },
  methods: {
    ...mapGetters([
      "getChapterMarks",
      "getSplashScreenObject",
      "getVideoObject",
      "getQuestionMarks"
    ]),
    calculateWatchPercentage(val) {
      this.postWatchPercentage = (val * 100).toFixed(2);
    },
    async saveLog() {
      let obj = {
        uid: this.uid,
        vid: this.vid,
        questions: this.questionList,
        percentage: this.postWatchPercentage,
        checkpoints: []
      };

      await axios.post(this.API_URL + "/api/insight/user", obj);
    },
    async fetchComment(vid) {
      this.comments = [];
      try {
        let result = await axios.get(this.API_URL + "/api/comment?vid=" + vid);
        if (result.data) {
          this.comments = result.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async sendComment(comment) {
      comment = { ...comment, username: this.user.name };
      let obj = {
        vid: this.vid,
        comment: comment
      };
      try {
        await axios.post(this.API_URL + "/api/comment", obj);
        await this.fetchComment(this.vid);
      } catch (error) {
        console.log(error);
      }
    },
    async submitRating({ rating, comment }) {
      let obj = {
        vid: this.vid,
        comment: {
          username: this.user.name,
          comment: comment,
          rating: rating
        }
      };
      try {
        await axios.post(this.API_URL + "/api/rating", obj);
      } catch (error) {
        console.log(error);
      }
    }
  },

  async mounted() {
    //set page loader
    this.is_loading = true;

    //set route params
    this.vid = this.$route.params.vid;
    this.uid = this.$route.params.uid;
    let is_test = this.uid == "test" ? true : false;

    //forward to 404 when no user found
    if (!is_test) {
      let res = await axios.get(this.API_URL + "/api/user?id=" + this.uid);
      if (res.status == 204 || res.status == 400 || res.status == 404) {
        this.$router.push("/404");
        return;
      }
      //assign user if exist
      this.user = res.data;
    }

    //set video title and chapter list
    let video = await axios.get(this.API_URL + "/api/video?id=" + this.vid);
    this.title = video.data.title;
    this.chapterList = video.data.chapterMarks;
    //set questions list
    if (!is_test) {
      let result = await axios.get(
        this.API_URL + "/api/insight/user?uid=" + this.uid + "&vid=" + this.vid
      );

      this.questionList = result.data.questions;
      this.watchPercentage = result.data.percentage;
    } else {
      this.questionList = video.data.questions;
      this.watchPercentage = 0;
    }

    //set comments
    this.fetchComment(this.vid);
    //set video watermark, splashduration, src and thumbnail
    this.watermark = video.data.watermark;
    this.splashDuration = video.data.splashDuration;
    this.src = this.API_URL + "/api/video/file?id=" + this.vid;
    this.thumbnail = this.API_URL + "/api/video/splash?id=" + this.vid;

    let result = await axios.get(
      this.API_URL + "/api/video/watermark?id=" + this.vid
    );

    if (result) {
      this.watermark.file =
        this.API_URL + "/api/video/watermark?id=" + this.vid;
    }
    // post video insight to increment view count
    if (!is_test) {
      await axios.post(this.API_URL + "/api/insight/video", {
        vid: this.vid,
        uid: this.uid
      });
    }

    //set timer to log periodically
    if (!is_test) {
      this.timer = setInterval(this.saveLog, 1000);
    }

    //unset loader
    this.is_loading = false;
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style></style>
