<template>
  <v-row justify="center">
    <v-dialog :value="showPlayer" persistent width="70vw">
      <v-app-bar dark dense>
        <v-layout row px-2>
          <v-flex xs10>
            <span class=" title">{{ title }}</span>
          </v-flex>
          <v-flex>
            <v-layout column align-end>
              <v-btn @click="close" color="red" fab outlined x-small dark
                ><v-icon color="red">fa fa-close</v-icon></v-btn
              >
            </v-layout>
          </v-flex>
        </v-layout>
      </v-app-bar>
      <v-card tile height="81vh" v-if="src != null">
        <iframe
          ref="frame"
          allowfullscreen
          :src="src"
          scrolling="no"
          frameborder="0"
          style="position: relative; height: 100%; width: 100%;"
        ></iframe>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["showPlayer", "src", "title"],

  methods: {
    close() {
      this.$emit("closePlayer", true);
    }
  },
  computed: {
    playerHeight() {
      return this.$refs.frame.getBoundingClientRect().height;
    }
  }
};
</script>
