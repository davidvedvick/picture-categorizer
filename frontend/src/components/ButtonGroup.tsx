import styled from "styled-components";

export const ButtonGroup = styled.div`
    cursor: pointer;

    display: inline-flex;
    justify-content: space-between;
    align-items: center;

    > {
        flex: 1 1 auto;
        position: relative;
    }

    > button:is(:first-of-type:not(:last-of-type)) {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
    }

    > button:is(:last-of-type:not(:first-of-type)) {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }
`;

export const VerticalButtonGroup = styled.div`
    cursor: pointer;

    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    > {
        flex: 1 1 auto;
        position: relative;
    }

    > button:is(:first-of-type:not(:last-of-type)) {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    > button:is(:last-of-type:not(:first-of-type)) {
        border-top-right-radius: 0;
        border-top-left-radius: 0;
    }
`;

// export function ButtonGroup(props:  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
//     return <ButtonGroupContainer {...props} />
// }
