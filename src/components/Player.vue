/* eslint no-use-before-define: 0 */
<template>
  <v-sheet class="overflow-hidden" style="position: relative;">
    <v-layout column>
      <!-- <v-overlay :absolute="true" opacity="0.5" :value="true">
          ddd
        </v-overlay> -->
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
        v-if="this.chapterList.length != 0"
        @mouseover="controlVisibility = true"
        @mouseleave="hideControls"
        @click.stop="drawer = !drawer"
        :color="
          controlVisibility
            ? 'rgba(61, 203, 255, 0.4)'
            : 'rgba(61, 203, 255, 0.1)'
        "
        small
        dark
        absolute
        right
      >
        <span
          v-if="this.chapterList.length != 0 && this.controlVisibility"
          color="primary"
          dark
        >
          {{ title }} | Chapter -
          {{ chapterList[playingChapter].text }}
        </span>
        <v-icon
          right
          dark
          :color="
            controlVisibility
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(255, 255, 255, 0.4)'
          "
          >fa fa-list-ul</v-icon
        >
      </v-btn>
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
</template>
<script>
export default {
  props: ["title", "src", "thumbnail", "chapterList", "user"],
  data: () => ({
    controlVisibility: false,
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
