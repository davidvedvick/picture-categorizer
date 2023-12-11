import React from "react";
import { Tag } from "../../../../transfer";
import { fetchAuthenticated } from "../../Security/UserModel";
import { ButtonGroup } from "../../components/ButtonGroup";
import { Button } from "../../components/Button";
import styled from "styled-components";

const DropdownButton = styled(Button)`
    &::after {
        border-top: 0.3em solid;
        border-right: 0.3em solid transparent;
        border-bottom: 0;
        border-left: 0.3em solid transparent;

        display: inline-block;
        margin-left: $caret-spacing;
        vertical-align: 0.255em;
        content: "";
    }
`;

interface PictureTagProps extends Tag {
    pictureId: number;
    onTagDeleted: () => void;
}

export function PictureTag(props: PictureTagProps) {
    const [isShowing, setIsShowing] = React.useState(false);

    async function deleteTag() {
        const response = await fetchAuthenticated(`/api/pictures/${props.pictureId}/tags/${props.id}`, {
            method: "delete",
        });

        if (response.ok) props.onTagDeleted();
    }

    return (
        <ButtonGroup>
            <Button>{props.tag}</Button>
            <DropdownButton onClick={() => setIsShowing((prevState) => !prevState)} aria-expanded={isShowing}>
                <span style={{ display: "none" }}>Toggle Dropdown</span>
            </DropdownButton>
            {isShowing && (
                <ul>
                    <li>
                        <button className="dropdown-item" onClick={deleteTag}>
                            Delete
                        </button>
                    </li>
                </ul>
            )}
        </ButtonGroup>
    );
}
