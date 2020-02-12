<template>
  <v-layout column ma-2>
    <v-alert
      :value="show"
      color="rgba(0,0,0,0.5)"
      transition="slide-x-reverse-transition"
      min-width="22vw"
    >
      <v-layout column>
        <v-layout mb-2>
          <v-btn
            @click="hideComment"
            class="blue--text text--lighten-3"
            dark
            :color="`rgba(0, 0, 0, ${opacity})`"
            block
            >Hide Comments
            <v-icon right small>fa fa-comment-slash</v-icon></v-btn
          >
        </v-layout>

        <v-layout pt-2 column align-center v-if="!$refs.commentCard">
          <span class="white--text">No Comments</span>
        </v-layout>

        <v-list
          id="style-7"
          color="rgba(0,0,0,0)"
          style="max-height: 50vh"
          class="scrollbar overflow-y-auto"
        >
          <v-flex my-1 v-for="comment in comments" :key="comment._id">
            <v-card
              ref="commentCard"
              v-if="time > comment.time"
              width="20vw"
              dark
              flat
              outlined
              :color="`rgba(0, 0, 0, ${opacity})`"
            >
              <v-card-text>
                <v-layout row mx-2>
                  <v-flex xs12>
                    <span class="subtitle white--text">{{
                      comment.comment
                    }}</span>
                    <v-divider></v-divider>
                  </v-flex>
                  <span class="white--text caption"
                    >by {{ comment.username }}</span
                  >
                  <v-spacer></v-spacer>
                  <span class="white--text caption"
                    >@ {{ comment.time | secondToHHMMSS }}</span
                  >
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-list>

        <v-layout mt-2 style="position:relative">
          <v-textarea
            @keydown.enter.ctrl="sendComment"
            v-model="userComment"
            rows="1"
            row-height="15"
            maxlength="50"
            dark
            label="Write a Comment"
            outlined
            no-resize
          ></v-textarea>

          <v-btn
            @click="sendComment"
            style="position:absolute;bottom:15px;right:10px"
            fab
            x-small
            ><v-icon x-small color="blue">fa fa-send</v-icon></v-btn
          >
        </v-layout>
      </v-layout>
    </v-alert>
  </v-layout>
</template>

<script>
export default {
  props: ["comments", "show", "time"],
  data() {
    return {
      opacity: 0.7,
      userComment: ""
    };
  },
  methods: {
    hideComment() {
      this.$emit("hideComments");
    },
    async sendComment() {
      if (this.userComment == "") {
        return;
      }
      this.$emit("sendComment", this.userComment);
      this.userComment = "";
    }
  }
};
</script>

<style scoped>
.scrollbar {
  float: left;
  height: 300px;
  background: #f5f5f5;
  overflow-y: scroll;
}
#style-7::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 5px;
}

#style-7::-webkit-scrollbar {
  width: 5px;
  background-color: #f5f5f5;
}

#style-7::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.44, rgb(122, 153, 217)),
    color-stop(0.72, rgb(73, 125, 189)),
    color-stop(0.86, rgb(28, 58, 148))
  );
}
</style>
