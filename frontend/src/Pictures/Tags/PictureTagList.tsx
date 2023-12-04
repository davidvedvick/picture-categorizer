import {PictureTag} from "./PictureTag";
import {NewPictureTag} from "./NewPictureTag";
import React from "react";
import {Tag} from "../../../../transfer";
import {instance as auth} from "../../Security/AuthorizationService";
import {ReadOnlyPictureTag} from "./ReadOnlyPictureTag";

interface PictureTagListProps {
    pictureId: number;
    onUnauthenticated: () => void;
}

export function PictureTagList(props: PictureTagListProps) {
    const {pictureId} = props;
    const [tags, setTags] = React.useState<Tag[]>([]);
    const isLoggedIn = auth().getUserToken();

    async function updateTags(pictureId: number) {
        const response = await fetch(`/api/pictures/${pictureId}/tags`);
        const tags = await response.json() as Tag[];
        setTags(tags);
    }

    React.useEffect(() => {
        updateTags(pictureId);
    }, [pictureId]);

    return isLoggedIn
        ? <div>
            {tags.map(t => (<PictureTag {...t} {...props} onTagDeleted={() => updateTags(pictureId)} />))}
            <NewPictureTag {...props} onNewPictureAdded={() => updateTags(pictureId)} />
        </div>
        : <div>
            {tags.map(t => (<ReadOnlyPictureTag {...t} {...props} />))}
        </div>;
}