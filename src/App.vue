<template>
  <v-app>
    <Navbar></Navbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer color="blue darken-3" app>
      <span class="white--text mx-auto">Last Modified Date: 2019/11/29</span>
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
