import React from "react";
import { Tag } from "../../../../transfer";
import { TagButton } from "./TagButton";

interface PictureTagProps extends Tag {
    pictureId: number;
}

export function ReadOnlyPictureTag(props: PictureTagProps) {
    return <TagButton disabled>{props.tag}</TagButton>;
}
