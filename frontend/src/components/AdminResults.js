import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, ListGroup, ListGroupItem, Row, Col, Button } from 'react-bootstrap';
import AdminNav from './AdminNav';
import Foot from './foot';
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function AdminResults() {
    const [ongoingElection, setOngoingElection] = useState(null);
    const [voteAnalysis, setVoteAnalysis] = useState([]);

    useEffect(() => {
        fetchOngoingElection();
    }, []);

    const fetchOngoingElection = async () => {
        try {
            const response = await axios.get('/admin-api/results/ongoingElection');
            const { ongoingElection, voteAnalysis } = response.data;
            setOngoingElection(ongoingElection);
            setVoteAnalysis(voteAnalysis);
        } catch (error) {
            console.error('Error fetching ongoing election and vote analysis:', error);
        }
    };

    const pieChartData = voteAnalysis.map(candidate => ({
        name: candidate.name,
        value: candidate.numberOfVotes
    }));

    const barChartData = voteAnalysis.map(candidate => ({
        name: candidate.name,
        votes: candidate.numberOfVotes
    }));

    const postResults = async () => {
        try {
            const response = await axios.post('/admin-api/resultsPost', { voteAnalysis, ongoingElection });
            console.log('Results posted successfully:', response.data);
        } catch (error) {
            console.error('Error posting results:', error);
        }
    };

    return (
        <>
            <AdminNav /> 
            <Container>
                <h2 className="mt-4 mb-4 text-center">Ongoing Election Analysis</h2>
                <Row className="justify-content-center">
                    <Col xs={12} md={6}>
                        {ongoingElection ? (
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title className="text-center">{ongoingElection.electionTitle}</Card.Title>
                                    <Card.Text className="text-center">
                                        <strong>Start Date:</strong> {ongoingElection.startDate}<br />
                                        <strong>End Date:</strong> {ongoingElection.endDate}
                                    </Card.Text>
                                </Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem>
                                        <h4 className="text-center">Pie Chart</h4>
                                        <PieChart width={400} height={400} className="mx-auto">
                                            <Pie
                                                dataKey="value"
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        ) : (
                            <p className="text-center">No ongoing election found.</p>
                        )}
                    </Col>
                    <Col xs={12} md={6}>
                        {ongoingElection && (
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title className="text-center">Vote Analysis</Card.Title>
                                    <ul className="list-unstyled">
                                        {voteAnalysis.map(candidate => (
                                            <li key={candidate.name} className="text-center">
                                                <strong>{candidate.name}</strong>: {candidate.numberOfVotes} votes
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        )}
                        <Card className="mb-4">
                            <Card.Body>
                                <h4 className="text-center">Bar Chart</h4>
                                <BarChart width={400} height={400} data={barChartData} className="mx-auto">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickCount={6} tick="none" interval="preserveStartEnd" />
                                    <Tooltip />
                                    <Bar dataKey="votes" fill="#8884d8" />
                                </BarChart>
                            </Card.Body>
                        </Card>
                        <div className="text-center">
                            <Button variant="primary" onClick={postResults}>Post Results</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Foot />
        </>
    );
}

export default AdminResults;
