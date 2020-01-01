<template>
  <nav v-if="$route.name != 'Embed'">
    <v-app-bar color="blue darken-3" app dark>
      <v-app-bar-nav-icon
        v-if="isLogged"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>
        Training Catalog <strong class="red--text">|</strong> Video Editor
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-text-field
        v-if="$route.name == 'Search' || $route.name == 'User'"
        placeholder="Search..."
        single-line
        append-icon="fa fa-search"
        color="white"
        hide-details
      />
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            color="rgba(0,0,0,0.3)"
            small
            fab
            depressed
            @click="$vuetify.theme.dark = !$vuetify.theme.dark"
          >
            <v-icon small>{{
              $vuetify.theme.dark ? "fa fa-moon" : "fa fa-sun"
            }}</v-icon>
          </v-btn>
        </template>
        <span>Dark Mode Toggle</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            color="rgba(0,0,0,0.3)"
            fab
            small
            v-if="isLogged"
            depressed
            :to="$route.name == 'upload' ? '/' : '/upload'"
          >
            <v-icon small>{{
              $route.name == "upload" ? "fa fa-search" : "fa fa-upload"
            }}</v-icon>
          </v-btn>
        </template>
        <span>{{ $route.name == "upload" ? "Search" : "Upload" }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            color="rgba(0,0,0,0.3)"
            fab
            small
            v-if="isLogged"
            depressed
            to="user"
            @click="logout"
          >
            <v-icon small>fa fa-sign-out-alt</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>
    </v-app-bar>

    <v-navigation-drawer v-if="getUser" v-model="drawer" app>
      <v-list-item>
        <v-layout column align-center>
          <v-flex mt-4 mb-3>
            <v-avatar size="100">
              <img :src="getUser.avatar" />
            </v-avatar>
          </v-flex>
          <v-flex>
            <p class="headline text-center">{{ getUser.name }}</p>
            <p class="subtitle-1 text-center">{{ getUser.role }}</p>
          </v-flex>
        </v-layout>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          color="blue darken-3"
          v-for="item in items"
          :key="item.title"
          link
          router
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isLogged: true, // TODO remove this when implement user login
      getUser: {
        name: "Chamara Senarath",
        role: "Administrator",
        avatar:
          "https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png"
      }, // TODO remove this when implement user login
      submitLoading: false,
      drawer: false,
      bg:
        "https://images.wallpaperscraft.com/image/corn_field_summer_124670_3840x2400.jpg",
      items: [
        { title: "Search", icon: "fa fa-search", path: "/" },
        { title: "Upload", icon: "fa fa-upload", path: "/upload" },
        { title: "Insight", icon: "fa fa-chart-line", path: "/report" }
      ]
    };
  },
  methods: {
    ...mapGetters["getVideoObject"],
    logout() {
      this.drawer = false;
      this.isLogged = false;
    }
  }
};
</script>
