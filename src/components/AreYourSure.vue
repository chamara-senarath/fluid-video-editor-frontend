<template>
  <v-row justify="center">
    <v-dialog :value="showConfirmation" persistent width="50vw">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to leave this page?</v-card-title
        >
        <v-card-text
          >If you go back, your saved sates will be deleted. Are you sure you
          want to leave this page?</v-card-text
        >
        <v-card-actions>
          <v-btn color="orange darken-1" text @click="submit('no')"
            >No,Keep me here</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="submit('yes')"
            >Yes,I am sure</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["showConfirmation"],
  methods: {
    submit(val) {
      this.$emit("userAnswer", val);
    }
  }
};
</script>
