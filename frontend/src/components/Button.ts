// Define our button, but with the use of props.theme this time
import styled from "styled-components";

export const Button = styled.button`
    font-size: 1rem;
    line-height: 24px;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;

    border-width: 1px;
    border-style: solid;

    cursor: pointer;

    transition:
        color 0.15s ease-in-out,
        background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
`;
