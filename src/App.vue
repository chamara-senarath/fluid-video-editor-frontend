<template>
  <v-app>
    <Navbar v-if="$route.name != 'Search' && $route.name != 'User'"></Navbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer v-if="$route.name != 'Embed'" color="blue-grey darken-4" app>
      <span class="white--text mx-auto">© DIPS. 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
import { mapGetters } from "vuex";
export default {
  components: {
    Navbar
  },
  methods: {
    ...mapGetters(["getLanguage"])
  },
  mounted() {
    this.$i18n.locale = this.getLanguage();
  }
};
</script>
