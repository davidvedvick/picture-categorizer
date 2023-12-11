import styled from "styled-components";
import React from "react";

const Overlay = styled.div`
    position: fixed;
    z-index: 1000;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
`;

const ModalDialogue = styled.div`
    position: relative;
    margin-left: auto;
    margin-right: auto;
    width: 500px;
    background-color: ${(props) => props.theme.surface};
`;

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    onClose: () => void;
}

export function Modal(props: Props) {
    return (
        <Overlay>
            <ModalDialogue {...props} />
        </Overlay>
    );
}
