<template>
  <div>
      <div class="page-title">
        <h3>{{'Bill_Title' | localize}}</h3>

        <button
          class="btn waves-effect waves-light btn-small"
          @click="refresh"
        >
          <i class="material-icons">refresh</i>
        </button>
      </div>

      <Loader v-if="loading"></Loader>
      <div class="row" v-else>
        <home-bill
        :rates="currency.rates"
        ></home-bill>
        <home-currency
        :rates="currency.rates"
        :date="currency.date"
        ></home-currency>
      </div>
</div>
</template>

<script>
import HomeBill from '../components/HomeBill'
import HomeCurrency from '../components/HomeCurrency'

export default {
  name: 'Home',
  metaInfo () {
    return {
      title: this.$title('Menu_Bill')
    }
  },
  components: { HomeBill, HomeCurrency },
  async mounted () {
    this.currency = await this.$store.dispatch('fetchCurrency')
    this.loading = false
  },
  data () {
    return {
      loading: true,
      currency: null
    }
  },
  methods: {
    async refresh () {
      this.loading = true
      this.currency = await this.$store.dispatch('fetchCurrency')
      this.loading = false
    }
  }
}
</script>
