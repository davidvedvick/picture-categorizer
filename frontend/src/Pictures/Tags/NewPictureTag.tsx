import React from "react";
import { fetchAuthenticated } from "../../Security/UserModel";
import { Button } from "../../components/Button";

interface PictureTagProps {
    pictureId: number;
    onNewPictureAdded: () => void;
}

export function NewPictureTag(props: PictureTagProps) {
    const [isEditing, setIsEditing] = React.useState(false);

    async function addNewTag(tag: string) {
        const response = await fetchAuthenticated(`/api/pictures/${props.pictureId}/tags`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tag: tag,
            }),
        });

        if (response.ok) {
            props.onNewPictureAdded();
        }
    }

    return (
        <Button
            contentEditable={isEditing}
            onClick={() => setIsEditing(true)}
            onKeyUp={async (e) => {
                if (e.key === "Escape") setIsEditing(false);
                if (e.key === "Enter") {
                    const newTag = e.currentTarget.textContent;
                    if (newTag && newTag !== "") await addNewTag(newTag);
                    setIsEditing(false);
                }
            }}
        >
            {!isEditing ? "New Tag" : ""}
        </Button>
    );
}
