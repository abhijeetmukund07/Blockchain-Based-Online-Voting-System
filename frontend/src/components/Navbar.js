import React ,{useEffect} from 'react'
import { Link ,useLocation } from "react-router-dom";
function Navbar() {
    const location = useLocation();
  useEffect(() => {
    console.log(location.pathname)
  }, [location]);
  return (
    
    <div>
        <nav className="navbar navsLogin navbar-expand-lg bg-body-tertiary " style={{position:"fixed",width:"100%"}}>
    <div className="container-fluid">
    <Link className="navbar-brand navVote" to="/">
    VoteVerse
    </Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
         
      </ul>
      <form className="d-flex navs" role="search">
        <Link to='/'  className={` ${location.pathname==='/' ? "locActive" : ""}`}> Home </Link>
        <Link to='/about' className={` ${location.pathname==='/about' ? "locActive" : ""}`}> About </Link>
        <hr className="hr" />
       <Link to='/login' >  <button className="btn btn-outline-danger"  type="submit">Login <i class="fa-solid fa-user"></i></button> </Link>
       <Link to='/register' >  <button className="btn btn-outline-danger"  type="submit">Register <i class="fa-solid fa-user"></i></button> </Link>
      </form>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar
