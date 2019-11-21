/* eslint no-use-before-define: 0 */
<template>
  <v-container fluid>
    <v-sheet class="overflow-hidden" style="position: relative;">
      <v-container class="fill-height">
        <v-layout column>
          <vue-plyr
            @timeupdate="videoTimeUpdated"
            :emit="['timeupdate']"
            ref="player"
          >
            <video :poster="thumbnail">
              <source :src="src" type="video/mp4" size="720" />
            </video>
          </vue-plyr>

          <v-alert
            v-if="this.chapterList.length != 0"
            color="primary"
            dark
            icon="fa fa-play"
            border="left"
          >
            Now Playing: Chapter - {{ chapterList[playingChapter].text }}
            <v-fab-transition>
              <v-btn
                @click.stop="drawer = !drawer"
                color="pink"
                small
                dark
                absolute
                bottom
                right
                fab
              >
                <v-icon>fa fa-list-ul</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-alert>
        </v-layout>
      </v-container>

      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Chamara Senarath</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item
            v-for="(item, i) in chapterList"
            :key="i"
            link
            @click="playChapter(i)"
          >
            <v-list-item-icon>
              <v-icon>fa fa-bookmark-o</v-icon>
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
  props: ["src", "thumbnail", "chapterList"],
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
