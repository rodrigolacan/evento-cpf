import type { PessoaFisicaDTO } from 'src/components/pessoaFisica'

export function generateVcardsPessoaFisica(responseData: PessoaFisicaDTO | null): string {
  if (!responseData) return ''

  const nome = responseData.NomeRazaoSocial?.trim() || 'Contato Desconhecido'
  const cpf = `X-CPF:${responseData.CgcCpf.toString().padStart(11, '0')}`

  const emails: string[] = []
  const telefones: string[] = []

  responseData.ListaInformacoesContato?.forEach((contato) => {
    if (contato.CodComunic === 25) {
      emails.push(`EMAIL:${contato.Numero || 'naoinformou@gmail.com'}`)
    } else if (contato.CodComunic === 5) {
      telefones.push(`TEL:${contato.Numero || '0000000000'}`)
    }
  })

  return `
BEGIN:VCARD
VERSION:4.0
FN:${nome}
${emails.length ? emails.join('\n') : 'EMAIL:naoinformou@gmail.com'}
${cpf}
${telefones.length ? telefones.join('\n') : 'TEL:0000000000'}
X-CPF-RESPONSAVEL:
END:VCARD
  `.trim()
}
