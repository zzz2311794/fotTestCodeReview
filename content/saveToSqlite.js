const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'webhook.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// 创建一个新表
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      commit_id TEXT NOT NULL,
      commit_ctx TEXT NOT NULL,
      diff TEXT NOT NULL,
      review TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
        if (err) {
            console.error('Error creating table', err);
        } else {
            console.log('Table created');
        }
    });
});

function insertReview(commitId, commit_ctx, diff, review) {
    db.run('INSERT INTO reviews (commit_id, commit_ctx, diff, review) VALUES (?, ?, ?, ?)', [commitId, commit_ctx, diff, review], (err) => {
        if (err) {
            console.error('Error inserting data', err);
        } else {
            console.log('Review data inserted');
        }
    });
}

function getReviews(commitId, callback) {
    db.all('SELECT * FROM reviews where commit_id = ?', [commitId], (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
}

exports.getReviews = getReviews;
exports.insertReview = insertReview;