<template>
  <v-app>
    <Navbar v-if="$route.name != 'Search' && $route.name != 'User'"></Navbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer v-if="$route.name != 'Embed'" color="blue-grey darken-4" app>
      <span class="white--text mx-auto">Last Modified Date: 2020/01/23</span>
      <span class="white--text ">© DIPS</span>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
export default {
  components: {
    Navbar
  }
};
</script>
