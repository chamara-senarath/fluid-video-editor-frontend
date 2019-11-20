<template>
  <v-stepper v-model="stepperCount">
    <v-stepper-header>
      <v-stepper-step :complete="stepperCount > 1" step="1"
        >Upload Video</v-stepper-step
      >

      <v-divider></v-divider>

      <v-stepper-step :complete="stepperCount > 2" step="2"
        >Add Splash</v-stepper-step
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
        <VideoUpload ref="videoUpload"></VideoUpload>
        <v-layout justify-end>
          <v-btn color="primary" @click="clickNext">
            Next
          </v-btn>
        </v-layout>
      </v-stepper-content>

      <v-stepper-content step="2">
        <SplashEditor ref="splashEditor"></SplashEditor>

        <v-layout>
          <v-layout justify-start>
            <v-btn color="primary" @click="clickBack">
              Back
            </v-btn>
          </v-layout>
          <v-layout justify-end>
            <v-btn color="primary" @click="clickNext(2)">
              Next
            </v-btn>
          </v-layout>
        </v-layout>
      </v-stepper-content>
      <v-stepper-content step="3">
        <ChapterMarks ref="chapterMarks"></ChapterMarks>

        <v-layout>
          <v-layout justify-start>
            <v-btn color="primary" @click="clickBack">
              Back
            </v-btn>
          </v-layout>
          <v-layout justify-end>
            <v-btn color="primary" @click="clickNext">
              Next
            </v-btn>
          </v-layout>
        </v-layout> </v-stepper-content
      ><v-stepper-content step="4">
        <v-card class="mb-12" outlined height="400px"></v-card>

        <v-layout>
          <v-layout justify-start>
            <v-btn color="primary" @click="clickBack">
              Back
            </v-btn>
          </v-layout>
          <v-layout justify-end>
            <v-btn color="primary" @click="clickNext">
              Next
            </v-btn>
          </v-layout>
        </v-layout>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
import VideoUpload from "@/components/VideoUpload";
import SplashEditor from "@/components/SplashEditor";
import ChapterMarks from "@/components/ChapterMarks";

export default {
  components: {
    VideoUpload,
    SplashEditor,
    ChapterMarks
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
