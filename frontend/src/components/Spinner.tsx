import styled from "styled-components";
import React from "react";

const Styled = styled.div`
    @keyframes spinner-border {
        to {
            transform: rotate(360deg);
        }
    }

    box-sizing: border-box;

    display: inline-block;
    width: 2rem;
    height: 2rem;
    vertical-align: -0.125em;
    border-radius: 50%;
    animation: 0.75s linear infinite spinner-border;

    color: ${(props) => props.theme.primary};
    border: 0.25em solid currentcolor;
    border-right-color: transparent;

    margin-left: auto;
    margin-right: auto;

    line-height: 24px;
`;

export function Spinner(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return <Styled role="status" {...props} />;
}
