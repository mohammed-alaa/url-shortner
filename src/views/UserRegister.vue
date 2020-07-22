<template>
    <section class="container">
        <form @submit.prevent="SubmitForum()" novalidate>
            {{ this.results }}
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="name" class="form-control" id="name" v-model="userData.Username">
            </div>
            <div class="form-group">
                <label for="email">Email address:</label>
                <input type="email" class="form-control" v-model="userData.Email" id="email">
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" class="form-control" v-model="userData.Password" id="password">
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirm password:</label>
                <input type="password" class="form-control" v-model="userData.confirmPassword" id="confirmPassword">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </section>
</template>

<script>
import axios from '@/api'
export default {
    name: "UserRegister",
    data () {
        return {
            userData: {
                Username: null,
                Email: null,
                Password: null,
                confirmPassword: null
            },
            userDataRules: {
                Username: {
                    required: true,
                    minLength: 4,
                    maxLength: 20,
                    pattern: null,
                    view_name: 'Name',
                    match: null
                },
                Email: {
                    required: true,
                    minLength: null,
                    maxLength: null,
                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    view_name: 'Email',
                    match: null
                },
                Password: {
                    required: true,
                    minLength: 8,
                    maxLength: null,
                    pattern: null,
                    view_name: 'Password',
                    match: null
                },
                confirmPassword: {
                    required: false,
                    minLength: null,
                    maxLength: null,
                    pattern: null,
                    view_name: 'Passwords',
                    match: 'Password'
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
                } else {
                    if (this.isValid(rule.minLength) && dataValue.length < rule.minLength) {
                        this.results.push(`Minimum length of ${rule.view_name} is ${rule.minLength}.`)
                    } else if (this.isValid(rule.maxLength) && dataValue.length > rule.maxLength) {
                        this.results.push(`Maximum length of ${rule.view_name} is ${rule.maxLength}.`)
                    } else if (this.isValid(rule.pattern) && !(rule.pattern).test(dataValue)) {
                        this.results.push(`Invalid value for ${rule.view_name}.`)
                    } else if (this.isValid(rule.match) && (dataValue !== this.userData[rule.match])) {
                        this.results.push(`${rule.view_name} don't match.`)
                    }
                }
            }

            if (!this.results.length) {
                axios.post('register', this.userData)
                    .then(res => {
                      if (!res.data.success) {
                        this.results.push(res.data.message)
                      } else {
                        this.$router.push(this.$route.query.redirect || { name: 'UserLogin' })
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
                    this.$router.push({ name: 'Profile' })
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