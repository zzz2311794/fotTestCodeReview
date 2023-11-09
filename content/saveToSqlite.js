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
      commit_id TEXT,
      commit_ctx TEXT,
      diff TEXT,
      diff_files TEXT,
      review TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
        if (err) {
            console.error('Error creating table', err);
        } else {
            console.log('Table created(reviews)');
        }
    });
});

function insertReview(commitId, commit_ctx, diff, diffFiles, review) {
    db.run('INSERT INTO reviews (commit_id, commit_ctx, diff,diff_files, review) VALUES (?, ?, ?, ?,?)', [commitId, JSON.stringify(commit_ctx), diff, JSON.stringify(diffFiles), review], (err) => {
        if (err) {
            console.error('Error inserting data.', err);
        } else {
            console.log('Review data inserted.');
        }
    });
}

function getReviews(commitId, callback) {
    db.all('SELECT * FROM reviews where commit_id = ?', [commitId], (err, rows) => {
        if (err) {
            callback(err);
        } else {
            // 字符串转换回对象，并转换为标准格式
            const dataWithObj = rows.map(row => ({
                commit: row.commit_ctx ? JSON.parse(row.commit_ctx) : {},
                diffString: row.diff,
                files: row.diff_files ? JSON.parse(row.diff_files) : {},
                review: row.review
            }));
            callback(null, dataWithObj);
        }
    });
}
exports.getReviews = getReviews;
exports.insertReview = insertReview;