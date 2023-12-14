import React from "react";
import { newPictureListModel } from "./PictureListModel";
import { cancellationToken } from "../CancellationToken";
import { PictureInformation } from "../../../transfer";
import { PictureTagList } from "./Tags/PictureTagList";
import styled from "styled-components";
import { Card, CardBody, CardTitle } from "../components/Card";
import { VisuallyHidden } from "../components/VisuallyHidden";
import { Spinner } from "../components/Spinner";

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
    const [pictures, setItemPictures] = React.useState<PictureInformation[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const token = cancellationToken();
        const viewModel = newPictureListModel(document, props.initialPictureList);
        const picturesSub = viewModel.pictures.subscribe(setItemPictures);
        const isLoadingSub = viewModel.isLoading.subscribe(setIsLoading);
        viewModel
            .watchFromScrollState(token)
            .catch((err) => console.error("An unrecoverable error occurred watching the scroll state.", err));
        return () => {
            token.cancel();
            picturesSub.unsubscribe();
            isLoadingSub.unsubscribe();
        };
    }, [props.initialPictureList]);

    return (
        <Pictures>
            {pictures.map((p) => (
                <PictureCard key={p.id}>
                    <a target="_blank" href={`/api/pictures/${p.id}/file`} title={p.fileName} rel="noreferrer">
                        <img
                            src={`/api/pictures/${p.id}/preview`}
                            alt={p.fileName}
                            title={p.fileName}
                            className="card-img-top"
                        />
                    </a>
                    <CardBody>
                        <CardTitle>{p.fileName}</CardTitle>
                        <PictureTagList pictureId={p.id} catEmployeeId={p.catEmployeeId} />
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
