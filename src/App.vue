<template>
  <v-app>
    <v-content height="100%">
      <div>
        <Navbar :title="sectionName" />
        <Sidebar
          @setSectionName="setSectionName"
          :isLogged="isLogged"
          :isAdmin="isAdmin"
          :isStorekeeper="isStorekeeper"
          :isSeller="isSeller"
        />
        <router-view class="pl-14"></router-view>
      </div>
    </v-content>
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

<style scoped></style>
