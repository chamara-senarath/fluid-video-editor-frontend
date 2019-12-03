<template>
  <v-layout column>
    <v-layout>
      <strong class="title">Questions</strong>
    </v-layout>
    <v-layout row>
      <v-chip
        disabled
        v-for="(question, index) in questions"
        :key="index"
        class="ma-2"
        color="teal"
        text-color="white"
      >
        Q{{ index + 1 }}
        <v-avatar right v-if="question.checked">
          <v-icon>mdi-checkbox-marked-circle</v-icon>
        </v-avatar>
      </v-chip>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  props: ["questions"]
};
</script>
