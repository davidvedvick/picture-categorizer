import React from "react";
import { newPictureListModel } from "./PictureListModel";
import { cancellationToken } from "../CancellationToken";
import { PictureInformation } from "../../../transfer";
import { PictureTagList } from "./Tags/PictureTagList";
import styled from "styled-components";
import { Card, CardBody, CardTitle } from "../components/Card";
import { VisuallyHidden } from "../components/VisuallyHidden";
import { Spinner } from "../components/Spinner";
import { useInteractionState } from "../interactions/InteractionState";

const Pictures = styled.div`
    display: flex;
    flex-wrap: wrap;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    box-sizing: border-box;
`;

const PictureCard = styled(Card)`
    max-width: 400px;

    img {
        max-height: 400px;
        max-width: 100%;
        width: auto;
        height: auto;
    }
`;

interface PictureListProperties {
    initialPictureList?: PictureInformation[];
    isLoggedIn: boolean;
}

export function PictureList(props: PictureListProperties) {
    const viewModel = React.useMemo(
        () => newPictureListModel(document, props.initialPictureList),
        [props.initialPictureList],
    );
    const pictures = useInteractionState(viewModel.pictures);
    const isLoading = useInteractionState(viewModel.isLoading);

    React.useEffect(() => {
        const token = cancellationToken();
        viewModel
            .watchFromScrollState(token)
            .catch((err) => console.error("An unrecoverable error occurred watching the scroll state.", err));
        return () => token.cancel();
    }, [viewModel]);

    function updatePicture(pictureId: number) {
        viewModel
            .updatePicture(pictureId)
            .catch((err) => console.error("An unrecoverable error updating the picture.", err));
    }

    return (
        <Pictures className="pictures">
            {pictures.map((p) => (
                <PictureCard key={p.id} className="picture">
                    <a target="_blank" href={`/api/pictures/${p.id}/file`} title={p.fileName} rel="noreferrer">
                        <img
                            src={`/api/pictures/${p.id}/preview`}
                            alt={p.fileName}
                            title={p.fileName}
                            className="card-img-top"
                        />
                    </a>
                    <CardBody>
                        <CardTitle>{p.headlineTag ?? p.fileName}</CardTitle>
                        <PictureTagList
                            pictureId={p.id}
                            catEmployeeId={p.catEmployeeId}
                            onTagPromoted={() => updatePicture(p.id)}
                            onTagDeleted={() => updatePicture(p.id)}
                            onTagAdded={() => updatePicture(p.id)}
                        />
                    </CardBody>
                </PictureCard>
            ))}
            {isLoading && (
                <Spinner>
                    <VisuallyHidden>Loading...</VisuallyHidden>
                </Spinner>
            )}
        </Pictures>
    );
}
