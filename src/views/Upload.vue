<template>
  <v-stepper v-model="stepperCount">
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
        >Publish</v-stepper-step
      >
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-layout justify-end>
          <v-btn fab small color="primary" @click="clickNext(1)">
            <v-icon>fa fa-angle-right</v-icon>
          </v-btn>
        </v-layout>
        <VideoUpload ref="videoUpload"></VideoUpload>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-layout>
          <v-layout justify-start>
            <v-btn fab small color="primary" @click="clickBack">
              <v-icon>fa fa-angle-left</v-icon>
            </v-btn>
          </v-layout>
          <v-layout justify-end>
            <v-btn fab small color="primary" @click="clickNext(2)">
              <v-icon>fa fa-angle-right</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
        <SplashEditor ref="splashEditor"></SplashEditor>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-layout>
          <v-layout justify-start>
            <v-btn fab small color="primary" @click="clickBack">
              <v-icon>fa fa-angle-left</v-icon>
            </v-btn>
          </v-layout>
          <v-layout justify-end>
            <v-btn fab small color="primary" @click="clickNext(3)">
              <v-icon>fa fa-angle-right</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
        <ChapterMarks ref="chapterMarks"></ChapterMarks> </v-stepper-content
      ><v-stepper-content step="4">
        <v-layout>
          <v-layout justify-start>
            <v-btn fab small color="primary" @click="clickBack">
              <v-icon>fa fa-angle-left</v-icon>
            </v-btn>
          </v-layout>
          <v-layout justify-end>
            <v-btn fab small color="primary" @click="clickNext">
              <v-icon>fa fa-angle-right</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
        <Publish v-if="stepperCount == 4" ref="publish"></Publish>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
import VideoUpload from "@/components/VideoUpload";
import SplashEditor from "@/components/SplashEditor";
import ChapterMarks from "@/components/ChapterMarks";
import Publish from "@/components/Publish";

export default {
  components: {
    VideoUpload,
    SplashEditor,
    ChapterMarks,
    Publish
  },
  data() {
    return {
      stepperCount: 1
    };
  },
  methods: {
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
      if (this.stepperCount < 4) {
        this.stepperCount += 1;
      }
    },
    clickBack() {
      if (this.stepperCount > 0) {
        this.stepperCount -= 1;
      }
    }
  }
};
</script>
