const db = require('../config/db');

/**
 * DATABASE INITIALIZATION
 * This script ensures all tables and columns exist for the SQLite migration.
 * Since SQLite ALTER TABLE is limited, we use a try-catch/if-error pattern
 * to add columns for existing databases.
 */

// 1. Create Base Tables
db.serialize(() => {
  // Ideas Table
  db.run(`
    CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      problemStatement TEXT,
      description TEXT,
      category TEXT,
      priority TEXT,
      technicalFeasibility TEXT,
      businessImpact TEXT,
      status TEXT DEFAULT 'Submitted',
      statusHistory TEXT,
      impact TEXT,
      images TEXT,
      submittedByEmail TEXT,
      submittedBy INTEGER,
      expectedDeliveryDate TEXT,
      assignedReviewer TEXT,
      outcomesAndBenefits TEXT,
      hoursSaved REAL,
      costSaved REAL,
      createdAt TEXT
    )
  `, (err) => {
    if (err) console.error('❌ Failed to create ideas table:', err.message);
    else console.log('✅ Ideas table ready');
  });

  // Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      department TEXT,
      createdAt TEXT
    )
  `, (err) => {
    if (err) console.error('❌ Failed to create users table:', err.message);
    else {
      console.log('✅ Users table ready');
      // Seed admin user
      const bcrypt = require('bcryptjs');
      db.get('SELECT id FROM users WHERE email = ?', ['admin@test.com'], async (err, user) => {
        if (!user) {
          const hash = await bcrypt.hash('admin123', 10);
          db.run(
            'INSERT INTO users (name, email, password, role, createdAt) VALUES (?, ?, ?, ?, ?)',
            ['Admin', 'admin@test.com', hash, 'admin', new Date().toISOString()],
            (err) => {
              if (err) console.log('❌ Failed to seed admin user', err);
              else console.log('✅ Default admin user created (admin@test.com / admin123)');
            }
          );
        }
      });
    }
  });

  // 2. Structural Integrity (Lazy Migrations)
  // These ensure that if a user has an older version of the DB, the new columns are added.
  const newColumns = [
    ['problemStatement', 'TEXT'],
    ['priority', 'TEXT'],
    ['technicalFeasibility', 'TEXT'],
    ['impact', 'TEXT'],
    ['images', 'TEXT'],
    ['submittedByEmail', 'TEXT'],
    ['submittedBy', 'INTEGER'],
    ['statusHistory', 'TEXT'],
    ['businessImpact', 'TEXT'],
    ['expectedDeliveryDate', 'TEXT'],
    ['assignedReviewer', 'TEXT'],
    ['outcomesAndBenefits', 'TEXT'],
    ['hoursSaved', 'REAL'],
    ['costSaved', 'REAL'],
    ['statusPipeline', 'TEXT']
  ];

  newColumns.forEach(([col, type]) => {
    db.run(`ALTER TABLE ideas ADD COLUMN ${col} ${type}`, (err) => {
      // "Duplicate column name" error is ignored
      if (!err) console.log(`✅ Added column: ${col}`);
    });
  });

  // Action Points Table (single-row admin notepad)
  db.run(`
    CREATE TABLE IF NOT EXISTS action_points (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK(id = 1),
      content TEXT DEFAULT '',
      updatedAt TEXT
    )
  `, (err) => {
    if (err) console.error('❌ Failed to create action_points table:', err.message);
    else console.log('✅ Action Points table ready');
  });

  // Team Members Table (org chart)
  db.run(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      type TEXT DEFAULT 'member',
      description TEXT DEFAULT '',
      imageUrl TEXT DEFAULT '',
      sortOrder INTEGER DEFAULT 0,
      createdAt TEXT
    )
  `, (err) => {
    if (err) console.error('❌ Failed to create team_members table:', err.message);
    else console.log('✅ Team Members table ready');
  });
});