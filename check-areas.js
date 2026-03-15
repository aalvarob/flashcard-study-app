const mysql = require('mysql2/promise');

(async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.log('DATABASE_URL não encontrada no .env');
      process.exit(1);
    }

    const connection = await mysql.createConnection(dbUrl);
    const [areas] = await connection.execute('SELECT DISTINCT area FROM flashcards ORDER BY area');
    
    console.log('Áreas únicas no banco:');
    areas.forEach(row => console.log('  -', row.area));
    
    await connection.end();
  } catch (error) {
    console.error('Erro:', error.message);
  }
})();
