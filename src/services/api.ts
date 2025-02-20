import type { PessoaFisicaDTO } from 'components/pessoaFisica'
import { api } from 'src/boot/axios'

//Buscar dados pelo CPF
export const fetchPessoaFisicaByCpf = async (newCpf: string) => {
  try {
    const cpfSemMascara = newCpf.replace(/\D/g, '')
    console.log(cpfSemMascara)
    const response = await api.get<PessoaFisicaDTO>('SelecionarPessoaFisica', {
      params: {
        CgcCpf: cpfSemMascara,
      },
      headers: {
        'x-req': import.meta.env.VITE_API_KEY,
      },
    })
    return response.data
  } catch (error) {
    console.error('Erro na requisição:', error)
  };
}

