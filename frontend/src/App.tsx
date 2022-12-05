import React from 'react';
import './App.css';
import {UserLogin} from "./Users/UserLogin";
import {PictureUploads} from "./Pictures/PictureUploads";
import {PictureList} from "./Pictures/PictureList";

function App() {

    const [isUploadDisplayed, setIsUploadDisplayed] = React.useState(false);

    function showUploads() {
        setIsUploadDisplayed(true);
    }

    function hideUploads() {
        setIsUploadDisplayed(false);
    }

    const authHeader = localStorage.getItem("auth")

    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">Cat Pics!</a>
                </div>
            </nav>
            <div className="container mt-3">
                <div className="row">
                    <div className="col-md-8">
                        <PictureList />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary" onClick={showUploads}>Upload More Catpics!</button>
                    </div>
                </div>
            </div>
            <div className={`modal fade ${isUploadDisplayed && "show"}`} id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden={!isUploadDisplayed} aria-modal={isUploadDisplayed}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Upload Cat Pics!</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={hideUploads} />
                        </div>
                        <div className="modal-body">
                            {
                                authHeader ? <PictureUploads /> : <UserLogin />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
