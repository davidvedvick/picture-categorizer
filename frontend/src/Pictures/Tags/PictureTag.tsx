import React from "react";
import { Tag } from "../../../../transfer";
import { fetchAuthenticated } from "../../Security/UserModel";
import { ButtonGroup, VerticalButtonGroup } from "../../components/ButtonGroup";
import { Button } from "../../components/Button";
import styled from "styled-components";
import { PrimaryButton } from "../../components/PrimaryButton";

const DropdownButton = styled(PrimaryButton)`
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

const ExpandoGroup = styled(ButtonGroup)`
    position: relative;
`;

const ExpandedButtons = styled(VerticalButtonGroup)`
    position: absolute;
    top: 100%;
    left: 0;
`;

interface PictureTagProps extends Tag {
    pictureId: number;
    onTagDeleted: () => void;
}

export function PictureTag(props: PictureTagProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    async function deleteTag() {
        const response = await fetchAuthenticated(`/api/pictures/${props.pictureId}/tags/${props.id}`, {
            method: "delete",
        });

        if (response.ok) props.onTagDeleted();
    }

    return (
        <ExpandoGroup>
            <PrimaryButton>{props.tag}</PrimaryButton>
            <DropdownButton onClick={() => setIsExpanded((prevState) => !prevState)} aria-expanded={isExpanded}>
                <span style={{ display: "none" }}>Toggle Dropdown</span>
            </DropdownButton>

            <ExpandedButtons>{isExpanded && <Button onClick={deleteTag}>Delete</Button>}</ExpandedButtons>
        </ExpandoGroup>
    );
}
