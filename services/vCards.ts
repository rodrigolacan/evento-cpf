import type { PessoaFisicaDTO } from 'src/components/pessoaFisica'

export function generateVcardsPessoaFisica(responseData: PessoaFisicaDTO | null): string {
  if (!responseData) return ''

  const nome = responseData.NomeRazaoSocial || 'Contato Desconhecido'
  const cpf = 'X-CPF:' + responseData.CgcCpf.toString().padStart(11, '0')

  const emails: string[] = []
  const telefones: string[] = []

  responseData.ListaInformacoesContato?.forEach((c) => {
    if (c.CodComunic === 25) {
      emails.push(c.Numero ? `EMAIL:${c.Numero}` : 'EMAIL:naoinformou@gmail.com')
    } else if (c.CodComunic === 5) {
      telefones.push(c.Numero ? `TEL:${c.Numero}` : 'TEL:0000000000')
    }
  })

  const contacts = [...emails, cpf, ...telefones]

  return `
BEGIN:VCARD
VERSION:4.0
FN:${nome}
${contacts.join('\n')}
X-CPF-RESPONSAVEL:
END:VCARD
  `.trim()
}
