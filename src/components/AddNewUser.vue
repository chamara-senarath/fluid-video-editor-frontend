<template>
  <v-container fluid px-10 py-5>
    <v-form ref="form_add">
      <v-text-field
        :rules="rules.username"
        label="Username"
        v-model="username"
      />
      <v-text-field
        :rules="rules.displayName"
        label="Display Name"
        v-model="displayName"
      />

      <v-text-field
        :rules="rules.defaultPassword"
        label="Default Password"
        v-model="defaultPassword"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        name="input-10-1"
        @click:append="show1 = !show1"
      ></v-text-field>
      <v-combobox
        :rules="rules.team"
        v-model="team"
        :items="teamList"
        label="Team"
      ></v-combobox>
      <v-combobox
        :rules="rules.position"
        v-model="position"
        :items="positionList"
        label="Position"
      ></v-combobox>
      <v-select
        :rules="rules.gender"
        v-model="gender"
        :items="genderList"
        label="Gender"
      ></v-select>
      <v-layout row align-center>
        <v-switch color="red" v-model="is_admin" label="Make Admin"></v-switch>
        <v-spacer></v-spacer>
        <span v-if="is_admin" class="subtitle red--text"
          >*This user is now an admin</span
        >
      </v-layout>
      <v-btn @click="submit" block dark elevation="0" color="green darken-2"
        >Add user</v-btn
      >
    </v-form>
  </v-container>
</template>

<script>
import { positionList, teamList } from "../lib/dataList";

export default {
  props: ["rules", "submitUser"],
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
      teamList: teamList,
      is_admin: false,
      show1: false,
    };
  },
  methods: {
    submit() {
      this.submitUser(
        this.$refs.form_add,
        "add",
        {
          username: this.username,
          displayName: this.displayName,
          defaultPassword: this.defaultPassword,
          team: this.team,
          position: this.position,
          gender: this.gender,
          role: this.is_admin ? "admin" : "user",
        },
        null
      );
    },
  },
};
</script>
