const mysql = require('mysql2/promise');
const fs = require('fs');

// Mapeamento de áreas
const areaMap = {
  'escrituras_sagradas': 'Escrituras Sagradas',
  'deus_pai': 'Deus Pai',
  'deus_filho': 'Deus Filho',
  'deus_espirito_santo': 'Deus Espírito Santo',
  'homem': 'Homem',
  'pecado': 'Pecado',
  'salvacao': 'Salvação',
  'eleicao': 'Eleição',
  'reino_de_deus': 'Reino de Deus',
  'igreja': 'Igreja',
  'dia_do_senhor': 'Dia do Senhor',
  'ministerio_da_palavra': 'Ministério da Palavra',
  'liberdade_religiosa': 'Liberdade Religiosa',
  'morte': 'Morte',
  'justos_e_impios': 'Justos e Ímpios',
  'anjos': 'Anjos',
  'amor_ao_proximo_e_etica': 'Amor ao Próximo e Ética',
  'batismo_e_ceia': 'Batismo e Ceia',
  'mordomia': 'Mordomia',
  'evangelismo_e_missoes': 'Evangelismo e Missões',
  'educacao_religiosa': 'Educação Religiosa',
  'ordem_social': 'Ordem Social',
  'familia': 'Família',
  'principios_batistas': 'Princípios Batistas',
  'historia_dos_batistas': 'História dos Batistas',
  'estrutura_e_funcionamento_cbb': 'Estrutura e Funcionamento CBB',
};

async function importFlashcards() {
  try {
    // Ler o arquivo de flashcards
    const fileContent = fs.readFileSync('/home/ubuntu/flashcard-study-app/data/flashcards.ts', 'utf-8');
    
    // Extrair o array de flashcards usando regex
    const arrayMatch = fileContent.match(/export const FLASHCARDS_DATA: FlashcardData\[\] = \[([\s\S]*?)\];/);
    if (!arrayMatch) {
      console.error('Não foi possível encontrar o array FLASHCARDS_DATA');
      process.exit(1);
    }

    const arrayContent = arrayMatch[1];
    
    // Extrair cada flashcard
    const cardRegex = /\{\s*id:\s*"([^"]+)",\s*question:\s*"([^"]+)",\s*answer:\s*"([^"]+)",\s*area:\s*"([^"]+)"\s*\}/g;
    const cards = [];
    let match;

    while ((match = cardRegex.exec(arrayContent)) !== null) {
      const [, id, question, answer, area] = match;
      cards.push({
        id,
        question: question.replace(/\\"/g, '"'),
        answer: answer.replace(/\\"/g, '"'),
        area: areaMap[area] || area,
      });
    }

    console.log(`Encontrados ${cards.length} flashcards para importar`);

    // Conectar ao banco de dados
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    // Limpar tabela existente
    await connection.execute('DELETE FROM flashcards');
    console.log('Tabela de flashcards limpa');

    // Inserir flashcards
    let inserted = 0;
    for (const card of cards) {
      try {
        await connection.execute(
          'INSERT INTO flashcards (question, answer, area, createdBy) VALUES (?, ?, ?, ?)',
          [card.question, card.answer, card.area, 1]
        );
        inserted++;
      } catch (error) {
        console.error(`Erro ao inserir card ${card.id}:`, error.message);
      }
    }

    console.log(`✓ ${inserted} flashcards importados com sucesso!`);

    await connection.end();
  } catch (error) {
    console.error('Erro durante importação:', error.message);
    process.exit(1);
  }
}

importFlashcards();
