<template>
  <v-navigation-drawer
    class="navigation-drawer"
    permanent
    expand-on-hover
    absolute
    v-if="isAdmin || isSeller || isStorekeeper"
  >
    <v-list nav dense>
      <v-list-item-group
        v-model="group"
        active-class="deep-purple--text text--accent-2"
      >
        <v-list-item
          @click="goRoute('Home', 'Inicio')"
          v-if="isAdmin || isSeller || isStorekeeper"
        >
          <v-list-item-title>Inicio</v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-group no-action sub-group v-if="isAdmin || isStorekeeper">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Almacén</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="item in warehouseItems"
            :key="item.title"
            link
            @click="goRoute(item.route, item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-group no-action sub-group v-if="isAdmin || isStorekeeper">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Compras</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="item in purchasesItems"
            :key="item.title"
            link
            @click="goRoute(item.route, item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-group no-action sub-group v-if="isAdmin || isSeller">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Ventas</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="item in salesItems"
            :key="item.title"
            link
            @click="goRoute(item.route, item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-group no-action sub-group v-if="isAdmin">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Accesos</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="item in accessItems"
            :key="item.title"
            link
            @click="goRoute(item.route, item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-group
          no-action
          sub-group
          v-if="isAdmin || isSeller || isStorekeeper"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Estadísticas</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="item in insightsItems"
            :key="item.title"
            link
            @click="goRoute(item.route, item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list-item-group>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn @click="logout" color="secondary" block>
          Cerrar sesión
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isLogged: {
      type: Boolean,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    isSeller: {
      type: Boolean,
      required: true,
    },
    isStorekeeper: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    group: null,
    warehouseItems: [
      { title: 'Categorías', icon: 'mdi-home', route: 'Categories' },
      { title: 'Artículos', icon: 'mdi-account', route: 'Articles' },
    ],
    purchasesItems: [
      { title: 'Ingresos', icon: 'mdi-home', route: 'Enters' },
      { title: 'Proveedores', icon: 'mdi-account', route: 'Providers' },
    ],
    salesItems: [
      { title: 'Ventas', icon: 'mdi-home', route: 'Sales' },
      { title: 'Clientes', icon: 'mdi-account', route: 'Clients' },
    ],
    accessItems: [{ title: 'Usuarios', icon: 'mdi-home', route: 'Users' }],
    insightsItems: [
      { title: 'Compras', icon: 'mdi-home', route: 'PurchasesInsights' },
      { title: 'Ventas', icon: 'mdi-account', route: 'SalesInsights' },
    ],
  }),
  methods: {
    goRoute(route, name) {
      this.$router.push({ name: `${route}` })
      this.setCurrentSectionName(name)
    },
    setCurrentSectionName(sectionName) {
      this.$emit('setSectionName', sectionName)
    },
    logout() {
      this.$store.dispatch('salir')
    },
  },
}
</script>

<style scoped>
.navigation-drawer {
  position: fixed;
}
</style>
