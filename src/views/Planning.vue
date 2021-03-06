<template>
  <div>
    <div class="page-title">
      <h3>{{'Planning_Title' | localize}}</h3>
      <h4>{{ info.bill | currency('RUB') }}</h4>
    </div>

    <Loader v-if="loading"></Loader>
    <p class="center" v-else-if="!categories.length">
      {{'Planning_Empty' | localize}}
      <router-link to="/categories">{{'Planning_AddNew' | localize}}</router-link>
    </p>
    <section v-else>
      <div v-for="cat in categories" :key="cat.id">
        <p>
          <strong>{{cat.title}}:</strong>
          {{cat.spend | currency('RUB')}} {{'Planning_Of' | localize}} {{cat.limit | currency('RUB')}}
        </p>
        <div class="progress" v-tooltip="cat.tooltip">
          <div
            class="determinate"
            :class="[cat.progressColor]"
            :style="{width: cat.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import currencyFilter from '@/filters/currency.filter'
import localizeFilter from '@/filters/locolize.filter'

export default {
  name: 'planning',
  metaInfo () {
    return {
      title: this.$title('Planning_Title')
    }
  },
  data () {
    return {
      loading: true,
      categories: []
    }
  },
  computed: {
    ...mapGetters(['info'])
  },
  async mounted () {
    const records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.categories = categories
      .map((cat) => {
        const spend = records
          .filter((rec) => rec.categoryId === cat.id)
          .filter((rec) => rec.type === 'outcome')
          .reduce((acc, rec) => {
            acc += +rec.amount
            return acc
          }, 0)

        const percent = 100 * spend / cat.limit

        const progressPercent = percent > 100 ? 100 : percent
        const progressColor = percent < 60
          ? 'green'
          : percent < 100
            ? 'yellow'
            : 'red'

        const tooltipValue = cat.limit - spend
        const tooltip = `${tooltipValue < 0 ? localizeFilter('Tooltip_Excess') : localizeFilter('Tooltip_Left')} ${currencyFilter(Math.abs(tooltipValue))}`

        return ({
          ...cat,
          progressPercent,
          progressColor,
          spend,
          tooltip
        })
      })

    this.loading = false
  }
}
</script>
