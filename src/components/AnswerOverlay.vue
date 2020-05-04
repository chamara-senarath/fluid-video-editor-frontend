<template>
  <v-overlay :absolute="true" :value="overlay">
    <v-card color="rgba(0,0,0,0.7)">
      <v-card-text class="title white--text font-regular">
        {{ question.question }}
      </v-card-text>
      <v-card-text>
        <v-layout column justify-center>
          <v-layout row justify-center>
            <v-flex
              pa-2
              xs6
              v-for="option in question.options"
              :key="option.id"
            >
              <v-responsive>
                <v-card
                  color="blue-grey blue-grey darken-2"
                  min-height="30"
                  @click="selectedOption = option.text"
                >
                  <v-card-title>
                    <v-layout column align-end>
                      <v-icon
                        color="green"
                        small
                        v-if="selectedOption == option.text"
                        >fa fa-bullseye</v-icon
                      >
                    </v-layout>
                  </v-card-title>
                  <v-card-text class="subtitle-1 white--text font-regular">
                    <strong>{{ option.text }}</strong>
                  </v-card-text>
                </v-card>
              </v-responsive>
            </v-flex>
          </v-layout>

          <v-progress-linear
            v-if="question.duration != 0"
            :value="timerValue"
          ></v-progress-linear>
        </v-layout>

        <v-layout mt-4 column>
          <v-layout>
            <v-btn block small color="success" @click="answer">
              Answer
            </v-btn>
          </v-layout>

          <v-layout mt-2>
            <v-btn
              block
              small
              v-if="question.duration == 0"
              color="info"
              @click="skip"
            >
              Skip
            </v-btn>
          </v-layout>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  props: ["overlay", "question"],
  data() {
    return {
      selectedOption: null,
      timerValue: null,
      interval: null,
    };
  },
  methods: {
    changeOverlayState(val) {
      this.$emit("state", val);
    },
    answer() {
      this.question.is_answered = true;
      this.question.is_skipped = false;
      if (this.selectedOption == this.question.answer) {
        this.question.is_correct = true;
      }
      this.changeOverlayState(false);
    },
    skip() {
      this.question.is_skipped = true;
      this.changeOverlayState(false);
    },
    timer() {
      if (this.question.duration == 0) {
        return;
      }

      let duration = this.question.duration;
      this.interval = setInterval(() => {
        this.timerValue += 100 / (duration * 10);
      }, 100);
    },
  },
  watch: {
    timerValue(val) {
      if (val >= 100 && this.question.duration != 0) {
        this.skip();
      }
    },
    question(newVal, oldVal) {
      if (oldVal.id != newVal.id) {
        this.timer();
      }
    },
    overlay(val) {
      if (val) {
        if (this.interval != null) {
          clearInterval(this.interval);
        }
        this.timerValue = 0;
        this.timer();
      }
    },
  },
  mounted() {
    this.timer();
  },
};
</script>
