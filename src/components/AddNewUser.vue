<template>
  <v-container fluid pa-10>
    <v-form>
      <v-text-field label="Username" v-model="username" />
      <v-text-field label="Display Name" v-model="displayName" />
      <v-text-field label="Default Password" v-model="defaultPassword" />
      <v-combobox v-model="team" :items="teamList" label="Team"></v-combobox>
      <v-combobox
        v-model="position"
        :items="positionList"
        label="Position"
      ></v-combobox>
      <v-select v-model="gender" :items="genderList" label="Gender"></v-select>
      <v-btn block dark elevation="0" color="green darken-2">Add user</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { positionList, teamList } from "../lib/dataList";

export default {
  data() {
    return {
      username: null,
      displayName: null,
      defaultPassword: null,
      team: null,
      position: null,
      gender: null,
      genderList: ["Male", "Female"],
      positionList: positionList,
      teamList: teamList
    };
  }
};
</script>
