import React, {useEffect} from "react";
import {Picture} from "./Picture";
import {Page} from "../Page";

const pageSize = 20;

export function PictureList() {

    const pageNumberRef = React.useRef(0)
    const [pictures, setItemPictures] = React.useState<Picture[]>([]);

    function loadingThreshold() {
        const fifthLastNote = document.querySelector('div.pictures div.picture:nth-last-child(5)');
        if (!fifthLastNote) return -1;

        const rect = fifthLastNote.getBoundingClientRect();
        return rect.top + window.scrollY;
    }

    async function loadMorePicturesIfNecessary() {
        if (window.scrollY < loadingThreshold()) return;

        window.removeEventListener('scroll', loadMorePicturesIfNecessary);

        let isFinished = false;
        try {
            const response = await fetch(`/api/pictures?sort=id,desc&page=${pageNumberRef.current}&size=${pageSize}`);
            if (response.ok) {
                const page = await response.json() as Page<Picture>;
                setItemPictures(prev => prev.concat(page.content));
                pageNumberRef.current += 1;
                isFinished = page.last;
            }
        } catch (error) {
            console.error("There was an error getting item pictures", error);
        } finally {
            if (!isFinished)
                window.addEventListener('scroll', loadMorePicturesIfNecessary);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', loadMorePicturesIfNecessary);
        loadMorePicturesIfNecessary();
        return () => window.removeEventListener('scroll', loadMorePicturesIfNecessary);
    }, [])

    return (
        <div className="pictures">
            {pictures.map(p => (
                <div className="picture card">
                    <img src={`/api/pictures/${p.id}/file`} alt={p.fileName} title={p.fileName} className="card-img-top"/>
                    <div className="card-body">
                        <h5 className="card-title">{p.fileName}</h5>
                    </div>
                </div>
            ))}
        </div>
    );
}