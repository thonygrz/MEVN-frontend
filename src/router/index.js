import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue'),
    meta: {
      requiresAuth: true,
      admin: true,
      storekeeper: true,
      seller: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  // {
  //   path: '/account',
  //   name: 'Account',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "account" */ '../views/Account.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     admin: true,
  //     storekeeper: true,
  //     seller: true,
  //   },
  // },
  {
    path: '/categories',
    name: 'Categories',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "categories" */ '../views/Categories.vue'),
    meta: {
      requiresAuth: true,
      admin: true,
      storekeeper: true,
    },
  },
  {
    path: '/articles',
    name: 'Articles',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "articles" */ '../views/Articles.vue'),
    meta: {
      requiresAuth: true,
      admin: true,
      storekeeper: true,
    },
  },
  {
    path: '/enters',
    name: 'Enters',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "enters" */ '../views/Enters.vue'),
    meta: {
      requiresAuth: true,
      admin: true,
      storekeeper: true,
      seller: true,
    },
  },
  // {
  //   path: '/providers',
  //   name: 'Providers',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "providers" */ '../views/Providers.vue'),
  // },
  {
    path: '/sales',
    name: 'Sales',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "sales" */ '../views/Sales.vue'),
    meta: {
      requiresAuth: true,
      admin: true,
      seller: true,
    },
  },
  {
    path: '/clients',
    name: 'Clients',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "clients" */ '../views/Clients.vue'),
    meta: {
      requiresAuth: true,
      admin: true,
      seller: true,
    },
  },
  {
    path: '/users',
    name: 'Users',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "users" */ '../views/Users.vue'),
    meta: {
      requiresAuth: true,
      admin: true,
    },
  },
  // {
  //   path: '/purchasesInsights',
  //   name: 'PurchasesInsights',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "purchasesInsights" */ '../views/PurchasesInsights.vue'
  //     ),
  // },
  // {
  //   path: '/salesInsights',
  //   name: 'SalesInsights',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "salesInsights" */ '../views/SalesInsights.vue'
  //     ),
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  let user = store.state.user
  // if (user === null) user = false
  let adminAuth = user && user?.role === 'Admin'
  let sellerAuth = user && user?.role === 'Seller'
  let storekeeperAuth = user && user?.role === 'Storekeeper'

  if (to.path !== '/login') {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (adminAuth) {
        if (to.matched.some(record => record.meta.admin)) {
          next()
        }
      } else if (sellerAuth) {
        if (to.matched.some(record => record.meta.seller)) {
          next()
        }
      } else if (storekeeperAuth) {
        if (to.matched.some(record => record.meta.storekeeper)) {
          next()
        }
      } else {
        next('/login')
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
