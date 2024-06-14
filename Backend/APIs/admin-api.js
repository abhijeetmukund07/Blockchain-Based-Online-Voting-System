const exp = require("express");
const adminApp = exp.Router();
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

adminApp.use((req, res, next) => {
    voters = req.app.get("voters");
    admin = req.app.get("admin");
    elections = req.app.get("elections");
    votes = req.app.get("votes");
    results = req.app.get("results");
    next();
  });


//admin login
adminApp.post('/login',expressAsyncHandler(async(req,res)=>{
    const userCred=req.body;
    const dbuser=await admin.findOne({username:userCred.username})
    if(dbuser===null){
        res.send({message:"Invalid username"})
    }else{
       const status=await bcryptjs.compare(userCred.password,dbuser.password)
       if(status===false){
        res.send({message:"Invalid password"})
       }else{
        const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'})
        res.send({message:"login success",token:signedToken,user:dbuser})
       }
    }
}))

//get the whole voter count
adminApp.get('/count',expressAsyncHandler(async(req,res)=>{
    const voterCount = await voters.count();
    res.send({voterCount});
    // console.log(voterCount);
}))

adminApp.get('/votedcount', expressAsyncHandler( async (req, res) => {
    try {
        const votedCount = await votes.countDocuments({ voted: true });
        res.json({ votedCount });
    } catch (error) {
        console.error("Error getting voted count:", error);
        res.status(500).json({ message: "Error getting voted count" });
    }
}))

// to get election count
adminApp.get('/electionsCount', expressAsyncHandler(async(req, res) => {
    const electionsCount = await elections.countDocuments();
    res.send({electionsCount});
}));


// Fetch all voters with name and voted status
adminApp.get('/voterList', expressAsyncHandler(async (req, res) => {
    try {
        const voterList = await votes.find({}, { projection: { _id: 0, username: 1, voted: 1 } }).toArray();
        res.json(voterList);
    } catch (error) {
        console.error("Error fetching voter list:", error);
        res.status(500).json({ message: "Error fetching voter list" });
    }
}));


// Get all elections
adminApp.get('/elections', expressAsyncHandler(async (req, res) => {
    try {
        const allElections = await elections.find({}).toArray();
        res.json(allElections);
    } catch (error) {
        console.error("Error fetching elections:", error);
        res.status(500).json({ message: "Error fetching elections" });
    }
}));



// now to add a new election in elections collection
adminApp.post("/addElection" , expressAsyncHandler ( async (req,res)=> {
    const eleInfo = req.body;
    const eleno = await elections.countDocuments();
    try{
        // console.log(eleInfo)
        eleInfo.status = false;  
        await elections.insertOne(eleInfo);
        res.send({message:"Election added successfully"})
    }catch(err){
        res.status(409).send("Error adding Election");
        console.error(err);
    }
} ))


// Stop election
adminApp.put("/stopElection/:electionTitle", expressAsyncHandler(async (req, res) => {
    const electionTitle = req.params.electionTitle;
    try {
        await elections.findOneAndUpdate({ electionTitle: electionTitle }, { $set: { status: false } });
        res.send({ message: `Election "${electionTitle}" has been stopped` });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error stopping election' });
    }
}));

//resume election
adminApp.put("/resumeElection/:electionTitle", expressAsyncHandler(async (req, res) => {
    const electionTitle = req.params.electionTitle;
    const count = await elections.countDocuments({status:true});
    if(count==0){
    try {
        await elections.findOneAndUpdate({ electionTitle: electionTitle }, { $set: { status: true } });
        res.send({ message: `Election "${electionTitle}" has been resumed` });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error stopping election' });
    }
    }else{
        res.send({message:"already a election is in motion"})
    }
}));

