<template>
  <v-container fluid>
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
            <AddNewUser />
          </v-card>
        </v-tab-item>
        <v-tab-item value="tab-2">
          <v-card flat>
            <EditUser />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import AddNewUser from "../components/AddNewUser";
import EditUser from "../components/EditUser";
export default {
  components: {
    AddNewUser,
    EditUser
  },
  data() {
    return {
      tab: null
    };
  }
};
</script>
