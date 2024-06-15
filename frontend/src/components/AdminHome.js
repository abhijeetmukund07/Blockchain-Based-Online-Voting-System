import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Web3Provider } from "@ethersproject/providers";
import AdminNav from "./AdminNav";
import Foot from "./foot";
import "./AdminHome.css";

function AdminHome() {
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const [votersCount, setVotersCount] = useState(0);
  const [votedCount, setVotedCount] = useState(0);
  const [eleCount, setElectionsCount] = useState(0);
  const [adminUsername, setAdminUsername] = useState("Rikhil");
  const [account, setAccount] = useState("");

  useEffect(() => {
    axios
      .get("/admin-api/count")
      .then((response) => {
        setVotersCount(response.data.voterCount);
      })
      .catch((error) => {
        console.error("Error fetching voter count:", error);
      });

    axios
      .get("/admin-api/votedcount")
      .then((response) => {
        setVotedCount(response.data.votedCount);
      })
      .catch((error) => {
        console.error("Error fetching voted count:", error);
      });

    axios
      .get("/admin-api/electionsCount")
      .then((response) => {
        setElectionsCount(response.data.electionsCount);
      })
      .catch((error) => {
        console.error("Error fetching elections count:", error);
      });

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      console.log("Account changed to:", accounts[0]);
    } else {
      setAccount("");
    }
  };

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const provider = new Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        handleAccountsChanged(accounts);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
  };

  return (
    <>
      <AdminNav />
      <div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
      <div className="adminHomeContainer">
        <div className="container">
          <h1 className="text-center mb-4">Welcome, {adminUsername}!</h1>
          <div className="row">
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Voter Count and Status</h5>
                  <p className="card-text">Total Number of Voters: {votersCount}</p>
                  <p className="card-text">Voters who have Voted: {votedCount}</p>
                  <p className="card-text">Voters who have Not Voted: {votersCount - votedCount}</p>
                </div>
                <div className="card-footer text-center">
                  <Link to={`/Admin/VoterList`} className="btn btn-warning">
                    View Voter List
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Add Elections</h5>
                  <p className="card-text">Total Number of Elections: {eleCount}</p>
                </div>
                <div className="card-footer text-center">
                  <Link to={`/Admin/Election`} className="btn btn-warning">
                    Manage Elections
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">See and Post Results</h5>
                  <p className="card-text">Total Number of Results(ongoing): 1</p>
                </div>
                <div className="card-footer text-center">
                  <Link to={`/Admin/Results`} className="btn btn-warning">
                    Manage Results
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button onClick={connectToMetaMask} className="btn btn-primary">
              {account ? `Connected: ${account}` : "Connect to MetaMask"}
            </button>
          </div>
        </div>
      </div>
      <Foot />
    </>
  );
}

export default AdminHome;
