<template>
  <v-container fluid>
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
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="blue dark-4"
        centered
        dark
        icons-and-text
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab href="#tab-1">
          Add new user
          <v-icon>fa fa-user-plus</v-icon>
        </v-tab>

        <v-tab href="#tab-2">
          Edit existing user
          <v-icon>fa fa-user-edit</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-1">
          <v-card flat>
            <AddNewUser :rules="rules" :submitUser="submitUser" />
          </v-card>
        </v-tab-item>
        <v-tab-item value="tab-2">
          <v-card flat>
            <EditUser :rules="rules" :submitUser="submitUser" />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import AddNewUser from "../components/AddNewUser";
import EditUser from "../components/EditUser";
import { mapGetters } from "vuex";
export default {
  components: {
    AddNewUser,
    EditUser
  },
  data() {
    return {
      tab: null,
      dialog: false,
      is_updated: false,
      rules: {
        username: [
          value => (value && value.length > 0) || "Username can not be empty"
        ],
        displayName: [
          value =>
            (value && value.length > 0) || "Display Name can not be empty"
        ],
        defaultPassword: [
          value =>
            (value && value.length > 0) || "Default Password can not be empty"
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
  methods: {
    ...mapGetters(["getProfile"]),
    validateForm(form) {
      return form.validate();
    },
    success(form) {
      this.is_updated = true;
      setTimeout(() => {
        this.dialog = false;
        form.reset();
      }, 500);
    },
    async submitUser(form, type, user, cb) {
      if (!this.validateForm(form)) {
        return;
      }
      this.is_updated = false;
      this.dialog = true;
      let userObj = {
        username: user.username,
        password: user.defaultPassword,
        name: user.displayName,
        role: user.role,
        group: this.getProfile().group,
        team: user.team,
        gender: user.gender,
        position: user.position
      };

      if (type === "add") {
        try {
          await axios.post(this.API_URL + "/api/user", userObj);
          this.success(form);
        } catch (error) {
          console.log(error);
        }
      }
      if (type === "edit") {
        try {
          await axios.patch(this.API_URL + "/api/user/update", userObj);
          this.success(form);
          cb();
        } catch (error) {
          console.log(error);
        }
      }
      if (type === "delete") {
        try {
          await axios.delete(
            this.API_URL + "/api/user/delete?username=" + userObj.username
          );
          this.success(form);
          cb();
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
};
</script>
