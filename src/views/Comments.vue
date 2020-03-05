<template>
  <v-container fluid>
    <v-layout column>
      <span class="title">{{ title }}</span>
      <v-layout row mx-5 mb-10 mt-5 align-center>
        <v-flex xs4>
          <v-img
            style="outline-style: solid;outline-width:1px"
            v-if="thumbnail"
            :src="thumbnail"
          >
          </v-img>
        </v-flex>
        <v-flex>
          <v-layout column align-center>
            <v-flex>
              <span>{{
                $t(
                  ratings.length == 0 ? "No Ratings for this video" : "Ratings"
                )
              }}</span>
            </v-flex>
            <v-flex px-5 v-for="rating in ratings" :key="rating._id">
              <v-layout row>
                <v-rating
                  :value="rating.rate"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="15"
                ></v-rating>
                <v-flex ml-2>
                  <span class="subtitle-1">{{ rating.amount }}</span>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <span class="title">{{ $t("Comments") }}</span>
      <v-divider></v-divider>
      <v-layout v-if="comments.length == 0" mt-10 column align-center>
        <v-flex>
          <span>{{ $t("No Comments for this video") }}</span>
        </v-flex>
      </v-layout>
      <v-layout column mt-5>
        <v-flex px-5 mt-2 v-for="comment in comments" :key="comment._id">
          <v-card outlined>
            <v-card-text>
              <v-layout column>
                <v-layout row px-3>
                  <v-flex xs11>
                    <span>{{ comment.user.name }}</span>
                  </v-flex>
                  <v-flex>
                    <span>{{ comment.date.split("T")[0] }}</span>
                  </v-flex>
                </v-layout>
                <v-rating
                  :value="comment.rating"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
                ></v-rating>
                <span>{{ comment.comment }}</span>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      title: null,
      thumbnail: null,
      ratings: [],
      comments: []
    };
  },
  async mounted() {
    let vid = this.$route.params.vid;
    try {
      this.thumbnail = this.API_URL + "/api/video/splash?id=" + vid;
      let ratingResult = await axios.get(
        this.API_URL + "/api/rating/comment?vid=" + vid
      );
      this.title = ratingResult.data.title;
      this.ratings = ratingResult.data.rating;
      this.comments = ratingResult.data.comments;
    } catch (error) {
      console.log(error.toString());
    }
  }
};
</script>
