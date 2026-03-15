// Script para corrigir mapeamento de áreas no banco de dados
// Mapeia IDs de áreas (snake_case) para nomes reais (Title Case)

const areaMapping = {
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

async function fixAreas() {
  try {
    // Importar módulos necessários
    const mysql = require('mysql2/promise');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'flashcard_app',
    });

    console.log('Conectado ao banco de dados');

    // Obter todos os flashcards com áreas em snake_case
    const [flashcards] = await connection.execute('SELECT id, area FROM flashcards');
    
    console.log(`Total de flashcards: ${flashcards.length}`);

    let updated = 0;
    for (const card of flashcards) {
      const correctArea = areaMapping[card.area];
      
      if (correctArea && correctArea !== card.area) {
        await connection.execute(
          'UPDATE flashcards SET area = ? WHERE id = ?',
          [correctArea, card.id]
        );
        updated++;
        console.log(`Atualizado card ${card.id}: ${card.area} → ${correctArea}`);
      }
    }

    console.log(`\nTotal de cards atualizados: ${updated}`);

    // Verificar áreas únicas no banco
    const [areas] = await connection.execute('SELECT DISTINCT area FROM flashcards ORDER BY area');
    console.log('\nÁreas no banco após correção:');
    areas.forEach(row => console.log(`  - ${row.area}`));

    await connection.end();
    console.log('\nConcluído!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

fixAreas();
