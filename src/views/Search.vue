<template>
  <v-container fluid>
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
            <v-img :src="thumbnail.img" height="194">
              <v-expand-transition>
                <div
                  v-if="hover"
                  class=" transition-fast-in-fast-out black  v-card--reveal"
                  style="height: 30%;"
                >
                  <v-container>
                    <v-layout row>
                      <v-flex px-1 xs6>
                        <v-btn block :to="{ name: 'Insight' }"
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
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      thumbnailList: [
        {
          id: "5e0d6fb24922641fe81a3cb5",
          title: "About DIPS",
          img: "https://picsum.photos/id/179/800/800",

          rating: 3.2,
          rates: 231
        },
        {
          id: 2,
          title: "DIPS Arena - eHealth solution",
          img: "https://picsum.photos/id/180/800/800",
          rating: 2.4,
          rates: 124
        },
        {
          id: 3,
          title: "DIPS SL Team Structure",
          img: "https://picsum.photos/id/191/800/800",
          rating: 4.6,
          rates: 6151
        },
        {
          id: 4,
          title: "DIPS SL Team : Short Summary",
          img: "https://picsum.photos/id/182/800/800",
          rating: 3.2,
          rates: 231
        },
        {
          id: 5,
          title: "Cross Team Forums",
          img: "https://picsum.photos/id/183/800/800",
          rating: 1.2,
          rates: 162
        },
        {
          id: 6,
          title: "Scrum Process",
          img: "https://picsum.photos/id/184/800/800",
          rating: 4.0,
          rates: 2131
        },
        {
          id: 7,
          title: "Mobile Development",
          img: "https://picsum.photos/id/185/800/800",
          rating: 3.2,
          rates: 231
        },
        {
          id: 8,
          title: "Database Development",
          img: "https://picsum.photos/id/189/800/800",
          rating: 3.2,
          rates: 1412
        }
      ]
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
          data: null,
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
</style>
