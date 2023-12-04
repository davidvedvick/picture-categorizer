import React from "react";
import {instance as auth} from "../../Security/AuthorizationService";

interface PictureTagProps {
    pictureId: number;
    onNewPictureAdded: () => void;
}

export function NewPictureTag(props: PictureTagProps) {
    const [isEditing, setIsEditing] = React.useState(false);

    async function addNewTag(tag: string) {
        const jwtToken = auth().getUserToken();
        if (!jwtToken) return;

        await fetch(`/api/pictures/${props.pictureId}/tags`, {
            method: "post",
            headers: {
                Authorization: `Bearer ${jwtToken.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tag: tag,
            }),
        });
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
                props.onNewPictureAdded();
            }
        }}
    >
        {!isEditing ? "New Tag" : ""}
    </button>;
}