import styled from "styled-components";

export const VisuallyHidden = styled.span`
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;

    &:not(caption) {
        position: absolute !important;
    }
`;
