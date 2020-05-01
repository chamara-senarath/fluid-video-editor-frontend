<template>
  <v-container>
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
export default {
  components: {
    VueTreeList,
  },
  data() {
    return {
      newTree: {},
      data: new Tree([]),
      is_admin: false,
      node: null,
    };
  },
  methods: {
    ...mapGetters(["getUser"]),
    onDel(node) {
      node.remove();
    },

    // onChangeName(params) {
    //   console.log(params);
    // },

    // onAddNode(params) {
    //   console.log(params);
    // },

    // onClick(params) {
    //   console.log(params);
    // },

    addNode() {
      console.log(this.data);
      this.node = new TreeNode({
        name: "new chapter",
        isLeaf: false,
        editNodeDisabled: !this.is_admin,
        delNodeDisabled: !this.is_admin,
        addTreeNodeDisabled: !this.is_admin,
        addLeafNodeDisabled: !this.is_admin,
        dragDisabled: !this.is_admin,
        addChildren: this.addChildren,
      });
      if (!this.data.children) this.data.children = [];
      this.data.addChildren(this.node);
    },
    addChildren(e) {
      this.node.addChildren(e);
    },
  },
  mounted() {
    this.is_admin = this.getUser().role === "admin";
  },
};
</script>
