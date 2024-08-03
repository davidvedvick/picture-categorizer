import { PictureTag } from "./PictureTag";
import { NewPictureTag } from "./NewPictureTag";
import React from "react";
import { Tag } from "../../../../transfer";
import { ReadOnlyPictureTag } from "./ReadOnlyPictureTag";
import { userModel } from "../../Security/UserModel";
import styled from "styled-components";
import { useInteractionState } from "../../interactions/InteractionState";

const Styled = styled.div`
    > * {
        margin: 4px;
    }
`;

interface PictureTagListProps {
    catEmployeeId: number;
    pictureId: number;
    onTagPromoted: () => void;
}

export function PictureTagList(props: PictureTagListProps) {
    const { pictureId } = props;
    const [tags, setTags] = React.useState<Tag[]>([]);
    const isLoggedIn = useInteractionState(userModel().isLoggedIn);
    const loggedInCatEmployeeId = useInteractionState(userModel().catEmployeeId);

    function updateTags(pictureId: number) {
        async function asyncUpdate() {
            const response = await fetch(`/api/pictures/${pictureId}/tags`);
            const tags = (await response.json()) as Tag[];
            setTags(tags);
        }

        asyncUpdate().catch(console.error);
    }

    React.useEffect(() => {
        updateTags(pictureId);
    }, [pictureId]);

    return isLoggedIn && loggedInCatEmployeeId === props.catEmployeeId ? (
        <Styled>
            {tags.map((t) => (
                <PictureTag
                    key={t.id}
                    {...t}
                    pictureId={pictureId}
                    onTagPromoted={() => {
                        updateTags(pictureId);
                        props.onTagPromoted();
                    }}
                    onTagDeleted={() => updateTags(pictureId)}
                />
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
