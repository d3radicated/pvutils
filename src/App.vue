<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

import LoginDialog from './components/LoginDialog.vue'
import { useSessionStore } from './store/session'
import { useLoginDialogStore } from './store/loginDialog'

const $q = useQuasar()
const route = useRoute()

const loginDialog = useLoginDialogStore()
const session = useSessionStore()

session.setTokenFromCookie()

const isLoggedIn = computed(() => session.isLoggedIn)
const isLoggingIn = computed(() => session.isLoggingIn)

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
  <QLayout view="hHh LpR fFf">
    <QHeader elevated class="bg-primary text-white">
      <QToolbar>
        <QToolbarTitle> PvUtils </QToolbarTitle>

        <QBtn
          v-if="isLoggedIn"
          push
          color="secondary"
          icon="mdi-logout-variant"
          label="Logout"
          @click="confirmLogout"
        />

        <QBtn
          v-else
          push
          color="secondary"
          icon="mdi-login-variant"
          label="Login"
          :disable="isLoggingIn"
          @click="showLoginDialog"
        />
      </QToolbar>
    </QHeader>

    <QPageContainer>
      <RouterView :key="route.fullPath" />
    </QPageContainer>

    <LoginDialog />
  </QLayout>
</template>
