<template>
  <header @loggedIn="changeName(name)" @settingsChangeName="changeName(name)">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link :to="{name: 'Home'}" class="navbar-brand">URL Shortener</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" v-if="!this.$root.isUserLoggedIn()">
            <router-link class="nav-link" :to="{name: 'UserRegister'}">Register</router-link>
          </li>
          <li class="nav-item" v-if="!this.$root.isUserLoggedIn()">
            <router-link class="nav-link" :to="{name: 'UserLogin'}">Login</router-link>
          </li>
          <li class="nav-item" v-if="this.$root.isUserLoggedIn()">
            <router-link class="nav-link" :to="{name: 'Profile'}">Profile</router-link>
          </li>
          <li class="nav-item" v-if="this.$root.isUserLoggedIn()">
            <router-link class="nav-link" :to="{name: 'Url'}">Links</router-link>
          </li>
          <li class="nav-item" v-if="this.$root.isUserLoggedIn()">
            <router-link class="nav-link" :to="{name: 'UserSettings'}">Settings</router-link>
          </li>
          <li class="nav-item" v-if="this.$root.isUserLoggedIn()">
            <a href="#" class="nav-link" @click.prevent="cancel()">Hi, {{ this.name }}</a>
          </li>
          <li class="nav-item" v-if="this.$root.isUserLoggedIn()" @click.prevent="logout()">
            <a href="#" class="nav-link" @click.prevent="cancel()">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import axios from '@/api'
export default {
  name: "AppHeader",
  data () {
    return {
      name: '',
      results: []
    }
  },
  methods: {
    cancel () {
      return false
    },
    logout () {
      const tokenKey = this.$store.state.tokenKey
      const token = localStorage.getItem(tokenKey)
      axios.get(`logout?${tokenKey}=${token}`)
        .then(() => {
          localStorage.removeItem(tokenKey)
          this.$store.state.isUserLoggedIn = false
          this.name = ''
          if (this.$route.name !== 'Home') {
            this.$router.push({ name: 'Home' })
          }
        })
        .catch(() => { this.results.push('An error occured. Please try again later.') })
    },
    changeName (name) {
      this.name = name
    }
  },
  mounted () {
    const tokenKey = this.$store.state.tokenKey
    const token = localStorage.getItem(tokenKey)
    if (token)
    {
        axios.get(`authenticate?${tokenKey}=${token}`)
          .then(res => {
            if (res.data.success) {
              this.$store.state.isUserLoggedIn = true
              this.name = res.data.message
            } else {
              this.$store.state.isUserLoggedIn = false
              this.name = ''
            }
          })
          .catch(() => { this.results.push('An error occured. Please try again later.') })
    }
  }
};
</script>

<style scoped lang="sass">

</style>
