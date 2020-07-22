<template>
    <section class="container">
        <form @submit.prevent="SubmitForum()" novalidate>
            {{ this.results }}
            <div class="form-group">
                <label for="email">Email address:</label>
                <input type="email" class="form-control" v-model="userData.Email" id="email">
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" class="form-control" v-model="userData.Password" id="password">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </section>
</template>

<script>
import axios from '@/api'
export default {
    name: "UserLogin",
    data () {
        return {
            userData: {
                Email: null,
                Password: null
            },
            userDataRules: {
                Email: {
                    required: true,
                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    view_name: 'Email'
                },
                Password: {
                    required: true,
                    pattern: null,
                    view_name: 'Password'
                }
            },
            results: []
        }
    },
    methods: {
        isValid (param) {
            return ((param !== null) && (undefined !== param))
        },
        SubmitForum () {
            var dataValue = null, rule = null
            this.results = []
            for (const data in this.userData) {
                rule = this.userDataRules[data]
                dataValue = (this.userData[data] !== null) ? this.userData[data].trim() : '';
                if (this.isValid(rule.required) && rule.required && !dataValue.length) {
                    this.results.push(`${rule.view_name} is required.`)
                } else if (this.isValid(rule.pattern) && !(rule.pattern).test(dataValue)) {
                    this.results.push(`Invalid value for ${rule.view_name}.`)
                }
            }

            if (!this.results.length) {
                const tokenKey = this.$store.state.tokenKey
                axios.post('login', this.userData)
                    .then(res => {
                      if (!res.data.success) {
                        this.results.push(res.data.message)
                      } else {
                        this.$root.$emit('loggedIn', res.data.message.name)
                        this.$store.state.isUserLoggedIn = true
                        localStorage.setItem(tokenKey, res.data.message.token)
                        this.$router.push(this.$route.query.redirect || { name: 'Profile' })
                      }
                    })
                    .catch(() => { this.results.push('An error occured. Please try again later.') })
                    // .finally(() => { this.isReqDone = true })
            }
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
                    this.$root.$emit('loggedIn', res.data.message)
                    this.$store.state.isUserLoggedIn = true
                    this.results.push(res.data.message)
                    this.$router.push(this.$route.query.redirect || { name: 'Profile' })
                  } else {
                    this.$store.state.isUserLoggedIn = false
                  }
                })
                .catch(() => { this.results.push('An error occured. Please try again later.') })
                // .finally(() => { this.isReqDone = true })
        }
    }
}
</script>

<style scoped lang="sass">

</style>