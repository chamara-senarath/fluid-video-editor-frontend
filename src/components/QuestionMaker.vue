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
                ></v-text-field>
                <v-layout v-for="(option, i) in options" :key="option.id">
                  <v-text-field
                    autofocus
                    v-model="option.text"
                    :label="`Option ${i + 1}`"
                    prepend-inner-icon="fa fa-check-double"
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
                    :items="options"
                    label="Correct Answer"
                    dense
                  ></v-select>
                  <v-select
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
            :disabled="options.length == 0"
            color="blue darken-1"
            text
            @click="save"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
// import { mapGetters } from "vuex";

export default {
  props: ["dialog", "startTime"],
  data() {
    return {
      timeDurations: [0, 2, 3, 5, 10, 15],
      question: null,
      options: [],
      answer: null,
      duration: null
    };
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
    },
    changeDialogState(val) {
      this.$emit("dialogStatus", val);
    },
    save() {
      let questionMark = {
        question: this.question,
        options: this.options,
        answer: this.answer,
        duration: this.duration,
        startTime: this.startTime
      };
      this.$emit("questionsMark", questionMark);
      this.$refs.mcqForm.reset();
      this.options = [];
      this.changeDialogState(false);
    }
  }
};
</script>
