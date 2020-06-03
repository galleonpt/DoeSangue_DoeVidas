const express = require("express");
const app = express();
const nunjucks = require("nunjucks");

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

const Pool = require("pg").Pool;
const db = new Pool({
  user: "postgres",
  password: "1234",
  host: "localhost",
  port: 5432,
  database: "maratonaDev",
});

nunjucks.configure("./", {
  express: app,
  noCache: true,
});

app.get("/", (request, response) => {
  db.query("SELECT * FROM donators", (err, result) => {
    //o result é um obj com os dados que vem do select
    if (err) return response.send("Erro na base de dados");

    const donators = result.rows; //pegar cada campo do result

    return response.render("index.html", {
      donators,
    });
  });
});

app.post("/", (request, response) => {
  const { name, email, blood } = request.body;

  if (name == "" || email == "" || blood == "")
    return response.send("Todos os campos são obrigatorios");

  const query = `INSERT INTO donators ("name", "email", "blood")
   VALUES ($1, $2, $3)`;

  const values = [name, email, blood];

  db.query(query, values, (err) => {
    if (err) return response.send("Erro na BD");

    return response.redirect("/");
  });
});

app.listen(3000);
