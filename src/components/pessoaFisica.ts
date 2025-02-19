interface Endereco {
  NumSeqEnd: number
  EndCorresp: string
  CodLogr: number | null
  DescEndereco: string
  Numero: string | null
  Complemento: string
  CodBairro: number
  DescBairro: string
  CodCid: number
  DescCid: string
  CodEst: number
  DescEst: string
  CodPais: number
  DescPais: string
  Cep: number
  EndInternacional: string | null
  IndCorrespond: number
  Principal: number
}

interface InformacaoContato {
  NumSeqCom: number
  CodComunic: number
  DescComunic: string
  Numero: string
  IndInternet: number
  RecebeContato: number | null
  RecebeSMS: number | null
  Principal: number | null
}

interface Vinculo {
  CgcCpf: number
  CodContatoPJ: number
  NomeRazaoSocialPJ: string
  CodCargCli: number
  DescCargCli: string
  IndPrincipal: number
  DtSituacao: string
  Situacao: number
  DataInclusao: string
  DataUltimaAlteracao: string
  SituacaoPJ: number
}

export interface PessoaFisicaDTO {
  CodSebrae: number
  DescSebrae: string
  CodParceiro: number
  CgcCpf: number
  NomeRazaoSocial: string
  NomeAbrevFantasia: string
  Genero: number
  DataNasc: string
  NomeMae: string
  CodGrauEscol: number
  DescGrauEscol: string
  Situacao: number
  FormaContatoID: number
  DescFormaContato: string
  TermoAceiteLGPD: number
  DataInclusaoTermoAceiteLGPD: string
  CodSebraeTermoAceiteLGPD: number
  DescSebraeTermoAceiteLGPD: string
  CodParceiroTermoAceiteLGPD: number
  NomeParceiroTermoAceiteLGPD: string
  Deficiencia: string
  DataInclusao: string
  DataUltimaAlteracao: string
  sit_cadastral: string
  Desc_sit_Cadastral: string
  ListaDeficiencia: unknown
  ListaGrupoCliente: unknown
  ListaInteresseNecessidade: unknown
  ListaEndereco: Endereco[]
  ListaInformacoesContato: InformacaoContato[]
  ListaVinculo: Vinculo[]
  ListaQualificacaoCadastro: unknown
  ListaAnexo: unknown
}
