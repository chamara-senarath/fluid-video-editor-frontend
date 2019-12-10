<template>
  <v-container>
    <QuestionMaker
      v-if="this.dialogBox"
      :startTime="startTime"
      :dialog="dialogBox"
      :editableQuestion="editableQuestion"
      @dialogStatus="changeDialogState"
      @saveQuestionsMark="createQuestionMarks"
      @updateQuestionMark="updateQuestionMark"
    ></QuestionMaker>
    <v-layout row justify-space-around>
      <v-flex md8>
        <vue-plyr ref="player">
          <video>
            <source :src="file" type="video/mp4" size="720" />
          </video>
        </vue-plyr>
      </v-flex>
      <v-flex md3>
        <v-form ref="chapterTextForm">
          <v-layout column>
            <v-layout
              v-for="questionsMark in questionsMarks"
              :key="questionsMark.id"
              row
              align-center
              justify-space-around
            >
              <v-flex md3>
                <v-text-field
                  readonly
                  color="blue darken-3"
                  label="Time"
                  :value="secondToHHMMSS(questionsMark.startTime)"
                ></v-text-field>
              </v-flex>
              <v-flex md5>
                <v-text-field
                  color="blue darken-3"
                  label="Question"
                  v-model="questionsMark.question"
                  autofocus
                  readonly
                ></v-text-field>
              </v-flex>
              <v-flex md2>
                <v-btn
                  @click="editQuestionMark(questionsMark.id)"
                  dark
                  color="yellow darken-3"
                  class="mx-2"
                  fab
                  small
                  ><v-icon small dark>fa fa-edit</v-icon></v-btn
                >
              </v-flex>
              <v-flex md2>
                <v-btn
                  @click="deleteQuestionMark(questionsMark.id)"
                  dark
                  color="red darken-3"
                  class="mx-2"
                  fab
                  small
                  ><v-icon small dark>fa fa-trash-alt</v-icon></v-btn
                >
              </v-flex>
            </v-layout>
            <v-layout column align-center>
              <v-flex>
                <v-btn dark color="blue darken-3" @click="addQuestionMark"
                  >Add Question Mark <v-icon right>fa fa-plus</v-icon></v-btn
                >
              </v-flex>
            </v-layout>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import QuestionMaker from "@/components/QuestionMaker";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    QuestionMaker
  },
  data() {
    return {
      dialogBox: false,
      player: null,
      startTime: null,
      questionsMarks: [],
      editableQuestion: null
    };
  },
  methods: {
    ...mapGetters(["getVideoObject"]),
    ...mapMutations(["setQuestionMarks"]),
    changeDialogState(val) {
      this.dialogBox = val;
    },
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
    secondToHHMMSS(time) {
      var date = new Date(null);
      date.setSeconds(time);
      var result = date.toISOString().substr(11, 8);
      return result;
    },
    addQuestionMark() {
      this.editableQuestion = null;

      this.player.pause();
      this.startTime = this.player.currentTime;
      let questionMarkExist = false;
      this.questionsMarks.forEach(questionMark => {
        if (questionMark.startTime == this.startTime) {
          questionMarkExist = true;
        }
      });
      if (!questionMarkExist) {
        this.changeDialogState(true);
      }
    },

    createQuestionMarks(val) {
      let id = this.create_UUID();
      this.questionsMarks.push({ ...val, id });
    },
    updateQuestionMark(val) {
      let id = val.id;
      for (let i = 0; i < this.questionsMarks.length; i++) {
        if (this.questionsMarks[i].id == id) {
          this.questionsMarks[i] = val;
        }
      }
      this.editableQuestion = null;
    },
    deleteQuestionMark(id) {
      this.questionsMarks = this.questionsMarks.filter(
        questionMark => questionMark.id != id
      );
    },
    editQuestionMark(id) {
      this.player.pause();
      this.questionsMarks.forEach(item => {
        if (item.id == id) {
          this.editableQuestion = item;
        }
      });
      this.changeDialogState(true);
    },
    validate() {
      this.setQuestionMarks(this.questionsMarks);
      return true;
    }
  },
  computed: {
    file() {
      return this.getVideoObject().file;
    }
  },

  mounted() {
    if (this.file != null) {
      this.player = this.$refs.player.player;
    }
  }
};
</script>
