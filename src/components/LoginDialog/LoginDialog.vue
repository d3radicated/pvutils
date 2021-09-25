<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { Field, Form } from 'vee-validate'
import { object, string } from 'yup'
import module from './module'

const $q = useQuasar()
const store = useStore()

!store.hasModule('loginDialog') && store.registerModule('loginDialog', module)

const schema = object({
  token: string().trim().required().label('Token'),
})

const token = ref<string | null>(null)
const submitting = ref(false)

const isVisible = computed({
  get() {
    return store.state?.loginDialog?.isVisible || false
  },

  set(value) {
    store.commit('loginDialog/setVisibility', value)
  },
})

watch(isVisible, (value) => {
  if (!value) {
    token.value = null
    submitting.value = false
  }
})

async function login() {
  submitting.value = true

  store.commit('session/setToken', token.value?.trim())

  try {
    await store.dispatch('session/getFarmStatus')
  } finally {
    submitting.value = false
  }

  if (store.state.session.isLoggedIn) {
    isVisible.value = false

    return $q.notify({
      type: 'positive',
      message: 'Login successful',
    })
  }

  $q.notify({
    type: 'negative',
    message: 'The token is invalid',
  })
}
</script>

<template>
  <QDialog v-model="isVisible" persistent>
    <QCard style="width: 480px">
      <QCardSection class="row">
        <div class="text-h6">Login</div>

        <QSpace />

        <QBtn
          v-close-popup
          flat
          round
          icon="mdi-close"
          size="sm"
          :disable="submitting"
        />
      </QCardSection>

      <QCardSection class="q-pt-none">
        <Form :validation-schema="schema" @submit="login">
          <Field v-slot="{ errorMessage, field }" name="token">
            <QInput
              v-model="token"
              v-bind="field"
              autogrow
              clearable
              filled
              label="Token"
              type="textarea"
              :disable="submitting"
              :error="!!errorMessage"
              :error-message="errorMessage"
            >
              <template #hint>
                You can get the token by opening DevTools > Application >
                Cookies.
              </template>
            </QInput>
          </Field>
        </Form>
      </QCardSection>

      <QCardActions align="right">
        <QBtn
          flat
          label="Login"
          text-color="primary"
          :disable="submitting"
          :loading="submitting"
          @click="login"
        />
      </QCardActions>
    </QCard>
  </QDialog>
</template>
