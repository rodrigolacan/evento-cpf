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
      <div class="flex justify-center mt-4">
        <button
          @click="buscarCpf(cpf)"
          class="bg-blue-500 text-white cursor-pointer font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors duration-200"
        >
          Buscar
        </button>
      </div>
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
        <q-btn label="Editar meus dados" @click="openEditDialog" class="mr-2" />
        <q-btn label="Fechar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showEditModal">
    <q-card class="max-w-lg w-full rounded-2xl shadow-lg bg-white">
      <q-card-section class="border-b border-gray-200 p-6">
        <div class="text-xl font-semibold text-gray-800">Editar Meus Dados</div>
      </q-card-section>

      <q-card-section class="p-6 space-y-4" v-if="editData">
        <!-- Formulário de Edição -->
        <div>
          <label for="nome" class="block text-sm font-medium text-gray-600"
            >Nome/Razão Social:</label
          >
          <input
            id="nome"
            placeholder="Nome"
            v-model="editData.NomeRazaoSocial"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label for="contato" class="block text-sm font-medium text-gray-600">Contatos:</label>
          <ul class="mt-2 space-y-2" v-if="editData.ListaInformacoesContato">
            <li
              v-for="(contato, index) in editData.ListaInformacoesContato"
              :key="index"
              placeholder="Digite seu e-mail"
              class="text-base text-gray-700 flex items-center gap-2"
            >
              <input
                v-model="contato.Numero"
                placeholder="(99) 99999-9999"
                @input="formatarTelefone(contato, index)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </li>
          </ul>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="p-4 border-t border-gray-200">
        <q-btn label="Salvar" @click="saveEdit" class="mr-2" />
        <q-btn label="Cancelar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance } from 'vue'
import { fetchPessoaFisicaByCpf } from 'src/services/api'
import { generateVcardsPessoaFisica } from 'src/services/vCards'
import type { PessoaFisicaDTO, InformacaoContato } from '../pessoaFisica'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { Loading } from 'quasar'


const cpf = ref<string>('')
const showModal = ref<boolean>(false)
const showEditModal = ref<boolean>(false)
const responseData = ref<PessoaFisicaDTO | null>(null)
const editData = ref<PessoaFisicaDTO | null>(null)

const instance = getCurrentInstance()
const masks = instance?.appContext.config.globalProperties?.$masks

const qrData = computed(() => generateVcardsPessoaFisica(responseData.value))


// Função debounce com tipos explícitos
function debounce<T extends (...args: string[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout); // Limpa o timeout anterior
    timeout = setTimeout(() => func(...args), wait); // Configura um novo timeout
  };
}

// Versão debounced da função buscarCpf
const buscarCpfDebounced = debounce(async (cpfInput: string) => {
  Loading.show({ message: 'Buscando CPF...' }) // Exibe o spinner
  try {
    responseData.value = (await fetchPessoaFisicaByCpf(cpfInput)) ?? null;
    showModal.value = true;
  } catch (error) {
    console.error('Erro ao buscar CPF:', error);
  } finally {
    Loading.hide() // Oculta o spinner
  }
}, 800); // 800ms de espera

async function buscarCpf(cpfInput: string) {
  Loading.show({ message: 'Buscando CPF...' }) // Exibe o spinner
  try {
    responseData.value = (await fetchPessoaFisicaByCpf(cpfInput)) ?? null
    showModal.value = true
  } catch (error) {
    console.error('Erro ao buscar CPF:', error)
  } finally {
    Loading.hide() // Oculta o spinner
  }
}

function formatarTelefone(contato: InformacaoContato, index: number) {
  if (!editData.value || !editData.value.ListaInformacoesContato) return

  const lista = editData.value.ListaInformacoesContato

  if (masks && contato.CodComunic === 5 && lista[index]) {
    lista[index].Numero = masks.phoneBR(contato.Numero)
  }
}

function openEditDialog() {
  if (responseData.value) {
    // Verifica se ListaInformacoesContato existe e não está vazia
    const listaContatos = responseData.value.ListaInformacoesContato || []

    // Verifica se há algum item na lista com CodComunic = 5
    const existeTelefone = listaContatos.some((contato) => contato.CodComunic === 5)

    // Se não houver nenhum item com CodComunic = 5, adiciona um novo item vazio
    if (!existeTelefone) {
      const novoContato = {
        NumSeqCom: listaContatos.length + 1, // Valor padrão para NumSeqCom
        CodComunic: 5, // Código para telefone
        DescComunic: 'TELEFONE CELULAR', // Descrição padrão
        Numero: '', // Campo vazio para o número de telefone
        IndInternet: 0, // Valor padrão para IndInternet
        RecebeContato: null, // Valor padrão para RecebeContato
        RecebeSMS: null, // Valor padrão para RecebeSMS
        Principal: null, // Valor padrão para Principal
      }
      listaContatos.push(novoContato)
    }

    editData.value = {
      ...responseData.value,
      CgcCpf: String(responseData.value.CgcCpf || ''),
      ListaInformacoesContato: responseData.value.ListaInformacoesContato || [],
    }
    console.log(editData.value)
    showEditModal.value = true
  }
}

function saveEdit() {
  if (editData.value) {
    responseData.value = editData.value
    showEditModal.value = false
  }
}

watch(cpf, (newCpf) => {
  if (masks) {
    cpf.value = masks.cpf(newCpf)
  }
  buscarCpfDebounced(newCpf)
})
</script>
