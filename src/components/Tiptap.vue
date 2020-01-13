<template>
  <v-container>
    <v-card>
      <v-card-title>Tiptap Editor</v-card-title>
      <v-card-actions>
        <select-file v-model="currentFile" :files="files"/>
        <v-btn @click="openFile"
               v-if="currentFile"
               style="float: right;" icon>
          <v-icon>open_in_browser</v-icon>
        </v-btn>
        <v-btn @click="saveFile"
               style="float: right;" icon>
          <v-icon>save</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-divider/>
    <tiptap-vuetify v-model="content" :extensions="extensions"/>
  </v-container>
</template>

<script>

import SelectFile from '@/components/SelectFile.vue'

// import { TiptapVuetifyPlugin } from "tiptap-vuetify"
// import "tiptap-vuetify/dist/main.css"

import {
  TiptapVuetify,
  Heading, Bold, Italic, Strike, Underline, Code,
  Paragraph, BulletList, OrderedList, ListItem,
  Link, Blockquote, HardBreak, HorizontalRule,
  History, Image
} from "tiptap-vuetify";

export default {

  components: {
    'select-file': SelectFile,
    TiptapVuetify
  },

  data: () => ({
    extensions: [
      History, Blockquote, Link, Code,
      Underline, Strike, Italic, Bold,
      ListItem, BulletList, OrderedList,
      Image,
      [
        Heading, {
          options: {
            levels: [1, 2, 3, 4, 5, 6]
          }
        }
      ],
      HorizontalRule, Paragraph, HardBreak
    ],
    files: null,
    currentFile: "",
    container: null,
    content: `
    `
  }),
  methods: {
    openFile () {
      console.log ( "open currentFile: ", this.currentFile )
      if ( !this.currentFile ) return

      fetch (`https://content-editor.glitch.me/files/${this.currentFile}`)
        .then ( response => response.text () )
          .then ( response => this.content = response )
    },

    saveFile () {
      console.log ( "save currentFile: ", this.currentFile )
      console.log ( "container: ", this.container )
      if ( !this.currentFile || !this.container ) return

      console.log ( this.container.innerHTML )

      fetch ( `https://content-editor.glitch.me/files/${this.currentFile}`, {
          method: "POST",
          headers: {
              "Content-Type": "text/html"
          },
          body: this.container.innerHTML
      }).then ( response => console.log ( response ) )
    },
  },
  mounted () {
    fetch ("https://content-editor.glitch.me/dir")
      .then ( response => response.json() )
        .then ( response => this.files = response )
  },
  updated () {
    this.container = document.querySelector ( '[contenteditable]')
    console.log ( this.container )
  }
};
</script>

<style>
code {
  background: #000!important;
  color: #ddd!important;
}
</style>
