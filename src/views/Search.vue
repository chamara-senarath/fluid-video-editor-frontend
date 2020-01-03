<template>
  <v-container fluid>
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
                  style="height: 30%;"
                >
                  <v-container>
                    <v-layout row>
                      <v-flex px-1 xs6>
                        <v-btn
                          block
                          :to="{
                            name: 'Insight',
                            params: { vid: thumbnail.id }
                          }"
                          ><v-icon left>fa fa-chart-line</v-icon>Insights</v-btn
                        >
                      </v-flex>
                      <v-flex px-1 xs6>
                        <v-btn @click="edit(thumbnail.id)" block
                          ><v-icon left>fa fa-edit</v-icon>Edit</v-btn
                        >
                      </v-flex>
                    </v-layout>
                  </v-container>
                </div>
              </v-expand-transition>
            </v-img>
            <v-card-title>
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
                <v-layout row justify-end>
                  <v-btn
                    fab
                    elevation="0"
                    outlined
                    small
                    @click="showConfirmation = true"
                    ><v-icon color="red" small>fa fa-trash-alt</v-icon></v-btn
                  >
                </v-layout>
              </v-layout>
            </v-card-title>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import AreYouSure from "@/components/AreYouSure";
import { mapMutations } from "vuex";
export default {
  components: {
    AreYouSure
  },
  data() {
    return {
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
        this.$router.push({ name: "upload" });
      });
    },
    async userAnswer(val) {
      if (val == "yes") {
        try {
          await axios.delete(
            this.API_URL + "/api/video/file?id=" + this.getVideoObject().id
          );
        } catch (error) {
          console.log(error);
        }
      }
      this.showConfirmation = false;
    }
  },
  async mounted() {
    let videos = await axios.get(this.API_URL + "/api/videos");
    videos.data.forEach(video => {
      let obj = {
        id: video._id,
        title: video.title,
        img: this.API_URL + "/api/video/splash?id=" + video._id,
        rating: 3.2,
        rates: 1412
      };
      this.thumbnailList.push(obj);
    });
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
</style>
