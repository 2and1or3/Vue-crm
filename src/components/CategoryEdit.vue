<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Categories_Edit_Title' | localize}}</h4>
      </div>

      <form @submit.prevent="submitHanlder">
        <div class="input-field" >
          <select ref="select" v-model="current">
            <option
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"

            >{{cat.title}}</option>
          </select>
          <label>{{'Categories_Edit_Choose' | localize}}</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{invalid: $v.title.$dirty && !$v.title.required}"
          >
          <label for="name">{{'Categories_Edit_Label' | localize}}</label>
          <span
            v-if="$v.title.$dirty && !$v.title.required"
            class="helper-text invalid"
          >{{'Categories_Edit_LabelMessageRequired' | localize}}</span>
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{invalid: $v.limit.$dirty && !$v.limit.minValue}"
          >
          <label for="limit">{{'Categories_Edit_Limit' | localize}}</label>
          <span
            v-if="$v.limit.$dirty && !$v.limit.minValue"
            class="helper-text invalid"
          >{{'Categories_Edit_LimitMessageMin' | localize}}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{'Categories_Edit_Button' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { minValue, required } from 'vuelidate/lib/validators'

export default {
  props: ['categories'],
  data () {
    return {
      select: null,
      title: '',
      limit: 1,
      current: null
    }
  },
  validations: {
    title: { required },
    limit: { minValue: minValue(1) }
  },
  methods: {
    async submitHanlder () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const categoryData = { id: this.current, title: this.title, limit: this.limit }

        await this.$store.dispatch('updateCategory', categoryData)

        this.$message('Категория успешно обновлена')
        this.$emit('updated', categoryData)
      } catch (e) {}
    }
  },
  watch: {
    current (catId) {
      const { title, limit } = this.categories.find(c => c.id === catId)
      this.title = title
      this.limit = limit
    }
  },
  created () {
    const { id, title, limit } = this.categories[0]
    this.current = id
    this.title = title
    this.limit = limit
  },
  mounted () {
    window.M.updateTextFields()
    this.select = window.M.FormSelect.init(this.$refs.select, {})
  },
  beforeDestroy () {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>

<style scoped>

</style>
