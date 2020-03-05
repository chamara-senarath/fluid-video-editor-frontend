<template>
  <v-container fluid>
    <v-layout column align-center v-if="error">
      <v-flex>
        <v-img src="/no_data_found.png" width="30vw"></v-img>
      </v-flex>
      <v-flex>
        <p class="title">{{ $t("Sorry, No data found") }}</p>
      </v-flex>
    </v-layout>
    <template v-else>
      <span class="title">{{ $t("Video insight") }}</span>
      <v-layout row>
        <v-flex
          xs12
          md6
          lg4
          v-for="(item, index) in watchList"
          :key="index"
          pa-2
        >
          <v-card dark :color="`${item.color} lighten-1`" min-height="25vh">
            <v-card-title :class="`${item.color} darken-1`">
              {{ $t(item.title) }}
              <v-icon right>{{ item.icon }}</v-icon>
            </v-card-title>
            <v-card-text>
              <v-layout row mt-2>
                <v-flex xs3 px-2>
                  <v-img :src="item.img"></v-img>
                </v-flex>
                <v-flex xs9 px-12>
                  <v-layout column>
                    <div class="title">
                      {{ item.video | truncate(50, "...") }}
                    </div>
                    <span>{{ $t("Total Views") }}: {{ item.views }} </span>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-card>
        <v-card-title>
          {{ $t("Summary") }}
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="fa fa-search"
            :label="$t('Search')"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
        ></v-data-table>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      error: false,
      watchList: [
        {
          title: "Most Watched Video",
          color: "green",
          icon: "fa fa-smile-beam"
        },
        {
          title: "Least Watched Video",
          color: "purple",
          icon: "fa fa-frown"
        },
        {
          title: "Frequently Watched Video",
          color: "red",
          icon: "fa fa-wave-square"
        }
      ],
      search: "",
      headers: [
        {
          text: "Title",
          align: "left",
          value: "name"
        },
        { text: "Views", value: "views" }
      ],
      items: []
    };
  },
  async mounted() {
    try {
      let mostWatched = await axios.get(
        this.API_URL + "/api/insight/most_watched"
      );
      let leastWatched = await axios.get(
        this.API_URL + "/api/insight/least_watched"
      );
      let summary = await axios.get(this.API_URL + "/api/insight/summary");

      if (mostWatched.data) {
        this.watchList[0].video = mostWatched.data.title;
        this.watchList[0].views = mostWatched.data.views;
        this.watchList[0].img =
          this.API_URL + "/api/video/splash?id=" + mostWatched.data.id;
      }
      if (leastWatched.data) {
        this.watchList[1].video = leastWatched.data.title;
        this.watchList[1].views = leastWatched.data.views;
        this.watchList[1].img =
          this.API_URL + "/api/video/splash?id=" + leastWatched.data.id;
      }
      //TODO Change this to frequent watch
      if (mostWatched.data) {
        this.watchList[2].video = mostWatched.data.title;
        this.watchList[2].views = mostWatched.data.views;
        this.watchList[2].img =
          this.API_URL + "/api/video/splash?id=" + mostWatched.data.id;
      }

      if (summary.data && summary.data.length != 0) {
        summary.data.forEach(summary => {
          let obj = {
            name: summary.title,
            views: summary.totalViews
          };
          this.items.push(obj);
        });
      }
      this.error = false;
    } catch (error) {
      this.error = error;
    }
  }
};
</script>
