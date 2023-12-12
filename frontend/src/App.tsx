import React from "react";
import "./App.css";
import { UserLogin } from "./Users/UserLogin";
import { PictureUploads } from "./Pictures/PictureUploads";
import { PictureList } from "./Pictures/PictureList";
import { PictureInformation } from "../../transfer";
import { userModel } from "./Security/UserModel";
import styled, { ThemeProvider } from "styled-components";
import { NavBar } from "./components/NavBar";
import { Header } from "./components/Header";
import { Modal } from "./components/Modal";
import { PrimaryButton } from "./components/PrimaryButton";

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

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-weight: 500;
        line-height: 1.2;
        margin-top: 0;
        margin-bottom: 0.5rem;
    }

    h1 {
        font-size: 2.5rem;
    }

    h2 {
        font-size: 2rem;
    }

    h3 {
        font-size: 1.75rem;
    }

    h4 {
        font-size: 1.5rem;
    }

    h5 {
        font-size: 1.25rem;
    }

    h6 {
        font-size: 1rem;
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
                        <PrimaryButton onClick={showUploads}>Upload More Catpics!</PrimaryButton>
                    </NavBar>
                </Header>
                <PictureList initialPictureList={initialPictures} isLoggedIn={isLoggedIn} />
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
