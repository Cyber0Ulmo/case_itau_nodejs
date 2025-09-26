import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Database = sqlite3.Database;

const dbPath = path.join(__dirname, '../../../banco.sqlite');

const db: Database = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
    throw err;
  }
  console.log(' Conectado ao banco SQLite em:', dbPath);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      saldo REAL DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log(' Tabela clientes verificada/criada');
    }
  });
});

export default db;