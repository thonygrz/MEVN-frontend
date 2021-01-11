<template>
  <v-app-bar v-show="isLogged" color="primary" dark absolute>
    <v-row class="justify-center">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-row>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    title: {
      type: String,
      required: true,
    },
    isLogged: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
