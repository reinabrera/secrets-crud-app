import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import pg from "pg";
import jwt from "jsonwebtoken";
import cors from "cors";

// const db = new pg.Client({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
// });

const db = new pg.Client({
  connectionString: process.env.POSTGRES_URL ,
})

db.connect((err) => {
  if (err) throw err
  console.log("db connection success!");
});

const app = express();
if (process.env.MODE === 'production') {
  const corsOptions = {
      origin: process.env.API_URL,
  };
  app.use(cors(corsOptions)); 
}

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

const port = parseInt(process.env.PORT);

const saltRounds = parseInt(process.env.SALTROUNDS);

const getRandomSecret = async () => {
  const result = await db.query(
    "SELECT * FROM secrets ORDER BY RANDOM() LIMIT 1"
  );
  return result.rows[0].secret_text;
};

const createUser = async (data) => {
  try {
    const username = data.username.toLowerCase();
    const hash = await bcrypt.hash(data.password, saltRounds);
    const result = await db.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
      [username, hash]
    );

    if (result.rowCount == 0) return { error: "Error creating your account." };

    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      return { error: "username already exists" };
    } else {
      throw error;
    }
  }
};

const matchPassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
};

app.get("/api", (req,res) => {
  res.json({message: "App is running"});
})

app.post("/api/register", async (req, res) => {
  if (req.body.username.length === 0 || req.body.password.length === 0) {
    return res.status(400).json({ error: "Error creating your account." });
  }

  const newUser = await createUser(req.body);
  if (newUser.error) {
    res.status(400).json({ error: newUser.error });
  } else {
    res.status(200).json({ message: "Account created" });
  }
});

app.post("/api/login", async (req, res) => {
  const usernameInput = req.body.username.toLowerCase();
  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    usernameInput,
  ]);

  if (result.rowCount === 0) {
    return res.status(400).json({ auth: false, error: "Account not found" });
  }

  const { id, password_hash, username } = result.rows[0];

  const isMatch = await matchPassword(req.body.password, password_hash);
  if (isMatch) {
    const token = jwt.sign({ username, id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ auth: true, message: "Account logged in", token });
  } else {
    return res.status(400).json({ auth: false, error: "Wrong password" });
  }
});

const verifyToken = (req, res, next) => {
  const authHeader  = req.headers["authorization"];
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Token not provided", auth: false });

  }
  const token = authHeader.substring(7);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid token", auth: false });
    req.username = decoded.username;
    req.user_id = decoded.id;
    next();
  });
};

app.get("/api/checkAuth", verifyToken, (req, res) => {
  res.json({ message: "Authenticated", auth: true, username: req.username });
});

app.get("/api/secrets", verifyToken, async (req, res) => {
  const secret = await getRandomSecret();
  res.json({ message: "Authenticated", auth: true, secret: secret });
});

const getUserSecrets = async (username) => {
  const result = await db.query(
    "SELECT secrets.secret_text, secrets.secret_id FROM secrets INNER JOIN users ON secrets.user_id=users.id WHERE username=$1 ORDER BY secret_id DESC",
    [username]
  );
  return result.rows;
};

app.get("/api/userSecrets", verifyToken, async (req, res) => {
  const userSecrets = await getUserSecrets(req.username);
  if (userSecrets) {
    res.json({ message: "Success", userSecrets: userSecrets });
  }
});

const patchSecret = async (secret_text, secret_id, user_id) => {
  try {
    const result = await db.query(
      "UPDATE secrets SET secret_text = $1 WHERE secret_id=$2 AND user_id=$3 RETURNING *",
      [secret_text, secret_id, user_id]
    );
    return result.rows[0];
  } catch (err) {
    if (err) {
      return { error: "Error updating secret" };
    }
  }
};

app.patch("/api/secret/:id", verifyToken, async (req, res) => {
  const patch = await patchSecret(req.body.secret_text, req.body.secret_id, req.user_id);
  if (patch.error) {
    return res.status(400).json(patch);
  }
  return res
    .status(200)
    .json({ message: "Secret updated sucessfully", updatedSecret: patch });
});

const deleteSecret = async (id, user_id) => {
  try {
    const result = await db.query(
      "DELETE FROM secrets WHERE secret_id=$1 AND user_id=$2 RETURNING *",
      [id, user_id]
    );
    return result.rows[0];
  } catch (error) {
    if (error) {
      return {error: "Error deleting secret"}
    }
  }
};

app.delete("/api/secret/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const deleteResult = await deleteSecret(id, req.user_id);
  if (deleteResult.error) {
    return res.status(400).json(deleteResult);
  }
  return res
    .status(200)
    .json({
      message: "Successfully deleted secret with id: " + deleteResult.secret_id,
    });
});

const addSecret = async (user_id, secret_text) => {
  try {
    const result = await db.query(
      "INSERT INTO secrets (user_id, secret_text) VALUES ($1, $2) RETURNING *",
      [user_id, secret_text]
    );
    return result.rows[0];
  } catch (err) {
    if (err) {
      return { error: "Error creating secret" };
    }
  }
};

app.post("/api/secret", verifyToken, async (req, res) => {
  const add = await addSecret(req.user_id, req.body.text);
  if (add.error) {
    return res.status(400).json(add);
  }
  return res
    .status(200)
    .json({ message: "Successfully created secret", newSecret: add });
});

const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const cronApiKey = process.env.CRON_API_KEY;
  
  if (cronApiKey !== apiKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

app.delete("/api/deleteEntries", authenticateAPIKey, async (req,res) => {
  try {
    const deleteSecretsQuery = `
      DELETE FROM secrets
      WHERE secret_id > 24
      AND created_at <= NOW() - interval '24 hours';
    `;

    const deleteUsersQuery = `
    DELETE FROM users
    WHERE id > 3
    AND created_at <= NOW() - interval '24 hours';
    `;

    const deleteSecrets = await db.query(deleteSecretsQuery);
    res.status(200).json(`${deleteSecrets.rowCount} rows deleted in secrets table.`);
    if (deleteSecrets) {
      const deleteUsers = await db.query(deleteUsersQuery);
      res.status(200).json(`${deleteUsers.rowCount} rows deleted in users table.`);
    }
  } catch (error) {
    res.status(400).json("Error executing delete query:", error);
  }
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
