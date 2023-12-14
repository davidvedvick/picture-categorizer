import styled from "styled-components";

export const NavBar = styled.nav`
    background-color: ${(props) => props.theme.brand};

    font-size: 1.25rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0.75rem;
    color: ${(props) => props.theme.onBrand};

    a {
        display: flex;
        justify-content: start;
        align-items: center;
    }
`;
