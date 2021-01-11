<template>
  <v-app-bar color="deep-purple" dark>
    <!-- <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon> -->
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
  },
}
</script>
