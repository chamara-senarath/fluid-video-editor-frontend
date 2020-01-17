<template>
  <v-container fluid fill-height class="bg-img">
    <v-row align="center" justify="end">
      <v-col cols="12" sm="4" md="4">
        <v-card @keydown.enter="login" class="elevation-2" max-width="50vh">
          <v-toolbar color="#517EA9" dark flat>
            <v-toolbar-title>Admin Login</v-toolbar-title>
            <v-spacer />
            <v-icon>fa fa-user</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-alert v-if="error" type="error">
              {{ error }}
            </v-alert>
            <v-form>
              <v-text-field
                label="User Name"
                autofocus
                @focus="error = null"
                prepend-icon="fa fa-user"
                type="text"
                v-model="username"
              />

              <v-text-field
                label="Password"
                @focus="error = null"
                prepend-icon="fa fa-lock"
                type="password"
                v-model="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn block color="#F1C42E" @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      username: null,
      password: null,
      error: null
    };
  },
  methods: {
    ...mapMutations(["setAdmin"]),
    login() {
      if (this.validateUser(this.username, this.password)) {
        this.$router.push("/");
      }
    },
    validateUser(username, password) {
      if (username == "admin" && password == "admin") {
        this.setAdmin({ isLogged: true });
        return true;
      } else {
        this.error = "Invalid Username/Password";
        return false;
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
