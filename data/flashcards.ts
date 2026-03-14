export type FlashcardArea =
  | "escrituras_sagradas"
  | "deus_pai"
  | "deus_filho"
  | "deus_espirito_santo"
  | "homem"
  | "pecado"
  | "salvacao"
  | "eleicao"
  | "reino_de_deus"
  | "igreja"
  | "dia_do_senhor"
  | "ministerio_da_palavra"
  | "liberdade_religiosa"
  | "morte"
  | "justos_e_impios"
  | "anjos"
  | "amor_ao_proximo_e_etica"
  | "batismo_e_ceia"
  | "mordomia"
  | "evangelismo_e_missoes"
  | "educacao_religiosa"
  | "ordem_social"
  | "familia"
  | "principios_batistas"
  | "historia_dos_batistas"
  | "estrutura_e_funcionamento_cbb";

export interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  area: FlashcardArea;
}

export const FLASHCARDS_DATA: FlashcardData[] = [
  { id: "1", question: "A Bíblia é ou contém a Palavra de Deus?", answer: "A Bíblia é a Palavra de Deus (2Tm 3.16; Sl 119.105).", area: "escrituras_sagradas" },
  { id: "2", question: "O que significa o nome \"Bíblia\"?", answer: "A palavra Bíblia vem do grego, ela significa \"coleção de livros\".", area: "escrituras_sagradas" },
  { id: "3", question: "Quem escreveu a Bíblia?", answer: "A Bíblia foi escrita por várias pessoas, mas foi inspirada unicamente por Deus.", area: "escrituras_sagradas" },
  { id: "4", question: "Como a Bíblia é Formada?", answer: "São 66 os livros contidos na Bíblia. 39 do Antigo Testamento e 27 do Novo Testamento.", area: "escrituras_sagradas" },
  { id: "5", question: "Em Quanto Tempo Foi Escrita a Bíblia?", answer: "A Bíblia foi escrita durante aproximadamente 1.300 anos.", area: "escrituras_sagradas" },
  { id: "6", question: "Em que línguas a Bíblia foi escrita?", answer: "Os idiomas bíblicos são três: o hebraico, o aramaico e o grego.", area: "escrituras_sagradas" },
  { id: "7", question: "Em quantas e quais partes se divide o Antigo Testamento?", answer: "4 partes. Pentateuco (Torah ou Os Livros da Lei), Históricos, Poéticos/Sabedoria e Profetas (Maiores e Menores).", area: "escrituras_sagradas" },
  { id: "8", question: "Quantos e Quais São Os Livros do Pentateuco?", answer: "5 livros. Gênesis, Êxodo, Levítico, Números e Deuteronômio.", area: "escrituras_sagradas" },
  { id: "9", question: "Quantos e Quais São Os Livros Históricos?", answer: "12 livros. Josué, Juízes, Rute, 1 e 2 Samuel, 1 e 2 Reis, 1 e 2 Crônicas, Esdras, Neemias e Ester.", area: "escrituras_sagradas" },
  { id: "10", question: "Quantos e Quais São Os Livros Poéticos/Sabedoria?", answer: "5 livros. Jó, Salmos, Provérbios, Eclesiastes e Cantares.", area: "escrituras_sagradas" },
  { id: "11", question: "Quantos e Quais São Os Livros dos Profetas Maiores?", answer: "5 livros. Isaías, Jeremias, Lamentações de Jeremias, Ezequiel e Daniel.", area: "escrituras_sagradas" },
  { id: "12", question: "Quantos e Quais São Os Livros dos Profetas Menores?", answer: "12 livros. Oséias, Joel, Amós, Obadias, Jonas, Miquéias, Naum, Habacuque, Sofonias, Ageu, Zacarias e Malaquias.", area: "escrituras_sagradas" },
  { id: "13", question: "Em quantas e quais partes se divide o Novo Testamento?", answer: "4 partes. Evangelhos, Histórico, Cartas (Epístolas) e Revelação.", area: "escrituras_sagradas" },
  { id: "14", question: "Quantos e Quais São Os Livros dos Evangelhos?", answer: "4 livros. Mateus, Marcos, Lucas e João.", area: "escrituras_sagradas" },
  { id: "15", question: "Qual o nome do Livro Histórico?", answer: "Atos dos Apóstolos.", area: "escrituras_sagradas" },
  { id: "16", question: "Quantos e Quais São As Cartas Paulinas?", answer: "13 cartas. Romanos, I e II Coríntios, Gálatas, Efésios, Filipense, Colossenses, I e II Tessalonicenses, I e II Timóteo, Tito e Filémon.", area: "escrituras_sagradas" },
  { id: "17", question: "Quantos e Quais São As Cartas Gerais?", answer: "8 cartas. Hebreus, Tiago, I e II Pedro, I, II e III João, Judas.", area: "escrituras_sagradas" },
  { id: "18", question: "Qual o nome do Livro de Revelação do Novo Testamento?", answer: "Apocalipse.", area: "escrituras_sagradas" },
  { id: "19", question: "O que é Período Inter Bíblico?", answer: "É uma expressão para descrever o período de 400 anos de silêncio, entre os últimos eventos do A.T. e o começo dos acontecimentos do N.T.", area: "escrituras_sagradas" },
  { id: "20", question: "Qual a origem da Palavra Evangelho e o Seu Significado?", answer: "A palavra tem sua origem \"em Jesus Cristo antes da fundação do mundo\". O \"evangelho\", as \"boas novas\" é o cumprimento declarado dessa promessa.", area: "escrituras_sagradas" },
  { id: "21", question: "Em quantas e quais partes se divide a Teologia?", answer: "4 partes. Teologia Bíblica, Teologia Histórica, Teologia Prática e Teologia Sistemática.", area: "escrituras_sagradas" },
  { id: "22", question: "Em quantas e quais partes se divide a Teologia Sistemática?", answer: "10 partes. Bibliologia, Teontologia, Cristologia, Pneumatologia, Antropologia, Hamartiologia, Soteriologia, Eclesiologia, Angelologia e Escatologia.", area: "escrituras_sagradas" },
  { id: "es_028", question: "O que é o inferno?", answer: "É a condenação eterna (Mt 25.46).", area: "escrituras_sagradas" },
  { id: "es_029", question: "Qual a Importância do ensino bíblico?", answer: "É fundamental para o crescimento espiritual. (Cl 3.16)", area: "escrituras_sagradas" },
  { id: "es_030", question: "Qual a definição de casamento?", answer: "União entre homem e mulher. (Gn 2.24)", area: "escrituras_sagradas" },
  { id: "23", question: "Quem é Deus?", answer: "Criador de tudo (Gn 1.1).", area: "deus_pai" },
  { id: "24", question: "O que são Atributos Incomunicáveis?", answer: "São aqueles referentes à Grandeza e Majestade de Deus.", area: "deus_pai" },
  { id: "25", question: "Cite 5 Atributos Incomunicáveis.", answer: "Onipotência, Onisciência, Onipresença, Imutabilidade e Eternidade.", area: "deus_pai" },
  { id: "26", question: "Fale sobre a Onipotência de Deus?", answer: "Nada para Deus é impossível (Lc 1.37).", area: "deus_pai" },
  { id: "27", question: "Fale sobre a Onisciência de Deus?", answer: "Deus conhece tudo (Is 46.10).", area: "deus_pai" },
  { id: "28", question: "Fale sobre a Onipresença de Deus?", answer: "Deus está em todo lugar (Sl 139.7).", area: "deus_pai" },
  { id: "29", question: "Fale sobre a Imutabilidade de Deus?", answer: "Deus não muda (Tg 1.17).", area: "deus_pai" },
  { id: "30", question: "Fale sobre a Eternidade de Deus?", answer: "Deus não tem início, nem fim (Sl 90.2).", area: "deus_pai" },
  { id: "31", question: "Fale sobre a AutoExistência de Deus?", answer: "Deus existe por Si mesmo (Jo 5.26).", area: "deus_pai" },
  { id: "32", question: "Fale sobre a Soberania de Deus?", answer: "Deus governa sobre tudo (Sl 103.19).", area: "deus_pai" },
  { id: "33", question: "O que são Atributos Comunicáveis?", answer: "São aqueles referentes ao Seu Caráter e Relacionamento.", area: "deus_pai" },
  { id: "34", question: "Cite 5 Atributos Comunicáveis e suas referências.", answer: "Amor (1Jo 4.8), Justiça (Dt 32.4), Misericórdia (Lc 6.36), Bondade (Sl 100.5) e Santidade (1Pe 1.16).", area: "deus_pai" },
  { id: "35", question: "Quais são os outros nomes dados para Deus?", answer: "Elohim, Yahweh, Adonai, El Shaddai, El Elyon, Jeová Jiré, Jeová Shalom e Abba (Pai).", area: "deus_pai" },
  { id: "36", question: "Quando Deus passou a existir?", answer: "Nunca; Ele é eterno (Sl 90.2).", area: "deus_pai" },
  { id: "37", question: "O que é a Trindade?", answer: "Há um só Deus que subsiste eternamente em três pessoas: o Pai (Criador), o Filho (Jesus Cristo-Redentor) e o Espírito Santo (Santificador) (1Jo 5.7).", area: "deus_filho" },
  { id: "38", question: "Quem é Jesus Cristo?", answer: "Filho de Deus e Salvador (Jo 1.1,14).", area: "deus_filho" },
  { id: "39", question: "Quais as Suas duas naturezas?", answer: "Divina e humana (Cl 2.9; 1Tm 2.5).", area: "deus_filho" },
  { id: "40", question: "Jesus poderia ter pecado?", answer: "Não; Ele é santo (Hb 4.15).", area: "deus_filho" },
  { id: "41", question: "Por que Jesus morreu?", answer: "Para expiar os pecados da humanidade e reconciliar o homem com Deus (Rm 5.8).", area: "deus_pai" },
  { id: "42", question: "Quem é o Espírito Santo?", answer: "Terceira pessoa da Trindade, o Consolador (Mt 28.19; Jo 14.26).", area: "deus_espirito_santo" },
  { id: "43", question: "O que é Dom do Espírito?", answer: "O próprio Espírito Santo dado ao crente (At 2.38).", area: "deus_espirito_santo" },
  { id: "44", question: "O que significa Dons do Espírito?", answer: "Capacidades sobrenaturais para edificação da Igreja (Rm 12.3-8; 1Co 12.8-10).", area: "deus_espirito_santo" },
  { id: "45", question: "O que significa o Fruto do Espírito?", answer: "O caráter de Cristo formado na vida do cristão (Gl 5.22).", area: "deus_espirito_santo" },
  { id: "46", question: "O que significa ser cheio do Espírito Santo?", answer: "Ser controlado por Ele (Ef 5.18).", area: "deus_espirito_santo" },
  { id: "47", question: "O que é o batismo no Espírito Santo?", answer: "É o ato pelo qual o crente é inserido no Corpo de Cristo (1Co 12.13).", area: "deus_espirito_santo" },
  { id: "48", question: "O que é o dom de línguas?", answer: "Capacidade sobrenatural de falar outras línguas (At 2.4).", area: "deus_espirito_santo" },
  { id: "49", question: "Fale sobre a origem do homem.", answer: "Criado por Deus à Sua imagem (Gn 1.26a-27; 2.7).", area: "homem" },
  { id: "51", question: "O que é o pecado?", answer: "É a transgressão da lei de Deus (1Jo 3.4).", area: "pecado" },
  { id: "52", question: "Qual é o único pecado que não haverá perdão?", answer: "Blasfêmia contra o Espírito Santo (Mt 12.31).", area: "pecado" },
  { id: "53", question: "O que é salvação?", answer: "É a libertação do pecado pela graça mediante a fé (Ef 2.8-9).", area: "salvacao" },
  { id: "54", question: "O crente pode perder a salvação?", answer: "Não, pois é guardado por Deus (Jo 10.28).", area: "salvacao" },
  { id: "55", question: "O que é fé?", answer: "É a certeza e convicção espiritual (Hb 11.1).", area: "salvacao" },
  { id: "56", question: "O que é Regeneração?", answer: "Novo nascimento (Jo 3.3).", area: "salvacao" },
  { id: "57", question: "O que é Justificação?", answer: "Declaração de justiça dada por Deus, mediante a fé em Cristo (Rm 3.24).", area: "salvacao" },
  { id: "58", question: "O que é Santificação?", answer: "Processo de transformação progressiva do crente (1Ts 4.3).", area: "salvacao" },
  { id: "59", question: "O que é eleição?", answer: "A escolha graciosa de Deus para a salvação (Ef 1.4).", area: "eleicao" },
  { id: "60", question: "Eleição anula responsabilidade humana?", answer: "Não. O homem continua responsável por crer (Jo 3.16).", area: "eleicao" },
  { id: "61", question: "Como pregar eleição sem prejudicar missões?", answer: "Pregando o evangelho a todos, pois Deus salva por meio da pregação (Rm 10.14–15).", area: "eleicao" },
  { id: "62", question: "O que é o Reino de Deus?", answer: "O governo de Deus sobre todas as coisas e especialmente sobre os salvos (Mc 1.15).", area: "reino_de_deus" },
  { id: "63", question: "O Reino de Deus é Presente ou futuro?", answer: "Ambos: já inaugurado e plenamente futuro (Lc 17.21; Ap 11.15).", area: "reino_de_deus" },
  { id: "64", question: "Qual a Relação da igreja com o Reino?", answer: "A igreja é instrumento e testemunha do Reino (Mt 28.19–20).", area: "reino_de_deus" },
  { id: "65", question: "Qual a diferença entre igreja e Reino de Deus?", answer: "A igreja é o povo de Deus; o Reino é o governo de Deus (Lc 17.21).", area: "reino_de_deus" },
  { id: "66", question: "Qual a definição de Igreja?", answer: "É a comunidade de crentes em Jesus de todos os tempos (1Co 1.2).", area: "igreja" },
  { id: "67", question: "Qual a definição de Igreja no sentido Universal?", answer: "Assembleia de todos os salvos (Gl 3.28).", area: "igreja" },
  { id: "68", question: "Qual a definição de Igreja no sentido Local?", answer: "Uma congregação de crentes batizados que se reúne para adorar e servir (Atos 2.41–42).", area: "igreja" },
  { id: "69", question: "Cite outros nomes bíblicos dados à Igreja.", answer: "Templo do Espírito Santo (1Co 6.19), Corpo de Cristo (1Co 12.27), Noiva do Cordeiro (Ap 21.9), Raça Eleita, Sacerdócio Real, Nação Santa e Povo de Propriedade Exclusiva de Deus (1Pe 2.9).", area: "igreja" },
  { id: "70", question: "Qual o Caráter Multiforme da Igreja?", answer: "Militante e Triunfante; Visível e Invisível; Instituição e Organismo.", area: "igreja" },
  { id: "71", question: "O que é uma Igreja Batista?", answer: "Uma igreja local autônoma, bíblica e missionária, com batismo por imersão (Cl 2.12).", area: "igreja" },
  { id: "72", question: "Qual a definição do termo \"Igreja\"?", answer: "\"Ekklesia\" significa \"chamados para fora\".", area: "igreja" },
  { id: "73", question: "Quais os oficiais da igreja?", answer: "Pastores e diáconos (Fp 1.1).", area: "igreja" },
  { id: "74", question: "Qual a missão principal da Igreja?", answer: "Fazer discípulos (Mt 28.19).", area: "igreja" },
  { id: "75", question: "Quais as formas de admissão em uma Igreja Batista?", answer: "Batismo, Carta, Aclamação ou Reconciliação.", area: "igreja" },
  { id: "76", question: "Quais as formas de demissão em uma Igreja Batista?", answer: "Carta, Morte ou Disciplina.", area: "igreja" },
  { id: "77", question: "Quais os tipos de governo de uma igreja?", answer: "Episcopal, Presbiteriano e Congregacional.", area: "igreja" },
  { id: "78", question: "Qual o tipo de governo adotado pelos Batistas?", answer: "Congregacional sob a autoridade de Cristo (Atos 6.3–5).", area: "igreja" },
  { id: "79", question: "Quais os tipos de disciplina eclesiástica?", answer: "Formativa (instrução, oração, vida comunitária) e Corretiva (admoestação, repreensão e exclusão) (Mt 18).", area: "igreja" },
  { id: "80", question: "Qual a relação do Estado com a Igreja?", answer: "Separação.", area: "igreja" },
  { id: "82", question: "Qual o significado do domingo?", answer: "Dia de culto e celebração da ressurreição (At 20.7).", area: "dia_do_senhor" },
  { id: "83", question: "O Domingo substituiu o sábado?", answer: "A igreja primitiva passou a reunir-se no primeiro dia da semana (Ap 1.10).", area: "dia_do_senhor" },
  { id: "84", question: "Como observar o Dia do Senhor?", answer: "Com adoração, comunhão e serviço a Deus (Hb 10.25).", area: "dia_do_senhor" },
  { id: "85", question: "Quais as principais atribuições de um Pastor?", answer: "Pregação, aconselhamento, realização de ordenanças e visitação (1Pe 5.2).", area: "ministerio_da_palavra" },
  { id: "86", question: "Quais as principais qualificações do pastor?", answer: "Caráter irrepreensível e aptidão para ensinar (1Tm 3.1–7; Tt 1.7–9).", area: "ministerio_da_palavra" },
  { id: "87", question: "Qual a função principal do pastor?", answer: "Pastorear, ensinar e cuidar da igreja (1Pe 5.2).", area: "ministerio_da_palavra" },
  { id: "88", question: "O que é o Ensino Sistemático da Palavra?", answer: "Exposição fiel das Escrituras para edificação da igreja (2Tm 4.2).", area: "ministerio_da_palavra" },
  { id: "89", question: "O que quer dizer Liberdade de Consciência?", answer: "Cada pessoa responde a Deus por sua fé (Rm 14.12).", area: "liberdade_religiosa" },
  { id: "90", question: "O que significa Separação Igreja e Estado?", answer: "O Estado não governa a igreja (Mt 22.21).", area: "liberdade_religiosa" },
  { id: "91", question: "O que fazer quando o Estado confronta princípios bíblicos?", answer: "Deve-se obedecer a Deus antes dos homens (At 5.29).", area: "liberdade_religiosa" },
  { id: "92", question: "O que acontece após a morte?", answer: "O crente vai para a presença de Deus (Fp 1.23).", area: "morte" },
  { id: "93", question: "Existe purgatório?", answer: "Não há base bíblica.", area: "morte" },
  { id: "94", question: "Como consolar enlutados?", answer: "Com a esperança da ressurreição (1Ts 4.13–14).", area: "morte" },
  { id: "95", question: "A ressurreição será corporal?", answer: "Sim (1Co 15.42–44).", area: "morte" },
  { id: "96", question: "Haverá ressurreição dos justos e ímpios?", answer: "Sim (Jo 5.28–29).", area: "morte" },
  { id: "97", question: "O que é o céu?", answer: "É a morada de Deus (Jo 14.2).", area: "morte" },
  { id: "99", question: "Haverá juízo literal?", answer: "Sim (Ap 20.11–12).", area: "justos_e_impios" },
  { id: "100", question: "O que significa condenação eterna?", answer: "Separação eterna de Deus (Mt 25.46).", area: "justos_e_impios" },
  { id: "101", question: "O que é Vida eterna?", answer: "Comunhão eterna com Deus (Jo 17.3).", area: "justos_e_impios" },
  { id: "102", question: "O que significa a Parousia?", answer: "Segunda vinda de Cristo (Jo 14.1-3).", area: "justos_e_impios" },
  { id: "103", question: "Quando e como se dará a Segunda vinda de Cristo?", answer: "Será visível, gloriosa e repentina (Mt 24.30, 36, 42).", area: "justos_e_impios" },
  { id: "104", question: "Fale sobre Anjos?", answer: "Seres espirituais ministradores (Hb 1.14).", area: "anjos" },
  { id: "105", question: "Quem era o Diabo antes da queda?", answer: "Ele era um querubim ungido (Lúcifer) (Ez 28.14-15).", area: "anjos" },
  { id: "106", question: "Como deve ser a relação entre um pastor batista e a denominação e com os colegas pastores?", answer: "Sempre pautado na Ética, Respeito mútuo e Cooperação.", area: "amor_ao_proximo_e_etica" },
  { id: "107", question: "O que é disciplina eclesiástica?", answer: "Correção amorosa para restaurar o irmão (Mt 18.15–17).", area: "amor_ao_proximo_e_etica" },
  { id: "108", question: "Quais as ordenanças deixadas por Jesus?", answer: "Batismo e Ceia (Mt 28.19; 1Co 11.24-25).", area: "batismo_e_ceia" },
  { id: "109", question: "Qual o significado do batismo?", answer: "Representa a morte para a velha vida e nascimento em Cristo (Rm 6.4).", area: "batismo_e_ceia" },
  { id: "110", question: "Por que Jesus se batizou?", answer: "Para cumprir toda a justiça (Mt 3.15).", area: "batismo_e_ceia" },
  { id: "111", question: "O batismo salva?", answer: "Não; a salvação é pela graça mediante a fé (Ef 2.8).", area: "batismo_e_ceia" },
  { id: "112", question: "O batismo infantil é bíblico?", answer: "Não, porque o Novo Testamento apresenta o batismo após a fé (At 2.41).", area: "batismo_e_ceia" },
  { id: "113", question: "Quem deve ser batizado?", answer: "Apenas quem crê em Cristo (At 2.41).", area: "batismo_e_ceia" },
  { id: "114", question: "Por que batizar por imersão?", answer: "Representa morte e ressurreição com Cristo (Rm 6.4).", area: "batismo_e_ceia" },
  { id: "115", question: "O que é a Ceia?", answer: "É o memorial da morte de Cristo até sua volta (1Co 11.23ss).", area: "batismo_e_ceia" },
  { id: "116", question: "Quais os tipos de interpretação da Ceia?", answer: "Transubstanciação, Consubstanciação, Presença Espiritual e Memorial.", area: "batismo_e_ceia" },
  { id: "117", question: "O que é a Grande Comissão?", answer: "Mandado de fazer discípulos de todas as nações (Mt 28.19–20).", area: "evangelismo_e_missoes" },
  { id: "118", question: "Qual a responsabilidade da igreja local?", answer: "Evangelizar, enviar e sustentar missionários (At 13.2–3).", area: "evangelismo_e_missoes" },
  { id: "119", question: "O que é Missões e discipulado?", answer: "Evangelizar e formar novos discípulos (Mt 28.20).", area: "evangelismo_e_missoes" },
  { id: "120", question: "Qual a Importância do ensino bíblico?", answer: "É fundamental para o crescimento espiritual (Cl 3.16).", area: "educacao_religiosa" },
  { id: "121", question: "Qual o papel da EBD?", answer: "Ensinar sistematicamente a Palavra para todas as idades.", area: "educacao_religiosa" },
  { id: "122", question: "Qual o papel da igreja na sociedade?", answer: "Ser sal e luz (Mt 5.13–16).", area: "ordem_social" },
  { id: "123", question: "O que é o Equilíbrio social e espiritual?", answer: "Servir ao próximo sem perder a missão do evangelho.", area: "ordem_social" },
  { id: "124", question: "Qual a definição de casamento?", answer: "União entre homem e mulher (Gn 2.24).", area: "familia" },
  { id: "125", question: "Qual o papel do pastor referente ao tema: família?", answer: "Ensinar e defender a família bíblica.", area: "familia" },
  { id: "126", question: "Como realizar o aconselhamento a casais?", answer: "Baseado em amor, perdão e princípios bíblicos (Ef 5.22–33).", area: "familia" },
  { id: "127", question: "Cite alguns princípios fundamentais dos Batistas.", answer: "Jesus como autoridade suprema, Bíblia como regra de fé, autonomia da igreja local, liberdade religiosa, sacerdócio universal dos crentes, separação Igreja-Estado e natureza missionária.", area: "principios_batistas" },
  { id: "128", question: "Como surgiram os Batistas no mundo?", answer: "Surgiram no século XVII pelo movimento separatista inglês. John Smyth e Thomas Helwys fundaram a primeira congregação em Amsterdã (1612).", area: "historia_dos_batistas" },
  { id: "129", question: "Fale sobre o início dos Batistas no Brasil.", answer: "A PIB Santa Bárbara D´Oeste (SP) foi organizada em 1871. Os missionários Bagby e Taylor, com o ex-padre Antônio Teixeira de Albuquerque, organizaram a primeira Igreja Batista brasileira.", area: "historia_dos_batistas" },
  { id: "hb_004", question: "Qual é o significado de CBB?", answer: "Convenção Batista Brasileira.", area: "historia_dos_batistas" },
  { id: "130", question: "O que é a Convenção Batista Brasileira?", answer: "É a organização que representa as Igrejas Batistas do Brasil, promovendo cooperação, missões e educação religiosa.", area: "estrutura_e_funcionamento_cbb" },
  { id: "ecbb_003", question: "Qual é o objetivo principal da CBB?", answer: "Promover a unidade, cooperação e missão das igrejas batistas brasileiras.", area: "estrutura_e_funcionamento_cbb" },
];
