<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="articulos"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn @click="guardarPDF" color="blue"
            ><v-icon>mdi-printer</v-icon></v-btn
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-toolbar-title>Artículos</v-toolbar-title>
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
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="codigo"
                          label="Código"
                          :rules="[rules.required, rules.minCod]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-combobox
                          v-model="categoria"
                          label="Categoría"
                          :items="categorias"
                          :rules="[rules.required]"
                        ></v-combobox>
                      </v-col>
                      <v-col cols="12" sm="12">
                        <v-text-field
                          v-model="nombre"
                          label="Nombre"
                          :rules="[rules.required, rules.min]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="stock"
                          label="Stock"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="precioVenta"
                          label="Precio de venta"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12">
                        <v-text-field
                          v-model="descripcion"
                          label="Descripcion"
                          :rules="[rules.required]"
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
        <v-btn color="primary" @click="getArticulos">
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
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
export default {
  name: 'Articles',
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Acciones', value: 'actions', sortable: false },
      { text: 'Nombre', value: 'name' },
      { text: 'Descripción', value: 'description' },
      { text: 'Precio de venta', value: 'sellingPrice' },
      { text: 'Stock', value: 'stock' },
      { text: 'Código', value: 'code' },
      { text: 'Categoría', value: 'category.name' },
      { text: 'Estado', value: 'status', align: 'center' },
    ],
    editedIndex: -1,
    defaultItem: {
      name: '',
      description: '',
      status: 0,
    },
    articulos: [],
    _id: '',
    nombre: '',
    categoria: '',
    categorias: [],
    codigo: '',
    descripcion: '',
    precioVenta: '',
    stock: '',
    roles: ['Admin', 'Storekeeper', 'Seller'],
    tiposDocumento: ['V', 'J', 'E'],
    rules: {
      required: value => !!value || 'Campo requerido',
      min: v =>
        (v && v.length >= 1 && v.length <= 53) ||
        'El nombre debe estar entre 1 y 50 caracteres',
      minCod: v =>
        (v && v.length >= 1 && v.length <= 64) ||
        'El nombre debe estar entre 1 y 64 caracteres',
    },
    valid: false,
    item: null,
    actionType: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo artículo' : 'Editar artículo'
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
    this.getArticulos()
    this.getCategorias()
  },

  methods: {
    async getArticulos() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        const res = await axios.get('article/list', config)
        this.articulos = res.data
      } catch (error) {
        console.log(error)
      }
    },
    async getCategorias() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        const res = await axios.get('category/list', config)
        let arrayCategorias = res.data
        this.categorias = arrayCategorias.map(x => {
          return {
            value: x._id,
            text: x.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    statusName(status) {
      if (status === 1) return 'Activo'
      else if (status === 0) return 'Desactivado'
      else return 'Estado desconocido'
    },

    transformarCategoria(cat) {
      return {
        value: cat._id,
        text: cat.name,
      }
    },

    editItem(item) {
      this._id = item._id
      this.nombre = item.name
      this.descripcion = item.description
      this.codigo = item.code
      this.precioVenta = item.sellingPrice
      this.stock = item.stock
      this.categoria = this.transformarCategoria(item.category)
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
          '/article/deactivate',
          {
            _id: this._id,
          },
          config
        )
        this.clean()
        this.close()
        this.getArticulos()
        this.getCategorias()
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
          '/article/activate',
          {
            _id: this._id,
          },
          config
        )
        this.clean()
        this.close()
        this.getArticulos()
        this.getCategorias()
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
      this.codigo = ''
      this.precioVenta = ''
      this.stock = ''
      this.categoria = ''
    },

    async save() {
      if (this.editedIndex === 1) {
        // se edita
        if (this.$refs.form.validate()) {
          try {
            let header = { Token: this.$store.state.token }
            let config = { headers: header }
            await axios.put(
              '/article/update',
              {
                _id: this._id,
                name: this.nombre,
                code: this.codigo,
                description: this.descripcion,
                sellingPrice: this.precioVenta,
                stock: this.stock,
                category: this.categoria.value,
              },
              config
            )
            this.clean()
            this.close()
            this.getArticulos()
            this.getCategorias()
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
              '/article/add',
              {
                name: this.nombre,
                code: this.codigo,
                description: this.descripcion,
                sellingPrice: this.precioVenta,
                stock: this.stock,
                category: this.categoria.value,
              },
              config
            )
            this.clean()
            this.close()
            this.getArticulos()
            this.getCategorias()
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

    guardarPDF() {
      let cols = [
        { title: 'Nombre', dataKey: 'name' },
        { title: 'Código', dataKey: 'code' },
        { title: 'Categoría', dataKey: 'category' },
        { title: 'Stock', dataKey: 'stock' },
        { title: 'Precio Venta', dataKey: 'sellingPrice' },
      ]

      let rows = this.articulos.map(function(x) {
        console.log('category: ', x.category)
        return {
          name: x.name,
          code: x.code,
          category: x.category.name,
          stock: x.stock,
          sellingPrice: x.sellingPrice,
        }
      })

      const doc = new jsPDF('p', 'pt')

      doc.autoTable(cols, rows, {
        margin: { top: 60 },
        addPageContent: function() {
          doc.text('Lista de Artículos', 40, 30)
        },
      })

      doc.save('Articulos.pdf')
    },
  },
}
</script>

<style></style>
