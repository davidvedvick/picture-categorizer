import React from "react";

interface PictureTagProperties {
    tag: string;
}

export function PictureTag(props: PictureTagProperties) {
    return (<>
        <span className="badge bg-primary tag">
            <span contentEditable>{props.tag}</span>
            <button type="button" className="btn-close" aria-label="Close" />
        </span>
    </>);
}