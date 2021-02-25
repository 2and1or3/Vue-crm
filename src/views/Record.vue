<template>
  <div>
    <div class="page-title">
      <h3>{{'Record_Title' | localize}}</h3>
    </div>

    <Loader v-if="loading"></Loader>

    <p class="center" v-else-if="!categories.length">
      {{'Record_Empty' | localize}}
      <router-link to="/categories">{{'Record_AddNew' | localize}}</router-link>
    </p>

    <form v-else class="form" @submit.prevent="submitHandler">
      <div class="input-field" >
        <select ref="select" v-model="category">
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"

          >{{cat.title}}</option>
        </select>
        <label>{{'Record_Choose' | localize}}</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{'Record_Income' | localize}}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>{{'Record_Outcome' | localize}}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
        >
        <label for="amount">{{'Record_Amount' | localize}}</label>
        <span
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          class="helper-text invalid"
        >{{'Record_AmountMessageMin' | localize}}</span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{invalid: $v.description.$dirty && !$v.description.required}"
        >
        <label for="description">{{'Record_Description' | localize}}</label>
        <span
          v-if="$v.description.$dirty && !$v.description.required"
          class="helper-text invalid"
        >{{'Record_DescriptionMessageRequired' | localize}}</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'Record_Create' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { minValue, required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'

export default {
  name: 'record',
  metaInfo () {
    return {
      title: this.$title('Record_Title')
    }
  },
  data () {
    return {
      loading: true,
      categories: [],
      select: null,
      category: null,
      type: 'outcome',
      amount: 1,
      description: ''
    }
  },
  validations: {
    description: { required },
    amount: { minValue: minValue(1) }
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord () {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount
    }
  },
  methods: {
    async submitHandler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          })

          const bill = this.type === 'income'
            ? this.info.bill + this.amount
            : this.info.bill - this.amount

          await this.$store.dispatch('updateInfo', { bill })
          this.$message('Запись успешно создана')
          this.$v.$reset()
          this.amount = 1
          this.description = ''
        } catch (e) {}
      } else {
        this.$message(`Недостаточно средств на счете ${this.amount - this.info.bill}`)
      }
    }
  },
  async mounted () {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false

    if (this.categories.length) {
      this.category = this.categories[0].id
    }

    setTimeout(() => {
      window.M.updateTextFields()
      this.select = window.M.FormSelect.init(this.$refs.select, {})
    })
  },
  beforeDestroy () {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>
