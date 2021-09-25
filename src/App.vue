<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import LoginDialog from './components/LoginDialog/LoginDialog.vue'

const $q = useQuasar()
const route = useRoute()
const store = useStore()

store.commit('session/setTokenFromCookie')

const isLoggedIn = computed(() => store.state.session.isLoggedIn)
const isFetching = computed(() => store.state.session.isFetching)

function showLoginDialog() {
  store.commit('loginDialog/show')
}

function confirmLogout() {
  $q.dialog({
    title: 'Logout',
    message: 'Would you like to logout?',
    cancel: true,
  }).onOk(() => {
    store.commit('session/logout')

    $q.notify({
      message: 'Logout successful',
      type: 'positive',
    })
  })
}

onMounted(() => {
  store.dispatch('session/getFarmStatus')
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
          :disable="isFetching"
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
