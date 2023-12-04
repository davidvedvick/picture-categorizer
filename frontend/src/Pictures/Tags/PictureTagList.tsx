import {PictureTag} from "./PictureTag";
import {NewPictureTag} from "./NewPictureTag";
import React from "react";
import {Tag} from "../../../../transfer";
import {ReadOnlyPictureTag} from "./ReadOnlyPictureTag";

interface PictureTagListProps {
    pictureId: number;
    isLoggedIn: boolean;
    onUnauthenticated: () => void;
}

export function PictureTagList(props: PictureTagListProps) {
    const {pictureId} = props;
    const [tags, setTags] = React.useState<Tag[]>([]);

    async function updateTags(pictureId: number) {
        const response = await fetch(`/api/pictures/${pictureId}/tags`);
        const tags = await response.json() as Tag[];
        setTags(tags);
    }

    React.useEffect(() => {
        updateTags(pictureId);
    }, [pictureId]);

    return props.isLoggedIn
        ? <div>
            {tags.map(t => (<PictureTag {...t} {...props} onTagDeleted={() => updateTags(pictureId)} />))}
            <NewPictureTag {...props} onNewPictureAdded={() => updateTags(pictureId)} />
        </div>
        : <div>
            {tags.map(t => (<ReadOnlyPictureTag {...t} {...props} />))}
        </div>;
}