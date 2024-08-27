import styled from "styled-components";
import React, { SVGProps } from "react";

export const StyledSvg = styled.svg`
    max-height: 1rem;
    max-width: 1rem;
    fill: ${(props) => props.theme.onPrimary};
`;

export function Icon(props: SVGProps<SVGSVGElement> & { src: string }) {
    return (
        <StyledSvg>
            <image href={props.src} />
        </StyledSvg>
    );
}
