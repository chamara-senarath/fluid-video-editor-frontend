<template>
  <v-layout column align-center>
    <v-img width="50vw" src="/404.png"></v-img>
    <v-layout mt-4></v-layout>
    <p class="headline">
      {{ $t("Sorry, We can not find what you are searching for") }}
    </p>
    <v-btn to="/" rounded dark depressed color="#00868E">{{
      $t("Go Home")
    }}</v-btn>
  </v-layout>
</template>
