import React from "react";
import {Tag} from "../../../../transfer";
import {fetchAuthenticated} from "../../Security/UserModel";

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

    return <div className="btn-group tag">
        <button type="button" className="btn btn-primary">{props.tag}</button>
        <button type="button" className={`btn btn-primary dropdown-toggle dropdown-toggle-split ${isShowing && "show"}`} aria-expanded={isShowing} onClick={() => setIsShowing(prevState => !prevState)}>
            <span className="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul className={`dropdown-menu ${isShowing && "show"}`} data-popper-placement="bottom-start">
            <li><button className="dropdown-item" onClick={deleteTag}>Delete</button></li>
        </ul>
    </div>;
}