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

  <q-dialog v-model="showModal">
    <q-card class="max-w-lg w-full rounded-2xl shadow-lg bg-white">
      <q-card-section class="border-b border-gray-200 p-6">
        <div class="text-xl font-semibold text-gray-800">Resultado da Busca</div>
      </q-card-section>

      <q-card-section class="p-6 space-y-4">
        <div>
          <div class="text-sm font-medium text-gray-600">Nome/Razão Social:</div>
          <div class="text-lg font-semibold text-gray-800">
            {{ responseData?.NomeRazaoSocial }}
          </div>
        </div>

        <div>
          <div class="text-sm font-medium text-gray-600">Contatos:</div>
          <ul class="mt-2 space-y-2">
            <li
              v-for="(contato, index) in responseData?.ListaInformacoesContato"
              :key="index"
              class="text-base text-gray-700 flex items-center gap-2"
            >
              <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
              {{ contato.Numero }}
            </li>
          </ul>
        </div>

        <!-- QR Code -->
        <div class="flex justify-center mt-4">
          <vue-qr
            :text="qrData"
            :size="200"
            :foreground="'#000000'"
            :background="'#FFFFFF'"
            class="border rounded-lg shadow-md"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="p-4 border-t border-gray-200">
        <q-btn label="Fechar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, getCurrentInstance } from 'vue'
import type { PessoaFisicaDTO } from '../pessoaFisica'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

const instance = getCurrentInstance()
const masks = instance?.appContext.config.globalProperties?.$masks
const axios = instance?.appContext.config.globalProperties?.$api
const isLoading = ref<boolean>(false)
const cpf = ref<string>('')
const showModal = ref<boolean>(false)
const responseData = ref<PessoaFisicaDTO | null>(null)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const qrData = computed(() => {
  if (!responseData.value) return ''

  const nome = responseData.value.NomeRazaoSocial || 'Contato Desconhecido'
  const cpf = responseData.value.CgcCpf.toString().padStart(11, '0')
  const telefones =
    responseData.value.ListaInformacoesContato?.map((c) => `TEL;TYPE=CELL:${c.Numero}`).join(
      '\n',
    ) || 'TEL;TYPE=CELL:00000000000'

  // Separando nome e sobrenome (caso haja)
  const [primeiroNome, ...resto] = nome.split(' ')
  const sobrenome = resto.join(' ') || ' '

  // Criando o vCard corretamente formatado
  const vCard = `
BEGIN:VCARD
VERSION:3.0
N:${sobrenome};${primeiroNome};;;
FN:${nome}
ORG:Sebrae
${telefones}
X-CPF: ${cpf}
END:VCARD
  `.trim()

  return vCard
})
console.log(cpf)

//Buscar dados pelo CPF
const buscarDadosCPF = async (newCpf: string) => {
  isLoading.value = true
  try {
    const cpfSemMascara = newCpf.replace(/\D/g, '')
    console.log(cpfSemMascara)
    const response = await axios.get('SelecionarPessoaFisica', {
      params: {
        CgcCpf: cpfSemMascara,
      },
      headers: {
        'x-req': import.meta.env.VITE_API_KEY,
      },
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
    void buscarDadosCPF(newCpf)
  }, 2000)
})
</script>
