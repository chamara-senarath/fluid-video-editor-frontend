<template>
  <v-container>
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
              v-for="chapterMark in chapterMarkList"
              :key="chapterMark.id"
              row
              align-center
              justify-space-around
            >
              <v-flex md3>
                <v-text-field
                  readonly
                  color="blue darken-3"
                  :label="$t('Time')"
                  :value="chapterMark.startTime | secondToHHMMSS"
                ></v-text-field>
              </v-flex>
              <v-flex md5>
                <v-text-field
                  color="blue darken-3"
                  :label="$t('Chapter Text')"
                  v-model="chapterMark.text"
                  autofocus
                  :rules="rules.chapterText"
                ></v-text-field>
              </v-flex>
              <v-flex md2>
                <v-btn
                  @click="deleteChapterMark(chapterMark.id)"
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
                <v-btn dark color="blue darken-3" @click="addChapterMark"
                  >{{ $t("Add Chapter Mark") }}
                  <v-icon right>fa fa-plus</v-icon></v-btn
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
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      player: null,
      chapterMarkList: [],
      chapterMark: {
        id: null,
        startTime: null,
        text: null
      },
      rules: {
        chapterText: [
          value =>
            (value && value.length > 0) || "Chapter Text can not be empty"
        ]
      }
    };
  },
  methods: {
    ...mapGetters(["getVideoObject", "getChapterMarks"]),
    ...mapMutations(["setChapterMarks"]),
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
    addChapterMark() {
      if (!this.$refs.chapterTextForm.validate()) {
        return;
      }
      this.player.pause();
      this.chapterMark.startTime = this.player.currentTime;
      let id = this.create_UUID();
      let chapterMark = {
        id: id,
        startTime: this.chapterMark.startTime,
        text: this.chapterMark.text
      };
      let chapterMarkExist = false;
      this.chapterMarkList.forEach(chapterMark => {
        if (chapterMark.startTime == this.chapterMark.startTime) {
          chapterMarkExist = true;
        }
      });
      if (!chapterMarkExist) {
        this.chapterMarkList.push(chapterMark);
      }
    },
    deleteChapterMark(id) {
      this.chapterMarkList = this.chapterMarkList.filter(
        chapterMark => chapterMark.id != id
      );
    },
    validate() {
      if (!this.$refs.chapterTextForm.validate()) {
        return;
      }
      this.setChapterMarks(this.chapterMarkList);
      this.player.pause();
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
      this.$refs.player.player.config.fullscreen = {
        enabled: false,
        fallback: false,
        iosNative: false
      };
    }
    if (this.getChapterMarks().length != 0) {
      this.chapterMarkList = this.getChapterMarks();
    }
  }
};
</script>
