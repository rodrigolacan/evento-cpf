import { defineBoot } from '#q-app/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot( ({app}) => {
  // Registra as funções globalmente
app.config.globalProperties.$masks = {
    cpf: maskCPF,
    phoneBR: maskPhoneBR,
    money: maskMoney,
  }
})

function maskCPF(value: string): string {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o sexto e o sétimo dígitos
    .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um hífen entre o nono e o décimo dígitos
    .replace(/(-\d{2})\d+?$/, '$1') // Impede que o usuário digite mais de 11 caracteres
}

function maskPhoneBR(value: string): string {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d{2})(\d)/, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
    .replace(/(\d{5})(\d)/, '$1-$2') // Coloca um hífen entre o quinto e o sexto dígitos
    .replace(/(-\d{4})\d+?$/, '$1') // Impede que o usuário digite mais de 11 caracteres
}

function maskMoney(value: string): string {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d)(\d{2})$/, '$1,$2') // Coloca a vírgula antes dos dois últimos dígitos
    .replace(/(?=(\d{3})+(\D))\B/g, '.') // Coloca pontos a cada três dígitos
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $masks: {
      cpf: (value: string) => string;
      phoneBR: (value: string) => string;
      money: (value: string) => string;
    };
  }
}