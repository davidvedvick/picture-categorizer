import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {UserLogin} from "./Users/UserLogin";
import {PictureUploads} from "./Pictures/PictureUploads";
import {PictureList} from "./Pictures/PictureList";
import {instance as auth} from "./Security/AuthorizationService";
import {PictureInformation} from "../../transfer";

function App() {

    const [isUploadDisplayed, setIsUploadDisplayed] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [initialPictures, setInitialPictures] = React.useState<PictureInformation[]>([])

    function handleUnauthenticated() {
        setIsLoggedIn(false);
    }

    async function showUploads() {
        const isLoggedIn = auth().isLoggedIn();
        setIsLoggedIn(isLoggedIn);
        setIsUploadDisplayed(true);
    }

    function handlePicturesUploaded(pictures: PictureInformation[]) {
        hideUploads();
        setInitialPictures(pictures);
    }

    function hideUploads() {
        setIsUploadDisplayed(false);
    }

    return (
        <div>
            <header>
                <nav className="navbar navbar-expand navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">
                            <img src="/cat-logo.png" alt="Logo of a Smirking Cat" />
                            Cat Pics!
                        </a>
                        <button className="btn btn-primary" onClick={showUploads}>Upload More Catpics!</button>
                    </div>
                </nav>
            </header>
            <div className="mt-3">
                <PictureList initialPictureList={initialPictures} onUnauthenticated={handleUnauthenticated} isLoggedIn={isLoggedIn} />
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
                               isLoggedIn
                                   ? <PictureUploads onUploadCompleted={handlePicturesUploaded} onUnauthenticated={handleUnauthenticated} />
                                   : <UserLogin onLoggedIn={showUploads} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
