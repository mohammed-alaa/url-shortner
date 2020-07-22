<template>
    <div>
        You're logged in
    </div>
</template>

<script>
import axios from '@/api'

export default {
    name: "UserProfile",
    data () {
        return {
            results: []
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
                    this.$router.push({ name: 'UserLogin', query: { redirect: this.$router.path } })
                  }
                })
                .catch(() => { this.results.push('An error occured. Please try again later.') })
                // .finally(() => { this.isReqDone = true })
        }
        else {
            this.$router.push({ name: 'UserLogin', query: { redirect: this.$router.path } })
        }
    }
}
</script>