const express = require("express");
const app = express();
const { Pool } = require("pg");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const session = require("express-session");
const _ = require("underscore");
const moment = require("moment");
const { text } = require("express");
const functions = require("./middlewares/functions");
const port = process.env.PORT || 8080;
// const db = require("./models/index.model");

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });
// db.sequelize.sync();

let db;

if (process.env.NODE_ENV === "production") {
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  db = new Pool({
    database: "findajob",
  });
}

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
app.use(session({ secret: "keyboard cat", cookie: { maxAge: 60000 } }));
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.isLoggedIn = true;
    const sql = `SELECT * FROM users WHERE id = $1`;
    db.query(sql, [req.session.userId], (err, dbRes) => {
      res.locals.currentUser = dbRes.rows[0];
      next();
    });
  } else {
    res.locals.isLoggedIn = false;
    res.locals.currentUser = {};
    next();
  }
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/", (req, res) => {
  const sql = `SELECT * FROM users WHERE email = $1;`;

  db.query(sql, [req.body.email], (err, dbRes) => {
    console.log(err);

    if (dbRes.rows.length === 0) {
      res.render("index.ejs");
      return;
    }

    let user = dbRes.rows[0];
    bcrypt.compare(req.body.password, user.password_digest, (err, result) => {
      if (result) {
        req.session.userId = user.id;
        res.redirect("/homepage");
      } else {
        res.render("index.ejs");
      }
    });
  });
});

app.delete("/logout", (req, res) => {
  req.session.userId = undefined;
  res.redirect("/");
});

app.get("/homepage", (req, res, next) => {
  db.query(
    "SELECT *, INITCAP(company) AS new_company_name, INITCAP(position) AS new_position, INITCAP(tags) AS new_tags, INITCAP (status) AS new_status FROM jobs;",
    (err, dbRes) => {
      if (err) {
        next(err);
        return;
      }
      let jobs = dbRes.rows;
      res.render("homepage.ejs", { jobs: jobs });
    }
  );
});

app.get("/new-application", (req, res, next) => {
  db.query(
    "SELECT REGEXP_REPLACE(LOWER(tags), '\\s+$', '') AS tag, REGEXP_REPLACE(LOWER(status), '\\s+$', '') AS state FROM jobs;",
    (err, dbRes) => {
      if (err) {
        next(err);
        return;
      }
      let select = dbRes.rows;
      let sortTag = _.chain(select)
        .sortBy(sort => {
          return sort.tag;
        })
        .map(sort => {
          return sort.tag;
        })
        .filter()
        .uniq();
      let sortStatus = _.chain(select)
        .sortBy(sort => {
          return sort.state;
        })
        .map(sort => {
          return sort.state;
        })
        .filter()
        .uniq();

      res.render("new%application.ejs", {
        select: select,
        error: false,
        sortTag: sortTag,
        sortStatus: sortStatus,
      });
    }
  );
  // res.render("new%application.ejs");
});

app.post("/new-upload", (req, res, next) => {
  const sql = `INSERT INTO jobs (company, position, date_applied, notes, tags, status) VALUES ($1, $2, $3, $4, $5, $6);`;
  db.query(
    sql,
    [
      req.body.company,
      req.body.position,
      new Date(req.body.date_applied),
      req.body.notes,
      req.body.tags,
      req.body.status,
    ],
    (err, dbRes) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect("/homepage");
    }
  );
});

app.get("/edit/:id", (req, res, next) => {
  db.query(
    "SELECT * FROM jobs WHERE id = $1;",
    [req.params.id],
    (err, dbRes) => {
      if (err) {
        next(err);
        return;
      }
      let jobs = dbRes.rows[0];
      res.render("comments.ejs", { jobs: jobs });
    }
  );
});

app.get("/application/:id", (req, res, next) => {
  db.query(
    "SELECT *, INITCAP(company) AS new_company_name, INITCAP(position) AS new_position, INITCAP(tags) AS new_tags, INITCAP (status) AS new_status FROM jobs WHERE id = $1;",
    [req.params.id],
    (err, dbRes) => {
      if (err) {
        next(err);
        return;
      }
      let jobs = dbRes.rows[0];

      res.render("view%application.ejs", { jobs: jobs });
    }
  );
});

app.put("/application/:id", (req, res, next) => {
  const sql = `UPDATE jobs SET company = $1, position = $2, date_applied = $3, notes = $4, tags = $5, status = $6 WHERE id = $7;`;
  db.query(
    sql,
    [
      req.body.company,
      req.body.position,
      new Date(req.body.date_applied),
      req.body.notes,
      req.body.tags,
      req.body.status,
      req.params.id,
    ],
    (err, dbRes) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect(`/application/${req.params.id}`);
    }
  );
});

app.post("/delete/:id", (req, res) => {
  const sql = `DELETE FROM jobs WHERE id = $1`;
  db.query(sql, [req.params.id], (err, dbRes) => {
    res.redirect("/homepage");
  });
});

app.put("/remove-notes/:id", (req, res) => {
  const sql = `UPDATE jobs SET notes = NULL WHERE id = $1`;
  db.query(sql, [req.params.id], (err, dbRes) => {
    res.redirect(`/application/${req.params.id}`);
  });
});

app.get("/checklist", (req, res) => {
  res.render("checklist.ejs");
});

app.get("/profile", (req, res) => {
  res.render("profile.ejs");
});

app.get("/tags", (req, res, next) => {});

app.listen(process.env.PORT || 8080);
