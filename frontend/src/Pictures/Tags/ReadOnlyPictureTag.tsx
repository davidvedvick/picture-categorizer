import React from "react";
import {Tag} from "../../../../transfer";

interface PictureTagProps extends Tag {
    pictureId: number;
}

export function ReadOnlyPictureTag(props: PictureTagProps) {
    return <button type="button" className="btn btn-primary disabled tag">{props.tag}</button>;
}