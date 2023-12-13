import styled from "styled-components";
import React from "react";

const Styled = styled.button`
    background-color: ${(props) => props.theme.surface};
    color: ${(props) => props.theme.onSurface};
    border: none;
    padding: 0;
    cursor: pointer;
    width: 1rem;
    height: 1rem;
`;

interface Props {
    onClick: () => void;
}

export function CloseButton(props: Props) {
    return (
        <Styled onClick={props.onClick}>
            <img src="/close-button.svg" alt="Close" />
        </Styled>
    );
}
