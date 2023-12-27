import styled from "styled-components";

export const Header = styled.header`
    background-color: ${(props) => props.theme.brand};
    color: ${(props) => props.theme.onBrand};
    padding: 0.75rem 0;
    max-height: 64px;

    &::after {
        content: "";
        display: block;
        clear: both;
    }
`;
