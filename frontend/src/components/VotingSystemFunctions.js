import { ethers } from 'ethers';
import { contractAbi, contractAddress } from './Constant/constant';

// Function to request the user's Ethereum accounts
async function requestAccount() {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } else {
    console.error("Metamask is not detected in the browser");
  }
}

// Function to get a provider
function getProvider() {
  return new ethers.providers.Web3Provider(window.ethereum);
}

// Function to get a signer
function getSigner() {
  const provider = getProvider();
  return provider.getSigner();
}

// Function to create a contract instance
function getContractInstance() {
  const signer = getSigner();
  return new ethers.Contract(contractAddress, contractAbi, signer);
}

// Function to start a new election
async function startNewElection(electionName) {
  const contract = getContractInstance();
  const tx = await contract.startNewElection(electionName);
  await tx.wait();
}

// Function to add a candidate
async function addCandidate(name, gender, party) {
  const contract = getContractInstance();
  const tx = await contract.addCandidate(name, gender, party);
  await tx.wait();
}

// Function to get the list of candidates
async function getCandidates() {
  const contract = getContractInstance();
  const candidatesList = await contract.getCandidates();
  return candidatesList.map((candidate, index) => ({
    index,
    name: candidate.name,
    gender: candidate.gender,
    party: candidate.party,
    voteCount: candidate.voteCount.toNumber()
  }));
}

// Function to start the voting phase
async function startVotingPhase() {
  const contract = getContractInstance();
  const tx = await contract.startVotingPhase();
  await tx.wait();
}

// Function to vote for a candidate
async function vote(candidateId, voterId) {
  const contract = getContractInstance();
  const tx = await contract.vote(candidateId, voterId);
  await tx.wait();
}

// Function to end the voting phase
async function endVotingPhase() {
  const contract = getContractInstance();
  const tx = await contract.endVotingPhase();
  await tx.wait();
}

// Function to declare the winner
async function declareWinner() {
  const contract = getContractInstance();
  const winnerName = await contract.declareWinner();
  return winnerName;
}

// Function to check if the user can vote
async function canVote() {
  const signer = getSigner();
  const contract = getContractInstance();
  const voteStatus = await contract.voters(await signer.getAddress());
  return voteStatus;
}

// Function to get the current voting status
async function getCurrentStatus() {
  const contract = getContractInstance();
  const status = await contract.getVotingStatus();
  return status;
}

// Function to get the remaining voting time
async function getRemainingTime() {
  const contract = getContractInstance();
  const time = await contract.getRemainingTime();
  return parseInt(time, 16);
}

// Function to handle account changes
function handleAccountsChanged(accounts, setAccount, canVote) {
  if (accounts.length > 0) {
    setAccount(accounts[0]);
    canVote();
  } else {
    setAccount(null);
  }
}

// Function to connect to Metamask
async function connectToMetamask(setProvider, setAccount, setIsConnected, canVote) {
  try {
    await requestAccount();
    const provider = getProvider();
    setProvider(provider);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
    setIsConnected(true);
    canVote();
  } catch (err) {
    console.error(err);
  }
}

// Exporting all functions
export {
  requestAccount,
  getProvider,
  getSigner,
  getContractInstance,
  startNewElection,
  addCandidate,
  getCandidates,
  startVotingPhase,
  vote,
  endVotingPhase,
  declareWinner,
  canVote,
  getCurrentStatus,
  getRemainingTime,
  handleAccountsChanged,
  connectToMetamask
};
