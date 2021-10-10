<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

import LoginDialog from '@/components/LoginDialog.vue'
import { useSessionStore } from '@/store/session'
import { useLoginDialogStore } from '@/store/loginDialog'
import { useWeatherStore } from '@/store/weather'

const $q = useQuasar()
const route = useRoute()

const loginDialog = useLoginDialogStore()
const session = useSessionStore()
const weather = useWeatherStore()

const isLoggedIn = computed(() => session.isLoggedIn)
const isLoggingIn = computed(() => session.isLoggingIn)
const hasEventToday = computed(() => weather.hasEventToday)

session.setTokenFromCookie()
weather.getDateEventsFromStorage()

if (!hasEventToday.value) {
  weather.fetchDateEvents()
}

function showLoginDialog() {
  loginDialog.show()
}

function confirmLogout() {
  $q.dialog({
    title: 'Logout',
    message: 'Would you like to logout?',
    cancel: true,
  }).onOk(() => {
    session.logout()

    $q.notify({
      message: 'Logout successful',
      type: 'positive',
    })
  })
}

onMounted(() => {
  session.getFarmStatus()
})
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title> PvUtils </q-toolbar-title>

        <q-btn
          v-if="isLoggedIn"
          push
          color="secondary"
          icon="mdi-logout-variant"
          label="Logout"
          @click="confirmLogout"
        />

        <q-btn
          v-else
          push
          color="secondary"
          icon="mdi-login-variant"
          label="Login"
          :disable="isLoggingIn"
          @click="showLoginDialog"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view :key="route.fullPath" />
    </q-page-container>

    <login-dialog />
  </q-layout>
</template>
