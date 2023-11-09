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
    //reviews
    db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      commit_id TEXT PRIMARY KEY ,
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
    // 使用REPLACE插入新的评论数据，这将自动删除具有相同commit_id的旧记录
    db.run('REPLACE INTO reviews (commit_id, commit_ctx, diff, diff_files, review) VALUES (?, ?, ?, ?, ?)',
        [commitId, JSON.stringify(commit_ctx), diff, JSON.stringify(diffFiles), review], (err) => {
            if (err) {
                console.error('Error inserting or replacing review data.', err);
            } else {
                console.log('Review data inserted or replaced successfully.');
            }
        });
}

function getReviews(commitId, callback) {
    db.all('SELECT * FROM reviews WHERE commit_id = ?', [commitId], (err, rows) => {
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

function getReviewsAll(commitId, callback) {
    db.all('SELECT * FROM reviews ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            callback(err);
        } else {
            const dataWithObj = rows.map(row => ({
                ...(row.commit_ctx ? JSON.parse(row.commit_ctx) : {})
            }));
            callback(null, dataWithObj);
        }
    });
}

exports.getReviews = getReviews;
exports.insertReview = insertReview;
exports.getReviewsAll = getReviewsAll;