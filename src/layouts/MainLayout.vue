<template>
  <div>
    <Loader v-if="loading"></Loader>
    <div class="app-main-layout" v-else>
      <navbar @toggle-navbar="isOpen = !isOpen"></navbar>
      <sidebar v-model="isOpen" :key="locale"></sidebar>
      <main class="app-content" :full="{full: !isOpen}">
        <div class="app-page">
          <router-view></router-view>
        </div>
      </main>

      <div class="fixed-action-btn">
        <router-link to="/record" class="btn-floating btn-large blue" v-tooltip=tooltipMessage :key="locale">
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/app/Navbar'
import Sidebar from '../components/app/Sidebar'
import messages from '@/utils/messages'
import localizeFilter from '@/filters/locolize.filter'

export default {
  name: 'main-layout',
  components: { Navbar, Sidebar },
  async mounted () {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }

    this.loading = false
  },
  data () {
    return {
      isOpen: true,
      loading: true
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    locale () {
      return this.$store.getters.info.locale
    },
    tooltipMessage: () => localizeFilter('Tooltip_CreateNew')
  },

  watch: {
    error (fbError) {
      this.$error(messages[fbError.code] || 'Something went wrong')
    }
  }
}
</script>
