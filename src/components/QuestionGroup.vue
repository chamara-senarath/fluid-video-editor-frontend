<template>
  <v-layout column>
    <v-layout>
      <strong class="title white--text">{{ $t("Questions") }}</strong>
    </v-layout>
    <v-layout row>
      <v-chip
        v-for="(question, index) in questions"
        :key="index"
        class="ma-2"
        :color="
          question.is_answered
            ? `rgba(0,150,136,${opacity})`
            : `rgba(84,110,122,${opacity})`
        "
        text-color="white"
      >
        Q{{ index + 1 }}
        <v-avatar right v-if="question.is_correct">
          <v-icon>mdi-checkbox-marked-circle</v-icon>
        </v-avatar>
      </v-chip>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  props: ["questions", "opacity"]
};
</script>
