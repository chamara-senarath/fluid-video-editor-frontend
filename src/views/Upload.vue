<template>
  <v-stepper v-model="stepperCount">
    <AreYourSureVue
      :showConfirmation="showConfirmation"
      @userAnswer="userAnswer"
    ></AreYourSureVue>
    <v-stepper-header>
      <v-stepper-step :complete="stepperCount > 1" step="1"
        >Upload Video</v-stepper-step
      >

      <v-divider></v-divider>

      <v-stepper-step :complete="stepperCount > 2" step="2"
        >Add Intro</v-stepper-step
      >

      <v-divider></v-divider>

      <v-stepper-step :complete="stepperCount > 3" step="3"
        >Add Chapter Marks</v-stepper-step
      >

      <v-divider></v-divider>

      <v-stepper-step :complete="stepperCount > 4" step="4"
        >Add Questions</v-stepper-step
      >

      <v-divider></v-divider>

      <v-stepper-step :complete="stepperCount > 5" step="5"
        >Publish</v-stepper-step
      >
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <VideoUpload
          @uploaded="
            val => {
              val == true ? (stepperCount += 1) : (stepperCount = 0);
            }
          "
          ref="videoUpload"
        ></VideoUpload>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-layout>
          <v-layout justify-start>
            <v-btn depressed fab small color="primary" @click="clickBack">
              <v-icon>fa fa-angle-left</v-icon>
            </v-btn>
          </v-layout>
          <v-layout justify-end>
            <v-btn depressed fab small color="primary" @click="clickNext(2)">
              <v-icon>fa fa-angle-right</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
        <SplashEditor ref="splashEditor"></SplashEditor>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-layout>
          <v-layout justify-start>
            <v-btn depressed fab small color="primary" @click="clickBack">
              <v-icon>fa fa-angle-left</v-icon>
            </v-btn>
          </v-layout>
          <v-layout justify-end>
            <v-btn depressed fab small color="primary" @click="clickNext(3)">
              <v-icon>fa fa-angle-right</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
        <ChapterMarks v-if="stepperCount > 2" ref="chapterMarks"></ChapterMarks>
      </v-stepper-content>
      <v-stepper-content step="4">
        <v-layout>
          <v-layout justify-start>
            <v-btn depressed fab small color="primary" @click="clickBack">
              <v-icon>fa fa-angle-left</v-icon>
            </v-btn>
          </v-layout>
          <v-layout justify-end>
            <v-btn depressed fab small color="primary" @click="clickNext(4)">
              <v-icon>fa fa-angle-right</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
        <Questions
          v-if="stepperCount > 2"
          ref="questionMarks"
        ></Questions> </v-stepper-content
      ><v-stepper-content step="5">
        <v-layout>
          <v-layout justify-start>
            <v-btn depressed fab small color="primary" @click="clickBack">
              <v-icon>fa fa-angle-left</v-icon>
            </v-btn>
          </v-layout>
          <v-layout justify-end>
            <v-btn depressed fab small color="primary" @click="clickNext">
              <v-icon small>fa fa-upload</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
        <Publish v-if="stepperCount == 5" ref="publish"></Publish>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
import VideoUpload from "@/components/VideoUpload";
import SplashEditor from "@/components/SplashEditor";
import ChapterMarks from "@/components/ChapterMarks";
import Questions from "@/components/Questions";
import Publish from "@/components/Publish";
import AreYourSureVue from "../components/AreYourSure.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    VideoUpload,
    SplashEditor,
    ChapterMarks,
    Questions,
    Publish,
    AreYourSureVue
  },
  data() {
    return {
      stepperCount: 1,
      showConfirmation: false,
      blockUpload: true
    };
  },
  methods: {
    ...mapGetters(["getVideoObject"]),
    clickNext(stepper) {
      if (stepper == 1) {
        let validate = this.$refs.videoUpload.validate();
        if (!validate) {
          return;
        }
      }
      if (stepper == 2) {
        let validate = this.$refs.splashEditor.validate();
        if (!validate) {
          return;
        }
      }
      if (stepper == 3) {
        let validate = this.$refs.chapterMarks.validate();
        if (!validate) {
          return;
        }
      }
      if (stepper == 4) {
        let validate = this.$refs.questionMarks.validate();
        if (!validate) {
          return;
        }
      }
      if (this.stepperCount < 5) {
        this.stepperCount += 1;
      }
    },

    userAnswer(val) {
      if (val == "yes") {
        this.blockUpload = false;
        this.clickBack();
      } else {
        this.blockUpload = true;
      }
      this.showConfirmation = false;
    },

    clickBack() {
      if (this.stepperCount == 2) {
        this.showConfirmation = true;
      }
      if (this.blockUpload) {
        return;
      }
      if (this.stepperCount > 0) {
        this.stepperCount -= 1;
      }
    }
  }
};
</script>
