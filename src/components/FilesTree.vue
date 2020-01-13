<template>
  <v-dialog v-model="dialog" persistent max-width="500">
    <template v-slot:activator="{ on }">
      <v-btn text color="#09b" v-on="on">SELECT</v-btn>
    </template>
    <v-card>
    <v-card-title class="headline">Select file</v-card-title>
      <v-card-text>
        <v-treeview
          onchange="changeHandler"
          :open="open"
          :items="items"
          activatable
          item-key="id"
          open-on-click
          @update:active="changeHandler"
        >
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="!item.file">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>mdi-file-document-outline</v-icon>
          </template>
        </v-treeview>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue lighten-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue lighten-1" text @click="dialog = false">Select</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SelectFile',
  props: [ 'value', 'url' ],
  data () {
    return {
      items: [],
      open: [],
      counter: 1,
      model: null,
      dialog: false,
    }
  },

  methods: {
    changeHandler(value) {
      this.$emit('input', this.getFullPath(value[0]))
    },
    getIcon(fileName) {
      let pos = fileName.indexOf(".")
      let files = {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      }
      return files[fileName.slice(pos)]
    },

    testFile(id, source) {
      let found = source.find(item => item.id === id)
      if (found && !found.file)
        throw new Error('Parameter must be file name, but present one is a folder name')
      return found ? (found.parents ? found.parents.join('/') + '/' : '') + found.name : null
    },

    getFullPath(selected) {
      if (!selected || typeof selected !== 'number')
        throw new Error('File id is required and must be a number')

        let found = this.testFile(selected, this.items)
        if (found) return found

        let folderItems = this.items.filter(item => !item.file).flatMap (item => item.children)
        found = this.testFile(selected, folderItems)
        if (found) return found

        let subfolderItems = folderItems.filter (item => !item.file)
          .flatMap (item => item.children)
        found = this.testFile(selected, subfolderItems)

        !found && console.warn ('Not found...')

        return found

    },
    getFiles(folder=[], folderName, subfolderName) {
      return folder.filter (item => typeof item === "string")
        .map (item => ({
          id: this.counter++,
          name: item,
          file: true,
          parents: folderName ? subfolderName ?
            [folderName, subfolderName] : [folderName] : null
        }) )
    },
    getFolders(folder=[], parentName) {
      return folder.filter(item => typeof item !== 'string')
        .map(dir => ({
          id: this.counter++,
          name: Object.keys(dir)[0],
          file: false,
          tmp: Object.values(dir)[0],
          parent: parentName ? parentName : null
        }))
    },

    async getContent() {
      let content = await (await fetch(this.url)).json()

      this.items.push(
        ...this.getFiles(content),
        ...this.getFolders (content)
      )

      this.items.filter(item => !item.file)
        .forEach (folder => {
          folder.children = [
              ...this.getFiles (folder.tmp, folder.name),
              ...this.getFolders (folder.tmp, folder.name)
          ];
          delete folder.tmp
          folder.children.filter(child => !child.files)
            .forEach(subfolder => {
              subfolder.children = this.getFiles(subfolder.tmp, subfolder.parent, subfolder.name )
              delete subfolder.tmp
            })
      })
    },
  },

  mounted () {
    this.getContent()
  }
}
</script>
