<template>
  <v-container fluid>
    <Navbar @search="loadData"></Navbar>
    <MiniPlayer
      :showPlayer="showPlayer"
      :src="videoSource"
      @closePlayer="showPlayer = false"
    ></MiniPlayer>
    <v-layout column align-center v-if="error">
      <v-flex>
        <v-img src="/no_data_found.png" width="30vw"></v-img>
      </v-flex>
      <v-flex>
        <p class="title">Sorry, No data found</p>
      </v-flex>
    </v-layout>
    <v-layout v-else row>
      <v-flex
        px-3
        py-3
        md4
        v-for="thumbnail in thumbnailList"
        :key="thumbnail.id"
      >
        <v-card @click="gotoVideo(thumbnail.id)">
          <v-img :src="thumbnail.img"> </v-img>
          <v-card-title class="ellipsis">
            {{ thumbnail.title }}
          </v-card-title>

          <v-progress-linear
            :value="thumbnail.completed"
            color="red"
          ></v-progress-linear>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Navbar from "@/components/Navbar";
import MiniPlayer from "@/components/MiniPlayer";
import axios from "axios";
export default {
  components: {
    Navbar,
    MiniPlayer
  },
  data() {
    return {
      thumbnailList: [],
      showPlayer: false,
      videoSource: null,
      error: null
    };
  },
  methods: {
    gotoVideo(id) {
      this.videoSource = this.API_URL + "/embed?vid=" + id;
      this.showPlayer = true;
    },
    async loadData(val) {
      this.thumbnailList = [];
      try {
        let videos = await axios.get(
          this.API_URL + "/api/video/search?key=" + val
        );
        this.pushData(videos.data);
      } catch (error) {
        this.error = error;
      }
    },
    pushData(videos) {
      videos.forEach(video => {
        let obj = {
          id: video._id,
          title: video.title,
          img: this.API_URL + "/api/video/splash?id=" + video._id,
          rating: 3.2,
          rates: 1412,
          completed: 30
        };
        this.thumbnailList.push(obj);
      });
      this.error = false;
      if (this.thumbnailList.length == 0) {
        this.error = true;
      }
    }
  },
  async mounted() {
    try {
      let videos = await axios.get(this.API_URL + "/api/videos");
      this.pushData(videos.data);
    } catch (error) {
      this.error = error;
    }
  }
};
</script>

<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 0.8;
  position: absolute;
  width: 100%;
}
.ellipsis {
  text-overflow: ellipsis;

  /* Required for text-overflow to do anything */
  white-space: nowrap;
  overflow: hidden;
}
</style>
