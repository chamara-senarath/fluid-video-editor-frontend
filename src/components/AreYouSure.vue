<template>
  <v-row justify="center">
    <v-dialog :value="showConfirmation" persistent width="50vw">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to {{ options.title }}?</v-card-title
        >
        <v-card-text>{{ options.content }}</v-card-text>
        <v-card-actions>
          <v-btn color="orange darken-1" text @click="submit('no')">{{
            options.no
          }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="submit('yes')">{{
            options.yes
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["showConfirmation", "options"],
  methods: {
    submit(val) {
      this.$emit("userAnswer", val);
    }
  }
};
</script>
