import styled from "styled-components";

export const Card = styled.div`
    background-color: #f7f7f7;
    padding: 20px 25px 30px;
    margin: 50px auto 25px;

    border-color: rgba(0, 0, 0, 0.175);
    border-radius: 2px;
    border-width: 1px;
    border-style: solid;

    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;

    position: relative;
    display: flex;
    flex-direction: column;
`;

export const CardTitle = styled.h5`
    margin-bottom: 0.5rem;
`;

export const CardBody = styled.div`
    flex: 1 1 auto;
    padding: 1rem;
`;
