import React, { FormEvent } from "react";
import { newPictureListModel } from "./PictureListModel";
import { cancellationToken } from "../CancellationToken";
import { PictureInformation } from "../../../transfer";
import { PictureTagList } from "./Tags/PictureTagList";
import styled from "styled-components";
import { Card, CardBody, CardTitle } from "../components/Card";
import { VisuallyHidden } from "../components/VisuallyHidden";
import { Spinner } from "../components/Spinner";
import { useInteractionState } from "../interactions/InteractionState";
import { userModel } from "../Security/UserModel";
import { Anchor } from "../components/Anchor";
import { Button } from "../components/Button";
import { Modal, ModalBody } from "../components/Modal";
import { CloseButton } from "../components/CloseButton";
import { PrimaryButton } from "../components/PrimaryButton";

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

const DeleteButton = styled(Button)`
    font-size: 0.8rem;
    color: darkred;
    border: none;
    background: none;
`;

interface PictureListProperties {
    initialPictureList?: PictureInformation[];
    isLoggedIn: boolean;
}

const deleteString = "LITTERBOX";

export function PictureList(props: PictureListProperties) {
    const viewModel = React.useMemo(
        () => newPictureListModel(document, props.initialPictureList),
        [props.initialPictureList],
    );
    const pictures = useInteractionState(viewModel.pictures);
    const isLoading = useInteractionState(viewModel.isLoading);
    const isLoggedIn = useInteractionState(userModel().isLoggedIn);
    const loggedInCatEmployeeId = useInteractionState(userModel().catEmployeeId);
    const [pictureToDelete, setPictureToDelete] = React.useState<number | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = React.useState("");
    const isDeleteEnabled = React.useMemo(() => deleteConfirmation == deleteString, [deleteConfirmation]);

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

    async function deletePicture() {
        try {
            const pictureId = pictureToDelete;
            if (pictureId) await viewModel.deletePicture(pictureId);
        } finally {
            setPictureToDelete(null);
            setDeleteConfirmation("");
        }
    }

    function handleDelete(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();
        deletePicture().catch((err) => console.error("An unrecoverable error updating the picture.", err));
    }

    return (
        <>
            <Pictures className="pictures">
                {pictures.map((p) => (
                    <PictureCard key={p.id} className="picture">
                        <Anchor target="_blank" href={`/api/pictures/${p.id}/file`} title={p.fileName} rel="noreferrer">
                            <img
                                src={`/api/pictures/${p.id}/preview`}
                                alt={p.fileName}
                                title={p.fileName}
                                className="card-img-top"
                            />
                        </Anchor>
                        {isLoggedIn && loggedInCatEmployeeId === p.catEmployeeId && (
                            <DeleteButton onClick={() => setPictureToDelete(p.id)}>Delete</DeleteButton>
                        )}
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
            {pictureToDelete && (
                <Modal>
                    <header>
                        <h5>Delete Picture?!?!</h5>
                        <CloseButton onClick={() => setPictureToDelete(null)} />
                    </header>
                    <ModalBody>
                        <form onSubmit={handleDelete}>
                            <div>
                                <p>To delete this picture and its associated data, enter LITTERBOX below.</p>
                                <input
                                    type="text"
                                    placeholder="LITTERBOX"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                />
                            </div>
                            <p>
                                <PrimaryButton type="submit" disabled={!isDeleteEnabled}>
                                    DELETE!
                                </PrimaryButton>
                            </p>
                        </form>
                    </ModalBody>
                </Modal>
            )}
        </>
    );
}
