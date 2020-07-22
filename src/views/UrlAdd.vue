<template>
    <section class="container">
        <form @submit.prevent="SubmitForum()" novalidate>
            {{ this.results }}
            <div class="form-group">
                <label for="url">Link:</label>
                <input type="text" class="form-control" v-model="userData.Url" id="url">
            </div>
            <div class="form-group">
                <label for="slug">Slug:</label>
                <input type="text" class="form-control" v-model="userData.Slug" id="slug">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </section>
</template>

<script>
import axios from '@/api'

export default {
    name: "UrlAdd",
    data () {
        return {
            results: [],
            userData: {
                Url: null,
                Slug: null
            },
            userDataRules: {
                Url: {
                    required: true,
                    minLength: 10,
                    view_name: 'Link',
                    maxLength: null,
                    pattern: null
                },
                Slug: {
                    required: true,
                    minLength: 5,
                    maxLength: 10,
                    view_name: 'Slug',
                    pattern: /^[a-zA-Z0-9\-_]+$/g
                }
            }
        }
    },
    methods: {
        isValid (param) {
            return ((param !== null) && (undefined !== param))
        },
        SubmitForum () {
            var dataValue = null, rule = null
            this.results = []
            const tokenKey = this.$store.state.tokenKey
            for (const data in this.userData) {
                if (data === tokenKey)  continue
                rule = this.userDataRules[data]
                dataValue = (this.userData[data] !== null) ? this.userData[data].trim() : '';
                if (this.isValid(rule.required) && rule.required && !dataValue.length) {
                    this.results.push(`${rule.view_name} is required.`)
                } else {
                    if (this.isValid(rule.pattern) && !(rule.pattern).test(dataValue)) {
                        this.results.push(`Invalid value for ${rule.view_name}.`)
                    } else if (this.isValid(rule.minLength) && dataValue < rule.minLength) {
                        this.results.push(`Max length for ${rule.view_name} is ${rule.minLength}.`)
                    } else if (this.isValid(rule.maxLength) && dataValue > rule.maxLength) {
                        this.results.push(`Max length for ${rule.view_name} is ${rule.maxLength}.`)
                    }
                }
            }

            if (!this.results.length) {
                this.userData[`${tokenKey}`] = localStorage.getItem(tokenKey)
                axios.post('add_url', this.userData)
                    .then(res => {
                      if (!res.data.success) {
                        this.results.push(res.data.message)
                      } else {
                        this.results.push("url added")
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
                  if (!res.data.success) {
                    this.results.push(res.data.message)
                    this.$router.push({ name: 'UserLogin', query: { redirect: this.$route.path } })
                  }
                })
                .catch(() => { this.results.push('An error occured. Please try again later.') })
                // .finally(() => { this.isReqDone = true })
        }
        else {
            this.$router.push({ name: 'UserLogin', query: { redirect: this.$route.path } })
        }
    }
}
</script>