// Define our button, but with the use of props.theme this time
import styled from "styled-components";

export const Button = styled.button`
    font-size: 1rem;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;

    /* Color the border and text with theme.main */
    color: ${(props) => props.theme.onPrimary};
    background-color: ${(props) => props.theme.primary};
    border: 1px solid ${(props) => props.theme.primary};

    cursor: pointer;

    :hover {
        background-color: ${(props) => props.theme.primaryDeciding};
        border: 1px solid ${(props) => props.theme.primaryDeciding};
    }
`;
