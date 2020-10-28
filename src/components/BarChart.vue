<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins
export default {
  extends: Bar,
  mixins: [reactiveProp],
  data () {
    return {
      chartoptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          align: 'start'
        },
        scales: {
          xAxes: [{
            stacked: true,
            ticks: {
              display: false
            }
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    }
  },
  watch: {
    chartData () {
      console.log('hello')
      this.renderChart(this.chartData, this.chartoptions)
      this.$data._chart.resize()
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.chartoptions)
  }
}
</script>
