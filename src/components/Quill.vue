<template>
  <v-container>
    <v-card class="pa-0">
      <v-card-title>Editor</v-card-title>
      <v-card-text>
        <v-icon color="#f50">mdi-file-document-outline</v-icon> <b>{{currentFile}}</b>
      </v-card-text>
      <v-card-actions>
        <select-file v-model="currentFile" :url="endpoint"/>
        <v-btn @click="openFile"
               v-if="currentFile"
               style="float: right;" text>
          OPEN
        </v-btn>
        <v-btn @click="saveFile"
               style="float: right;" text>
          SAVE
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-divider/>
    <v-card>
      <vue-editor v-model="content"></vue-editor>
    </v-card>
  </v-container>
</template>

<script>

import SelectFile from './FilesTree.vue'

import { VueEditor } from 'vue2-editor';

export default {

  components: {
    SelectFile,
    VueEditor
  },

  data: () => ({
    files: null,
    currentFile: "",
    container: null,
    content: null,
  }),
  computed: {
    endpoint() {
      return this.$root.$store.getters.editorEndpoint
    }
  },
  methods: {
    openFile () {
      if ( !this.currentFile ) return

      fetch (`${this.endpoint}${this.currentFile}`)
        .then ( response => response.text () )
          .then ( response => this.content = response )
    },

    saveFile () {
      if ( !this.currentFile || !this.content ) return

      fetch ( `${this.endpoint}${this.currentFile}`, {
          method: "POST",
          headers: {
              "Content-Type": "text/html"
          },
          body: this.content
      }).then ( response => console.log ( response ) )
    },
  },
  created () {
    fetch (this.endpoint)
      .then ( response => response.json() )
        .then ( response => this.files = response )
  },
  mounted () {

  },
  updated () {

  }
};
</script>

<style>
code {
  background: #000!important;
  color: #ddd!important;
}
</style>
