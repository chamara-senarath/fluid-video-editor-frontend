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
    <template v-else>
      <span class="title">Video List</span>
      <AreYouSure
        :showConfirmation="showConfirmation"
        :options="confirmationMessage"
        @userAnswer="userAnswer"
      ></AreYouSure>
      <v-layout row wrap>
        <v-flex
          px-3
          py-3
          xs12
          md4
          v-for="thumbnail in thumbnailList"
          :key="thumbnail.id"
        >
          <v-hover v-slot:default="{ hover }">
            <v-card>
              <v-img :src="thumbnail.img">
                <v-expand-transition>
                  <div
                    v-if="hover"
                    class=" transition-fast-in-fast-out black  v-card--reveal"
                    style="height: 8vh;"
                  >
                    <v-container>
                      <v-layout row justify-space-between px-2>
                        <v-flex px-1 xs4>
                          <v-btn
                            small
                            block
                            :to="{
                              name: 'Insight',
                              params: { vid: thumbnail.id }
                            }"
                            ><v-icon left>fa fa-chart-line</v-icon
                            >Insights</v-btn
                          >
                        </v-flex>
                        <v-flex px-1 xs4>
                          <v-btn small @click="edit(thumbnail.id)" block
                            ><v-icon left>fa fa-edit</v-icon>Edit</v-btn
                          >
                        </v-flex>
                        <v-flex px-1 xs4>
                          <v-btn
                            block
                            small
                            @click="
                              () => {
                                showConfirmation = true;
                                selectedID = thumbnail.id;
                              }
                            "
                          >
                            <v-icon left>fa fa-trash-alt</v-icon>Delete
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                </v-expand-transition>
              </v-img>
              <v-card-title class="ellipsis">
                <v-layout row>
                  <v-flex>
                    <v-layout column>
                      {{ thumbnail.title }}

                      <v-row align="center" class="mx-0">
                        <v-rating
                          :value="thumbnail.rating"
                          color="amber"
                          dense
                          half-increments
                          readonly
                          size="14"
                        ></v-rating>

                        <div class="grey--text ml-4 caption">
                          4.5 ({{ thumbnail.rates }})
                        </div>
                      </v-row>
                    </v-layout>
                  </v-flex>
                  <v-flex>
                    <v-layout column align-end>
                      <v-btn
                        @click="gotoVideo(thumbnail.id)"
                        small
                        elevation="0"
                        dark
                        fab
                        color="pink"
                        ><v-icon small dark>fa fa-play</v-icon></v-btn
                      >
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-title>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </template>
  </v-container>
</template>

<script>
import axios from "axios";
import AreYouSure from "@/components/AreYouSure";
import Navbar from "@/components/Navbar";
import MiniPlayer from "@/components/MiniPlayer";

import { mapMutations } from "vuex";
export default {
  components: {
    AreYouSure,
    Navbar,
    MiniPlayer
  },
  data() {
    return {
      error: false,
      showPlayer: false,
      videoSource: null,
      selectedID: null,
      thumbnailList: [],
      showConfirmation: false,
      confirmationMessage: {
        title: "Delete this video",
        content:
          "If you delete the video, this video will be deleted from your uploaded video list. Are you sure?",
        yes: "Yes, I am sure",
        no: "No, Keep me here"
      }
    };
  },
  methods: {
    ...mapMutations([
      "setVideoObject",
      "setSplashScreenObject",
      "setChapterMarks",
      "setQuestionMarks",
      "setWatermark"
    ]),
    gotoVideo(id) {
      this.videoSource = this.API_URL + "/embed?vid=" + id;
      this.showPlayer = true;
    },
    edit(id) {
      let videoURL = this.API_URL + "/api/video/file?id=" + id;
      let watermarkURL = this.API_URL + "/api/video/watermark?id=" + id;
      axios.get(this.API_URL + "/api/video?id=" + id).then(video => {
        this.setVideoObject({
          id: video.data._id,
          title: video.data.title,
          file: videoURL,
          authors: video.data.authors,
          tags: video.data.tags
        });
        this.setSplashScreenObject({
          data: "edit",
          duration: video.data.splashDuration
        });
        this.setChapterMarks(video.data.chapterMarks);
        this.setQuestionMarks(video.data.questions);
        this.setWatermark({
          ...video.data.watermark,
          file: watermarkURL
        });
        this.$router.push({ name: "upload", params: { is_edit: true } });
      });
    },
    async userAnswer(val) {
      if (val == "yes") {
        try {
          await axios.delete(
            this.API_URL + "/api/video/file?id=" + this.selectedID
          );
          this.thumbnailList = this.thumbnailList.filter(
            item => item.id != this.selectedID
          );
          this.error = false;
          if (this.thumbnailList.length == 0) {
            this.error = true;
          }
        } catch (error) {
          this.error = error;
        }
      }
      this.showConfirmation = false;
    },
    pushData(videos) {
      videos.forEach(video => {
        let obj = {
          id: video._id,
          title: video.title,
          img: this.API_URL + "/api/video/splash?id=" + video._id,
          rating: 3.2,
          rates: 1412
        };
        this.thumbnailList.push(obj);
      });
      this.error = false;
      if (this.thumbnailList.length == 0) {
        this.error = true;
      }
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
  white-space: nowrap;
  overflow: hidden;
}
</style>
