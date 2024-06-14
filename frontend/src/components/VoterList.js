import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import Foot from './foot';

function VoterList() {
    const [voterList, setVoterList] = useState([]);
    const [votersCount, setVotersCount] = useState(0);
    const [votedCount, setVotedCount] = useState(0);

    useEffect(() => {
        fetchVoterList();
        fetchCounts();
    }, []);

    const fetchVoterList = () => {
        axios.get('/admin-api/voterList')
            .then(response => {
                setVoterList(response.data);
            })
            .catch(error => {
                console.error('Error fetching voter list:', error);
            });
    };

    const fetchCounts = () => {
        axios.get("/admin-api/count")
            .then(response => {
                setVotersCount(response.data.voterCount);
            })
            .catch(error => {
                console.error("Error fetching voter count:", error);
            });

        axios.get("/admin-api/votedcount")
            .then(response => {
                setVotedCount(response.data.votedCount);
            })
            .catch(error => {
                console.error("Error fetching voted count:", error);
            });
    };

    const resetVotes = () => {
        const confirmReset = window.confirm("Are you sure you want to reset all votes?");
        if (confirmReset) {
            axios.post("/admin-api/resetVotes")
                .then(response => {
                    console.log(response);
                    // Refresh voter list and counts after reset
                    fetchVoterList();
                    fetchCounts();
                })
                .catch(error => {
                    console.error("Error resetting votes:", error);
                });
        }
    };

    return (
        <>
            <div className="wrapper">
                <AdminNav />
                <div><br /><br /><br /></div>
                <div className="container mt-4">
                    <h2 className="text-center mb-4">Voter List</h2>
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th scope="col">Voter</th>
                                            <th scope="col">Voted</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {voterList.map(voter => (
                                            <tr key={voter.username}>
                                                <td>{voter.username}</td>
                                                <td>{voter.voted ? "Yes" : "No"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-lg-4 mt-4 mt-lg-0">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title text-center mb-4">Statistics</h4>
                                    <div className="mb-3">
                                        <p className="mb-1">Number of Voters:</p>
                                        <h5>{votersCount}</h5>
                                    </div>
                                    <div className="mb-3">
                                        <p className="mb-1">Number of Votes Cast:</p>
                                        <h5>{votedCount}</h5>
                                    </div>
                                    <div>
                                        <p className="mb-1">Number of Pending Votes:</p>
                                        <h5>{votersCount - votedCount}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <button onClick={resetVotes} className="btn btn-danger">Reset All Votes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="push"></div>
            </div>
            <Foot />
        </>
    );
}

export default VoterList;
