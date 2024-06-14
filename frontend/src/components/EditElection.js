import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminNav from './AdminNav';
import Foot from './foot';

function EditElection() {
    const { electionTitle } = useParams();
    const [election, setElection] = useState(null);
    const [newParticipant, setNewParticipant] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchElectionDetails();
    }, [electionTitle]);

    const fetchElectionDetails = () => {
        axios.get(`/admin-api/elections/${electionTitle}`)
            .then(response => {
                setElection(response.data);
            })
            .catch(error => {
                console.error('Error fetching election details:', error);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewParticipant(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`/admin-api/elections/${electionTitle}/participants`, newParticipant)
            .then(response => {
                console.log(response.data);
                setNewParticipant({ 
                    name: '',
                    description: ''
                });
                fetchElectionDetails(); 
            })
            .catch(error => {
                console.error('Error adding participant:', error);
            });
    };

    const handleDeleteParticipant = (participantId) => {
        axios.delete(`/admin-api/elections/${electionTitle}/participants/${participantId}`)
            .then(response => {
                console.log(response.data);
                fetchElectionDetails();
            })
            .catch(error => {
                console.error('Error deleting participant:', error);
            });
    };

    return (
        <>
            <div className="fixed-top">
                <AdminNav />
            </div>
            <div><br /><br /><br /></div>
            <div className="container mt-5 mb-5">
                <h2 className="text-center mb-4">Edit Election - {electionTitle}</h2>
                <div className="row">
                    <div className="col-md-6">
                        <h3>Add Participant</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name:</label>
                                <input type="text" className="form-control" id="name" name="name" value={newParticipant.name} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description:</label>
                                <input type="text" className="form-control" id="description" name="description" value={newParticipant.description} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Add Participant</button>
                        </form>
                    </div>
                    <div className="col-md-6">
                        <h3>Participants</h3>
                        <ul className="list-group">
                            {election && election.participants && election.participants.length > 0 ? (
                                election.participants.map((participant, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{participant.name}</strong>: {participant.description}
                                        </div>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteParticipant(participant.id)}>Delete</button>
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item">No participants added yet.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <div><br /><br /><br /><br></br><br></br><br></br><br></br><br></br></div>
            <div className="fixed-bottom">
                <Foot />
            </div>
        </>
    );
}

export default EditElection;
