import React from 'react';
// import './App.css';
import {UserLogin} from "./Users/UserLogin";
import {BrowserRouter as Router, NavLink, Route, Routes} from "react-router-dom";

function App() {
    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg bg-light">
                    <div className="container-fluid">
                        <NavLink className="navbar-brand" to="/">Cat Pics!</NavLink>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <NavLink className="navbar-brand" to="/">Home</NavLink>
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


                <hr />

                {/*
                      A <Switch> looks through all its children <Route>
                      elements and renders the first one whose path
                      matches the current URL. Use a <Switch> any time
                      you have multiple routes, but you want only one
                      of them to render at a time
                    */}
                <Routes>
                    <Route path="/">
                    </Route>
                    <Route path="/pictures">
                    </Route>
                    <Route path="/user" element={<UserLogin/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
