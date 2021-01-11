<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="ventas"
      class="elevation-1"
      :search="search"
      v-show="!newEnter"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Ventas</v-toolbar-title>
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

          <v-dialog v-model="facturaDialog">
            <v-card>
              <v-card-title class="headline">
                <v-btn @click="verFactura" color="blue"
                  ><v-icon>mdi-printer</v-icon></v-btn
                >
                <v-divider class="mx-4" inset vertical></v-divider>
                Factura
              </v-card-title>

              <v-card-text>
                <div id="factura">
                  <header>
                    <div id="logo">
                      <img
                        src="data:image/png;base64,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"
                        id="imagen"
                      />
                    </div>
                    <div id="datos">
                      <p id="encabezado">
                        <b>IncanatoIT</b><br />José Gálvez 1368, Chongoyape -
                        Chiclayo, Perú<br />Telefono:(+51)931742904<br />Email:jcarlos.ad7@gmail.com
                      </p>
                    </div>
                    <div id="fact">
                      <p>
                        {{ tipoComprobante }}<br />
                        {{ serieComprobante }}-{{ numComprobante }}<br />
                        {{ fecha }}
                      </p>
                    </div>
                  </header>
                  <br />
                  <section>
                    <div>
                      <table id="facliente">
                        <tbody>
                          <tr>
                            <td id="cliente">
                              <strong>Sr(a). {{ persona.name }}</strong
                              ><br />
                              <strong>Documento:</strong>
                              {{ persona.documentType }}-{{
                                persona.documentNumber
                              }}<br />
                              <strong>Dirección:</strong> {{ persona.address
                              }}<br />
                              <strong>Teléfono:</strong> {{ persona.phoneNumber
                              }}<br />
                              <strong>Email:</strong> {{ persona.email }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                  <br />
                  <section>
                    <div>
                      <table id="facarticulo">
                        <thead>
                          <tr id="fa">
                            <th>CANT</th>
                            <th>DESCRIPCION</th>
                            <th>PRECIO UNIT</th>
                            <th>DESC.</th>
                            <th>PRECIO TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="art in articulos" :key="art._id">
                            <td style="text-align:center;">
                              {{ art.quantity }}
                            </td>
                            <td>
                              {{ art.name }}
                            </td>
                            <td style="text-align:right;">
                              {{ art.price }}
                            </td>
                            <td style="text-align:right;">
                              {{ art.discount }}
                            </td>
                            <td style="text-align:right;">
                              {{ art.price * art.quantity - art.discount }}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th style="text-align:right;">SUBTOTAL</th>
                            <th style="text-align:right;">
                              {{ totalParcial }}
                            </th>
                          </tr>
                          <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th style="text-align:right;">IVA</th>
                            <th style="text-align:right;">
                              {{ totalImpuesto }}
                            </th>
                          </tr>
                          <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th style="text-align:right;">TOTAL</th>
                            <th style="text-align:right;">{{ totalNeto }}</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </section>
                  <br />
                  <br />
                  <footer>
                    <div id="gracias">
                      <p><b>Gracias por su compra!</b></p>
                    </div>
                  </footer>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="changeFacturaDialog"
                  >Cancelar</v-btn
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
        <v-icon small class="mr-2" @click="verFactura(item)">
          mdi-printer
        </v-icon>
        <v-icon v-if="item.status === 1" small @click="deactivateItem(item)">
          mdi-cancel
        </v-icon>
        <v-icon v-else small @click="activateItem(item)">
          mdi-check
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getVentas">
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
            v-model="cliente"
            label="Cliente"
            :items="clientes"
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
            <template v-slot:item.discount="{ item }">
              <v-text-field
                v-model="item.discount"
                type="number"
              ></v-text-field>
            </template>
            <template v-slot:item.subtotal="{ item }">
              <p>${{ item.price * item.quantity - item.discount }}</p>
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
  name: 'Ventas',
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    articuloDialog: false,
    headers: [
      { text: 'Acciones', value: 'actions', sortable: false },
      { text: 'Usuario', value: 'user.name' },
      { text: 'Cliente', value: 'person.name' },
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
      {
        text: 'Descuento',
        value: 'discount',
        align: 'center',
        sortable: false,
      },
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
    clientes: [],
    codigo: '',
    tiposComprobante: ['FACTURA', 'BOLETA'],
    editedIndex: -1,
    defaultItem: {
      name: '',
      description: '',
      status: 0,
    },
    ventas: [],
    _id: '',
    nombre: '',
    descripcion: '',
    tipoComprobante: '',
    serieComprobante: '',
    numComprobante: '',
    cliente: '',
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
    descuento: 0,
    facturaDialog: false,
    fecha: '',
    persona: '',
  }),

  computed: {
    totalParcial() {
      let total = 0
      this.articulos.forEach(el => {
        // prettier-ignore
        total += (el.price * el.quantity * (this.impuesto + 1)) - el.discount
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
    this.getVentas()
    this.getClientes()
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
    async getVentas() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        const res = await axios.get('sale/list', config)
        this.ventas = res.data
      } catch (error) {
        console.log(error)
      }
    },
    async getClientes() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        const res = await axios.get('person/list', config)
        let arrayPersonas = res.data
        this.clientes = arrayPersonas.filter(x => x.personType === 'Cliente')
        this.clientes = this.clientes.map(x => {
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
          discount: 0,
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
      this.cliente = item.person.name
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
          '/sale/deactivate',
          {
            _id: this._id,
          },
          config
        )
        this.clean()
        this.close()
        this.getVentas()
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
          '/sale/activate',
          {
            _id: this._id,
          },
          config
        )
        this.clean()
        this.close()
        this.getVentas()
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
      this.cliente = ''
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

    verFactura(item) {
      this.changeFacturaDialog()

      this.clean()
      this._id = item._id
      this.nombre = item.name
      this.descripcion = item.description
      this.persona = item.person
      this.tipoComprobante = item.proofType
      this.serieComprobante = item.proofSeries
      this.numComprobante = item.proofNumber
      this.fecha = item.createdAt
      this.articulos = item.details
      // this.articulos =
    },

    changeFacturaDialog() {
      this.facturaDialog = !this.facturaDialog
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
            '/sale/add',
            {
              user: this.$store.state.user._id,
              person: this.cliente.value,
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
          this.getVentas()
        } catch (error) {
          console.log(error)
        }
        this.close()
      }
    },
  },
}
</script>

<style scoped>
#factura {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}

#logo {
  float: left;
  margin-left: 2%;
  margin-right: 2%;
}
#imagen {
  width: 100px;
}

#fact {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

#datos {
  float: left;
  margin-top: 0%;
  margin-left: 2%;
  margin-right: 2%;
  /*text-align: justify;*/
}

#encabezado {
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 16px;
}

section {
  clear: left;
}

#cliente {
  text-align: left;
}

#facliente {
  width: 40%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 15px;
}

#fa {
  color: #ffffff;
  font-size: 14px;
}

#facarticulo {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  padding: 20px;
  margin-bottom: 15px;
}

#facarticulo thead {
  padding: 20px;
  background: #2183e3;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

#gracias {
  text-align: center;
}
</style>
