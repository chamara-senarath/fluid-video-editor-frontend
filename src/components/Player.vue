<template>
  <div
    @mousewheel="changeOpacity"
    class="overflow-hidden"
    style="position: relative;"
  >
    <v-layout>
      <vue-plyr
        @timeupdate="videoTimeUpdated"
        :emit="['timeupdate']"
        ref="player"
      >
        <video :poster="thumbnail" size="720">
          <source :src="src" type="video/mp4" size="720" />
        </video>
      </vue-plyr>

      <AnswerOverlay
        v-if="currentQuestion != null"
        @state="changeAnswerOverlayState"
        :overlay="answerOverlay"
        :question="currentQuestion"
      ></AnswerOverlay>

      <v-navigation-drawer
        v-if="this.watermark != null"
        :v-model="true"
        absolute
        right
        dark
        color="rgba(0, 0, 0, 0)"
      >
        <v-list-item>
          <v-layout pt-4 pr-4 justify-end>
            <img :src="watermark" width="100" style="opacity:0.5" />
          </v-layout>
        </v-list-item>
      </v-navigation-drawer>

      <v-btn
        v-if="this.chapterList.length != 0 && !drawer"
        @click.stop="drawer = !drawer"
        color="`rgba(0,0,0,${panelOpacity})`"
        depressed
        dark
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
      v-if="this.chapterList.length != 0"
      v-model="drawer"
      absolute
      dark
      :color="`rgba(0,0,0,${panelOpacity})`"
    >
      <v-list-item v-if="user != null">
        <v-list-item-avatar>
          <v-img :src="user.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
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
            <span>{{ secondToHHMMSS(item.startTime) }}</span>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <strong v-on="on">{{ item.text }}</strong>
                </template>
                <strong>{{ item.text }}</strong>
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

export default {
  components: {
    AnswerOverlay,
    QuestionGroup
  },
  props: [
    "title",
    "src",
    "thumbnail",
    "watermark",
    "chapterList",
    "questionList",
    "user"
  ],
  data: () => ({
    controlVisibility: true,
    panelOpacity: 0.4,
    drawer: true,
    player: null,
    duration: null,
    playingChapter: 0,
    answerOverlay: false,
    currentQuestion: null
  }),
  methods: {
    secondToHHMMSS(time) {
      var date = new Date(null);
      date.setSeconds(time);
      var result = date.toISOString().substr(11, 8);
      return result;
    },
    playChapter(index) {
      this.player.currentTime = this.chapterList[index].startTime;
      this.player.pause();
    },
    videoTimeUpdated: function() {
      this.duration = this.player.currentTime;
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
    }
  },
  watch: {
    duration(value) {
      for (let i = 0; i < this.chapterList.length; i++) {
        if (value >= this.chapterList[i].startTime) {
          this.playingChapter = i;
        }
      }
      for (let i = 0; i < this.questionList.length; i++) {
        if (
          value >= this.questionList[i].startTime &&
          !this.questionList[i].checked
        ) {
          this.displayQuestion(i);
        }
      }
    }
  },
  mounted() {
    this.player = this.$refs.player.player;
  }
};
</script>
