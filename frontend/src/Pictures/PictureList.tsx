import React from "react";
import {newPictureListModel} from "./PictureListModel";
import {cancellationToken} from "../CancellationToken";
import {PictureInformation} from "../../../transfer";
import {PictureTagList} from "./Tags/PictureTagList";

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
        viewModel.watchFromScrollState(token).catch(err => console.error("An unrecoverable error occurred watching the scroll state.", err));
        return () => {
            token.cancel();
            picturesSub.unsubscribe();
            isLoadingSub.unsubscribe();
        };
    }, [props.initialPictureList]);

    return (
        <div className="pictures">
            {pictures.map(p => (
                <div key={p.id} className="picture card">
                    <a target="_blank" href={`/api/pictures/${p.id}/file`} title={p.fileName} rel="noreferrer">
                        <img src={`/api/pictures/${p.id}/preview`} alt={p.fileName} title={p.fileName} className="card-img-top"/>
                    </a>
                    <div className="card-body">
                        <h5 className="card-title">{p.fileName}</h5>
                        <PictureTagList pictureId={p.id} catEmployeeId={p.catEmployeeId} />
                    </div>
                </div>
            ))}
            {isLoading && <div className="spinner-border text-center" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>}
        </div>
    );
}
