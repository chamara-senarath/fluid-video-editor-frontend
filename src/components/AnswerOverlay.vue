<template>
  <v-overlay :absolute="true" :value="overlay">
    <v-card min-width="200">
      <v-card-text>
        <v-layout column justify-center>
          <v-layout column justify-center>
            <v-radio-group v-model="option">
              <template v-slot:label>
                <div>
                  {{ question.question }}
                </div>
              </template>
              <v-radio
                v-for="option in question.options"
                :key="option.id"
                :value="option.text"
              >
                <template v-slot:label>
                  <div>
                    <strong>{{ option.text }}</strong>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
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
      option: null,
      timerValue: null
    };
  },
  methods: {
    changeOverlayState(val) {
      this.$emit("state", val);
      this.timerValue = 0;
    },
    answer() {
      this.question.checked = true;
      if (this.option == this.question.answer) {
        this.question.correct = true;
      }
      this.changeOverlayState(false);
    },
    skip() {
      this.question.checked = true;
      this.changeOverlayState(false);
    },
    timer() {
      let duration = this.question.duration;
      setInterval(() => {
        this.timerValue += 100 / (duration * 10);
      }, 100);
    }
  },
  mounted() {
    this.timer();
  },
  watch: {
    timerValue(val) {
      if (val >= 100) {
        this.skip();
      }
    }
  }
};
</script>
