<template>
  <v-container fluid>
    <v-layout row justify-center>
      <v-flex xs12 md4 v-for="(item, index) in watchList" :key="index" pa-2>
        <v-card dark :color="`${item.color} lighten-1`">
          <v-card-title :class="`${item.color} darken-1`">
            {{ item.title }}
            <v-icon right>{{ item.icon }}</v-icon>
          </v-card-title>
          <v-card-text>
            <v-layout row mt-2>
              <v-flex xs3 px-2>
                <v-avatar tile size="100"
                  ><v-img :src="item.img"></v-img
                ></v-avatar>
              </v-flex>
              <v-flex xs9 px-3>
                <v-layout column>
                  <div class="title">{{ item.video }}</div>
                  <span>Total Views: {{ item.views }} </span>
                  <span>Total Likes: {{ item.likes }}</span>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-card>
      <v-card-title>
        Summary
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa fa-search"
          label="Search"
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
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      watchList: [
        {
          title: "Most Watched Video",
          video: "About DIPS",
          img: "https://picsum.photos/id/179/800/800",
          views: 1241,
          likes: 921,
          color: "green",
          icon: "fa fa-smile-beam"
        },
        {
          title: "Least Watched Video",
          video: "DIPS Arena - eHealth solution",
          img: "https://picsum.photos/id/179/800/800",
          views: 51,
          likes: 1,
          color: "purple",
          icon: "fa fa-frown"
        },
        {
          title: "Frequently Watched Video",
          video: "Cross Team Forums",
          img: "https://picsum.photos/id/179/800/800",
          views: 933,
          likes: 124,
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
        { text: "Views", value: "views" },
        { text: "Likes", value: "likes" }
      ],
      items: [
        {
          name: "DIPS Arena - eHealth solution",
          views: 151,
          likes: 112
        },
        {
          name: "DIPS SL Team : Short Summary",
          views: 526,
          likes: 12
        },
        {
          name: "Cross Team Forums",
          views: 929,
          likes: 20
        }
      ]
    };
  }
};
</script>
