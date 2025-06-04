// script.js

// 1. Log inicial para confirmar que o script foi carregado e está em execução
console.log('1. script.js carregado e em execução.');

// Importa a biblioteca PDF.js
import { getDocument } from './lib/pdf.js/build/pdf.mjs';

// Configura o caminho para o Web Worker do PDF.js
// Essencial para que a biblioteca funcione corretamente
import * as pdfjsLib from './lib/pdf.js/build/pdf.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = './lib/pdf.js/build/pdf.worker.mjs';

// 2. Log para confirmar que o PDF.js foi importado
console.log('2. getDocument do PDF.js importado com sucesso.');

// Referências aos elementos HTML
const pdfInput = document.getElementById('pdfInput');
const processPdfBtn = document.getElementById('processPdfBtn');
const materiasList = document.getElementById('materiasList');

// 3. Log para confirmar que os elementos HTML foram capturados
console.log('3. Elementos HTML capturados:', { pdfInput, processPdfBtn, materiasList });

// --- Estrutura de Matérias Principais e Suas Submatérias ---
// Chave: Nome padronizado da matéria principal.
// Valor: Array de strings com os tópicos/submatérias.
const materiasComSubmaterias = {
    "Língua Portuguesa": [
        "Ortografia", "Acentuação Gráfica", "Crase", "Pontuação",
        "Sintaxe", "Morfologia", "Concordância Verbal", "Concordância Nominal",
        "Regência Verbal", "Regência Nominal", "Colocação Pronominal",
        "Semântica", "Significação de Palavras", "Figuras de Linguagem",
        "Funções da Linguagem", "Tipologia Textual", "Gêneros Textuais",
        "Interpretação de Texto", "Compreensão de Textos", "Coerência Textual",
        "Coesão Textual", "Redação Oficial", "Correspondência Oficial",
        "Vícios de Linguagem", "Variedades Linguísticas", "Classes de Palavras",
        "Período Composto", "Orações Coordenadas", "Orações Subordinadas"
    ],
    "Raciocínio Lógico-Matemático": [
        "Estruturas Lógicas", "Lógica de Argumentação", "Diagramas Lógicos",
        "Sequências Numéricas", "Associações Lógicas", "Verdades e Mentiras",
        "Proposições", "Conectivos Lógicos", "Tabelas-Verdade",
        "Equivalências Lógicas", "Negação de Proposições", "Porcentagem",
        "Juros Simples", "Juros Compostos", "Razão e Proporção",
        "Regra de Três Simples", "Regra de Três Composta",
        "Análise Combinatória", "Probabilidade", "Conjuntos",
        "Sistemas de Medidas", "Problemas com Frações", "Funções",
        "Geometria Básica", "Equações"
    ],
    "Informática": [
        "Sistema Operacional Windows", "Sistema Operacional Linux",
        "Microsoft Word", "MS Word", "LibreOffice Writer",
        "Microsoft Excel", "MS Excel", "LibreOffice Calc",
        "Microsoft PowerPoint", "MS PowerPoint", "LibreOffice Impress",
        "Conceitos de Internet", "Navegadores Web", "Correio Eletrônico",
        "Segurança da Informação", "Vírus e Malwares", "Backup",
        "Redes de Computadores", "Hardware", "Software",
        "Cloud Computing", "Computação em Nuvem", "Intranet",
        "Extranet", "Servidores", "Armazenamento de Dados",
        "Aplicativos de Escritório"
    ],
    "Direito Constitucional": [
        "Teoria da Constituição", "Poder Constituinte", "Classificação das Constituições",
        "Princípios Fundamentais", "Direitos e Deveres Individuais e Coletivos",
        "Direitos Sociais", "Nacionalidade", "Direitos Políticos", "Partidos Políticos",
        "Organização do Estado", "Administração Pública na Constituição",
        "Poder Legislativo", "Poder Executivo", "Poder Judiciário",
        "Funções Essenciais à Justiça", "Ministério Público", "Advocacia Pública",
        "Defensoria Pública", "Controle de Constitucionalidade", "Processo Legislativo",
        "Defesa do Estado e das Instituições Democráticas", "Ordem Econômica e Financeira",
        "Ordem Social", "Reforma da Constituição", "Emendas Constitucionais"
    ],
    "Direito Administrativo": [
        "Conceito e Fontes do Direito Administrativo", "Princípios do Direito Administrativo",
        "Administração Pública", "Organização da Administração Pública",
        "Administração Direta e Indireta", "Poderes Administrativos",
        "Ato Administrativo", "Validade do Ato Administrativo", "Extinção do Ato Administrativo",
        "Classificação dos Atos Administrativos", "Processo Administrativo",
        "Contratos Administrativos", "Licitações", "Lei nº 8.666/93",
        "Lei nº 14.133/21", "Serviços Públicos", "Bens Públicos",
        "Improbidade Administrativa", "Lei nº 8.429/92",
        "Responsabilidade Civil do Estado", "Agentes Públicos",
        "Regime Jurídico Único (Lei nº 8.112/90)",
        "Intervenção do Estado na Propriedade", "Controle da Administração Pública",
        "Controle Judicial", "Controle Legislativo", "Controle Administrativo"
    ],
    "Ética no Serviço Público": [
        "Conceito de Ética e Moral", "Ética Profissional", "Ética no Setor Público",
        "Decreto nº 1.171/94", // Código de Ética Profissional do Servidor Público Civil Federal
        "Conduta do Servidor Público", "Assédio Moral e Sexual", "Conflito de Interesses",
        "Transparência e Probidade", "Valores e Princípios da Administração Pública"
    ],
    "Atualidades": [
        "Fatos Políticos Nacionais", "Fatos Políticos Internacionais",
        "Economia Brasileira", "Economia Mundial", "Questões Sociais",
        "Meio Ambiente", "Tecnologia e Inovação", "Saúde Pública",
        "Educação", "Segurança Pública", "Relações Internacionais",
        "Cultura e Esporte", "Desenvolvimento Sustentável"
    ],
    "Contabilidade": [
        "Contabilidade Geral", "Contabilidade Pública", "Princípios de Contabilidade",
        "Regime de Competência", "Regime de Caixa", "Demonstrativos Contábeis",
        "Balanço Patrimonial", "DRE", "Fluxo de Caixa", "Análise de Balanços",
        "Ativo", "Passivo", "Patrimônio Líquido", "Receitas", "Despesas",
        "Auditoria Contábil", "Normas Brasileiras de Contabilidade (NBC)"
    ],
    "Direito Penal": [
        "Princípios do Direito Penal", "Aplicação da Lei Penal", "Teoria do Crime",
        "Tipicidade", "Ilicitude", "Culpabilidade", "Crimes contra a Pessoa",
        "Crimes contra o Patrimônio", "Crimes contra a Administração Pública",
        "Excludentes de Ilicitude", "Excludentes de Culpabilidade", "Penas",
        "Extinção da Punibilidade", "Legislação Penal Especial"
    ],
    "Direito Processual Penal": [
        "Princípios do Processo Penal", "Sistemas Processuais", "Ação Penal",
        "Jurisdição e Competência", "Inquérito Policial", "Provas",
        "Prisões", "Liberdade Provisória", "Recursos", "Nulidades",
        "Sujeitos do Processo", "Juiz", "Ministério Público", "Acusado", "Defensor"
    ],
    "Direito Civil": [
        "Lei de Introdução às Normas do Direito Brasileiro (LINDB)",
        "Pessoas Naturais", "Pessoas Jurídicas", "Bens", "Fatos Jurídicos",
        "Atos Jurídicos", "Negócio Jurídico", "Prescrição e Decadência",
        "Obrigações", "Contratos", "Direito das Coisas", "Direito de Família",
        "Direito das Sucessões", "Posse", "Propriedade"
    ],
    "Direito Processual Civil": [
        "Princípios do Processo Civil", "Jurisdição e Competência", "Ação",
        "Partes e Procuradores", "Atos Processuais", "Prazos", "Citação",
        "Intimação", "Petição Inicial", "Contestação", "Réplica", "Provas",
        "Sentença", "Coisa Julgada", "Recursos", "Execução", "Cumprimento de Sentença"
    ],
    "Direito do Trabalho": [
        "Princípios do Direito do Trabalho", "Fontes do Direito do Trabalho",
        "Contrato Individual de Trabalho", "Jornada de Trabalho", "Salário e Remuneração",
        "Férias", "FGTS", "Rescisão Contratual", "Estabilidade", "Greve",
        "Organização Sindical", "Segurança e Saúde no Trabalho"
    ],
    "Direito Processual do Trabalho": [
        "Princípios do Processo do Trabalho", "Organização da Justiça do Trabalho",
        "Competência da Justiça do Trabalho", "Ação Trabalhista", "Partes e Procuradores",
        "Atos, Termos e Prazos Processuais", "Dissídio Individual", "Dissídio Coletivo",
        "Recursos Trabalhistas", "Execução Trabalhista", "Audiência Trabalhista"
    ],
    "Direito Previdenciário": [
        "Seguridade Social", "Previdência Social", "Regimes Previdenciários",
        "Benefícios Previdenciários", "Custeio da Seguridade Social",
        "Regime Geral de Previdência Social (RGPS)", "Regime Próprio de Previdência Social (RPPS)",
        "Salário de Contribuição", "Carência", "Qualidade de Segurado",
        "Aposentadoria por Idade", "Aposentadoria por Tempo de Contribuição",
        "Aposentadoria por Invalidez", "Auxílio-Doença", "Pensão por Morte",
        "Salário-Maternidade", "Auxílio-Reclusão"
    ],
    "Direito Tributário": [
        "Sistema Tributário Nacional", "Princípios do Direito Tributário",
        "Competência Tributária", "Tributo", "Espécies de Tributos",
        "Impostos", "Taxas", "Contribuições de Melhoria", "Empréstimos Compulsórios",
        "Contribuições Especiais", "Obrigação Tributária", "Crédito Tributário",
        "Lançamento", "Suspensão", "Extinção", "Exclusão do Crédito Tributário",
        "Imunidades Tributárias", "Isenções Tributárias"
    ],
    "Direitos Humanos": [
        "Teoria Geral dos Direitos Humanos", "Gerações de Direitos Humanos",
        "Pacto de San José da Costa Rica", "Declaração Universal dos Direitos Humanos",
        "Direitos Civis e Políticos", "Direitos Econômicos, Sociais e Culturais",
        "Proteção Internacional dos Direitos Humanos", "Corte Interamericana de Direitos Humanos"
    ],
    "Administração Pública": [
        "Modelos de Administração Pública", "Patrimonialismo", "Burocracia",
        "Gerencialismo", "Reforma do Aparelho do Estado", "Governança Pública",
        "Gestão da Qualidade no Serviço Público", "Planejamento Estratégico",
        "Orçamento Público", "LOA", "LDO", "PPA", "Ciclo Orçamentário",
        "Compras Governamentais", "Contratos Administrativos", "Convênios",
        "Gestão de Pessoas no Setor Público", "Avaliação de Desempenho",
        "Comunicação Organizacional", "Gestão de Projetos"
    ],
    "Legislação Específica": [
        "Lei de Acesso à Informação (Lei nº 12.527/2011)",
        "Lei Geral de Proteção de Dados (Lei nº 13.709/2018)",
        "LGPD",
        "Estatuto do Idoso",
        "Estatuto da Criança e do Adolescente (ECA)",
        "Lei Maria da Penha",
        "Lei de Improbidade Administrativa",
        "Leis Complementares Estaduais",
        "Decretos Locais",
        "Regulamentos Específicos"
    ],
    "Conhecimentos Gerais": [
        "Aspectos Geográficos do Brasil", "Aspectos Geográficos de [Estado/Município]",
        "Aspectos Históricos do Brasil", "Aspectos Históricos de [Estado/Município]",
        "Estrutura Social Brasileira", "Desenvolvimento Sustentável",
        "Globalização", "Urbanização", "População Brasileira", "Migrações",
        "Cidadania", "Direitos Sociais", "Sustentabilidade", "Educação Ambiental"
    ],
    "Conhecimentos Específicos": [
        // Esta categoria é genérica e pode conter submatérias variadas.
        // O ideal é preencher com tópicos específicos da área do concurso.
        "Técnicas de [Área]",
        "Princípios de [Área]",
        "Legislação Profissional",
        "Normas Técnicas",
        "Atribuições do Cargo",
        // Ex: Para um concurso de TI: "Banco de Dados", "Linguagens de Programação", "Redes"
    ]
};

