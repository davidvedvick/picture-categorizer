import styled from "styled-components";

export const ButtonGroup = styled.div`
    font-size: 1rem;

    cursor: pointer;

    display: inline-flex;
    justify-content: space-between;
    align-items: center;

    > button {
        flex: 1 1 auto;
        position: relative;
    }

    > button:not(:last-child) {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
    }

    > button:last-child {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }
`;

// export function ButtonGroup(props:  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
//     return <ButtonGroupContainer {...props} />
// }
