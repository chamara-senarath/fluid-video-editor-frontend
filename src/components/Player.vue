<template>
  <v-container fluid>
    <v-layout row justify-space-around>
      <v-flex md3 v-if="this.items.length != 0">
        <v-card tile>
          <v-list rounded>
            <v-subheader>Chapters</v-subheader>
            <v-list-item-group v-model="item" color="primary">
              <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-icon>
                  <v-icon>fa fa-play</v-icon>
                </v-list-item-icon>
                <v-list-item-content @click="playChapter(i)">
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list> </v-card
      ></v-flex>
      <v-flex md8
        ><vue-plyr ref="player">
          <video :poster="thumbnail">
            <source :src="src" type="video/mp4" size="720" />
          </video>
        </vue-plyr>
        <v-alert
          v-if="this.items.length != 0"
          color="primary"
          dark
          icon="fa fa-play"
          border="left"
        >
          Now Playing: Chapter - {{ this.items[item].text }}
        </v-alert></v-flex
      >
    </v-layout>
  </v-container>
</template>
<script>
export default {
  props: ["src", "thumbnail", "chapterList"],
  data: () => ({
    player: null,
    item: 0,
    items: []
  }),
  methods: {
    playChapter(index) {
      this.player.currentTime = this.items[index].startTime;
      this.player.pause();
    }
  },
  mounted() {
    this.player = this.$refs.player.player;
    this.items = this.chapterList;
  }
};
</script>
