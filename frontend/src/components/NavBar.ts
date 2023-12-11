import styled from "styled-components";

export const NavBar = styled.nav`
    background-color: ${(props) => props.theme.brand};

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
