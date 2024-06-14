import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminNav() {
    const location = useLocation();

    const handleLogout = () => {
        toast.success('Logged Out Successfully', {
            position: 'top-center',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
        setTimeout(() => {
            window.location.href = window.location.origin;
        }, 500);
    };

    return (
        <nav className="navbar navsLogin navbar-expand-lg bg-body-tertiary " style={{ position: 'fixed', width: '100%' }}>
            <div className="container-fluid">
                <Link className="navbar-brand navVote" to="/">
                    VoteVerse
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                    <form className="d-flex navs" role="search">
                        <Link to="/admin-home" className={`nav-link text-dark ${location.pathname === '/admin-home' ? 'locActive' : ''}`}>
                            Home
                        </Link>
                        <Link to="/Admin/Election" className={`nav-link text-dark ${location.pathname === '/Admin/Election' ? 'locActive' : ''}`}>
                            Elections
                        </Link>
                        <Link to="/Admin/VoterList" className={`nav-link text-dark ${location.pathname === '/Admin/VoterList' ? 'locActive' : ''}`}>
                            Voters
                        </Link>
                        <Link to="/Admin/Results" className={`nav-link text-dark ${location.pathname === '/Admin/Results' ? 'locActive' : ''}`}>
                            Results
                        </Link>
                        <hr className="hr" />
                        <Link to='#' >  <button onClick={handleLogout} className="btn btn-outline-danger" type="button">Sign Out<i class="fa-solid fa-user"></i></button> </Link>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default AdminNav;
