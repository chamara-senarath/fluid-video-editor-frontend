<template>
  <v-container fluid px-10 py-5>
    <v-dialog persistent v-model="dialog" width="500">
      <v-card dark width="100vw" color="rgba(0,0,0,0.2)">
        <v-card-text>
          <v-container>
            <v-layout column align-center>
              <v-progress-circular
                v-if="!is_updated"
                :size="150"
                color="primary"
                indeterminate
              ></v-progress-circular>
              <v-icon v-if="is_updated" color="green" size="150"
                >fa fa-check</v-icon
              >
              <v-flex mt-5>
                <span class="title">{{
                  is_updated ? "Updated Successfully" : "Updating"
                }}</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <AreYouSure
      :showConfirmation="showConfirmation"
      :options="passwordUpdateOptions"
      @userAnswer="userAnswer"
    />
    <v-layout column align-center>
      <v-avatar size="100">
        <img src="/avatar.png" />
      </v-avatar>
      <span class="title mt-3">{{ displayName }}</span>
    </v-layout>
    <v-form ref="form">
      <v-alert v-if="error" type="error">
        {{ error }}
      </v-alert>
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
      <v-checkbox
        color="red"
        v-model="resetPassword"
        label="Reset Password"
      ></v-checkbox>

      <div v-if="resetPassword">
        <v-text-field
          :rules="rules.defaultPassword"
          label="Old Password"
          v-model="oldPassword"
          type="password"
        />
        <v-text-field
          :rules="rules.defaultPassword"
          label="New Password"
          v-model="newPassword"
          type="password"
        />
        <v-text-field
          :rules="rules.confirmPassword"
          label="Confirm New Password"
          v-model="confirmNewPassword"
          type="password"
        />
      </div>

      <v-combobox
        :rules="rules.team"
        v-model="team"
        label="Team"
        disabled
      ></v-combobox>
      <v-combobox
        :rules="rules.position"
        v-model="position"
        label="Position"
        disabled
      ></v-combobox>
      <v-select
        :rules="rules.gender"
        v-model="gender"
        :items="genderList"
        label="Gender"
      ></v-select>
      <v-btn @click="submit" block dark elevation="0" color="green darken-2"
        >Update</v-btn
      >
    </v-form>
  </v-container>
</template>

<script>
import AreYouSure from "../components/AreYouSure";
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  components: {
    AreYouSure
  },
  data() {
    return {
      error: null,
      dialog: false,
      is_updated: false,
      resetPassword: false,
      showConfirmation: false,
      passwordUpdateOptions: {
        title: "Reset Password",
        content: "Do you really need to reset your password?",
        yes: "Yes, Reset my password",
        no: "No, Do not reset"
      },
      username: null,
      displayName: null,
      is_admin: false,
      oldPassword: null,
      newPassword: null,
      confirmNewPassword: null,
      team: null,
      position: null,
      gender: null,
      genderList: ["Male", "Female"],
      rules: {
        username: [
          value => (value && value.length > 0) || "Username can not be empty"
        ],
        displayName: [
          value =>
            (value && value.length > 0) || "Display Name can not be empty"
        ],
        defaultPassword: [
          value => (value && value.length > 0) || "This field can not be empty"
        ],
        confirmPassword: [
          value => (value && value.length > 0) || "This field can not be empty",
          value => value === this.newPassword || "Password not match"
        ],
        team: [
          value => (value && value.length > 0) || "Teams can not be empty"
        ],
        position: [
          value => (value && value.length > 0) || "Position can not be empty"
        ],
        gender: [
          value => (value && value.length > 0) || "Gender can not be empty"
        ]
      }
    };
  },
  watch: {
    resetPassword(val) {
      if (val) {
        this.showConfirmation = true;
      }
    }
  },
  methods: {
    ...mapGetters(["getProfile"]),
    userAnswer(ans) {
      if (ans === "yes") {
        this.resetPassword = true;
        this.showConfirmation = false;
      } else {
        this.resetPassword = false;
        this.showConfirmation = false;
      }
    },
    success() {
      this.is_updated = true;
      this.error = null;
      setTimeout(() => {
        this.dialog = false;
      }, 500);
    },
    async submit() {
      let form = this.$refs.form;
      if (!form.validate()) {
        return;
      }
      this.is_updated = false;
      this.dialog = true;
      let userObj = {
        username: this.username,
        name: this.displayName,
        gender: this.gender
      };
      if (this.resetPassword) {
        userObj = {
          ...userObj,
          password: this.newPassword,
          oldPassword: this.oldPassword
        };
      }

      let result = await axios.patch(
        this.API_URL + "/api/user/profile",
        userObj
      );
      if (result.data.error) {
        this.dialog = false;
        this.error = result.data.error;
        return;
      }
      this.success();
    },
    async fetchData() {
      try {
        let result = await axios.get(
          this.API_URL + "/api/user?id=" + this.getProfile().id
        );

        let user = result.data;
        this.username = user.username;
        this.displayName = user.name;
        this.team = user.team;
        this.position = user.position;
        this.gender = user.gender;
      } catch (error) {
        this.dialog = false;
      }
    }
  },

  mounted() {
    this.fetchData();
  }
};
</script>
