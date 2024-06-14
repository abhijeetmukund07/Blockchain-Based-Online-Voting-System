import React from "react";
import user from "../images/user.JPG";
import Navbar from "./Navbar";
import Foot from "./foot";

function Index() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="text-center">
                <img src={user} alt="User" className="img-fluid rounded-circle mb-4" style={{ width: "150px" }} />
                <h2>RIKHIL</h2>
                <h5 className="text-muted">Student</h5>
                <p className="text-muted">
                  A B-tech Student with a passion for web development. Experienced in building scalable web applications using
                  technologies like React, Node.js, and MongoDB. Always eager to learn and explore new technologies.
                </p>
                <div className="mt-4">
                  <a href="https://github.com/DeityofDeath" className="btn btn-primary" style={{ marginRight: "10px" }} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                  <a href="www.linkedin.com/in/rikhil-rao-janagama-047972284" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Foot />
    </div>
  );
}

export default Index;
