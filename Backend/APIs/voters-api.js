const exp = require("express");
const votersApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken=require('../middleware/verifyToken');
require("dotenv").config();

let voters;
let admin;
let elections;
let votes;
let results;

votersApp.use((req, res, next) => {
    voters = req.app.get("voters");
    admin = req.app.get("admin");
    elections = req.app.get("elections");
    votes = req.app.get("votes");
    results = req.app.get("results");
    next();
  });


  //user register
  votersApp.post(
    "/register",
    expressAsyncHandler(async (req, res) => {
      const newUser = req.body;
      const dbuser = await voters.findOne({ username: newUser.username });
      if (dbuser !== null) {
        res.send({ message: "User existed" });
      } else {
        const hashedPassword = await bcryptjs.hash(newUser.password, 6);
        newUser.password = hashedPassword;
        await voters.insertOne(newUser);
        await votes.insertOne({
          username: newUser.username,
          voted: false,
          for:-1
        });
        res.send({ message: "User created" });
      }
    })
  );



  //user login
votersApp.post(
    "/login",
    expressAsyncHandler(async (req, res) => {
      const userCred = req.body;
      const dbuser = await voters.findOne({
        username: userCred.username,
      });
      if (dbuser === null) {
        res.send({ message: "Invalid username" });
      } else {
        const status = await bcryptjs.compare(userCred.password, dbuser.password);
        if (status === false) {
          res.send({ message: "Invalid password" });
        } else {
          const signedToken = jwt.sign(
            { username: dbuser.username },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
          );
          res.send({
            message: "login success",
            token: signedToken,
            user: dbuser,
          });
        }
      }
    })
  );

  votersApp.get("/voter/:username", expressAsyncHandler(async (req, res) => {
    const username = req.params.username;
    try {
        const voter = await voters.findOne({ username });
        if (!voter) {
            return res.status(404).json({ message: "Voter not found" });
        }
        res.status(200).json(voter);
    } catch (error) {
        console.error("Can't get profile", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
}));





  votersApp.post(
    "/vote/:electionTitle/:username/:candidateId",
    expressAsyncHandler(async (req, res) => {
        const { electionTitle, username, candidateId } = req.params;
        try {
            const voter = await votes.findOne({ username });
            if (!voter || voter.voted) {
                return res.status(400).json({ message: "You have already voted" });
            }
            const updateResult = await elections.updateOne(
              { electionTitle, "participants.id": parseInt(candidateId) },
              { $inc: { "participants.$.numberOfVotes": 1 } }
          );
          const election = await elections.findOne({ electionTitle: electionTitle });
          if (!election.voters) {
            election.voters = [];
          }
          await elections.updateOne({ electionTitle: electionTitle }, { $push: { voters: username } });

          if (updateResult.modifiedCount === 0) {
              return res.status(404).json({ message: "Candidate not found in the election" });
          }
          await votes.updateOne({ username }, { $set: { voted: true, for: candidateId } });
          return res.json({ message: "Vote recorded successfully" });
        } catch (error) {
            console.error("Error voting:", error);
            res.status(500).json({ message: "Error voting" });
        }
    })
);


// Get active elections
votersApp.get(
  "/activeElections",
  expressAsyncHandler(async (req, res) => {
      try {
          const activeElections = await elections.find({ status: true }).toArray();
          res.json(activeElections);
      } catch (error) {
          console.error("Error fetching active elections:", error);
          res.status(500).json({ message: "Error fetching active elections" });
      }
  })
);

// Get candidates for a specific election
votersApp.get("/candidates/:electionTitle", expressAsyncHandler(async (req, res) => {
  const { electionTitle } = req.params;
  try {
      const election = await elections.findOne({ electionTitle });
      if (!election) {
          res.status(404).json({ message: "Election not found" });
          return;
      }
      res.json(election.participants);
  } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ message: "Error fetching candidates" });
  }
}));


// voted has voted or not
votersApp.get("/hasVoted/:electionTitle/:username", expressAsyncHandler(async (req, res) => {
  const { electionTitle, username } = req.params;
  try {
      const election = await elections.findOne({ electionTitle });
      if (!election) {
          return res.status(404).json({ message: "Election not found" });
      }
      const hasVoted = election.voters.includes(username);
      res.status(200).json({ hasVoted });
  } catch (err) {
      console.error("Error checking if user has voted:", err);
      res.status(500).json({ message: "Error checking if user has voted" });
  }
}));


// get the results
votersApp.get("/results", expressAsyncHandler(async (req, res) => {
  try {
    const allResults = await results.find({}).toArray();
    res.status(200).send(allResults);
  }catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).send({ message: 'Failed to fetch results' });
}
}));

module.exports = votersApp;

