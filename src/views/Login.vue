<template>
  <v-container fill-height fluid>
    <v-row class="justify-center">
      <v-col sm="10" md="4">
        <v-card>
          <v-card-title class="justify-center">
            Compras y Ventas
          </v-card-title>
          <v-divider></v-divider>
          <v-form ref="form">
            <v-card-text>
              <v-text-field
                @keyup.enter="login"
                v-model="user"
                required
                :rules="[rules.required]"
              >
              </v-text-field>
              <v-text-field
                v-model="password"
                required
                type="password"
                :rules="[rules.required]"
                @keyup.enter="login"
              >
              </v-text-field>
              <p v-show="showErrorMessage" class="red--text">
                {{ errorMessage }}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="load" color="primary" block @click="login"
                >Iniciar sesión</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data: () => ({
    user: '',
    password: '',
    rules: {
      required: value => !!value || 'Campo requerido',
    },
    showErrorMessage: false,
    errorMessage: '',
    load: false,
  }),
  methods: {
    async login() {
      this.load = true
      if (this.$refs.form.validate()) {
        try {
          let res = await axios.post('user/login', {
            email: this.user,
            password: this.password,
          })
          this.$store.dispatch('guardarToken', res.data.tokenReturn)
          this.$router.push({ name: 'Home' })
          this.showErrorMessage = false
          this.load = false
        } catch (error) {
          console.log(error.message)
          if (error.response && error.response.status === 404) {
            this.showErrorMessage = true
            this.errorMessage = 'Credenciales inválidas.'
            this.load = false
          } else {
            this.showErrorMessage = true
            this.errorMessage = 'Ocurrió un error con el servidor.'
            this.load = false
          }
        }
      }
    },
  },
}
</script>
