const pool = require("../db/pool");

async function getMessages(req, res) {
  let result;
  if (req.user.member) {
    result = await pool.query(`
    SELECT messages.id, messages.title, messages.text, messages.time, users.username
    FROM messages
    LEFT JOIN users
    ON messages.user_id = users.id;
    `);
  } else {
    result = await pool.query(`
    SELECT messages.id, messages.title, messages.text
    FROM messages
    LEFT JOIN users
    ON messages.user_id = users.id;
    `);
  }
  res.render("messages", { messages: result.rows, user: req.user });
}

function getNewMessagePage(req, res) {
  res.render("new-message");
}

async function createMessage(req, res) {
  if (!req.user) {
    return res.redirect("/log-in");
  }

  const message = req.body;
  const timeStamp = new Date();

  await pool.query(
    `
   INSERT INTO messages (title, text, time, user_id) VALUES ($1, $2, $3, $4)
    `,
    [message.title, message.text, timeStamp, req.user.id],
  );
  res.redirect("/message");
}

async function deleteMessage(req, res) {
  if (!req.user.admin) {
    return res.status(403).send("You are not an admin");
  }
  await pool.query(
    `
        DELETE FROM messages
        WHERE id = $1
        `,
    [req.params.id],
  );
  res.redirect("/message");
}

module.exports = {
  getMessages,
  getNewMessagePage,
  createMessage,
  deleteMessage,
};
