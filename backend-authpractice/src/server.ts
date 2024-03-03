import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const db = knex({
  client: "pg",
  connection: {
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT)
      : 5432,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
  },
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;

const app = express();
app.use(cors());
app.use(express.json());

function autheticateToken(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if (err) return res.sendStatus(403);
        req.body.user= user;
        next(); 
    })
}

app.get("/users", autheticateToken, async (req, res) => {
    const users = await db('users').select("username");
  //   console.log(JSON.stringify(users));
  const foundUser = await db('users')
  .select("*")
  .where({username: req.body.user.username})
  res.json(foundUser);
});

app.post("/createUser", async (req: Request, res: Response) => {
  //check if username already exists

  let existingUsers = await db
    .select("username")
    .from("users")
    .where({ username: req.body.username });
  if (existingUsers.length > 0) {
    res.send("Username already exists.  Please select a different username");
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      username: req.body.username,
      password: hashedPassword,
    };
    console.log("User to Insert" + JSON.stringify(user));
    db("users")
      .insert(user)
      .then(() => {
        res.status(201).send("User Successfully Created");
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        res.status(500).send("Error Creating User");
      });
  }
  //use bcrypt to get user password and then store into DB
});

app.post("/login", async (req: Request, res: Response) => {
  //check does user exist
  //if user exists, check the password, get the salt, and see if password match
  //if match ... set up JWT
  const userFound = await db("users")
    .select("*")
    .where({ username: req.body.username });
  if (userFound.length === 0) {
    res.status(200).send("User Not Found");
  } else {
    if (await bcrypt.compare(req.body.password, userFound[0].password)) {
      const user = {username: userFound[0].username}
      const accessToken = jwt.sign(
        user,
        process.env.ACCESS_TOKEN_SECRET as string,
        {expiresIn: "15s"}
      );
      const refreshToken = jwt.sign(user, process.env.ACCESS_REFRESH_TOKEN as string);
        res.json({ accessToken, refreshToken } );
      //JWT Token
    } else {
      res.status(200).send("Incorrect Password");
    }
  }
});

app.listen(port, () => {
  console.log(`Application has started on http://localhost:${port}`);
});
