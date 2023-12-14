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
    margin-top: 20px;
    width: 500px;
    background-color: ${(props) => props.theme.surface};

    box-sizing: border-box;

    border-color: #dee2e6;
    border-width: 1px;
    border-style: solid;
    border-radius: 0.375rem;

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid rgb(222, 226, 230);
        line-height: 1.5;
        vertical-align: center;

        > * {
            margin-bottom: 0;
        }
    }
`;

export const ModalBody = styled.div`
    padding: 1rem;
`;

export function Modal(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return (
        <Overlay>
            <ModalDialogue {...props} />
        </Overlay>
    );
}
