<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Search Video
      </v-card-title>

      <v-card-text>
        <v-layout column>
          <v-flex>
            <v-text-field
              @input="searchVideo"
              label="Search Video"
              prepend-icon="fa fa-search"
            ></v-text-field>
          </v-flex>
          <v-layout row wrap>
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
              <v-card @click="select = thumbnail.title">
                <v-img :src="thumbnail.img"> </v-img>
                <v-card-title class="ellipsis">
                  <v-layout row justify-end>
                    <v-icon
                      v-if="select === thumbnail.title"
                      color="green"
                      right
                      small
                      >fa fa-check-circle</v-icon
                    >
                    <v-flex xs12>
                      <v-layout column>
                        <span class="caption"> {{ thumbnail.title }}</span>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="submit">
          Done
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  props: ["dialog"],
  data() {
    return {
      select: null,
      videos: [],
      thumbnailList: [],
    };
  },
  methods: {
    ...mapGetters(["getProfile"]),
    submit() {
      this.$emit("videoSelected", this.select);
    },
    async searchVideo(e) {
      this.thumbnailList = [];
      this.select = null;
      if (e === "") {
        return;
      }
      let key = e;
      let option = "All";
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
      const modifiedVideos = videos.map((video) => {
        if (!video.rating) {
          video.rtn = 0;
          video.rts = 0;
        } else {
          video.rtn =
            video.rating.rating && video.rating.users
              ? video.rating.rating / video.rating.users
              : 0;
          video.rts = video.rating.users;
        }
        return video;
      });
      modifiedVideos.forEach((video) => {
        let obj = {
          id: video._id,
          title: video.title,
          img: this.API_URL + "/api/video/splash?id=" + video._id,
          rating: video.rtn,
          rates: video.rts,
        };
        this.thumbnailList.push(obj);
      });
      this.error = false;
      if (this.thumbnailList.length == 0) {
        this.error = true;
      }
    },
  },
};
</script>
