import styled from "styled-components";
import React from "react";

const Styled = styled.div`
    border-radius: 0.375rem;
    border-width: 1px;
    border-style: solid;
    padding: 1rem;
`;

export function Alert(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return <Styled role="alert" {...props} />;
}
