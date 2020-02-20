<template>
  <v-container fluid>
    <Navbar @search="loadData"></Navbar>
    <MiniPlayer
      :showPlayer="showPlayer"
      :src="videoSource"
      @closePlayer="closePlayer"
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
        xs12
        sm6
        md4
        lg3
        v-for="thumbnail in thumbnailList"
        :key="thumbnail.id"
      >
        <v-card @click="gotoVideo(thumbnail.id)">
          <v-img :src="thumbnail.img"> </v-img>
          <v-card-title class="ellipsis">
            {{ thumbnail.title }}
          </v-card-title>
          <v-rating
            :value="thumbnail.rating"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
          ></v-rating>
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
      uid: null,
      thumbnailList: [],
      showPlayer: false,
      videoSource: null,
      error: null
    };
  },
  methods: {
    gotoVideo(id) {
      this.videoSource = this.API_URL + "/embed/" + id + "/" + this.uid;
      this.showPlayer = true;
    },
    async loadData({ key, option }) {
      this.thumbnailList = [];
      try {
        let videos = await axios.get(
          this.API_URL +
            "/api/insight/user/search?key=" +
            key +
            "&uid=" +
            this.uid +
            "&option=" +
            option
        );
        this.pushData(videos.data);
      } catch (error) {
        this.error = error;
      }
    },
    pushData(videos) {
      videos.forEach(video => {
        let obj = {
          id: video.video._id,
          title: video.video.title,
          img: this.API_URL + "/api/video/splash?id=" + video.video._id,
          rating:
            video.video.rating.users == 0
              ? 0
              : video.video.rating.rating / video.video.rating.users,
          rates: video.video.rating.users,
          completed: video.video.percentage
        };
        this.thumbnailList.push(obj);
      });
      this.error = false;
      if (this.thumbnailList.length == 0) {
        this.error = true;
      }
    },
    closePlayer() {
      this.showPlayer = false;
      this.fetchData();
    },
    async fetchData() {
      this.thumbnailList = [];
      try {
        let videos = await axios.get(
          this.API_URL + "/api/insight/user/all?uid=" + this.uid
        );
        this.pushData(videos.data.videos);
      } catch (error) {
        this.error = error;
      }
    }
  },
  async mounted() {
    this.uid = this.$route.params.uid;
    //forward to 404 when no user found
    let res = await axios.get(this.API_URL + "/api/user?id=" + this.uid);
    if (res.status == 204 || res.status == 400 || res.status == 404) {
      this.$router.push("/404");
      return;
    }
    this.fetchData();
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
  margin-right: 1vw;
  text-overflow: ellipsis;

  /* Required for text-overflow to do anything */
  white-space: nowrap;
  overflow: hidden;
}
</style>
