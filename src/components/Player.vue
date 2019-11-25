/* eslint no-use-before-define: 0 */
<template>
  <v-container>
    <v-sheet class="overflow-hidden" style="position: relative;">
      <v-layout column>
        <!-- <v-overlay :absolute="true" opacity="0.5" :value="true" z-index="10">
            <v-btn color="primary" @click="overlay = false">
              Hide Overlay
            </v-btn>
          </v-overlay> -->
        <vue-plyr
          @timeupdate="videoTimeUpdated"
          :emit="['timeupdate']"
          ref="player"
        >
          <video :poster="thumbnail">
            <source :src="src" type="video/mp4" size="1080" />
          </video>
        </vue-plyr>

        <v-btn
          @click.stop="drawer = !drawer"
          color="pink"
          small
          dark
          absolute
          right
          fab
        >
          <v-icon>fa fa-list-ul</v-icon>
        </v-btn>

        <v-alert
          v-if="this.chapterList.length != 0"
          color="primary"
          dark
          border="left"
        >
          Now Playing: Chapter - {{ chapterList[playingChapter].text }}
        </v-alert>
      </v-layout>

      <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
        dark
        color="rgba(255, 255, 255, 0.4)"
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

        <v-layout my-3 row justify-center>
          <v-icon left>fa fa-list-ul</v-icon>
          <span class="title white--text">Chapter List</span>
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
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-sheet>
  </v-container>
</template>
<script>
export default {
  props: ["src", "thumbnail", "chapterList", "user"],
  data: () => ({
    drawer: null,
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
