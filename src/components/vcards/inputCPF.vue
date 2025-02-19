<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="bg-white p-6 rounded-2xl shadow-lg w-96">
      <label for="cpf" class="block text-lg font-medium text-gray-700 mb-2">
        Informe o CPF do participante:
      </label>
      <input
        id="cpf"
        v-model="cpf"
        placeholder="000.000.000-00"
        maxlength="14"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  </div>

  <!-- Modal para exibir os resultados -->
  <q-dialog v-model="showModal">
    <q-card>
      <q-card-section>
        <div class="text-h6">Resultado da busca</div>
      </q-card-section>
      <q-card-section>
        <pre>{{ responseData }}</pre>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Fechar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const masks = instance?.appContext.config.globalProperties?.$masks
const axios = instance?.appContext.config.globalProperties?.$api
const isLoading = ref<boolean>(false)
const cpf = ref<string>('')
const showModal = ref<boolean>(false)
const responseData = ref<Record<string, unknown> | null>(null)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const buscarDadosCPF = async (newCpf: string) => {
  isLoading.value = true
  try {
    const cpfSemMascara = newCpf.replace(/\D/g, '')
    console.log(cpfSemMascara);
    const response = await axios.get('SelecionarPessoaFisica', {
      params: {
        CgcCpf: cpfSemMascara,
      },
      headers:{
        'x-req': import.meta.env.VITE_API_KEY
      }
    })
    responseData.value = response.data
    showModal.value = true
  } catch (error) {
    console.error('Erro na requisição:', error)
    instance?.appContext.config.globalProperties?.$q.notify({
      type: 'negative',
      message: 'Erro ao buscar os dados do CPF.',
    })
  } finally {
    isLoading.value = false
  }
}

watch(cpf, (newCpf) => {
  if (masks) {
    cpf.value = masks.cpf(newCpf)
  }

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    void buscarDadosCPF(newCpf);
  }, 2000)
})
</script>
