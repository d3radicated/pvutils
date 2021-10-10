<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Field, Form as VvForm } from 'vee-validate'
import _ from 'lodash'
import { useQuasar } from 'quasar'
import { object, string } from 'yup'
import { useLoginDialogStore } from '@/store/loginDialog'
import { useSessionStore } from '@/store/session'

const $q = useQuasar()
const loginDialog = useLoginDialogStore()
const session = useSessionStore()

const schema = object({
  token: string().trim().required().label('Token'),
})

const token = ref<string | null>(null)
const submitting = ref(false)

const isVisible = computed({
  get() {
    return loginDialog.isVisible
  },

  set(value: boolean) {
    loginDialog.setVisibility(value)
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

  session.setToken((token.value || '').trim())

  try {
    await session.getFarmStatus()
  } finally {
    submitting.value = false
  }

  if (session.isLoggedIn) {
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
  <q-dialog v-model="isVisible" persistent>
    <q-card style="width: 480px">
      <q-card-section class="row">
        <div class="text-h6">Login</div>

        <q-space />

        <q-btn v-close-popup flat round icon="mdi-close" size="sm" :disable="submitting" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <vv-form :validation-schema="schema" @submit="login">
          <field v-slot="{ errorMessage, field }" name="token">
            <q-input
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
                You can get the token by opening DevTools > Application > Cookies.
              </template>
            </q-input>
          </field>
        </vv-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Login"
          text-color="primary"
          :disable="_.isEmpty(token) || submitting"
          :loading="submitting"
          @click="login"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
