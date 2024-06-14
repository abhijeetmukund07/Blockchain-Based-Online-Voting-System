const exp = require("express");
// const cors = require("cors");
const app = exp();
require("dotenv").config();
const mongoClient = require("mongodb").MongoClient;
const path = require("path");

// app.use(cors());
app.use(exp.static(path.join(__dirname, "../frontend/build")));
app.use(exp.json());

mongoClient
  .connect(process.env.DB_URL)
  .then((client) => {
    const votedb = client.db("OnlineVotingSystem");
    const voters = votedb.collection("voters");
    const elections = votedb.collection("elections");
    const admin = votedb.collection("admin");
    const votes = votedb.collection("votes");
    const results = votedb.collection("results");
    app.set("voters", voters);
    app.set("elections", elections);
    app.set("admin", admin);
    app.set("votes", votes);
    app.set("results", results);
    console.log("DB connection success");
  })
  .catch((err) => console.log("Err in DB connection", err));

const votersApp = require("./APIs/voters-api");
const adminApp = require("./APIs/admin-api");

app.use("/voters-api", votersApp);
app.use("/admin-api", adminApp);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.use((err, req, res, next) => {
  res.send({ message: "error", payload: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Web server on port ${port}`));
