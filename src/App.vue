<template>
  <div id="app">
    <v-app>
      <v-container>
        <v-btn @click="runSpeedTest" v-if="speedTestButtonEnabled">Run Speed Test</v-btn>
        <v-btn @click="speedTestHistory">Speed Test History</v-btn>
        <v-btn @click="startSpeedTest">START</v-btn>
        <div>
        <v-card flat>
          <v-card-text class="pt-4">
            <v-card-text v-if="downloadProgress || downloadSpeed">{{downloadProgress}}% {{downloadSpeed}} Kb/s</v-card-text>
            <v-card-text v-if="uploadProgress || uploadSpeed">{{uploadProgress}}% {{uploadSpeed}}Kb/s</v-card-text>
            <v-card-text v-if="speedTestData">{{JSON.stringify(speedTestData)}}</v-card-text>
          </v-card-text>
        </v-card>
        
          <v-card flat>
            <v-card-text class="pt-4">
              <v-container>
                <quill-editor/>
              </v-container>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import QuillEditor from "@/components/Quill.vue"
const speedTest = require('speedtest-net')

export default {

  name: "App",

  components: {
     QuillEditor
  },

  data: () => ({
    api: null,
  }),
  computed: {
    ...mapState([
      'speedTestInstance',
      'speedTestButtonEnabled',
      'downloadProgress',
      'downloadSpeed',
      'uploadProgress',
      'uploadSpeed',
      'speedTestData'
    ])
  },

  watch: {
    'api': val => console.log('Created API:\n', val)
  },

  methods: {
    runSpeedTest() {
      this.$store.dispatch('INIT_WEBSOCKET')
    },
    speedTestHistory() {
      this.$store.dispatch("SPEED_TEST_HISTORY")
        .then (response => console.log(response))
    },
    startSpeedTest() {
      const test = speedTest({ maxTime: 5000 })
      test.on('data', data => {
        console.dir(data)
      })

      test.on('error', err => {
        console.error(err)
      })
    },
  },

  mounted() {

  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
