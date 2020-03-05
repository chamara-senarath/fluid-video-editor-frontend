<template>
  <v-row justify="center">
    <v-dialog :value="showConfirmation" persistent width="50vw">
      <v-card>
        <v-card-title class="headline"
          ><v-layout column align-center>
            <v-img src="/are_you_sure.png" width="10vw"></v-img>
            {{ $t(options.title) }}?
          </v-layout></v-card-title
        >
        <v-card-text
          ><v-layout column align-center>
            {{ $t(options.content) }}
          </v-layout></v-card-text
        >
        <v-card-actions>
          <v-btn color="orange darken-1" text @click="submit('no')">{{
            $t(options.no)
          }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="submit('yes')">{{
            $t(options.yes)
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
