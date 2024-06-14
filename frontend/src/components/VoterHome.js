import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import VoterNav from './VoterNav';
import Foot from './foot';
import { useParams } from 'react-router-dom';
import './VoterHome.css';

function VoterHome() {
    const { voterName } = useParams();
    const [activeElections, setActiveElections] = useState([]);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        fetchUserProfile();
        fetchActiveElections();
    }, []);

    const fetchUserProfile = () => {
        axios.get(`/voters-api/voter/${voterName}`)
            .then(response => {
                setUserProfile(response.data);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    };

    const fetchActiveElections = () => {
        axios.get('/voters-api/activeElections')
            .then(response => {
                setActiveElections(response.data);
            })
            .catch(error => {
                console.error('Error fetching active elections:', error);
            });
    };

    const hasVoted = (election) => {
        return election.voters && election.voters.includes(voterName);
    };

    return (
        <>
            <VoterNav />
            <div><br></br><br></br><br></br></div>
            <div className="container">
                <div className="profile-info">
                    {userProfile && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <h1 className="card-title text-center">Welcome, {userProfile.Name}</h1>
                                <p className="card-text">Username: {userProfile.username}</p>
                                <p className="card-text">Phone: {userProfile.phone}</p>
                                <p className="card-text">Date of Birth: {userProfile.dob}</p>
                                <p className="card-text">Gender: {userProfile.gender}</p>
                            </div>
                        </div>
                    )}
                </div>
                <h2 className="text-center mb-4">Active Elections</h2>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {activeElections.length === 0 ? (
                        <div className="col text-center">
                            <p>No active elections at the moment.</p>
                        </div>
                    ) : (
                        activeElections.map(election => (
                            <div key={election.electionTitle} className="col">
                                <div className={`card h-100 ${hasVoted(election) ? 'voted' : ''}`}>
                                    <div className="card-body">
                                        <h5 className="card-title">{election.electionTitle}</h5>
                                    </div>
                                    <div className="card-footer text-center">
                                        {hasVoted(election) ? (
                                            <p className="already-voted">You have already voted</p>
                                        ) : (
                                            <Link to={`/vote/${election.electionTitle}/${voterName}`} className="btn btn-primary">Vote</Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br></div>
            <div className="fixed-bottom">
                <Foot />
            </div>
        </>
    );
}

export default VoterHome;
