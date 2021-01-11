<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="clientes"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Clientes</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            prepend-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
            justify="center"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12">
                        <v-text-field
                          v-model="nombre"
                          label="Nombre"
                          :counter="50"
                          :rules="[rules.required, rules.min]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-combobox
                          v-model="tipoPersona"
                          label="Tipo de persona"
                          :items="['Cliente', 'Proveedor']"
                          :rules="[rules.required]"
                        ></v-combobox>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="email"
                          label="Correo"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-combobox
                          v-model="tipoDocumento"
                          label="Tipo Doc"
                          :items="tiposDocumento"
                          :rules="[rules.required]"
                        ></v-combobox>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="numDoc"
                          label="Número de documento"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="tlf"
                          label="Número de teléfono"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12">
                        <v-text-field
                          v-model="direccion"
                          label="Dirección"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title v-if="!actionType" class="headline"
                >¿Estás seguro de desactivar este item?</v-card-title
              >
              <v-card-title v-else class="headline"
                >¿Estás seguro de activar este item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn
                  v-if="!actionType"
                  color="blue darken-1"
                  text
                  @click="deactivateItemConfirm"
                  >Desactivar</v-btn
                >
                <v-btn
                  v-else
                  color="blue darken-1"
                  text
                  @click="activateItemConfirm"
                  >Activar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon v-if="item.status === 1" small @click="deactivateItem(item)">
          mdi-cancel
        </v-icon>
        <v-icon v-else small @click="activateItem(item)">
          mdi-check
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getClientes">
          Reset
        </v-btn>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="getColor(item.status)" dark>
          {{ statusName(item.status) }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Clients',
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Acciones', value: 'actions', sortable: false },
      { text: 'Nombre', value: 'name' },
      { text: 'Tipo persona', value: 'personType' },
      { text: 'Tipo de documento', value: 'documentType' },
      { text: 'Número de documento', value: 'documentNumber', sortable: false },
      { text: 'Dirección', value: 'address', sortable: false },
      { text: 'Número de teléfono', value: 'phoneNumber', sortable: false },
      { text: 'Correo', value: 'email', sortable: false },
      { text: 'Estado', value: 'status', align: 'center' },
    ],
    editedIndex: -1,
    defaultItem: {
      name: '',
      description: '',
      status: 0,
    },
    clientes: [],
    _id: '',
    nombre: '',
    tipoDocumento: '',
    direccion: '',
    numDoc: '',
    tlf: '',
    email: '',
    tipoPersona: '',
    roles: ['Admin', 'Storekeeper', 'Seller'],
    tiposDocumento: ['V', 'J', 'E'],
    rules: {
      required: value => !!value || 'Campo requerido',
      min: v =>
        (v && v.length >= 1 && v.length <= 53) ||
        'El nombre debe estar entre 1 y 50 caracteres',
    },
    valid: false,
    item: null,
    actionType: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo cliente' : 'Editar cliente'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.getClientes()
  },

  methods: {
    async getClientes() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        const res = await axios.get('person/list', config)
        this.clientes = res.data
      } catch (error) {
        console.log(error)
      }
    },
    statusName(status) {
      if (status === 1) return 'Activo'
      else if (status === 0) return 'Desactivado'
      else return 'Estado desconocido'
    },

    editItem(item) {
      this._id = item._id
      this.nombre = item.name
      this.tipoPersona = item.personType
      this.tipoDocumento = item.documentType
      this.numDoc = item.documentNumber
      this.tlf = item.phoneNumber
      this.direccion = item.address
      this.email = item.email
      this.editedIndex = 1
      this.dialog = true
    },

    deactivateItem(item) {
      this._id = item._id
      this.actionType = 0
      this.dialogDelete = true
    },

    activateItem(item) {
      this._id = item._id
      this.actionType = 1
      this.dialogDelete = true
    },

    async deactivateItemConfirm() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        await axios.put(
          '/person/deactivate',
          {
            _id: this._id,
          },
          config
        )
        this.clean()
        this.close()
        this.getClientes()
      } catch (error) {
        console.log(error)
      }
      this.closeDelete()
    },

    async activateItemConfirm() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        await axios.put(
          '/person/activate',
          {
            _id: this._id,
          },
          config
        )
        this.clean()
        this.close()
        this.getClientes()
      } catch (error) {
        console.log(error)
      }
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$refs.form.resetValidation()
      this.clean()
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    clean() {
      this._id = ''
      this.nombre = ''
      this.descripcion = ''
      this.tipoPersona = ''
      this.tipoDocumento = ''
      this.numDoc = ''
      this.direccion = ''
      this.tlf = ''
      this.email = ''
    },

    async save() {
      if (this.editedIndex === 1) {
        // se edita
        if (this.$refs.form.validate()) {
          try {
            let header = { Token: this.$store.state.token }
            let config = { headers: header }
            await axios.put(
              '/person/update',
              {
                _id: this._id,
                name: this.nombre,
                personType: this.tipoPersona,
                documentType: this.tipoDocumento,
                documentNumber: this.numDoc,
                address: this.direccion,
                phoneNumber: this.tlf,
                email: this.email,
              },
              config
            )
            this.clean()
            this.close()
            this.getClientes()
          } catch (error) {
            console.log(error)
          }
          this.close()
        }
      } else {
        // se guarda el nuevo item
        if (this.$refs.form.validate()) {
          try {
            let header = { Token: this.$store.state.token }
            let config = { headers: header }
            await axios.post(
              '/person/add',
              {
                name: this.nombre,
                personType: this.tipoPersona,
                documentType: this.tipoDocumento,
                documentNumber: this.numDoc,
                address: this.direccion,
                phoneNumber: this.tlf,
                email: this.email,
              },
              config
            )
            this.clean()
            this.close()
            this.getClientes()
          } catch (error) {
            console.log(error)
          }
          this.close()
        }
      }
    },

    getColor(status) {
      if (status === 1) return 'green'
      else if (status === 0) return 'red'
      else return 'black'
    },
  },
}
</script>

<style></style>
