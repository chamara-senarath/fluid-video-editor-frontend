<template>
  <nav>
    <v-app-bar color="green darken-3" app dark>
      <v-app-bar-nav-icon
        v-if="isLogged"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-avatar tile width="100">
          <img src="@/assets/logo_banner.png" />
        </v-avatar>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="hidden-xs-only"
        v-if="isLogged"
        depressed
        outlined
        @click="logout"
      >
        <v-icon left>fa fa-sign-out-alt</v-icon>
        <span>Logout</span>
      </v-btn>
      <v-btn
        :loading="submitLoading"
        small
        class="hidden-sm-and-up"
        v-if="isLogged"
        depressed
        outlined
        @click="logout"
      >
        <v-icon small>fa fa-sign-out-alt</v-icon>
      </v-btn>
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
          color="green darken-3"
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
export default {
  data() {
    return {
      isLogged: true, // TODO remove this when implement user login
      getUser: true, // TODO remove this when implement user login
      submitLoading: false,
      drawer: true,
      bg:
        "https://images.wallpaperscraft.com/image/corn_field_summer_124670_3840x2400.jpg",
      items: [
        { title: "Search", icon: "fa fa-search", path: "/" },
        { title: "Upload", icon: "fa fa-upload", path: "/upload" }
      ]
    };
  },
  methods: {
    logout() {}
  }
};
</script>
