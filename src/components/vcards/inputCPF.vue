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
</template>

<script setup lang="ts">
import { ref, watch, getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const masks = instance?.appContext.config.globalProperties?.$masks;

const cpf = ref<string>('');

watch(cpf, (newCpf) => {
  if (masks) {
    cpf.value = masks.cpf(newCpf);
  }
});
</script>