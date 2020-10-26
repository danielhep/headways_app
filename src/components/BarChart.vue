<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: { chartdata: { type: Object, default: () => {} } },
  data () {
    return {
      chartoptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.chartdata, this.chartoptions)
  }
}
</script>
