import {PictureTag} from "./PictureTag";
import {NewPictureTag} from "./NewPictureTag";
import React from "react";
import {Tag} from "../../../../transfer";

interface PictureTagListProps {
    pictureId: number;
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

    return <div>
        {tags.map(t => (<PictureTag {...t} {...props} onTagDeleted={() => updateTags(pictureId)} />))}
        <NewPictureTag {...props} onNewPictureAdded={() => updateTags(pictureId)} />
    </div>;
}