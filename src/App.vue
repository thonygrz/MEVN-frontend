<template>
  <v-app>
    <Navbar :title="sectionName" :isLogged="isLogged" />
    <Sidebar
      @setSectionName="setSectionName"
      :isLogged="isLogged"
      :isAdmin="isAdmin"
      :isStorekeeper="isStorekeeper"
      :isSeller="isSeller"
    />
    <router-view class="pl-14 pt-16"></router-view>
  </v-app>
</template>

<script>
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: {
    Sidebar,
    Navbar,
  },
  data: () => ({
    sectionName: 'Inicio',
  }),
  methods: {
    setSectionName(newValue) {
      this.sectionName = newValue
    },
  },
  computed: {
    isLogged() {
      return !!this.$store.state.user
    },
    isAdmin() {
      return !!(
        this.$store.state.user && this.$store.state.user.role === 'Admin'
      )
    },
    isSeller() {
      return !!(
        this.$store.state.user && this.$store.state.user.role === 'Seller'
      )
    },
    isStorekeeper() {
      return !!(
        this.$store.state.user && this.$store.state.user.role === 'Storekeeper'
      )
    },
  },
  created() {
    this.$store.dispatch('autoLogin')
  },
}
</script>
