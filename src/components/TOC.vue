<template>
  <v-container>
    <MiniPlayer
      :showPlayer="showPlayer"
      :title="videoTitle"
      :src="videoSource"
      @closePlayer="closePlayer"
    ></MiniPlayer>
    <SerachVideo :dialog="dialog" @videoSelected="videoSelected" />
    <div class="row justify-center mb-10">
      <span class="headline">Table Of Content</span>
    </div>
    <v-btn
      v-if="is_admin"
      rounded
      dark
      small
      elevation="0"
      color="green darken-3"
      @click="addNode"
      ><v-icon left>fa fa-plus</v-icon>Add Chapter</v-btn
    >
    <vue-tree-list
      class="mt-5"
      @add-node="onAddNode"
      @click="onClick"
      @delete-node="onDel"
      :model="data"
      default-tree-node-name="new sub chapter"
      default-leaf-node-name="new topic"
      v-bind:default-expanded="false"
    >
      <span class="px-3" slot="addTreeNodeIcon"
        ><v-icon small color="orange">fa fa-folder-plus</v-icon></span
      >
      <span class="px-3" slot="addLeafNodeIcon"
        ><v-icon small color="green">fa fa-file-medical</v-icon></span
      >
      <span class="px-3" slot="editNodeIcon"
        ><v-icon small color="blue">fa fa-file-signature</v-icon></span
      >
      <span class="px-3" slot="delNodeIcon"
        ><v-icon small color="red">fa fa-trash-alt</v-icon></span
      >
      <span class="px-3" slot="leafNodeIcon"><v-icon>fa fa-file</v-icon></span>
      <span class="px-3" slot="treeNodeIcon"
        ><v-icon color="orange">fa fa-folder</v-icon></span
      >
    </vue-tree-list>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { VueTreeList, Tree, TreeNode } from "vue-tree-list";
import SerachVideo from "../components/SearchVideo";
import Axios from "axios";
import MiniPlayer from "@/components/MiniPlayer";
import cj from "circular-json";
export default {
  components: {
    VueTreeList,
    SerachVideo,
    MiniPlayer,
  },
  data() {
    return {
      dialog: false,
      data: new Tree([]),
      is_admin: false,
      node: null,
      videoObj: null,
      showPlayer: false,
      videoTitle: null,
      videoSource: null,
    };
  },

  methods: {
    ...mapGetters(["getUser", "getProfile"]),
    simpleStringify(object) {
      var simpleObject = {};
      for (var prop in object) {
        if (!object.hasOwnProperty(prop)) {
          continue;
        }
        if (typeof object[prop] == "object") {
          continue;
        }
        if (typeof object[prop] == "function") {
          continue;
        }
        simpleObject[prop] = object[prop];
      }
      return JSON.stringify(simpleObject); // returns cleaned up JSON
    },
    closePlayer() {
      this.videoSource = null;
      this.showPlayer = false;
    },
    videoSelected(videoTitle) {
      if (videoTitle === "" || null) {
        this.videoObj.name = "NO VIDEO";
        return;
      }
      this.videoObj.editNodeDisabled = true;
      this.videoObj.name = videoTitle;
      this.videoTitle = videoTitle;
      this.dialog = false;
      this.saveTOC();
    },
    onDel(node) {
      node.remove();
    },

    onAddNode(obj) {
      this.saveTOC();
      if (obj.isLeaf) {
        this.videoObj = obj;
        this.dialog = true;
      }
    },

    async onClick(obj) {
      if (obj.isLeaf) {
        //open player
        let result = await Axios.get(
          this.API_URL +
            "/api/video/title?title=" +
            encodeURIComponent(this.videoTitle)
        );
        let id = result.data.id;
        this.videoSource =
          this.API_URL + "/embed/" + id + "/" + this.getProfile().id;
        this.showPlayer = true;
      }
    },

    addNode() {
      this.node = new TreeNode({
        name: "new chapter",
        isLeaf: false,
        editNodeDisabled: !this.is_admin,
        delNodeDisabled: !this.is_admin,
        addTreeNodeDisabled: !this.is_admin,
        addLeafNodeDisabled: !this.is_admin,
        dragDisabled: !this.is_admin,
      });
      if (!this.data.children) this.data.children = [];
      this.data.addChildren(this.node);
    },
    async saveTOC() {
      var serialized = cj.stringify(this.data);
      try {
        await Axios.post(this.API_URL + "/api/toc/new", {
          toc: serialized,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async fetchTOC() {
      try {
        let result = await Axios.get(this.API_URL + "/api/toc");

        this.data = cj.parse(result.data.toc.TOC);
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.fetchTOC();
    this.is_admin = this.getUser().role === "admin";
  },
};
</script>
