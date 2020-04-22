<template>
  <v-container fluid>
    <Navbar @search="loadData"></Navbar>
    <MiniPlayer
      :showPlayer="showPlayer"
      :src="videoSource"
      :title="videoTitle"
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
        <v-card>
          <v-img :src="thumbnail.img"> </v-img>
          <v-card-title class="ellipsis">
            {{ thumbnail.title }}
          </v-card-title>
          <v-row align="center" class="mb-2 mx-3">
            <v-rating
              :value="thumbnail.rating"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>
            <router-link
              :to="{
                name: 'Comments',
                params: { vid: thumbnail.id },
              }"
            >
              <span class="grey--text ml-4 caption">
                {{ thumbnail.rating.toFixed(1) }} ({{ thumbnail.rates }})
              </span>
            </router-link>
            <v-layout column align-end>
              <v-btn
                @click="gotoVideo(thumbnail)"
                x-small
                elevation="0"
                dark
                fab
                color="pink"
                ><v-icon small dark>fa fa-play</v-icon></v-btn
              >
            </v-layout>
          </v-row>
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
import { mapGetters } from "vuex";
export default {
  components: {
    Navbar,
    MiniPlayer,
  },
  data() {
    return {
      uid: null,
      thumbnailList: [],
      showPlayer: false,
      videoSource: null,
      videoTitle: null,
      percentagesList: [],
      error: null,
    };
  },
  methods: {
    ...mapGetters(["getProfile"]),
    gotoVideo(thumbnail) {
      let id = thumbnail.id;
      this.videoTitle = thumbnail.title;
      this.videoSource = this.API_URL + "/embed/" + id + "/" + this.uid;
      this.showPlayer = true;
    },
    async loadData({ key, option }) {
      this.thumbnailList = [];
      try {
        let videos = await axios.get(
          this.API_URL +
            "/api/video/search?key=" +
            key +
            "&option=" +
            option +
            "&group=" +
            this.getProfile().group
        );
        this.pushData(videos.data);
      } catch (error) {
        this.error = error;
      }
    },
    pushData(videos) {
      videos.forEach((video) => {
        let obj = {
          id: video._id,
          title: video.title,
          img: this.API_URL + "/api/video/splash?id=" + video._id,
          rating:
            video.rating.users == 0
              ? 0
              : video.rating.rating / video.rating.users,
          rates: video.rating.users,
          completed: this.findPercentage(video._id),
        };
        this.thumbnailList.push(obj);
      });
      this.error = false;
      if (this.thumbnailList.length == 0) {
        this.error = true;
      }
    },
    closePlayer() {
      this.videoSource = null;
      this.showPlayer = false;
      this.fetchData();
    },
    async fetchData() {
      this.thumbnailList = [];
      try {
        let videos = await axios.get(
          this.API_URL + "/api/videos?group=" + this.getProfile().group
        );
        this.pushData(videos.data);
      } catch (error) {
        this.error = error;
      }
    },
    findPercentage(id) {
      let item = this.percentagesList.find((ele) => ele.video == id);
      if (item) {
        return item.percentage;
      } else {
        return 0;
      }
    },
  },

  async mounted() {
    this.uid = this.$route.params.uid;
    try {
      //forward to 404 when no user found
      let videoListResult = await axios.get(
        this.API_URL + "/api/user?id=" + this.uid
      );
      if (
        videoListResult.status == 204 ||
        videoListResult.status == 400 ||
        videoListResult.status == 404
      ) {
        this.$router.push("/404");
        return;
      }
      let percentageListResult = await axios.get(
        this.API_URL + "/api/insight/user/all?uid=" + this.uid
      );
      if (percentageListResult.data) {
        this.percentagesList = percentageListResult.data;
      }
      this.fetchData();
    } catch (error) {
      console.log(error);
    }
  },
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
