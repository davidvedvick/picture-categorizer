import React from 'react';
import './App.css';
import {UserLogin} from "./Users/UserLogin";
import {BrowserRouter as Router, NavLink, Route, Routes} from "react-router-dom";
import {PictureUploads} from "./Pictures/PictureUploads";
import {PictureGallery} from "./Pictures/PictureGallery";

function App() {
    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">Cat Pics!</a>
                </div>
            </nav>
            <div className="container mt-3">
                <PictureGallery />
            </div>
        </div>
    )

    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <div className="container-fluid">
                        <NavLink className="navbar-brand" to="/">Cat Pics!</NavLink>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <NavLink className="navbar-brand nav-link" to="/">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/pictures">Browse Pictures</NavLink>
                                </li>
                                <li>
                                    <NavLink className="nav-link" to="/user">User Management</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>


                <div className="container mt-3">
                    <Routes>
                        <Route path="/" />
                        <Route path="/pictures" element={<PictureUploads />} />
                        <Route path="/user" element={<UserLogin/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
