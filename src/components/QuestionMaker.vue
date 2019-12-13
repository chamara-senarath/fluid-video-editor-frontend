<template>
  <v-row justify="center">
    <v-dialog :value="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">MCQ Genarator</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-layout column>
              <v-form ref="mcqForm">
                <v-text-field
                  label="Question"
                  v-model="question"
                  prepend-inner-icon="fa fa-question"
                  :rules="rules.text"
                ></v-text-field>
                <v-layout v-for="(option, i) in options" :key="option.id">
                  <v-text-field
                    autofocus
                    v-model="option.text"
                    :label="`Option ${i + 1}`"
                    prepend-inner-icon="fa fa-check-double"
                    :rules="rules.text"
                  ></v-text-field>
                  <v-btn
                    @click="deleteOption(option.id)"
                    dark
                    color="red darken-3"
                    class="mx-2"
                    fab
                    small
                    ><v-icon small dark>fa fa-trash-alt</v-icon></v-btn
                  >
                </v-layout>
                <v-btn class="primary" @click="addOption">{{
                  options.length == 0 ? "add an option" : "add another option"
                }}</v-btn>

                <v-layout column mt-5>
                  <v-select
                    v-if="options.length != 0 && options[0].text != ''"
                    v-model="answer"
                    :items="options.filter(option => option.text)"
                    label="Correct Answer"
                    required
                    :rules="[v => !!v || 'Correct answer is required']"
                    dense
                  ></v-select>
                  <v-text-field
                    prepend-icon="fa fa-coins"
                    v-model="points"
                    type="Number"
                    min="0"
                    label="Enter Points"
                    dense
                  ></v-text-field>
                  <v-switch v-model="isTimed" label="Timed Question">
                  </v-switch>
                  <v-select
                    v-if="isTimed"
                    v-model="duration"
                    :items="timeDurations"
                    label="Select Time Duration"
                    dense
                    suffix="Seconds"
                  ></v-select>
                </v-layout>
              </v-form>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="changeDialogState(false)"
            >Close</v-btn
          >
          <v-btn
            :disabled="answer == null || options.length == 0"
            color="blue darken-1"
            text
            @click="save"
            >{{ editableQuestion == null ? "Save" : "Update" }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["dialog", "startTime", "editableQuestion"],
  data() {
    return {
      pointsList: [10, 20, 50, 100, 200],
      question: null,
      options: [],
      answer: null,
      isTimed: false,
      duration: null,
      points: null,
      rules: {
        text: [
          value => (value && value.length > 0) || "This field can not be empty"
        ]
      }
    };
  },
  computed: {
    timeDurations() {
      let arr = [];
      for (let i = 1; i <= 50; i++) {
        arr.push(i);
      }
      return arr;
    }
  },
  methods: {
    create_UUID() {
      var dt = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },
    addOption() {
      let id = this.create_UUID();
      let option = {
        id: id,
        text: ""
      };
      this.options.push(option);
    },
    deleteOption(id) {
      this.options = this.options.filter(option => option.id != id);
      this.answer = null;
    },
    changeDialogState(val) {
      this.$emit("dialogStatus", val);
    },
    save() {
      if (!this.$refs.mcqForm.validate()) {
        return;
      }
      let questionMark = {
        question: this.question,
        options: this.options,
        answer: this.answer,
        isTimed: this.isTimed,
        duration:
          this.duration == null || this.isTimed == false ? 0 : this.duration,
        startTime: this.startTime,
        correct: false,
        points: this.points == null ? 0 : this.points,
        checked: false
      };
      if (this.editableQuestion == null) {
        this.$emit("saveQuestionsMark", questionMark); //save
      } else {
        questionMark = { ...questionMark, id: this.editableQuestion.id };
        this.$emit("updateQuestionMark", questionMark);
      }
      this.exit();
    },
    exit() {
      this.changeDialogState(false);
      this.question = null;
      this.options = [];
      this.answer = null;
      this.isTimed = false;
      this.duration = null;
      this.points = null;
    }
  },
  mounted() {
    if (this.editableQuestion != null) {
      this.question = this.editableQuestion.question;
      this.options = this.editableQuestion.options;
      this.answer = this.editableQuestion.answer;
      this.isTimed = this.editableQuestion.isTimed;
      this.duration = this.editableQuestion.duration;
      this.points = this.editableQuestion.points;
    }
  }
};
</script>
