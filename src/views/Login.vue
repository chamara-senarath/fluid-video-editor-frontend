<template>
  <v-container fluid fill-height class="bg-img">
    <v-row align="center" justify="end">
      <v-col cols="12" sm="4" md="4">
        <v-card @keydown.enter="login" class="elevation-2" max-width="50vh">
          <v-toolbar color="#517EA9" dark flat>
            <v-toolbar-title>{{ $t("Login") }}</v-toolbar-title>
            <v-spacer />
            <v-icon>fa fa-user</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-alert v-if="error" type="error">
              {{ error }}
            </v-alert>
            <v-form>
              <v-select
                prepend-icon="fa fa-user-tag"
                :items="groups"
                :label="$t('Group')"
                v-model="group"
              ></v-select>
              <v-text-field
                :label="$t('Username')"
                autofocus
                @focus="error = null"
                prepend-icon="fa fa-user"
                type="text"
                v-model="username"
              />

              <v-text-field
                :label="$t('Password')"
                @focus="error = null"
                prepend-icon="fa fa-lock"
                type="password"
                v-model="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn block color="#F1C42E" @click="login">{{
              $t("Login")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      username: null,
      password: null,

      group: "DIPS",
      error: null,
      groups: ["DIPS", "LayUp"]
    };
  },
  methods: {
    ...mapMutations(["setToken", "setUser", "setProfile", "setURL"]),
    async login() {
      if (this.group == "DIPS") {
        this.API_URL = process.env.VUE_APP_DIPS_SERVER;
        this.setURL(process.env.VUE_APP_DIPS_SERVER);
      }
      if (this.group == "LayUp") {
        this.API_URL = process.env.VUE_APP_LAYUP_SERVER;
        this.setURL(process.env.VUE_APP_LAYUP_SERVER);
      }

      let username = this.username;
      let password = this.password;

      try {
        let result = await axios.post(this.API_URL + "/api/user/login", {
          username,
          password
        });

        let token = result.data.token;
        let user_id = result.data.user_id;

        let profileObj = {
          id: user_id,
          name: result.data.name,
          avatar: null,
          group: result.data.group
        };
        console.log(profileObj);
        this.setToken(token);

        this.setUser({
          is_logged: true,
          role: result.data.role == "admin" ? "admin" : "user"
        });

        if (this.group.toLowerCase() === profileObj.group.toLowerCase()) {
          this.setProfile(profileObj);
          this.$router.push("/");
        } else {
          throw new Error("You have no access to this Group");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.error = "Invalid Username / Password for the role " + this.role;
        } else {
          this.error = error;
        }
      }
    }
  }
};
</script>

<style scoped>
.bg-img {
  background-image: url("/login.png");
  background-position: left;
  background-repeat: no-repeat;
  background-size: contain;
  position: relative;
}
</style>