// --- Mapeamento para Padronização dos Nomes das Matérias Principais ---
// Usado para agrupar sinônimos ou variações de uma mesma matéria principal.
// As chaves são os termos encontrados no edital (em minúsculas) e os valores são o nome PADRONIZADO da matéria.
const mapaMateriasPadronizadas = {
    "língua portuguesa": "Língua Portuguesa",
    "português": "Língua Portuguesa",
    "gramática": "Língua Portuguesa",
    "interpretação de texto": "Língua Portuguesa",
    "compreensão de textos": "Língua Portuguesa",
    "redação oficial": "Língua Portuguesa",
    "literatura brasileira": "Língua Portuguesa",
    "português instrumental": "Língua Portuguesa",

    "raciocínio lógico": "Raciocínio Lógico-Matemático",
    "matemática": "Raciocínio Lógico-Matemático",
    "lógica": "Raciocínio Lógico-Matemático",
    "raciocínio lógico-matemático": "Raciocínio Lógico-Matemático",
    "matemática financeira": "Raciocínio Lógico-Matemático",
    "estatística": "Raciocínio Lógico-Matemático",
    "aritmética": "Raciocínio Lógico-Matemático",
    "álgebra": "Raciocínio Lógico-Matemático",
    "geometria": "Raciocínio Lógico-Matemático",

    "noções de informática": "Informática",
    "informática": "Informática",
    "microsoft office": "Informática",
    "ms office": "Informática",
    "libreoffice": "Informática",
    "segurança da informação": "Informática",
    "redes de computadores": "Informática",
    "hardware e software": "Informática",
    "cloud computing": "Informática",
    "computação em nuvem": "Informática",
    "internet": "Informática",
    "correio eletrônico": "Informática",
    "editores de texto": "Informática",
    "planilhas eletrônicas": "Informática",
    "navegadores web": "Informática",
    "conceitos de internet": "Informática",
    "aplicativos de escritório": "Informática",

    "direito constitucional": "Direito Constitucional",
    "constituição federal": "Direito Constitucional",
    "direitos e deveres individuais e coletivos": "Direito Constitucional",
    "poderes": "Direito Constitucional",
    "organização do estado": "Direito Constitucional",
    "processo legislativo": "Direito Constitucional",
    "direitos sociais": "Direito Constitucional",
    "nacionalidade": "Direito Constitucional",
    "direitos políticos": "Direito Constitucional",
    "partidos políticos": "Direito Constitucional",

    "direito administrativo": "Direito Administrativo",
    "licitações e contratos": "Direito Administrativo",
    "licitações": "Direito Administrativo",
    "atos administrativos": "Direito Administrativo",
    "improbidade administrativa": "Direito Administrativo",
    "serviços públicos": "Direito Administrativo",
    "lei nº 8.666/93": "Direito Administrativo",
    "lei nº 14.133/21": "Direito Administrativo",
    "bens públicos": "Direito Administrativo",
    "processo administrativo": "Direito Administrativo",
    "responsabilidade civil do estado": "Direito Administrativo",
    "agentes públicos": "Direito Administrativo",
    "regime jurídico único": "Direito Administrativo",
    "intervenção do estado na propriedade": "Direito Administrativo",
    "controle da administração pública": "Direito Administrativo",
    "controle judicial": "Direito Administrativo",
    "controle legislativo": "Direito Administrativo",
    "controle administrativo": "Direito Administrativo",

    "ética no serviço público": "Ética no Serviço Público",
    "ética": "Ética no Serviço Público",
    "decreto nº 1.171/94": "Ética no Serviço Público",
    "conduta do servidor público": "Ética no Serviço Público",
    "assédio moral e sexual": "Ética no Serviço Público",
    "conflito de interesses": "Ética no Serviço Público",
    "transparência e probidade": "Ética no Serviço Público",
    "valores e princípios da administração pública": "Ética no Serviço Público",

    "atualidades": "Atualidades",
    "conhecimentos gerais": "Atualidades",
    "história": "Atualidades",
    "geografia": "Atualidades",
    "economia": "Atualidades",
    "política": "Atualidades",
    "meio ambiente": "Atualidades",
    "saúde pública": "Atualidades",
    "sus": "Atualidades",
    "sistema único de saúde": "Atualidades",
    "epidemiologia": "Atualidades",
    "vigilância sanitária": "Atualidades",
    "saúde coletiva": "Atualidades",
    "políticas de saúde": "Atualidades",
    "fatos políticos nacionais": "Atualidades",
    "fatos políticos internacionais": "Atualidades",
    "economia brasileira": "Atualidades",
    "economia mundial": "Atualidades",
    "questões sociais": "Atualidades",
    "tecnologia e inovação": "Atualidades",
    "educação": "Atualidades",
    "segurança pública": "Atualidades",
    "relações internacionais": "Atualidades",
    "cultura e esporte": "Atualidades",
    "desenvolvimento sustentável": "Atualidades",


    "contabilidade geral": "Contabilidade",
    "contabilidade pública": "Contabilidade",
    "auditoria": "Contabilidade",
    "noções de contabilidade": "Contabilidade",
    "princípios de contabilidade": "Contabilidade",
    "regime de competência": "Contabilidade",
    "regime de caixa": "Contabilidade",
    "demonstrativos contábeis": "Contabilidade",
    "balanço patrimonial": "Contabilidade",
    "dre": "Contabilidade",
    "fluxo de caixa": "Contabilidade",
    "análise de balanços": "Contabilidade",
    "ativo": "Contabilidade",
    "passivo": "Contabilidade",
    "patrimônio líquido": "Contabilidade",
    "receitas": "Contabilidade",
    "despesas": "Contabilidade",
    "auditoria contábil": "Contabilidade",
    "normas brasileiras de contabilidade (nbc)": "Contabilidade",

    "direito penal": "Direito Penal",
    "princípios do direito penal": "Direito Penal",
    "aplicação da lei penal": "Direito Penal",
    "teoria do crime": "Direito Penal",
    "tipicidade": "Direito Penal",
    "ilicitude": "Direito Penal",
    "culpabilidade": "Direito Penal",
    "crimes contra a pessoa": "Direito Penal",
    "crimes contra o patrimônio": "Direito Penal",
    "crimes contra a administração pública": "Direito Penal",
    "excludentes de ilicitude": "Direito Penal",
    "excludentes de culpabilidade": "Direito Penal",
    "penas": "Direito Penal",
    "extinção da punibilidade": "Direito Penal",
    "legislação penal especial": "Direito Penal",

    "direito processual penal": "Direito Processual Penal",
    "princípios do processo penal": "Direito Processual Penal",
    "sistemas processuais": "Direito Processual Penal",
    "ação penal": "Direito Processual Penal",
    "jurisdição e competência": "Direito Processual Penal",
    "inquérito policial": "Direito Processual Penal",
    "provas": "Direito Processual Penal",
    "prisões": "Direito Processual Penal",
    "liberdade provisória": "Direito Processual Penal",
    "recursos": "Direito Processual Penal",
    "nulidades": "Direito Processual Penal",
    "sujeitos do processo": "Direito Processual Penal",
    "juiz": "Direito Processual Penal",
    "ministério público": "Direito Processual Penal",
    "acusado": "Direito Processual Penal",
    "defensor": "Direito Processual Penal",

    "direito civil": "Direito Civil",
    "lei de introdução às normas do direito brasileiro (lindb)": "Direito Civil",
    "pessoas naturais": "Direito Civil",
    "pessoas jurídicas": "Direito Civil",
    "bens": "Direito Civil",
    "fatos jurídicos": "Direito Civil",
    "atos jurídicos": "Direito Civil",
    "negócio jurídico": "Direito Civil",
    "prescrição e decadência": "Direito Civil",
    "obrigações": "Direito Civil",
    "contratos": "Direito Civil",
    "direito das coisas": "Direito Civil",
    "direito de família": "Direito Civil",
    "direito das sucessões": "Direito Civil",
    "posse": "Direito Civil",
    "propriedade": "Direito Civil",
    "família": "Direito Civil",

    "direito processual civil": "Direito Processual Civil",
    "princípios do processo civil": "Direito Processual Civil",
    "jurisdição e competência": "Direito Processual Civil",
    "ação": "Direito Processual Civil",
    "partes e procuradores": "Direito Processual Civil",
    "atos processuais": "Direito Processual Civil",
    "prazos": "Direito Processual Civil",
    "citação": "Direito Processual Civil",
    "intimação": "Direito Processual Civil",
    "petição inicial": "Direito Processual Civil",
    "contestação": "Direito Processual Civil",
    "réplica": "Direito Processual Civil",
    "provas": "Direito Processual Civil",
    "sentença": "Direito Processual Civil",
    "coisa julgada": "Direito Processual Civil",
    "recursos": "Direito Processual Civil",
    "execução": "Direito Processual Civil",
    "cumprimento de sentença": "Direito Processual Civil",

    "direito do trabalho": "Direito do Trabalho",
    "princípios do direito do trabalho": "Direito do Trabalho",
    "fontes do direito do trabalho": "Direito do Trabalho",
    "contrato individual de trabalho": "Direito do Trabalho",
    "jornada de trabalho": "Direito do Trabalho",
    "salário e remuneração": "Direito do Trabalho",
    "férias": "Direito do Trabalho",
    "fgts": "Direito do Trabalho",
    "rescisão contratual": "Direito do Trabalho",
    "estabilidade": "Direito do Trabalho",
    "greve": "Direito do Trabalho",
    "organização sindical": "Direito do Trabalho",
    "segurança e saúde no trabalho": "Direito do Trabalho",

    "direito processual do trabalho": "Direito Processual do Trabalho",
    "princípios do processo do trabalho": "Direito Processual do Trabalho",
    "organização da justiça do trabalho": "Direito Processual do Trabalho",
    "competência da justiça do trabalho": "Direito Processual do Trabalho",
    "ação trabalhista": "Direito Processual do Trabalho",
    "partes e procuradores": "Direito Processual do Trabalho",
    "atos, termos e prazos processuais": "Direito Processual do Trabalho",
    "dissídio individual": "Direito Processual do Trabalho",
    "dissídio coletivo": "Direito Processual do Trabalho",
    "recursos trabalhistas": "Direito Processual do Trabalho",
    "execução trabalhista": "Direito Processual do Trabalho",
    "audiência trabalhista": "Direito Processual do Trabalho",

    "direito previdenciário": "Direito Previdenciário",
    "seguridade social": "Direito Previdenciário",
    "previdência social": "Direito Previdenciário",
    "regimes previdenciários": "Direito Previdenciário",
    "benefícios previdenciários": "Direito Previdenciário",
    "custeio da seguridade social": "Direito Previdenciário",
    "regime geral de previdência social (rgps)": "Direito Previdenciário",
    "regime próprio de previdência social (rpps)": "Direito Previdenciário",
    "salário de contribuição": "Direito Previdenciário",
    "carência": "Direito Previdenciário",
    "qualidade de segurado": "Direito Previdenciário",
    "aposentadoria por idade": "Direito Previdenciário",
    "aposentadoria por tempo de contribuição": "Direito Previdenciário",
    "aposentadoria por invalidez": "Direito Previdenciário",
    "auxílio-doença": "Direito Previdenciário",
    "pensão por morte": "Direito Previdenciário",
    "salário-maternidade": "Direito Previdenciário",
    "auxílio-reclusão": "Direito Previdenciário",

    "direito tributário": "Direito Tributário",
    "sistema tributário nacional": "Direito Tributário",
    "princípios do direito tributário": "Direito Tributário",
    "competência tributária": "Direito Tributário",
    "tributo": "Direito Tributário",
    "espécies de tributos": "Direito Tributário",
    "impostos": "Direito Tributário",
    "taxas": "Direito Tributário",
    "contribuições de melhoria": "Direito Tributário",
    "empréstimos compulsórios": "Direito Tributário",
    "contribuições especiais": "Direito Tributário",
    "obrigação tributária": "Direito Tributário",
    "crédito tributário": "Direito Tributário",
    "lançamento": "Direito Tributário",
    "suspensão": "Direito Tributário",
    "extinção": "Direito Tributário",
    "exclusão do crédito tributário": "Direito Tributário",
    "imunidades tributárias": "Direito Tributário",
    "isenções tributárias": "Direito Tributário",

    "arquivologia": "Arquivologia",
    "gestão de documentos": "Arquivologia",
    "protocolo": "Arquivologia",
    "classificação de documentos": "Arquivologia",
    "preservação de documentos": "Arquivologia",

    "legislação específica": "Legislação Específica",
    "legislação pertinente": "Legislação Específica",
    "regimento interno": "Legislação Específica",
    "estatuto": "Legislação Específica",
    "código de ética": "Legislação Específica",
    "decreto": "Legislação Específica",
    "lei": "Legislação Específica",
    "lei de acesso à informação (lei nº 12.527/2011)": "Legislação Específica",
    "lei geral de proteção de dados (lei nº 13.709/2018)": "Legislação Específica",
    "lgpd": "Legislação Específica",
    "estatuto do idoso": "Legislação Específica",
    "estatuto da criança e do adolescente (eca)": "Legislação Específica",
    "lei maria da penha": "Legislação Específica",
    "lei de improbidade administrativa": "Legislação Específica",
    "leis complementares estaduais": "Legislação Específica",
    "decretos locais": "Legislação Específica",
    "regulamentos específicos": "Legislação Específica",
    "combate à corrupção": "Legislação Específica",
    "acesso à informação": "Legislação Específica",
    "proteção de dados": "Legislação Específica",

    "conhecimentos gerais": "Conhecimentos Gerais",
    "aspectos geográficos do brasil": "Conhecimentos Gerais",
    "aspectos geográficos de [estado/município]": "Conhecimentos Gerais", // Precisa ser adaptado
    "aspectos históricos do brasil": "Conhecimentos Gerais",
    "aspectos históricos de [estado/município]": "Conhecimentos Gerais", // Precisa ser adaptado
    "estrutura social brasileira": "Conhecimentos Gerais",
    "desenvolvimento sustentável": "Conhecimentos Gerais",
    "globalização": "Conhecimentos Gerais",
    "urbanização": "Conhecimentos Gerais",
    "população brasileira": "Conhecimentos Gerais",
    "migrações": "Conhecimentos Gerais",
    "cidadania": "Conhecimentos Gerais",
    "direitos sociais": "Conhecimentos Gerais",
    "sustentabilidade": "Conhecimentos Gerais",
    "educação ambiental": "Conhecimentos Gerais",

    "conhecimentos específicos": "Conhecimentos Específicos",
    "técnicas de [área]": "Conhecimentos Específicos", // Exemplo, precisa ser específico
    "princípios de [área]": "Conhecimentos Específicos", // Exemplo, precisa ser específico
    "legislação profissional": "Conhecimentos Específicos",
    "normas técnicas": "Conhecimentos Específicos",
    "atribuições do cargo": "Conhecimentos Específicos"
};


