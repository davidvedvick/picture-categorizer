// Define our button, but with the use of props.theme this time
import styled from "styled-components";
import { Button } from "./Button";

export const PrimaryButton = styled(Button)`
    /* Color the border and text with theme.main */
    color: ${(props) => props.theme.onPrimary};

    background-color: ${(props) => props.theme.primary};
    border-color: ${(props) => props.theme.primary};

    cursor: pointer;

    &:hover {
        background-color: ${(props) => props.theme.primaryDeciding};
        border-color: ${(props) => props.theme.primaryDeciding};
    }

    &:active {
        background-color: ${(props) => props.theme.primaryDecided};
        border-color: ${(props) => props.theme.primaryDecided};
    }

    &:disabled {
        background-color: ${(props) => props.theme.primaryDeciding};
        border-color: ${(props) => props.theme.primaryDeciding};
        cursor: auto;
    }
`;
