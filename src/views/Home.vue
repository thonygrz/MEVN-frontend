<template>
  <div>
    <v-container>
      <v-row justify="center" height="400">
        <v-col cols="12" sm="12">
          <canvas id="myChart"></canvas>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import Chart from 'chart.js'
export default {
  name: 'Home',
  data: () => ({
    meses: [],
    totales: [],
    myChart: '',
  }),
  mounted() {
    this.getVentasUltimos12Meses()
  },
  methods: {
    async getVentasUltimos12Meses() {
      try {
        let header = { Token: this.$store.state.token }
        let config = { headers: header }
        const res = await axios.get('sale/lastYearGraph', config)
        let arr = res.data
        this.meses = arr.map(
          x => this.mesCorrespondiente(x._id.month) + '-' + x._id.year
        )
        this.totales = arr.map(x => x.total)
        this.graficar()
      } catch (error) {
        console.log(error)
      }
    },
    mesCorrespondiente(num) {
      switch (num) {
        case 1:
          return 'Enero'
        case 2:
          return 'Febrero'
        case 3:
          return 'Marzo'
        case 4:
          return 'Abril'
        case 5:
          return 'Mayo'
        case 6:
          return 'Junio'
        case 7:
          return 'Julio'
        case 8:
          return 'Agosto'
        case 9:
          return 'Septiembre'
        case 10:
          return 'Octubre'
        case 11:
          return 'Noviembre'
        case 12:
          return 'Diciembre'
        default:
        // code block
      }
    },
    graficar() {
      var ctx = document.getElementById('myChart').getContext('2d')
      this.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.meses,
          datasets: [
            {
              label: 'Ventas de los últimos 12 meses',
              data: this.totales,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      })
    },
  },
}
</script>
