// Define our button, but with the use of props.theme this time
import styled from "styled-components";

export const Button = styled.button`
    font-size: 1rem;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;

    /* Color the border and text with theme.main */
    color: ${(props) => props.theme.onPrimary};
    background-color: ${(props) => props.theme.primary};

    border-width: 1px;
    border-style: solid;

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

    transition:
        color 0.15s ease-in-out,
        background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
`;
