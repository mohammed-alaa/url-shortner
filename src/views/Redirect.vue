<template>
    <section class="container">
        {{ this.results }}
    </section>
</template>

<script>
import axios from '@/api'

export default {
    name: "Redirect",
    data () {
        return {
            results: null,
            slug: this.$route.params.slug || null
        }
    },
    methods: {
        loadUrl () {
            axios.get(`url/${this.slug}`)
                .then(res => {
                    if (res.data.success) {
                        this.results = res.data.message || ''
                        this.Redirect()
                    } else {
                        this.results = 'Invalid shit.'
                    }
                })
                .catch(() => { this.results.push('An error occured. Please try again later.') })
                // .finally(() => { this.isReqDone = true })
        },
        Redirect () {
            setTimeout(() => {
                if (this.results.length) {
                    window.location.href = this.results
                }
            }, 10000)
        }
    },
    mounted () {
        this.loadUrl()
    }
}
</script>