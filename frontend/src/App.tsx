import React from "react";
import { UserLogin } from "./Users/UserLogin";
import { PictureUploads } from "./Pictures/PictureUploads";
import { PictureList } from "./Pictures/PictureList";
import { PictureInformation } from "../../transfer";
import { userModel } from "./Security/UserModel";
import styled, { ThemeProvider } from "styled-components";
import { NavBar } from "./components/NavBar";
import { Header } from "./components/Header";
import { Modal, ModalBody } from "./components/Modal";
import { PrimaryButton } from "./components/PrimaryButton";
import { CloseButton } from "./components/CloseButton";

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
    font-family:
        system-ui,
        -apple-system,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        "Noto Sans",
        "Liberation Sans",
        Arial,
        sans-serif,
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji";

    text-align: start;
    font-size: 1rem;

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

    p {
        margin-bottom: 1rem;
    }

    div {
        margin-bottom: 1rem !important;
    }

    label {
        margin-bottom: 0.5rem;
        box-sizing: border-box;
        display: inline-block;
    }

    input {
        margin: 0;
        border-radius: 0.375rem;
        padding: 0.375rem 0.75rem;
        border: 1px solid #ced4da;
        font-size: 1rem;
        box-sizing: border-box;
    }

    input[type="file"] {
        width: 100%;

        &::file-selector-button {
            margin: -0.375rem -0.75rem;
            margin-inline-end: 0.75rem;
            border: 0 solid;
            padding: 0.375rem 0.75rem;
        }
    }
`;

const Logo = styled.img`
    max-height: 48px;
    padding-left: 8px;
    padding-right: 8px;
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
                            <Logo src="/cat-logo.png" alt="Logo of a Smirking Cat" />
                            Cat Pics!
                        </a>
                        <PrimaryButton onClick={showUploads}>Upload More Catpics!</PrimaryButton>
                    </NavBar>
                </Header>
                <PictureList initialPictureList={initialPictures} isLoggedIn={isLoggedIn} />
                {isUploadDisplayed && (
                    <Modal>
                        <header>
                            <h5>Upload Cat Pics!</h5>
                            <CloseButton onClick={hideUploads} />
                        </header>
                        <ModalBody>
                            {isLoggedIn ? <PictureUploads onUploadCompleted={handlePicturesUploaded} /> : <UserLogin />}
                        </ModalBody>
                    </Modal>
                )}
            </Root>
        </ThemeProvider>
    );
}

export default App;
