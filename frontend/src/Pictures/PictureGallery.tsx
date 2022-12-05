import React, {useEffect} from "react";
import {Picture} from "./Picture";
import {Page} from "../Page";
import {PictureUploads} from "./PictureUploads";

export function PictureGallery() {
    const pageSize = 20;

    const [itemCount, setItemCount] = React.useState(0);
    const [isUploadDisplayed, setIsUploadDisplayed] = React.useState(false);

    const [pictures, setItemPictures] = React.useState<Picture[]>([]);

    function showUploads() {
        setIsUploadDisplayed(true);
    }

    function hideUploads() {
        setIsUploadDisplayed(false);
    }

    async function loadPictures(page: number = 0) {
        const response = await fetch(`/api/pictures?sort=id,desc&page=${page}&size=${pageSize}`);
        if (response.ok) {
            const page = await response.json() as Page<Picture>;
            setItemPictures(pictures.concat(page.content));
        }
    }

    useEffect(() => {
        loadPictures(0);
    }, [])

    return (
        <>
            <div className="row">
                <div className="col-md-8 pictures">
                    {pictures.map(p => (
                        <div className="card">
                            <img src={`/api/pictures/${p.id}/file`} alt={p.fileName} title={p.fileName} className="card-img-top"/>
                            <div className="card-body">
                                <h5 className="card-title">{p.fileName}</h5>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary" onClick={showUploads}>Upload More Catpics!</button>
                </div>
            </div>

            <div className={`modal fade ${isUploadDisplayed && "show"}`} id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden={!isUploadDisplayed} aria-modal={isUploadDisplayed}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={hideUploads} />
                        </div>
                        <div className="modal-body">
                            <PictureUploads />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}