// --- Listener para o botão de processamento do PDF ---
processPdfBtn.addEventListener('click', async () => {
    // 4. Log para confirmar que o botão foi clicado
    console.log('4. Botão "Processar Edital" clicado!');

    // Obtém o arquivo selecionado pelo usuário
    const file = pdfInput.files[0];
    if (!file) {
        alert('Por favor, selecione um arquivo PDF.');
        console.log('4.1. Nenhum arquivo PDF selecionado.');
        return; // Sai da função se nenhum arquivo for selecionado
    }

    // Limpa a lista de matérias exibidas anteriormente
    materiasList.innerHTML = '';
    // Objeto para armazenar as matérias principais encontradas e, dentro delas, suas submatérias.
    // Ex: { "Língua Portuguesa": Set("Ortografia", "Crase"), "Informática": Set("Windows") }
    const materiasEncontradasComSubmaterias = {};

    try {
        // 4.2. Log antes de tentar carregar o PDF
        console.log('4.2. Tentando carregar PDF:', file.name);

        // Converte o arquivo para um ArrayBuffer e carrega o PDF com PDF.js
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;

        // 4.3. Log após o PDF ser carregado e obter o número de páginas
        console.log('4.3. PDF carregado. Número de páginas:', numPages);

        // Loop por cada página do PDF para extrair o texto
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // Junta todo o texto da página em uma única string e converte para minúsculas
            const pageText = textContent.items.map(item => item.str).join(' ').toLowerCase();

            // 4.4. Opcional: Logar uma parte do texto de cada página para depuração
            // console.log(`4.4. Conteúdo da página ${i} (trecho):`, pageText.substring(0, 500) + '...');

            // Primeiro, vamos tentar identificar as matérias principais e suas submatérias
            for (const materiaPrincipal in materiasComSubmaterias) { // Itera sobre as chaves do objeto materiasComSubmaterias
                const submateriasPossiveis = materiasComSubmaterias[materiaPrincipal] || [];

                // Lista de termos para buscar no edital, incluindo o nome da matéria principal
                // e todas as suas submatérias, para tentar identificar a matéria principal e seus tópicos.
                const termosDeBuscaParaEstaMateria = [
                    materiaPrincipal, // O nome da matéria principal (ex: "Língua Portuguesa")
                    ...submateriasPossiveis // Todas as suas submatérias
                ];

                for (const termo of termosDeBuscaParaEstaMateria) {
                    const termoLower = termo.toLowerCase();

                    if (pageText.includes(termoLower)) {
                        // Encontrou um termo relacionado à matéria principal ou uma submatéria.
                        // Agora, padronizamos o nome da matéria principal.
                        const materiaPrincipalPadronizada = mapaMateriasPadronizadas[termoLower] || materiaPrincipal;

                        // Inicializa o Set de submatérias para esta matéria principal, se ainda não existir
                        if (!materiasEncontradasComSubmaterias[materiaPrincipalPadronizada]) {
                            materiasEncontradasComSubmaterias[materiaPrincipalPadronizada] = new Set();
                        }

                        // Se o termo encontrado for o próprio nome da matéria principal
                        if (termo.toLowerCase() === materiaPrincipalPadronizada.toLowerCase() ||
                            (mapaMateriasPadronizadas[termoLower] && mapaMateriasPadronizadas[termoLower].toLowerCase() === materiaPrincipalPadronizada.toLowerCase())) {
                            // Adiciona o nome da matéria principal ao seu próprio conjunto para garantir que ela seja listada
                            // mesmo que nenhuma submatéria específica seja encontrada.
                            materiasEncontradasComSubmaterias[materiaPrincipalPadronizada].add(materiaPrincipalPadronizada);
                        } else {
                            // Se o termo encontrado for uma submatéria, adiciona a submatéria ao conjunto.
                            // Verifica se o termo é de fato uma das submatérias da matéria principal correspondente.
                            if (submateriasPossiveis.some(sub => sub.toLowerCase() === termoLower)) {
                                materiasEncontradasComSubmaterias[materiaPrincipalPadronizada].add(termo);
                            }
                        }
                    }
                }
            }
        }

        // --- Exibição dos Resultados na Interface ---
        // Obtém os nomes das matérias principais que foram encontradas e os ordena alfabeticamente
        const nomesMateriasPrincipaisEncontradas = Object.keys(materiasEncontradasComSubmaterias).sort();

        if (nomesMateriasPrincipaisEncontradas.length === 0) {
            materiasList.innerHTML = '<li>Nenhuma matéria ou subtópico comum encontrado neste edital.</li>';
            console.log('4.5. Nenhuma matéria ou subtópico encontrado.');
        } else {
            console.log('4.6. Matérias e Subtópicos encontrados:');
            // Itera sobre as matérias principais encontradas para exibi-las
            nomesMateriasPrincipaisEncontradas.forEach(materiaPrincipal => {
                const liMateriaPrincipal = document.createElement('li');
                liMateriaPrincipal.innerHTML = `<strong>${materiaPrincipal}</strong>`; // Matéria principal em negrito
                materiasList.appendChild(liMateriaPrincipal);

                // Obtém as submatérias encontradas para esta matéria principal e as ordena
                const submateriasDoSet = Array.from(materiasEncontradasComSubmaterias[materiaPrincipal]).sort();

                if (submateriasDoSet.length > 0) {
                    const ulSubmaterias = document.createElement('ul'); // Cria uma lista aninhada para submatérias
                    submateriasDoSet.forEach(submateria => {
                        // Evita adicionar o nome da matéria principal como uma submatéria se já estiver lá
                        // (ex: não queremos "Língua Portuguesa" dentro de "Língua Portuguesa")
                        if (submateria.toLowerCase() !== materiaPrincipal.toLowerCase()) {
                             const liSubmateria = document.createElement('li');
                             liSubmateria.textContent = submateria;
                             ulSubmaterias.appendChild(liSubmateria);
                        }
                    });
                    // Adiciona a lista de submatérias apenas se houver submatérias reais (não apenas o nome da principal)
                    if (ulSubmaterias.children.length > 0) {
                        liMateriaPrincipal.appendChild(ulSubmaterias);
                    }
                }
                console.log(`- ${materiaPrincipal}:`, submateriasDoSet);
            });
        }

    } catch (error) {
        // 5. Captura e loga quaisquer erros durante o processamento do PDF
        console.error('5. Erro ao processar o PDF:', error);
        alert('Ocorreu um erro ao processar o edital. Verifique o console para mais detalhes.');
    }
});