<template>
  <v-container fluid pa-10>
    <v-form ref="form_update">
      <v-toolbar elevation="0" dark color="teal">
        <v-toolbar-title>Search User</v-toolbar-title>
        <v-autocomplete
          v-model="select"
          :loading="loading"
          :items="users"
          cache-items
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="Enter Username or Display Name"
          solo-inverted
        ></v-autocomplete>
      </v-toolbar>

      <div :style="{ marginTop: '20px' }" v-if="select != null">
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
        />
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
        <v-btn @click="submit" block dark elevation="0" color="green darken-2"
          >Update User</v-btn
        >
      </div>
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
      loading: false,
      items: [],
      select: null,
      users: ["a", "b"]
    };
  },
  methods: {
    submit() {
      this.submitUser(this.$refs.form_update, "edit", {
        username: this.username,
        displayName: this.displayName,
        defaultPassword: this.defaultPassword,
        team: this.team,
        position: this.position,
        gender: this.gender
      });
    }
  }
};
</script>
