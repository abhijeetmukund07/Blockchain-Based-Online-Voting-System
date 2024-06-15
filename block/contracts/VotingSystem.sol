// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Candidate {
        string name;
        string gender;
        string party;
        uint256 voteCount;
    }

    struct Election {
        string name;
        bool isActive;
        mapping(uint256 => Candidate) candidates;
        uint256 candidatesCount;
        mapping(address => bool) hasVoted;
        mapping(string => bool) voterIds;
    }

    address public admin;
    Election public currentElection;
    bool public electionInProgress;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier electionActive() {
        require(electionInProgress, "No active election");
        _;
    }

    modifier electionNotActive() {
        require(!electionInProgress, "An election is already in progress");
        _;
    }

    constructor() {
        admin = msg.sender; // Set the contract deployer as the admin
    }

    function startNewElection(string memory _name) public onlyAdmin electionNotActive {
        currentElection.name = _name;
        currentElection.isActive = true;
        currentElection.candidatesCount = 0;
        electionInProgress = true;
    }

    function addCandidate(string memory _name, string memory _gender, string memory _party) public onlyAdmin electionActive {
        uint256 candidateId = currentElection.candidatesCount;
        currentElection.candidates[candidateId] = Candidate(_name, _gender, _party, 0);
        currentElection.candidatesCount++;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory candidatesList = new Candidate[](currentElection.candidatesCount);
        for (uint256 i = 0; i < currentElection.candidatesCount; i++) {
            Candidate storage candidate = currentElection.candidates[i];
            candidatesList[i] = candidate;
        }
        return candidatesList;
    }

    function startVotingPhase() public onlyAdmin electionActive {
        // No additional logic needed, as the election is already active
    }

    function vote(uint256 candidateId, string memory voterId) public electionActive {
        require(!currentElection.hasVoted[msg.sender], "You have already voted");
        require(!currentElection.voterIds[voterId], "This voter ID has already been used");

        currentElection.candidates[candidateId].voteCount++;
        currentElection.hasVoted[msg.sender] = true;
        currentElection.voterIds[voterId] = true;
    }

    function endVotingPhase() public onlyAdmin electionActive {
        currentElection.isActive = false;
        electionInProgress = false;
    }

    function declareWinner() public view returns (string memory winnerName) {
        require(!currentElection.isActive, "Election is still ongoing");
        uint256 winningVoteCount = 0;
        uint256 winningCandidateId = 0;

        for (uint256 i = 0; i < currentElection.candidatesCount; i++) {
            if (currentElection.candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = currentElection.candidates[i].voteCount;
                winningCandidateId = i;
            }
        }

        winnerName = currentElection.candidates[winningCandidateId].name;
    }
}