<template>
  <div class="app-main-layout">
    <navbar @toggle-navbar="isOpen = !isOpen"></navbar>
    <sidebar v-model="isOpen"></sidebar>
    <main class="app-content" :full="{full: !isOpen}">
      <div class="app-page">
        <router-view></router-view>
      </div>
    </main>

    <div class="fixed-action-btn">
      <router-link to="/record" class="btn-floating btn-large blue">
        <i class="large material-icons">add</i>
      </router-link>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/app/Navbar'
import Sidebar from '../components/app/Sidebar'

export default {
  name: 'main-layout',
  components: { Navbar, Sidebar },
  data () {
    return {
      isOpen: true
    }
  }
}
</script>
