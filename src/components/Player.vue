/* eslint no-use-before-define: 0 */
<template>
  <v-sheet class="overflow-hidden" style="position: relative;">
    <v-layout>
      <vue-plyr
        @timeupdate="videoTimeUpdated"
        :emit="['timeupdate']"
        ref="player"
      >
        <video :poster="thumbnail" size="720">
          <source :src="src" type="video/mp4" size="720" />
        </video>
      </vue-plyr>

      <v-btn
        v-if="this.chapterList.length != 0 && !drawer"
        @click.stop="drawer = !drawer"
        color="rgba(0, 0, 0, 0.4)"
        depressed
        dark
        absolute
      >
        <v-icon left dark color="white">fa fa-list-ul</v-icon>
        <span v-if="this.chapterList.length != 0" color="primary" dark>
          {{ title }} |
          {{ chapterList[playingChapter].text }}
        </span>
      </v-btn>
    </v-layout>

    <v-navigation-drawer
      v-if="this.chapterList.length != 0"
      v-model="drawer"
      absolute
      dark
      color="rgba(0, 0, 0, 0.3)"
    >
      <v-list-item v-if="user != null">
        <v-list-item-avatar>
          <v-img :src="user.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-layout my-3 mx-4 row justify-space-between align-center>
        <span class="title white--text">Chapter List</span>
        <v-btn text icon color="white" @click="drawer = !drawer">
          <v-icon>fa fa-chevron-circle-left</v-icon>
        </v-btn>
      </v-layout>

      <v-list dense>
        <v-list-item
          v-for="(item, i) in chapterList"
          :key="i"
          @click="playChapter(i)"
        >
          <v-list-item-icon>
            <v-icon :color="i == playingChapter ? 'red' : 'blue'"
              >fa fa-bookmark-o</v-icon
            >
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title
              :class="i == playingChapter ? 'red--text' : 'white--text'"
            >
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ item.text }}</span>
                </template>
                <span>{{ item.text }}</span>
              </v-tooltip></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-sheet>
</template>
<script>
export default {
  props: ["title", "src", "thumbnail", "chapterList", "user"],
  data: () => ({
    controlVisibility: true,
    drawer: true,
    player: null,
    duration: null,
    playingChapter: 0
  }),
  methods: {
    playChapter(index) {
      this.player.currentTime = this.chapterList[index].startTime;
      this.player.pause();
    },
    videoTimeUpdated: function() {
      this.duration = this.player.currentTime;
    },
    hideControls() {
      setTimeout(() => {
        this.controlVisibility = false;
      }, 2000);
    }
  },
  watch: {
    duration(value) {
      for (let i = 0; i < this.chapterList.length; i++) {
        if (value >= this.chapterList[i].startTime) {
          this.playingChapter = i;
        }
      }
    }
  },
  mounted() {
    this.player = this.$refs.player.player;
  }
};
</script>
