<template>
  <v-container fluid>
    <v-layout row justify-space-around>
      <v-flex md8>
        <vue-plyr ref="player">
          <video
            poster="https://img.pngio.com/watercolor-splash-png-hd-vector-clipart-psd-peoplepngcom-splash-png-4600_2636.png"
          >
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
              size="720"
            />
          </video>
        </vue-plyr>
      </v-flex>
      <v-flex md3>
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
                color="green darken-3"
                label="Time"
                v-model="chapterMark.startTime"
                suffix="s"
              ></v-text-field>
            </v-flex>
            <v-flex md5>
              <v-text-field
                color="green darken-3"
                label="Chapter Text"
                v-model="chapterMark.text"
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
              <v-btn dark color="green darken-3" @click="addChapterMark"
                >Add Chapter Mark <v-icon right>fa fa-plus</v-icon></v-btn
              >
            </v-flex>
          </v-layout>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      player: null,
      chapterMarkList: [],
      chapterMark: {
        id: null,
        startTime: null,
        text: null
      }
    };
  },
  methods: {
    addChapterMark() {
      this.player.pause();
      this.chapterMark.startTime = this.player.currentTime;
      let id = Math.floor(Date.now() / 1000);
      let chapterMark = {
        id: id,
        startTime: this.chapterMark.startTime,
        text: this.chapterMark.text
      };
      this.chapterMarkList.push(chapterMark);
    },
    deleteChapterMark(id) {
      this.chapterMarkList = this.chapterMarkList.filter(
        chapterMark => chapterMark.id != id
      );
    }
  },
  mounted() {
    this.player = this.$refs.player.player;
  }
};
</script>
