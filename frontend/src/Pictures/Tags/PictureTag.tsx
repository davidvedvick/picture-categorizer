import React from "react";
import {Tag} from "../../../../transfer";
import {instance as auth} from "../../Security/AuthorizationService";

interface PictureTagProps extends Tag {
    pictureId: number;
    onTagDeleted: () => void;
    onUnauthenticated: () => void;
}

export function PictureTag(props: PictureTagProps) {
    const [isShowing, setIsShowing] = React.useState(false);

    async function deleteTag() {
        const jwtToken = auth().getUserToken();
        if (!jwtToken) return;

        const response = await fetch(`/api/pictures/${props.pictureId}/tags/${props.id}`, {
            method: "delete",
            headers: {
                Authorization: `Bearer ${jwtToken.token}`
            },
        });

        if (response.ok) {
            props.onTagDeleted();
            return;
        }

        if (response.status === 401) {
            props.onUnauthenticated();
        }
    }

    return <>
        <div className="btn-group tag">
            <button type="button" className="btn btn-primary">{props.tag}</button>
            <button type="button" className={`btn btn-primary dropdown-toggle dropdown-toggle-split ${isShowing && 'show'}`} aria-expanded={isShowing} onClick={() => setIsShowing(prevState => !prevState)}>
                <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className={`dropdown-menu ${isShowing && 'show'}`} data-popper-placement="bottom-start">
                <li><button className="dropdown-item" onClick={deleteTag}>Delete</button></li>
            </ul>
        </div>
    </>;
}