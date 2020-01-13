<template>
  <v-row>
    <v-col cos="12" sm="8" md="6" lg="4" class="mx-auto">
      <v-combobox
        v-model="model"
        :items="files"
        clearable
        v-if="files"
        hide-on-select
        label="Enter file name"
        persistent-hint
        chips
        :success="success"
        :focus="focus"
      >
      </v-combobox>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: 'SelectFile',

  props: [ "value", "files" ],

  data: () => ({
    model: null,
    success: false,
    focus: true,
  }),

  watch: {
    model (val) {
      this.$emit( "input", val )
    },
  },

  mounted () {

  },
  updated () {

  }
};
</script>
