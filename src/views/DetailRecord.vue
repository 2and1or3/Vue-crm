<template>
  <div>
    <Loader v-if="loading"></Loader>
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{'DetailRecord_History' | localize}}</router-link>
        <a @click.prevent class="breadcrumb">
          {{record.typeText}}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="[record.typeClass]">
            <div class="card-content white-text">
              <p>{{'DetailRecord_Description' | localize}}: {{record.description}}</p>
              <p>{{'DetailRecord_Amount' | localize}}: {{record.amount | currency('RUB')}}</p>
              <p>{{'DetailRecord_Category' | localize}}: {{record.categoryName}}</p>

              <small>{{record.date | date('datetime')}}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>{{'DetailRecord_Empty' | localize}}</p>
  </div>
</template>

<script>
import localizeFilter from '../filters/locolize.filter'

export default {
  name: 'detail-record',
  metaInfo () {
    return {
      title: this.$title('DetailRecord_Title')
    }
  },
  data () {
    return {
      loading: true,
      record: null
    }
  },
  async mounted () {
    const id = this.$route.params.id
    const record = await this.$store.dispatch('fetchRecordById', id)
    const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)

    this.record = {
      ...record,
      typeText: record.type === 'income' ? localizeFilter('DetailRecord_Income') : localizeFilter('DetailRecord_Outcome'),
      typeClass: record.type === 'income' ? 'green' : 'red',
      categoryName: category.title
    }

    this.loading = false
  }
}
</script>
