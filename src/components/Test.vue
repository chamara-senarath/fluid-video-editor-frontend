<template>
  <div style="position:relative">
    <div style="position:absolute;z-index:0">
      <vue-plyr
        ref="player"
        @enterfullscreen="exit"
        :emit="['enterfullscreen']"
      >
        <video size="720">
          <source
            src="https://d3f0mfyq5w9v4s.cloudfront.net/encoded/54ab108297e5f902008ab2ba/57aa3ba59476ed0300665927/288p_480kbps.mp4"
            type="video/mp4"
            size="720"
          />
        </video>
      </vue-plyr>
    </div>
    <v-card
      class="plyr--video plyr--video"
      color="red"
      width="100"
      height="100"
      style="position:absolute;z-index:2147483638"
    >
    </v-card>
  </div>
</template>

<script>
export default {
  methods: {
    exit() {
      console.log("efe");
      this.$refs.player.player.fullscreen.exit();
    }
  },
  mounted() {}
};
</script>
