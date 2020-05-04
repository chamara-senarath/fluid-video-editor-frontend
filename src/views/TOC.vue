<template>
  <v-container px-10>
    <MiniPlayer
      :showPlayer="showPlayer"
      :title="videoTitle"
      :src="videoSource"
      @closePlayer="closePlayer"
    ></MiniPlayer>
    <SerachVideo :dialog="dialog" @videoSelected="videoSelected" />

    <v-card>
      <v-card-title>
        <span class="headline px-2">Table Of Content</span>
      </v-card-title>
      <v-divider class="mx-4" />
      <v-card-text>
        <v-layout column px-5>
          <v-layout row>
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
            <div class="ml-5"></div>
            <v-btn
              v-if="is_admin"
              rounded
              dark
              small
              elevation="0"
              color="yellow darken-3"
              @click="saveTOC"
              :loading="is_saving"
              ><v-icon left>fa fa-save</v-icon>Save</v-btn
            >
          </v-layout>
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
            <span class="px-3" slot="leafNodeIcon"
              ><v-icon>fa fa-file</v-icon></span
            >
            <span class="px-3" slot="treeNodeIcon"
              ><v-icon color="orange">fa fa-folder</v-icon></span
            >
          </vue-tree-list>
        </v-layout>
      </v-card-text>
    </v-card>
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
      is_saving: false,
      dialog: false,
      data: new Tree([]),
      is_admin: false,
      node: null,
      nodeList: [],
      videoObj: null,
      showPlayer: false,
      videoTitle: null,
      videoSource: null,
    };
  },

  methods: {
    ...mapGetters(["getUser", "getProfile"]),
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
    },
    onDel(node) {
      node.remove();
    },

    onAddNode(obj) {
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
            encodeURIComponent(obj.name)
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
      });
      if (!this.data.children) {
        this.data.children = [];
      }
      this.nodeList.push(this.node);
      this.data.addChildren(this.node);
    },

    async saveTOC() {
      this.is_saving = true;
      var nodes = [];
      if (this.nodeList.length != 0) {
        nodes = cj.stringify(this.nodeList);
      }
      try {
        await Axios.post(this.API_URL + "/api/toc/new", {
          nodes,
        });
        this.is_saving = false;
      } catch (error) {
        console.log(error);
        this.is_saving = false;
      }
    },
    async fetchTOC() {
      try {
        let result = await Axios.get(this.API_URL + "/api/toc");
        let newNodes = cj.parse(result.data.toc.nodes);
        this.nodeList = newNodes;
        this.data = new Tree(newNodes);
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.is_admin = this.getUser().role === "admin";
    this.fetchTOC();
  },
};
</script>
