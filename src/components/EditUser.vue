<template>
  <v-container fluid px-10 py-5>
    <AreYouSure
      :showConfirmation="showConfirmation"
      :options="deleteOptions"
      @userAnswer="userAnswer"
    />
    <v-form ref="form_update">
      <v-toolbar elevation="0" dark color="teal">
        <v-toolbar-title>Search User</v-toolbar-title>
        <v-autocomplete
          @click="
            () => {
              this.select = null;
            }
          "
          v-model="select"
          :loading="loading"
          :items="users"
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="Enter Username"
          item-text="username"
          item-value="username"
          solo-inverted
          dense
        >
          <template v-slot:selection="data">
            {{ data.item.name }}
          </template>
          <template v-slot:item="data">
            <template>
              <v-list-item-content>
                <v-list-item-title v-html="data.item.name"></v-list-item-title>
                <v-list-item-subtitle
                  v-html="data.item.username"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
      </v-toolbar>

      <div :style="{ marginTop: '20px' }" v-if="select != null">
        <v-text-field
          :rules="rules.username"
          label="Username"
          v-model="username"
          readonly
        />
        <v-text-field
          :rules="rules.displayName"
          label="Display Name"
          v-model="displayName"
        />
        <span class="caption red--text" v-if="protectPassword"
          >*Double click Password field to edit</span
        >

        <v-text-field
          @dblclick="unprotect"
          :rules="rules.defaultPassword"
          label="Password"
          v-model="defaultPassword"
          :readonly="protectPassword"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
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
        <v-layout row align-center mb-2>
          <v-switch
            v-if="!is_same_user"
            color="red"
            v-model="is_admin"
            label="Make Admin"
          ></v-switch>
          <v-spacer></v-spacer>
          <span v-if="is_admin" class="subtitle red--text"
            >*{{ is_same_user ? "You are " : "This user is " }} an admin</span
          >
        </v-layout>
        <v-btn @click="submit" block dark elevation="0" color="green darken-2"
          >Update User</v-btn
        >
        <div class="mt-1"></div>
        <v-btn
          v-if="!is_same_user"
          @click="deleteUser"
          block
          dark
          elevation="0"
          color="red darken-2"
          >Delete User</v-btn
        >
      </div>
    </v-form>
  </v-container>
</template>

<script>
  import AreYouSure from "../components/AreYouSure";
  import { mapGetters } from "vuex";
  import axios from "axios";
  import { positionList, teamList } from "../lib/dataList";
  export default {
    props: ["rules", "submitUser"],
    components: {
      AreYouSure,
    },
    data() {
      return {
        showConfirmation: false,
        deleteOptions: {
          title: "Delete User",
          content:
            "If you delete a user, all the records of the user is deleted. Do you really want to delete this user?",
          yes: "Yes, Delete this",
          no: "No, Do not delete this",
        },
        username: null,
        displayName: null,
        is_admin: false,
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
        users: [],
        usersObj: [],
        protectPassword: true,
        is_same_user: false,
        show1: false,
      };
    },
    watch: {
      select(val) {
        this.is_same_user = false;
        this.protectPassword = true;
        if (val == null) {
          return;
        }
        let user = this.usersObj.find((user) => user.username === val);
        if (user._id === this.getProfile().id) {
          this.is_same_user = true;
        }
        this.username = user.username;
        this.displayName = user.name;
        this.defaultPassword = "******";
        this.team = user.team;
        this.position = user.position;
        this.gender = user.gender;
        this.is_admin = user.role === "admin" ? true : false;
      },
    },
    methods: {
      ...mapGetters(["getProfile"]),
      unprotect() {
        this.protectPassword = false;
        this.defaultPassword = "";
      },
      userAnswer(ans) {
        if (ans === "yes") {
          this.submitUser(
            this.$refs.form_update,
            "delete",
            {
              username: this.username,
            },
            this.fetchUsers
          );
          this.showConfirmation = false;
        }
        if (ans === "no") {
          this.showConfirmation = false;
        }
      },
      deleteUser() {
        this.showConfirmation = true;
      },
      submit() {
        this.submitUser(
          this.$refs.form_update,
          "edit",
          {
            username: this.username,
            displayName: this.displayName,
            defaultPassword:
              this.defaultPassword === "******" || ""
                ? null
                : this.defaultPassword,
            team: this.team,
            position: this.position,
            gender: this.gender,
            role: this.is_admin ? "admin" : "user",
          },
          this.fetchUsers
        );
      },
      async fetchUsers() {
        try {
          let result = await axios.get(this.API_URL + "/api/user/search");
          this.usersObj = result.data;
          this.users = result.data.map((user) => {
            return { id: user._id, name: user.name, username: user.username };
          });
        } catch (error) {
          console.log(error);
        }
      },
    },
    mounted() {
      this.fetchUsers();
    },
  };
</script>
