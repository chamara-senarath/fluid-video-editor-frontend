<template>
  <v-overlay :absolute="true" :value="overlay">
    <v-card class="elevation-16 mx-auto" width="300">
      <v-card-title class="headline" primary-title>
        Rate This Video
      </v-card-title>
      <v-card-text>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium
        optio velit, cumque quibusdam iste rerum!

        <div class="text-center mt-12">
          <v-rating
            v-model="rating"
            color="yellow darken-3"
            background-color="grey darken-1"
            empty-icon="$ratingFull"
            hover
          ></v-rating>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-space-between">
        <v-btn text @click="submit('close')">No Thanks</v-btn>
        <v-btn color="primary" text @click="submit('submit')">
          Rate Now
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  props: ["overlay"],
  data: () => ({
    rating: 0
  }),
  methods: {
    submit(option) {
      let value = this.rating;
      this.$emit("submit", { option, value });
    }
  }
};
</script>
