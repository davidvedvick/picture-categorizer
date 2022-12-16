import React, {useEffect} from "react";
import {Picture} from "./Picture";
import {Page} from "../Page";

const pageSize = 20;

interface PictureListProperties {
    initialPictureList?: Picture[]
}

export function PictureList(props: PictureListProperties) {

    const pageNumberRef = React.useRef(0);
    const loadedPictures = React.useRef(new Set());
    const [pictures, setItemPictures] = React.useState<Picture[]>([]);

    useEffect(() => {
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
                    setItemPictures(prev => prev.concat(page.content.filter(p => {
                        if (loadedPictures.current.has(p.id)) return false;
                        loadedPictures.current.add(p.id);
                        return true;
                    })));
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

        const initialPictures = props.initialPictureList;
        if (initialPictures && initialPictures.length > 0) {
            setItemPictures(initialPictures);
            pageNumberRef.current = 0;
        }

        loadMorePicturesIfNecessary();
        return () => window.removeEventListener('scroll', loadMorePicturesIfNecessary);
    }, [props.initialPictureList])

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