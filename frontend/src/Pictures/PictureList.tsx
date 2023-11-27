import React from "react";
import {newPictureListModel} from "./PictureListModel";
import {cancellationToken} from "../CancellationToken";
import {PictureInformation} from "../../../transfer";

interface PictureListProperties {
    initialPictureList?: PictureInformation[]
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
                    <img src={`/api/pictures/${p.id}/file`} alt={p.fileName} title={p.fileName} className="card-img-top"/>
                    <div className="card-body">
                        <h5 className="card-title">{p.fileName}</h5>
                    </div>
                </div>
            ))}
            {isLoading && <div className="spinner-border text-center" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>}
        </div>
    );
}
