import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {UserLogin} from "./Users/UserLogin";
import {PictureUploads} from "./Pictures/PictureUploads";
import {PictureList} from "./Pictures/PictureList";
import {PictureInformation} from "../../transfer";
import {userModel} from "./Security/UserModel";

function App() {

    const [isUploadDisplayed, setIsUploadDisplayed] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(userModel().isLoggedIn.value);
    const [initialPictures, setInitialPictures] = React.useState<PictureInformation[]>([]);

    async function showUploads() {
        setIsUploadDisplayed(true);
    }

    function handlePicturesUploaded(pictures: PictureInformation[]) {
        hideUploads();
        setInitialPictures(pictures);
    }

    function hideUploads() {
        setIsUploadDisplayed(false);
    }

    React.useEffect(() => {
        const vm = userModel();
        const isLoggedInSub = vm.isLoggedIn.subscribe(setIsLoggedIn);

        return () => isLoggedInSub.unsubscribe();
    }, []);

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
                <PictureList initialPictureList={initialPictures} isLoggedIn={isLoggedIn} />
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
                                    ? <PictureUploads onUploadCompleted={handlePicturesUploaded} />
                                    : <UserLogin />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
