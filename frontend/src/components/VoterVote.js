import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VoterNav from "./VoterNav";
import Foot from "./foot";
import { vote } from "./VotingSystemFunctions";

function VoterVote() {
  const { electionTitle, voterName } = useParams();
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = () => {
    axios
      .get(`/voters-api/candidates/${electionTitle}`)
      .then((response) => {
        setCandidates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching candidates:", error);
      });
  };

  async function handleVoteClick(candidateId) {
    const confirmVote = window.confirm("Are you sure you want to vote for this candidate?");
    if (confirmVote) {
      await vote(candidateId, voterName);
      let response = await axios.post(
        `/voters-api/vote/${electionTitle}/${voterName}/${candidateId}`
      );
      console.log(response.data.message);
      if (response) {
        navigate(`/voter-home/${voterName}`);
      }
    }
  }

  return (
    <>
      <div className="fixed-top">
        <VoterNav />
      </div>
      <div>
        <br />
        <br />
        <br />
      </div>
      <div className="container mt-5 mb-5">
        <h1 className="text-center mb-4">Vote in Election - {electionTitle}</h1>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{candidate.name}</h5>
                  <p className="card-text">{candidate.description}</p>
                </div>
                <div className="card-footer text-center">
                  <button onClick={() => handleVoteClick(candidate.id)} className="btn btn-primary">
                    Vote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <br />
        <br />
        <br />
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
      <div className="fixed-bottom">
        <Foot />
      </div>
    </>
  );
}

export default VoterVote;
