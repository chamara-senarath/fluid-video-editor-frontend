<template>
  <v-row justify="center">
    <v-dialog :value="showPlayer" persistent width="70vw">
      <v-btn @click="close" block small tile
        >Close Player<v-icon right small color="red">fa fa-close</v-icon></v-btn
      >

      <v-card tile height="81vh">
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
  props: ["showPlayer", "src"],

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
