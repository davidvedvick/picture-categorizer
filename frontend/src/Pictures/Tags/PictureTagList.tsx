import {PictureTag} from "./PictureTag";
import {NewPictureTag} from "./NewPictureTag";
import React from "react";
import {Tag} from "../../../../transfer";
import {ReadOnlyPictureTag} from "./ReadOnlyPictureTag";
import {userModel} from "../../Security/UserModel";

interface PictureTagListProps {
    pictureId: number;
}

export function PictureTagList(props: PictureTagListProps) {
    const {pictureId} = props;
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [isLoggedIn, setIsLoggedIn] = React.useState(userModel().isLoggedIn.value);

    async function updateTags(pictureId: number) {
        const response = await fetch(`/api/pictures/${pictureId}/tags`);
        const tags = await response.json() as Tag[];
        setTags(tags);
    }

    React.useEffect(() => {
        updateTags(pictureId);
    }, [pictureId]);

    React.useEffect(() => {
        const vm = userModel();
        const isLoggedInSub = vm.isLoggedIn.subscribe(setIsLoggedIn);

        return () => isLoggedInSub.unsubscribe();
    }, []);

    return isLoggedIn
        ? <div>
            {tags.map(t => (<PictureTag {...t} {...props} onTagDeleted={() => updateTags(pictureId)} />))}
            <NewPictureTag {...props} onNewPictureAdded={() => updateTags(pictureId)} />
        </div>
        : <div>
            {tags.map(t => (<ReadOnlyPictureTag {...t} {...props} />))}
        </div>;
}