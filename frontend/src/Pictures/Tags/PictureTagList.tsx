import { PictureTag } from "./PictureTag";
import { NewPictureTag } from "./NewPictureTag";
import React from "react";
import { Tag } from "../../../../transfer";
import { ReadOnlyPictureTag } from "./ReadOnlyPictureTag";
import { userModel } from "../../Security/UserModel";
import styled from "styled-components";

const Styled = styled.div`
    > * {
        margin: 4px;
    }
`;

interface PictureTagListProps {
    catEmployeeId: number;
    pictureId: number;
}

export function PictureTagList(props: PictureTagListProps) {
    const { pictureId } = props;
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [isLoggedIn, setIsLoggedIn] = React.useState(userModel().isLoggedIn.value);
    const [loggedInCatEmployeeId, setLoggedInCatEmployeeId] = React.useState(userModel().catEmployeeId.value);

    async function updateTags(pictureId: number) {
        const response = await fetch(`/api/pictures/${pictureId}/tags`);
        const tags = (await response.json()) as Tag[];
        setTags(tags);
    }

    React.useEffect(() => {
        updateTags(pictureId);
    }, [pictureId]);

    React.useEffect(() => {
        const vm = userModel();
        const isLoggedInSub = vm.isLoggedIn.subscribe(setIsLoggedIn);
        const idSub = vm.catEmployeeId.subscribe(setLoggedInCatEmployeeId);

        return () => {
            isLoggedInSub.unsubscribe();
            idSub.unsubscribe();
        };
    }, []);

    return isLoggedIn && loggedInCatEmployeeId === props.catEmployeeId ? (
        <Styled>
            {tags.map((t) => (
                <PictureTag key={t.id} {...t} {...props} onTagDeleted={() => updateTags(pictureId)} />
            ))}
            <NewPictureTag {...props} onNewPictureAdded={() => updateTags(pictureId)} />
        </Styled>
    ) : (
        <Styled>
            {tags.map((t) => (
                <ReadOnlyPictureTag key={t.id} {...t} {...props} />
            ))}
        </Styled>
    );
}
