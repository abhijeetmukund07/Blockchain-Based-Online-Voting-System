import React from 'react'
import { Link } from "react-router-dom";
import Navbar from './Navbar';
import Foot from './foot'

function index() {
  return (
    <>
    <div className=' bg1'>
          <Navbar/>
          <div className="ctnt">
            <h1>Welcome to <span className='special' style={{color:"black",fontWeight:"bold"}}>VoteVerse</span>  </h1>
            <h1>An Online Voting System</h1>
            <p>A project done for the Completion of the MERN stack Course</p>
            <br></br>
            <Link className="signups" style={{marginTop:"25px"}} to='/login'><button >Vote Here &nbsp; <i class="fa-solid fa-computer-mouse fa-flip"></i></button></Link>
          </div>
          <div className='quote'>
        <h3> "The ballot is stronger than the bullet.”</h3>
        <p> - Abraham Lincoln</p>
        <hr />
      </div>
      <Foot />
    </div>
    </>
  )
}

export default index
