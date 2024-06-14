import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, ListGroup, ListGroupItem, Row, Col } from 'react-bootstrap';
import NavBar from './VoterNav';
import Foot from './foot';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

function Results() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await axios.get('/voters-api/results');
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    const findWinner = (candidates) => {
        let winner = '';
        let maxVotes = -1;
        candidates.forEach(candidate => {
            if (candidate.numberOfVotes > maxVotes) {
                maxVotes = candidate.numberOfVotes;
                winner = candidate.name;
            }
        });
        return winner;
    };

    return (
        <>
            <NavBar />
            <Container>
                <h2 className="mt-4 mb-4 text-center">Election Results</h2>
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <Card key={index} className="mb-4 p-4 shadow">
                            <Card.Body>
                                <Card.Title className="text-center mb-4">{result.electionTitle}</Card.Title>
                                <Row className="justify-content-center">
                                    <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                                        <PieChart width={300} height={300}>
                                            <Pie
                                                data={result.voteAnalysis}
                                                dataKey="numberOfVotes"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                                label
                                            >
                                                {result.voteAnalysis.map((candidate, index) => (
                                                    <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <ListGroup variant="flush">
                                            {result.voteAnalysis.map((candidate, idx) => (
                                                <ListGroupItem key={idx} className="d-flex justify-content-between align-items-center">
                                                    <span>{candidate.name}</span>
                                                    <span>{candidate.numberOfVotes} votes</span>
                                                </ListGroupItem>
                                            ))}
                                        </ListGroup>
                                        <div className="text-center mt-4">
                                            <strong className="text-primary">Winner:</strong> <strong><span className="text-success">{findWinner(result.voteAnalysis)}</span></strong>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p className="text-center">No election results found.</p>
                )}
            </Container>
            <div><br></br><br></br><br></br><br></br><br></br></div>
            <Foot />
        </>
    );
}

export default Results;
