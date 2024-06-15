import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminNav from "./AdminNav";
import Foot from "./foot";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { startNewElection, startVotingPhase, endVotingPhase } from "./VotingSystemFunctions";

function Election() {
  const [elections, setElections] = useState([]);
  const [newElection, setNewElection] = useState({
    electionTitle: "",
    startDate: "",
    endDate: "",
    status: true, // default status is true
  });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = () => {
    axios
      .get("/admin-api/elections")
      .then((response) => {
        setElections(response.data);
      })
      .catch((error) => {
        console.error("Error fetching elections:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewElection((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await startNewElection(newElection.electionTitle);
    axios
      .post("/admin-api/addElection", newElection)
      .then((response) => {
        console.log(response.data);
        setNewElection({
          // Reset form fields
          electionTitle: "",
          startDate: "",
          endDate: "",
          status: true,
        });
        fetchElections(); // Refresh elections after adding a new one
      })
      .catch((error) => {
        console.error("Error adding election:", error);

        toast.error("Error occurred", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleStopElection = async (electionTitle) => {
    await endVotingPhase(electionTitle);
    axios
      .put(`/admin-api/stopElection/${electionTitle}`)
      .then((response) => {
        console.log(response.data);
        fetchElections(); // Refresh elections after stopping
      })
      .catch((error) => {
        console.error("Error stopping election:", error);
      });
  };

  const handleresumeElection = async (electionTitle) => {
    await startVotingPhase(electionTitle);
    axios
      .put(`/admin-api/resumeElection/${electionTitle}`)
      .then((response) => {
        console.log(response.data);
        fetchElections(); // Refresh elections after stopping
      })
      .catch((error) => {
        console.error("Error resuming election:", error);
      });
  };

  const handleDeleteElection = (electionTitle, status) => {
    if (!status) {
      axios
        .delete(`/admin-api/deleteElection/${electionTitle}`)
        .then((response) => {
          console.log(response.data);
          fetchElections(); // Refresh elections after deletion
        })
        .catch((error) => {
          console.error("Error deleting election:", error);
        });
    } else {
      console.log("Cannot delete election with active status");
    }
  };

  return (
    <>
      <AdminNav />
      <div>
        <br />
        <br />
        <br />
      </div>
      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">Elections</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {elections.length === 0 ? (
            <div className="col text-center">
              <p>No elections going on currently.</p>
            </div>
          ) : (
            elections.map((election) => (
              <div key={election.electionTitle} className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{election.electionTitle}</h5>
                    <p className="card-text">Start Date: {election.startDate}</p>
                    <p className="card-text">End Date: {election.endDate}</p>
                    <p className="card-text">Status: {election.status ? "Active" : "Inactive"}</p>
                  </div>
                  <div className="card-footer text-center">
                    <Link
                      to={`/Admin/election/${election.electionTitle}`}
                      className="btn btn-primary me-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleStopElection(election.electionTitle)}
                      className="btn btn-warning me-3"
                    >
                      Stop
                    </button>
                    <button
                      onClick={() => handleresumeElection(election.electionTitle)}
                      className="btn btn-success me-3"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => handleDeleteElection(election.electionTitle, election.status)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                    <ToastContainer
                      position="top-center"
                      autoClose={1000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="light"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="container mt-5">
        <h2 className="text-center mb-4">Add Election</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="electionTitle" className="form-label">
              Election Title:
            </label>
            <input
              type="text"
              className="form-control"
              id="electionTitle"
              name="electionTitle"
              value={newElection.electionTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">
              Start Date:
            </label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              name="startDate"
              value={newElection.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">
              End Date:
            </label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              name="endDate"
              value={newElection.endDate}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Election
          </button>
        </form>
      </div>
      <div>
        <br />
        <br />
        <br />
      </div>
      <Foot />
    </>
  );
}

export default Election;
