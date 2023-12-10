import React from "react";
import "./App.css";
import { UserLogin } from "./Users/UserLogin";
import { PictureUploads } from "./Pictures/PictureUploads";
import { PictureList } from "./Pictures/PictureList";
import { PictureInformation } from "../../transfer";
import { userModel } from "./Security/UserModel";
import styled, { ThemeProvider } from "styled-components";
import { Button } from "./components/Button";
import { NavBar } from "./components/NavBar";
import { Header } from "./components/Header";

const theme = {
    surface: "white",
    onSurface: "rgba(0, 0, 0, .9)",
    primary: "salmon",
    onPrimary: "white",
    primaryDeciding: "lightsalmon",
    brand: "teal",
    onBrand: "rgba(0, 0, 0, .9)",
};

const Root = styled.div`
    text-align: start;

    a {
        text-decoration: none;
        color: ${(props) => props.theme.onSurface};
    }
`;

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
        <ThemeProvider theme={theme}>
            <Root>
                <Header>
                    <NavBar>
                        <a className="navbar-brand" href="/">
                            <img src="/cat-logo.png" alt="Logo of a Smirking Cat" />
                            Cat Pics!
                        </a>
                        <Button onClick={showUploads}>Upload More Catpics!</Button>
                    </NavBar>
                </Header>
                <div className="mt-3">
                    <PictureList initialPictureList={initialPictures} isLoggedIn={isLoggedIn} />
                </div>
                <div
                    className={`modal fade ${isUploadDisplayed && "show"}`}
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden={!isUploadDisplayed}
                    aria-modal={isUploadDisplayed}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Upload Cat Pics!
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={hideUploads}
                                />
                            </div>
                            <div className="modal-body">
                                {isLoggedIn ? (
                                    <PictureUploads onUploadCompleted={handlePicturesUploaded} />
                                ) : (
                                    <UserLogin />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Root>
        </ThemeProvider>
    );
}

export default App;
