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
import { Modal } from "./components/Modal";

const theme = {
    surface: "white",
    onSurface: "rgba(0, 0, 0, .9)",
    primary: "salmon",
    onPrimary: "white",
    primaryDeciding: "lightsalmon",
    primaryDecided: "darksalmon",
    brand: "teal",
    onBrand: "rgba(0, 0, 0, .9)",
};

const Root = styled.div`
    text-align: start;
    font-size: 1.25rem;

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
                        <a href="/">
                            <img src="/cat-logo.png" alt="Logo of a Smirking Cat" />
                            Cat Pics!
                        </a>
                        <Button onClick={showUploads}>Upload More Catpics!</Button>
                    </NavBar>
                </Header>
                <div className="mt-3">
                    <PictureList initialPictureList={initialPictures} isLoggedIn={isLoggedIn} />
                </div>
                {isUploadDisplayed && (
                    <Modal onClose={hideUploads}>
                        <h5>Upload Cat Pics!</h5>
                        {isLoggedIn ? <PictureUploads onUploadCompleted={handlePicturesUploaded} /> : <UserLogin />}
                    </Modal>
                )}
            </Root>
        </ThemeProvider>
    );
}

export default App;
