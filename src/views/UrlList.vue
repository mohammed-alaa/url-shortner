<template>
    <section class="container">
        <div class="table-responsive text-center" v-if="this.results.length">
            <table class="table table-dark table-bordered background-secondary mb-0">
                <caption><router-link :to="{ name: 'UrlAdd' }" role="button" class="btn btn-success">Add url</router-link></caption>
                <thead class="background-primary text-secondary">
                    <tr>
                        <th>Link</th>
                        <th>Slug</th>
                        <th>Clicks</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="url in this.results" :key="url.id">
                        <td>{{ url.url }}</td>
                        <td>{{ url.slug }}</td>
                        <td>{{ url.clicks }}</td>
                        <td>{{ url.time }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            There are no links.
            <router-link :to="{ name: 'UrlAdd' }" role="button" class="btn btn-success">Add url</router-link>
        </div>
    </section>
</template>

<script>
import axios from '@/api'

export default {
    name: "UrlList",
    data () {
        return {
            results: []
        }
    },
    methods: {
        loadLinks () {
            const tokenKey = this.$store.state.tokenKey
            const token = localStorage.getItem(tokenKey)
            axios.get(`url_list?${tokenKey}=${token}`)
                .then(res => {
                  this.results = res.data.message || []
                })
                .catch(() => { this.results.push('An error occured. Please try again later.') })
                // .finally(() => { this.isReqDone = true })
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
                  } else {
                    this.loadLinks()
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