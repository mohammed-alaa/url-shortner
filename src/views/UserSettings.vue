<template>
    <section class="container">
        {{ this.results }}
        <form @submit.prevent="ChangePassword()" novalidate>
            <div class="form-group">
                <label for="old_password">Old password:</label>
                <input type="password" class="form-control" v-model="userData.oldPassword" id="old_password">
            </div>
            <div class="form-group">
                <label for="new_password">New password:</label>
                <input type="password" class="form-control" v-model="userData.newPassword" id="new_password">
            </div>
            <div class="form-group">
                <label for="confirm_password">Confirm password:</label>
                <input type="password" class="form-control" v-model="userData.confirmNewPassword" id="confirm_password">
            </div>
            <button type="submit" class="btn btn-primary">Update password</button>
        </form>
        <form @submit.prevent="ChangeName()" novalidate>
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" class="form-control" v-model="userName" id="name">
            </div>
            <button type="submit" class="btn btn-primary">Update name</button>
        </form>
    </section>
</template>

<script>
import axios from '@/api'

export default {
    name: "UserSettings",
    data () {
        return {
            results: [],
            userName: undefined,
            userData: {
                Token: localStorage.getItem(`${this.$store.state.tokenKey}`),
                oldPassword: undefined,
                newPassword: undefined,
                confirmNewPassword: undefined
            },
            userDataRules: {
                Token: {
                    required: false
                },
                oldPassword: {
                    required: true,
                    view_name: 'Old password'
                },
                newPassword: {
                    required: true,
                    view_name: 'New passowrd',
                    minLength: 8
                },
                confirmNewPassword: {
                    required: false,
                    view_name: 'Passwords',
                    match: 'newPassword'
                }
            }
        }
    },
    methods: {
        isValid (param) {
            return ((param !== null) && (undefined !== param))
        },
        ChangePassword () {
            var dataValue = null, rule = null
            this.results = []
            for (const data in this.userData) {
                rule = this.userDataRules[data]
                dataValue = (this.isValid(this.userData[data])) ? this.userData[data].trim() : '';
                if (this.isValid(rule.required) && rule.required && !dataValue.length) {
                    this.results.push(`${rule.view_name} is required.`)
                } else {
                    if (this.isValid(rule.minLength) && dataValue.length < rule.minLength) {
                        this.results.push(`Minimum length of ${rule.view_name} is ${rule.minLength}.`)
                    } else if (this.isValid(rule.match) && (dataValue !== this.userData[rule.match])) {
                        this.results.push(`${rule.view_name} don't match.`)
                    }
                }
            }

            if (!this.results.length) {
                axios.post('change-password', this.userData)
                    .then(res => {
                      if (!res.data.success) {
                        this.results.push(res.data.message)
                      } else {
                        this.results.push('Password has been changed.')
                      }
                    })
                    .catch(() => { this.results.push('An error occured. Please try again later.') })
                    // .finally(() => { this.isReqDone = true })
            }
        },
        ChangeName () {
            this.results = []
            if (this.userName === undefined || !this.userName.trim().length) {
                this.results.push('Name is required.')
            } else if (this.userName.length < 4) {
                this.results.push('Minimum length of name is 4.')
            }

            if (!this.results.length) {
                axios.post('change-name', { Token: localStorage.getItem(`${this.$store.state.tokenKey}`), newName: this.userName })
                    .then(res => {
                      if (!res.data.success) {
                        this.results.push(res.data.message)
                      } else {
                        this.$root.$emit('settingsChangeName', this.userName)
                        this.userName = undefined
                        this.results.push('Name has been changed.')
                        this.$router.push({ name: 'Profile' })
                      }
                    })
                    .catch(() => { this.results.push('An error occured. Please try again later.') })
                    // .finally(() => { this.isReqDone = true })
            }
        }
    },
    mounted () {
        if (this.userData.Token && this.isUserLoggedIn())
        {
            axios.get(`authenticate?${this.$store.state.tokenKey}=${this.userData.Token}`)
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