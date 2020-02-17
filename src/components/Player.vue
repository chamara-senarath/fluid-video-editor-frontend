<template>
  <div
    class="overflow-hidden"
    style="position: relative;"
    @mousewheel="changeOpacity"
    @keydown.enter="toggleFullscreen"
    @dblclick="toggleFullscreen"
    ref="playerView"
  >
    <v-layout>
      <vue-plyr
        @timeupdate="videoTimeUpdated"
        :emit="['timeupdate']"
        ref="player"
        :style="
          `width:${
            isFullscreen ? fullScreenWidth + 'px' : normalScreenWidth + 'px'
          };`
        "
      >
        <video :poster="thumbnail">
          <source v-if="is_intro" :src="thumbnail" type="video/png" />
          <source v-if="!is_intro" :src="src" type="video/mp4" />
        </video>
      </vue-plyr>

      <transition name="fade">
        <div v-if="is_intro" style="position:absolute;right:0px;z-index:100">
          <v-btn
            transition="slide-x-transition"
            :color="`rgba(0,0,0,${panelOpacity})`"
            depressed
            dark
            tile
            @click="
              () => {
                is_intro = false;

                this.player.play();
              }
            "
          >
            <v-icon left small>fa fa-info-circle</v-icon>
            Skip Intro
          </v-btn>
        </div>
      </transition>

      <transition name="slide-x-reverse-transition">
        <div
          v-if="expandRightPanel && !showComments"
          style="position:absolute;right:65px;z-index:100"
        >
          <v-btn
            :color="`rgba(0,0,0,${panelOpacity})`"
            depressed
            dark
            tile
            @click="showCommentHandler"
          >
            <v-icon left small>fa fa-comment-dots</v-icon>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn
            :color="`rgba(0,0,0,${panelOpacity})`"
            depressed
            dark
            tile
            @click="takeScreenShot"
          >
            <v-icon left small>fa fa-camera-retro</v-icon>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn
            :color="`rgba(0,0,0,${panelOpacity})`"
            depressed
            dark
            tile
            @click="showRating"
          >
            <v-icon left small>fa fa-smile</v-icon>
          </v-btn>
          <v-divider vertical></v-divider>
        </div>
      </transition>
      <div v-if="!is_intro" style="position:absolute;right:0px;z-index:100">
        <v-btn
          @click="expandRightPanelHandler"
          :color="`rgba(0,0,0,${panelOpacity})`"
          depressed
          dark
          tile
        >
          <v-icon left small
            >fa fa-chevron-circle-{{
              expandRightPanel ? "right" : "left"
            }}</v-icon
          >
        </v-btn>
      </div>

      <div
        v-if="this.watermarkStyle != null"
        :style="
          `position:absolute;top:${watermarkStyle.top}px;left:${watermarkStyle.left}px;`
        "
      >
        <img
          :src="watermark.file"
          :width="watermarkStyle.width"
          :style="`opacity:${watermark.opacity / 100};pointer-events: none;`"
        />
      </div>
      <AnswerOverlay
        v-if="currentQuestion != null"
        @state="changeAnswerOverlayState"
        :overlay="answerOverlay"
        :question="currentQuestion"
      ></AnswerOverlay>
      <Rating @submit="submitRating" :overlay="ratingOverlay"> </Rating>
      <div style="position:absolute;right:0px;bottom:2vh;z-index:1000">
        <CommentSection
          :show="showComments"
          :comments="commentList"
          :time="duration"
          @hideComments="hideCommentHandler"
          @sendComment="sendComment"
        />
      </div>
      <v-btn
        v-if="this.chapterList.length != 0 && !drawer && !is_intro"
        @click.stop="drawer = !drawer"
        :color="`rgba(0,0,0,${panelOpacity})`"
        depressed
        dark
        tile
        absolute
      >
        <v-icon left dark color="white">fa fa-list-ul</v-icon>
        <span v-if="this.chapterList.length != 0" color="primary" dark>
          {{ title }} <strong class="blue--text">|</strong>
          {{ chapterList[playingChapter].text }}
        </span>
      </v-btn>
    </v-layout>

    <v-navigation-drawer
      v-if="this.chapterList.length != 0 && !is_intro"
      v-model="drawer"
      absolute
      dark
      :color="`rgba(0,0,0,${panelOpacity})`"
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="user.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content v-if="user != null">
          <v-list-item-title>{{ user.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-layout my-3 mx-4 row justify-space-between align-center>
        <span class="title white--text">Chapter List</span>
        <v-btn text icon color="white" @click="drawer = !drawer">
          <v-icon>fa fa-chevron-circle-left</v-icon>
        </v-btn>
      </v-layout>

      <v-list dense>
        <v-list-item
          v-for="(item, i) in chapterList"
          :key="i"
          @click="playChapter(i)"
          :style="
            i == playingChapter
              ? `background-color:rgba(13, 71, 161,${panelOpacity}`
              : ''
          "
        >
          <v-list-item-icon>
            <span style="font-weight: 300;">{{
              item.startTime | secondToHHMMSS
            }}</span>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <span style="font-weight: 300;" v-on="on">{{
                    item.text
                  }}</span>
                </template>
                <span style="font-weight: 300;">{{ item.text }}</span>
              </v-tooltip></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-layout mt-10 ml-4>
        <QuestionGroup
          :questions="questionList"
          :opacity="panelOpacity"
        ></QuestionGroup>
      </v-layout>
    </v-navigation-drawer>
  </div>
</template>
<script>
import AnswerOverlay from "@/components/AnswerOverlay";
import QuestionGroup from "@/components/QuestionGroup";
import CommentSection from "@/components/CommentSection";
import Rating from "@/components/Rating";
export default {
  components: {
    AnswerOverlay,
    QuestionGroup,
    CommentSection,
    Rating
  },
  props: [
    "title",
    "src",
    "thumbnail",
    "splashDuration",
    "watermark",
    "chapterList",
    "questionList",
    "commentList",
    "seek",
    "user"
  ],
  data: () => ({
    controlVisibility: true,
    panelOpacity: 0.6,
    watermarkStyle: null,
    drawer: true,
    player: null,
    duration: null,
    playingChapter: 0,
    answerOverlay: false,
    ratingOverlay: false,
    currentQuestion: null,
    isFullscreen: false,
    fullScreenWidth: null,
    normalScreenWidth: null,
    is_intro: true,
    is_set_duration: false,

    showComments: false,
    expandRightPanel: false
  }),
  methods: {
    genarateWatermarkStyle({ leftRatio, topRatio }, widthRatio) {
      let playerWidth = this.$refs.playerView.getBoundingClientRect().width;
      let playerHeight = this.$refs.playerView.getBoundingClientRect().height;
      let left = playerWidth * leftRatio;
      let top = playerHeight * topRatio;
      let width = playerWidth * widthRatio;
      return {
        left: left,
        top: top,
        width: width
      };
    },
    playChapter(index) {
      this.player.currentTime = this.chapterList[index].startTime;
      this.player.pause();
    },
    playIntro(duration) {
      setTimeout(() => {
        this.is_intro = false;
      }, duration * 1000);
    },
    videoTimeUpdated: function() {
      this.duration = this.player.currentTime;
      this.calculateWatchPercentage(
        this.player.currentTime,
        this.player.duration
      );
    },
    onPlayVideo() {
      if (this.duration < 1) {
        this.playIntro(this.splashDuration);
      }
      if (
        this.watermark.position == null ||
        this.watermark.widthRatio == null
      ) {
        return;
      }
      this.watermarkStyle = this.genarateWatermarkStyle(
        this.watermark.position,
        this.watermark.widthRatio
      );
    },
    hideControls() {
      setTimeout(() => {
        this.controlVisibility = false;
      }, 2000);
    },
    changeAnswerOverlayState(val) {
      this.answerOverlay = val;
      if (val == false) {
        this.player.play();
      }
    },
    displayQuestion(i) {
      this.player.pause();
      this.currentQuestion = this.questionList[i];
      this.answerOverlay = true;
    },
    changeOpacity(e) {
      if (
        e.shiftKey &&
        e.wheelDeltaY > 0 &&
        this.panelOpacity <= 0.8 &&
        this.drawer
      ) {
        this.panelOpacity += 0.05;
      }
      if (
        e.shiftKey &&
        e.wheelDeltaY < 0 &&
        this.panelOpacity > 0.3 &&
        this.drawer
      ) {
        this.panelOpacity -= 0.05;
      }
    },
    toggleFullscreen: function() {
      if (this.$route.name == "upload") {
        return;
      }
      var elem = document.documentElement;
      if (
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled
      ) {
        if (!this.isFullscreen) {
          document.documentElement.style.overflow = "hidden";
          this.fullScreenWidth = window.screen.width;
          if (elem.requestFullscreen) {
            elem.requestFullscreen();
            this.isFullscreen = true;
            return;
          } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
            this.isFullscreen = true;
            return;
          } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
            this.isFullscreen = true;
            return;
          } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
            this.isFullscreen = true;
            return;
          }
        } else {
          document.documentElement.style.overflow = "auto";
          if (document.exitFullscreen) {
            document.exitFullscreen();
            this.isFullscreen = false;
            return;
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            this.isFullscreen = false;
            return;
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
            this.isFullscreen = false;
            return;
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
            this.isFullscreen = false;
            return;
          }
        }
      }
    },
    handleResize() {
      this.fullScreenWidth = window.innerWidth;
    },
    calculateWatchPercentage(currentTime, duration) {
      let watchPercentage = currentTime / duration;
      this.$emit("calculateWatchPercentage", watchPercentage);
    },
    sendComment(userComment) {
      let comment = {
        comment: userComment,
        time: this.duration
      };
      this.$emit("sendComment", comment);
    },
    showCommentHandler() {
      this.showComments = true;
      this.expandRightPanel = false;
    },
    hideCommentHandler() {
      this.showComments = false;
    },
    expandRightPanelHandler() {
      this.expandRightPanel = !this.expandRightPanel;
      this.showComments = false;
      this.ratingOverlay = false;
    },
    takeScreenShot() {},
    submitRating({ option, value }) {
      if (option == "submit") {
        console.log(value);
      }
      this.ratingOverlay = false;
    },
    showRating() {
      this.ratingOverlay = true;
      this.expandRightPanel = false;
    }
  },
  watch: {
    duration(value) {
      this.onPlayVideo();
      if (this.is_set_duration == false && this.player.duration > 0) {
        this.is_set_duration = true;
        this.player.currentTime = (this.seek * this.player.duration) / 100;
      }
      for (let i = 0; i < this.chapterList.length; i++) {
        if (value >= this.chapterList[i].startTime) {
          this.playingChapter = i;
        }
      }
      for (let i = 0; i < this.questionList.length; i++) {
        if (
          value >= this.questionList[i].startTime &&
          !(this.questionList[i].is_answered || this.questionList[i].is_skipped)
        ) {
          this.displayQuestion(i);
        }
      }
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  mounted() {
    this.chapterList = this.chapterList.sort((a, b) =>
      a.startTime > b.startTime ? 1 : -1
    );
    this.normalScreenWidth = window.innerWidth;
    // this.$refs.player.player.elements.buttons.fullscreen.hidden = true;
    this.$refs.player.player.config.fullscreen = {
      enabled: false,
      fallback: false,
      iosNative: false
    };
    this.player = this.$refs.player.player;
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
