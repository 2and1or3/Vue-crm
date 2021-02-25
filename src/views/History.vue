<template>
  <div>
    <div class="page-title">
      <h3>{{'History_Title' | localize}}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading"></Loader>
    <p class="center" v-else-if="!records.length">
      {{'History_Empty' | localize}}
      <router-link to="/record">{{'History_AddNew' | localize}}</router-link>
    </p>
    <section v-else>
      <history-table
        :records="items"
      ></history-table>
      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'History_Pagination_Next' | localize"
        :next-text="'History_Pagination_Prev' | localize"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      >
      ></Paginate>
    </section>
  </div>
</template>

<script>
import HistoryTable from '../components/HistoryTable'
import paginationMixin from '../mixins/pagination.mixin'
import { Pie } from 'vue-chartjs'
import localizeFilter from '@/filters/locolize.filter'

export default {
  name: 'history',
  extends: Pie,
  components: { HistoryTable },
  mixins: [paginationMixin],
  data () {
    return {
      loading: true,
      records: []
    }
  },

  async mounted () {
    this.records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.setup(categories)

    this.loading = false
  },
  methods: {
    setup (categories) {
      this.setupPagination(this.records.map(rec => {
        return {
          ...rec,
          categoryName: categories.find(c => c.id === rec.categoryId).title,
          typeClass: rec.type === 'income' ? 'green' : 'red',
          typeText: rec.type === 'income' ? localizeFilter('History_Income') : localizeFilter('History_Outcome')
        }
      }))

      this.renderChart({
        labels: categories.map(cat => cat.title),
        datasets: [{
          label: 'Расходы по категориям',
          data: categories.map(cat => {
            return this.records.reduce((acc, rec) => {
              if (rec.categoryId === cat.id && rec.type === 'outcome') {
                acc += +rec.amount
              }

              return acc
            }, 0)
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      })
    }
  }

}
</script>
