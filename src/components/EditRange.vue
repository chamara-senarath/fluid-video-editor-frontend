<template>
  <v-row justify="center">
    <v-dialog :value="editRangeDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Edit Range</v-card-title>
        <v-card-text>
          <v-layout column px-3>
            <v-layout
              row
              align-center
              justify-space-between
              v-for="(range, index) in ranges"
              :key="index"
            >
              <v-flex xs4>
                <v-text-field
                  v-model="ranges[index]"
                  type="number"
                  min="0"
                  :max="ranges[index + 1]"
                  :readonly="index == 0 ? false : true"
                  label="Start"
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field
                  v-model="ranges[index + 1]"
                  type="number"
                  :min="parseInt(ranges[index]) + 1"
                  :max="parseInt(ranges[index + 2]) - 1"
                  label="End"
                ></v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-btn
                  @click="remove(index)"
                  :disabled="index == 0"
                  fab
                  small
                  color="red"
                  ><v-icon small>fa fa-trash-alt</v-icon></v-btn
                >
              </v-flex>
            </v-layout>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="save">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["editRangeDialog"],
  data() {
    return {
      ranges: ["18", "25", "30", "40"]
    };
  },
  methods: {
    save() {
      this.$emit("saveRange", this.ranges);
    },
    remove(index) {
      this.ranges = this.ranges.filter(
        item => index != this.ranges.indexOf(item)
      );
    }
  }
};
</script>
