<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="ingresos"
      class="elevation-1"
      :search="search"
      v-show="!newEnter"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Ingresos</v-toolbar-title>
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
          <v-btn color="primary" dark class="mb-2" @click="changeNewEnter">
            Nuevo Item
          </v-btn>

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
        <v-icon small class="mr-2" @click="showItem(item)">
          mdi-eye
        </v-icon>
        <v-icon v-if="item.status === 1" small @click="deactivateItem(item)">
          mdi-cancel
        </v-icon>
        <v-icon v-else small @click="activateItem(item)">
          mdi-check
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getIngresos">
          Reset
        </v-btn>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="getColor(item.status)" dark>
          {{ statusName(item.status) }}
        </v-chip>
      </template>
    </v-data-table>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row v-show="newEnter" class="px-16 pb-16">
        <v-col cols="12" sm="4">
          <v-combobox
            v-model="tipoComprobante"
            label="Tipo de comprobante"
            :items="tiposComprobante"
            :rules="[rules.required]"
          ></v-combobox>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="serieComprobante"
            label="Serie de comprobante"
            :rules="[rules.required, rules.minSeries]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="numComprobante"
            label="Número de comprobante"
            :rules="[rules.required, rules.minNum]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="8">
          <v-combobox
            v-model="proveedor"
            label="Proveedor"
            :items="proveedores"
            :rules="[rules.required]"
          ></v-combobox>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="impuesto"
            label="Impuesto"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="codigo"
            label="Código"
            @keyup.enter="buscarCodigo"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="1">
          <v-btn
            @click="changeArticuloDialog"
            class="mx-2"
            fab
            dark
            small
            color="teal"
          >
            <v-icon dark>
              mdi-format-list-bulleted-square
            </v-icon>
          </v-btn>
          <v-dialog v-model="articuloDialog" max-width="1000px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        v-model="searchArticulo"
                        prepend-icon="mdi-magnify"
                        label="Buscar"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-data-table
                        :headers="headers3"
                        :items="articulosDialog"
                        hide-default-footer
                        class="elevation-1"
                        :loading="loadDialog"
                        loading-text="Buscando artículos... por favor espere."
                      >
                        <template v-slot:item.add="{ item }">
                          <v-icon small @click="agregarDetalle(item)">
                            mdi-plus-thick
                          </v-icon>
                        </template>
                        <template v-slot:item.status="{ item }">
                          <v-chip :color="getColor(item.status)" dark>
                            {{ statusName(item.status) }}
                          </v-chip>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="12" sm="7">
          <p v-show="errorCodeMessage" class="red--text">
            {{ errorMessage }}
          </p>
        </v-col>

        <v-col cols="12" sm="12">
          <v-data-table
            :headers="headers2"
            :items="articulos"
            hide-default-footer
            class="elevation-1"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="removeArticle(item)">
                mdi-delete
              </v-icon>
            </template>

            <template v-slot:item.quantity="{ item }">
              <v-text-field
                v-model="item.quantity"
                type="number"
              ></v-text-field>
            </template>
            <template v-slot:item.price="{ item }">
              <v-text-field v-model="item.price" type="number"></v-text-field>
            </template>
            <template v-slot:item.subtotal="{ item }">
              <p>${{ item.price * item.quantity }}</p>
            </template>
            <template v-slot:no-data>
              <v-alert :value="true" color="warning" icon="mdi-alert">
                Debes añadir un artículo
              </v-alert>
            </template>
          </v-data-table>
        </v-col>
        <v-col cols="12" sm="12">
          <p class="d-flex justify-end ma-0">
            <b>Total Parcial $ </b> {{ totalParcial }}
          </p>
          <p class="d-flex justify-end ma-0">
            <b>Impuesto $ </b> {{ totalImpuesto }}
          </p>
          <p class="d-flex justify-end ma-0">
            <b>Impuesto $ </b> {{ totalNeto }}
          </p>
        </v-col>
        <v-col cols="12" sm="4">
          <v-btn @click="closeNewEnter" class="mx-2" dark small color="grey">
            Cancelar
          </v-btn>
          <v-btn
            v-show="botonGuardar"
            @click="save"
            class="mx-2"
            dark
            small
            color="green"
          >
            Guardar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Enters',
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    articuloDialog: false,
    headers: [
      { text: 'Acciones', value: 'actions', sortable: false },
      { text: 'Usuario', value: 'user.name' },
      { text: 'Proveedor', value: 'person.name' },
      { text: 'Fecha', value: 'createdAt' },
      { text: 'Tipo de comprobante', value: 'proofType' },
      { text: 'Serie de comprobante', value: 'proofSeries' },
      { text: 'Número de comprobante', value: 'proofNumber' },
      { text: 'Impuesto', value: 'tax' },
      { text: 'Total', value: 'total' },
      { text: 'Estado', value: 'status', align: 'center' },
    ],
    headers2: [
      { text: 'Borrar', value: 'actions', align: 'center', sortable: false },
      { text: 'Artículo', value: 'name', align: 'center' },
      { text: 'Cantidad', value: 'quantity', align: 'center', sortable: false },
      { text: 'Precio', value: 'price', align: 'center', sortable: false },
      { text: 'SubTotal', value: 'subtotal', align: 'center', sortable: false },
    ],
    headers3: [
      { text: 'Agregar', value: 'add', sortable: false, align: 'center' },
      { text: 'Nombre', value: 'name' },
      { text: 'Descripción', value: 'description' },
      { text: 'Precio de venta', value: 'sellingPrice' },
      { text: 'Stock', value: 'stock' },
      { text: 'Código', value: 'code' },
      { text: 'Categoría', value: 'category.name' },
      { text: 'Estado', value: 'status', align: 'center' },
    ],
    articulos: [],
    articulosDialog: [],
    proveedores: [],
    codigo: '',
    tiposComprobante: ['FACTURA', 'BOLETA'],
    editedIndex: -1,
    defaultItem: {
      name: '',
      description: '',
      status: 0,
    },
    ingresos: [],
    _id: '',
    nombre: '',
    descripcion: '',
    tipoComprobante: '',
    serieComprobante: '',
    numComprobante: '',
    proveedor: '',
    rules: {
      required: value => !!value || 'Campo requerido',
      min: v =>
        (v && v.length >= 1 && v.length <= 53) ||
        'El nombre debe estar entre 1 y 50 caracteres',
      minSeries: v =>
        (v && v.length >= 1 && v.length <= 7) ||
        'El nombre debe estar entre 1 y 7 caracteres',
      minNum: v =>
        (v && v.length >= 1 && v.length <= 10) ||
        'El nombre debe estar entre 1 y 10 caracteres',
    },
    valid: false,
    item: null,
    actionType: null,
    newEnter: false,
    errorCodeMessage: false,
    errorMessage: 'error',
    impuesto: 0.18,
    formTitle: 'Añadir artículos',
    searchArticulo: '',
    loadDialog: false,
    botonGuardar: true,
  }),

  computed: {
    totalParcial() {
      let total = 0
      this.articulos.forEach(el => {
        total += el.price * el.quantity
      })
      return total.toFixed(2)
    },
    totalImpuesto() {
      return (this.totalParcial * this.impuesto).toFixed(2)
    },
    totalNeto() {
      return (
        parseFloat(this.totalParcial) + parseFloat(this.totalImpuesto)
      ).toFixed(2)
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    searchArticulo() {
      this.loadDialog = true
      this.getArticulos()
    },
  },

  created() {
    this.getIngresos()
    this.getProveedores()
  },

  methods: {
    async getArticulos() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        const res = await axios.get(
          'article/list?keyword=' + this.searchArticulo,
          config
        )
        this.articulosDialog = res.data
      } catch (error) {
        console.log(error)
      }
      this.loadDialog = false
    },
    async getIngresos() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        const res = await axios.get('enter/list', config)
        this.ingresos = res.data
      } catch (error) {
        console.log(error)
      }
    },
    async getProveedores() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        const res = await axios.get('person/list', config)
        let arrayPersonas = res.data
        this.proveedores = arrayPersonas.filter(
          x => x.personType === 'Proveedor'
        )
        this.proveedores = this.proveedores.map(x => {
          return {
            value: x._id,
            text: x.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    encontrarArticulo(id) {
      let booly = this.articulos.some(x => x._id === id)
      console.log('find: ', booly)
      return booly
    },

    removeFromArray(arr, item) {
      let index = arr.indexOf(item)
      if (index != -1) {
        arr.splice(index, 1)
      }
    },

    removeArticle(item) {
      this.removeFromArray(this.articulos, item)
    },

    agregarDetalle(data) {
      if (!this.encontrarArticulo(data._id)) {
        this.articulos.push({
          _id: data._id,
          name: data.name,
          quantity: 1,
          price: data.sellingPrice,
        })
      } else {
        this.errorCodeMessage = true
        this.errorMessage = 'El artículo ya fue ingresado.'
        console.log('ya se agregó el articulo')
      }
    },

    async buscarCodigo() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        const res = await axios.get('article/query?code=' + this.codigo, config)
        console.log(res.data)
        this.errorCodeMessage = false
        this.agregarDetalle(res.data)
        this.codigo = ''
        // this.articulo = res.data
      } catch (error) {
        console.log(error)
        if (error.response.status === 400) {
          this.errorMessage =
            'El código ingresado no pertenece a ningún artículo'
          this.errorCodeMessage = true
        }
      }
    },

    statusName(status) {
      if (status === 1) return 'Activo'
      else if (status === 0) return 'Desactivado'
      else return 'Estado desconocido'
    },

    showItem(item) {
      this._id = item._id
      this.proveedor = item.person.name
      this.tipoComprobante = item.proofType
      this.serieComprobante = item.proofSeries
      this.numComprobante = item.proofNumber
      this.impuesto = item.tax
      this.articulos = item.details
      this.botonGuardar = false

      this.changeNewEnter()
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
          '/enter/deactivate',
          {
            _id: this._id,
          },
          config
        )
        this.clean()
        this.close()
        this.getIngresos()
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
          '/enter/activate',
          {
            _id: this._id,
          },
          config
        )
        this.clean()
        this.close()
        this.getIngresos()
      } catch (error) {
        console.log(error)
      }
      this.closeDelete()
    },

    close() {
      this.articuloDialog = false
      this.searchArticulo = ''
      this.$refs.form.resetValidation()
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
      this.proveedor = ''
      this.tipoComprobante = ''
      this.serieComprobante = ''
      this.numComprobante = ''
      this.articulos = []
      this.$refs.form.resetValidation()
    },

    getColor(status) {
      if (status === 1) return 'green'
      else if (status === 0) return 'red'
      else return 'black'
    },

    closeNewEnter() {
      this.clean()
      this.changeNewEnter()
      this.botonGuardar = true
    },

    changeNewEnter() {
      this.newEnter = !this.newEnter
    },

    changeArticuloDialog() {
      this.articuloDialog = !this.articuloDialog
    },

    async save() {
      if (this.$refs.form.validate() && this.articulos.length > 0) {
        try {
          let header = { Token: this.$store.state.token }
          let config = { headers: header }
          await axios.post(
            '/enter/add',
            {
              user: this.$store.state.user._id,
              person: this.proveedor.value,
              proofType: this.tipoComprobante,
              proofSeries: this.serieComprobante,
              proofNumber: this.numComprobante,
              tax: this.impuesto,
              total: this.totalNeto,
              details: this.articulos,
            },
            config
          )
          this.clean()
          this.changeNewEnter()
          this.getArticulos()
          this.getIngresos()
        } catch (error) {
          console.log(error)
        }
        this.close()
      }
    },
  },
}
</script>

<style></style>
