'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use ( Vuex )

export default new Vuex.Store ({
  state: {
      host: "https://ws-with-routes.glitch.me/",
      socket: "wss://ws-with-routes.glitch.me/",
      speedTestInstance: null,
      speedTestData: null,
      downloadProgress: null,
      downloadSpeed: null,
      uploadProgress: null,
      uploadSpeed: null,
      testServer: null,
      speedTestButtonEnabled: true,
      speedTestAPIkey: 'SOM5e1adebb69cb6',
      speedTestAPIdomain: 'localhost',
      ws: null,
      map: {
        markers: null,
      },
  },
  getters: {
    speedTestEndpoint: state => `${state.socket}speedtest`,
    speedTestHistoryEndpoint: state => `${state.host}speedtesthistory`,
    mapMarkersEndpoint: state => `${state.host}map/markers`,
    blogInfoEndpoint: state => state.host + "blog/",
    editorEndpoint: state => state.host + "content/",
  },

  mutations: {

    WEBSOCKET_CONNECTION: (state, options) => {
      state.ws = Object.assign(new WebSocket(options.connect), {
        onopen: options.onopen,
        onclose: options.onclose,
        onmessage: options.onmessage,
        onerror: options.onerror,
      })
      console.log(state.ws)
    },

    SPEED_TEST_RESULTS: (state, data) => {
      state.speedTestData = data
    },
    DOWNLOAD_PROGRESS: (state, newVal) => {
      state.downloadProgress = newVal
      console.log('state.downloadProgress', state.downloadProgress)
    },
    DOWNLOAD_SPEED: (state, newVal) => {
      state.downloadSpeed = newVal
      console.log('state.downloadSpeed', state.downloadSpeed)
    },
    UPLOAD_PROGRESS: (state, newVal) => {
      state.uploadProgress = newVal
      console.log('state.uploadProgress', state.uploadProgress)
    },
    UPLOAD_SPEED: (state, newVal) => {
      state.uploadSpeed = newVal
      console.log('state.uploadSpeed', state.uploadSpeed)
    },
    SPEED_TEST_SERVER: (state, server) => {
      state.testServer = JSON.parse(JSON.stringify(server))
    },
    SPEED_TEST_BUTTON: (state, val) => {
      state.speedTestButtonEnabled = val
      console.log('state.speedTestButtonEnabled', state.speedTestButtonEnabled)
    },
    SPEED_TEST_INSTANCE: (state, instance) => {
      state.speedTestInstance = instance
      console.log('SPEED TEST INSTANCE:\n', state.speedTestInstance)
    },

    MAP_MARKERS: (state, json) => {
      state.map.markers = JSON.parse(JSON.stringify(json))
    },
  },

  actions: {

    INIT_WEBSOCKET({ getters, commit, dispatch }) {

      dispatch('START_SPEED_TEST')

      const onOpen = function(event) {
        event.target.send("Hello, server!")
      }

      const onClose = (function(dispatch) {
        return function() {
          dispatch('INIT_WEBSOCKET')
        }
      })(dispatch)

      const onMessage = (function(commit) {
        return function(event) {
          const data = JSON.parse(event.data)
          console.log('DATA: ', data)
          if (data.downloadProgress) commit('DOWNLOAD_PROGRESS', data.downloadProgress)
          if (data.downloadSpeed) commit('DOWNLOAD_SPEED', data.downloadSpeed)
          if (data.uploadProgress) commit('UPLOAD_PROGRESS', data.uploadProgress)
          if (data.uploadSpeed) commit('UPLOAD_SPEED', data.uploadSpeed)
          if (data.testServer) commit('SPEED_TEST_SERVER', data.testServer)
          if (data.speedTestResult) {
            console.log('speedTestResult: ', data.speedTestResult)
            commit('SPEED_TEST_RESULTS', data.speedTestResult)
            commit('SPEED_TEST_BUTTON', true)
          }
        }
      })(commit)

      commit('WEBSOCKET_CONNECTION', {
        connect: getters.speedTestEndpoint,
        onopen: onOpen,
        onclose: onClose,
        onmessage: onMessage,
      })
    },

    START_SPEED_TEST({ commit }) {
      commit('SPEED_TEST_RESULTS', null)
      commit('DOWNLOAD_PROGRESS', null)
      commit('UPLOAD_PROGRESS', null)
      commit('DOWNLOAD_SPEED', null)
      commit('UPLOAD_SPEED', null)
      commit('SPEED_TEST_BUTTON', false)
    },

    async SPEED_TEST_HISTORY({ getters }) {
      return await (
        await fetch(getters.speedTestHistoryEndpoint)
      ).json()
    },

    async saveSpeedTestHistory(context, data) {
      console.log(data)
      let response = await fetch(context.getters.speedTestHistoryEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log(response)
    },

    async GET_MAP_MARKERS({ state, getters, commit }) {
      commit(
        'MAP_MARKERS',
        await (await fetch(getters.mapMarkersEndpoint)).json(),
      )
      console.log(state.map.markers)
    },

    INIT_SPEED_TEST_API({ state }) {
      const api = document.head.appendChild(document.createElement('script'))
      api.src = 'https://speedof.me/api/api.js'
      // api.onerror = function(err) {
      //   console.log(err)
      // }
      api.onload = function() {
        window.SomApi.account = state.speedTestAPIkey,
        window.SomApi.domainName = state.speedTestAPIdomain,
        window.SomApi.config = {
          sustainTime: 4,
          testServerEnabled: true,
          userInfoEnabled: true,
          latencyTestEnabled: true,
          uploadTestEnabled: true,
          progress: {
            enabled: true,
            verbose: true
          }
        }
        window.SomApi.onProgress = function(progress) {
          console.log('type: ', progress.type, ' pass: ', progress.pass, ' percentDone: ', progress.percentDone, ' currentSpeed: ', progress.currentSpeed)
        }
        window.SomApi.onError = function(err) {
          console.warn(err)
        }
        window.SomApi.onTestCompleted = function(result) {
          console.log('RESULT: ', result)
        }
      }
    },

    RUN_SPEED_TEST() {
      window.SomApi.startTest()
    },
  }
})