// Delete election
adminApp.delete('/deleteElection/:electionTitle', expressAsyncHandler(async (req, res) => {
    const electionTitle = req.params.electionTitle;
    try {
        const election = await elections.findOne({ electionTitle: electionTitle });
        if (!election) {
            res.status(404).send({ message: `Election "${electionTitle}" not found` });
            return;
        }
        if (election.status) {
            res.status(400).send({ message: `Cannot delete election "${electionTitle}" with active status` });
            return;
        }
        await elections.deleteOne({ electionTitle: electionTitle });
        res.send({ message: `Election "${electionTitle}" has been deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error deleting election' });
    }
}));





// Fetch election details by electionTitle
adminApp.get('/elections/:electionTitle', expressAsyncHandler(async (req, res) => {
    const electionTitle = req.params.electionTitle;
    try {
        const election = await elections.findOne({ electionTitle: electionTitle });
        if (!election) {
            res.status(404).json({ message: `Election "${electionTitle}" not found` });
            return;
        }
        res.json(election);
    } catch (err) {
        console.error("Error fetching election details:", err);
        res.status(500).json({ message: "Error fetching election details" });
    }
}));

// Add a participant to the election
adminApp.post('/elections/:electionTitle/participants', expressAsyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const electionTitle = req.params.electionTitle;
    try {
        const election = await elections.findOne({ electionTitle: electionTitle });
        if (!election) {
            res.status(404).json({ message: `Election "${electionTitle}" not found` });
            return;
        }
        if (!election.participants) {
            election.participants = [];
        }
        const newParticipant = {
            id: election.participants.length + 1,
            name,
            description,
            numberOfVotes: 0
        };
        await elections.updateOne({ electionTitle: electionTitle }, { $push: { participants: newParticipant } });
        res.json(newParticipant);
    } catch (err) {
        console.error("Error adding participant:", err);
        res.status(500).json({ message: "Error adding participant" });
    }
}));

// Delete a participant from the election
adminApp.delete('/elections/:electionTitle/participants/:participantId', expressAsyncHandler(async (req, res) => {
    const { electionTitle, participantId } = req.params;
    try {
        const election = await elections.findOne({ electionTitle: electionTitle });
        if (!election) {
            res.status(404).json({ message: `Election "${electionTitle}" not found` });
            return;
        }
        if (!election.participants || election.participants.length === 0) {
            res.status(400).json({ message: `No participants found for election "${electionTitle}"` });
            return;
        }
        const participantIndex = election.participants.findIndex(participant => participant.id === parseInt(participantId));
        if (participantIndex === -1) {
            res.status(404).json({ message: `Participant not found in election "${electionTitle}"` });
            return;
        }
        election.participants.splice(participantIndex, 1);
        await elections.updateOne({ electionTitle: electionTitle }, { $set: { participants: election.participants } });
        res.json({ message: `Participant ${participantId} has been deleted from election "${electionTitle}"` });
    } catch (err) {
        console.error("Error deleting participant:", err);
        res.status(500).json({ message: "Error deleting participant" });
    }
}));


//reset votes
adminApp.post('/resetVotes', expressAsyncHandler(async (req, res) => {
    try{
        await votes.updateMany({},{$set:{voted:false,for:-1}})
        await elections.updateOne({status:true},{$set: { voters: [] },$set: { "participants.$[].numberOfVotes": 0 }})
        res.send('Votes reset')
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Couldn't reset votes"});
    }
}));
    
// results calculation
// Get ongoing election and its vote analysis
adminApp.get(
    "/results/ongoingElection",
    expressAsyncHandler(async (req, res) => {
        try {
            const ongoingElection = await elections.findOne({ status: true });
            if (!ongoingElection) {
                return res.status(404).json({ message: "No ongoing election found" });
            }
            const voteAnalysis = ongoingElection.participants.map(candidate => {
                return {
                    name: candidate.name,
                    numberOfVotes: candidate.numberOfVotes
                };
            });
            voteAnalysis.sort((a, b) => b.numberOfVotes - a.numberOfVotes);
            res.status(200).json({ ongoingElection, voteAnalysis });
        } catch (error) {
            console.error("Error fetching ongoing election and vote analysis:", error);
            res.status(500).json({ message: "Error fetching ongoing election and vote analysis" });
        }
    })
);

// post the results to the results collection
adminApp.post("/resultsPost", expressAsyncHandler(async (req, res) => {
    const { voteAnalysis, ongoingElection } = req.body;
    const electionTitle = ongoingElection.electionTitle;
    try {
        const existingResult = await results.findOne({ electionTitle: electionTitle });
        if (existingResult) {
            const updatedResult = await results.findOneAndUpdate(
                { electionTitle: electionTitle },
                { $set: { voteAnalysis: voteAnalysis } },
                { returnOriginal: false }
            );
            res.status(200).send({ message: 'Results updated successfully', results: updatedResult });
        } else {
            const newResult = await results.insertOne({ electionTitle: electionTitle, voteAnalysis: voteAnalysis });
            res.status(201).send({ message: 'Results posted successfully', results: newResult });
        }
    } catch (error) {
        console.error('Error posting results:', error);
        res.status(500).send({ message: 'Failed to post results' });
    }
}));



module.exports = adminApp;

