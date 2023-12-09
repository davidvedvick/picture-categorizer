// Define our button, but with the use of props.theme this time
import styled from "styled-components";

export const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;

  /* Color the border and text with theme.main */
  color: ${props => props.theme.primary};
  border: 2px solid ${props => props.theme.main};
`;