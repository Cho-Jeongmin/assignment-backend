import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "minjeong1593!",
  database: "test",
});

// If ther is a authentication problem,
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'minjeong1593!';

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("hello this is the backend");
});

// 게시글 전체 조회
app.get("/posts", (req, res) => {
  const q = "SELECT * FROM posts ORDER BY id DESC;";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// 게시글 한 개 조회
app.get("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const q = "SELECT * FROM posts WHERE id = ?;";
  db.query(q, [postId], (err, post) => {
    if (err) return res.json(err);
    const q2 = "SELECT * FROM comments WHERE postId = ?;";
    db.query(q2, [postId], (err, comments) => {
      if (err) return res.json(err);
      return res.json({ post: post[0], comments: comments });
    });
  });
});

// 댓글 작성
app.post("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  const q = "INSERT INTO comments (`content`, `nickname`, `postId`) VALUES (?)";
  const values = [req.body.content, req.body.nickname, postId];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("댓글이 작성되었습니다.");
  });
});

// 좋아요
app.put("/posts/:id/likes", (req, res) => {
  const postId = req.params.id;
  const offset = req.body.isAdding ? "1" : "-1";
  const q = "UPDATE posts SET likes = likes + ? WHERE id = ?";
  db.query(q, [offset, postId], (err, data) => {
    if (err) return res.json(err);
    return res.json("좋아요");
  });
});

app.listen(8800, () => {
  console.log("Connected to backend!");
});
