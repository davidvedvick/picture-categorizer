import React from "react";
import {instance as auth} from "../../Security/AuthorizationService";

interface PictureTagProps {
    pictureId: number;
    onNewPictureAdded: () => void;
    onUnauthenticated: () => void;
}

export function NewPictureTag(props: PictureTagProps) {
    const [isEditing, setIsEditing] = React.useState(false);

    async function addNewTag(tag: string) {
        const jwtToken = auth().getUserToken();
        if (!jwtToken) return;

        const response = await fetch(`/api/pictures/${props.pictureId}/tags`, {
            method: "post",
            headers: {
                Authorization: `Bearer ${jwtToken.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tag: tag,
            }),
        });

        if (response.ok) {
            props.onNewPictureAdded();
            return;
        }

        if (response.status === 401) {
            props.onUnauthenticated();
        }
    }

    return <button
        type="button"
        className="btn btn-primary tag"
        contentEditable={isEditing}
        onClick={() => setIsEditing(true)}
        onKeyUp={async (e) => {
            if (e.key === "Escape")
                setIsEditing(false);
            if (e.key === "Enter") {
                const newTag = e.currentTarget.textContent;
                if (newTag && newTag !== "")
                   await addNewTag(newTag);
                setIsEditing(false);
            }
        }}
    >
        {!isEditing ? "New Tag" : ""}
    </button>;
}