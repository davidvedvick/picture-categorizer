import React from "react";
import {Picture} from "./Picture";
import {Page} from "../Page";

const pageSize = 20;

interface PictureListProperties {
    initialPictureList?: Picture[]
}

interface PictureListState {
    isLoading: boolean,
    pictures: Picture[],
}

class UnloadedPictureListState implements PictureListState {
    isLoading = true;

    pictures = [];
}

class UpdatedPictureListState implements PictureListState {
    constructor(public isLoading: boolean = false, public pictures: Picture[] = []) {
    }
}

export class PictureList extends React.Component<PictureListProperties, PictureListState> {
    private readonly loadMorePicturesIfNecessary: () => Promise<void>;

    constructor(props: PictureListProperties) {
        super(props);

        function loadingThreshold() {
            const fifthLastNote = document.querySelector('div.pictures div.picture:nth-last-child(5)');
            if (!fifthLastNote) return -1;

            const rect = fifthLastNote.getBoundingClientRect();
            return rect.top + window.scrollY;
        }

        const loadedPictures = new Set<number>();
        let pageNumber = 0;

        const loadMorePicturesIfNecessary = async () => {
            if (window.scrollY < loadingThreshold()) return;

            window.removeEventListener('scroll', loadMorePicturesIfNecessary);

            let isFinished = false;
            this.setState(prev => new UpdatedPictureListState(true, prev?.pictures || []));
            try {
                const response = await fetch(`/api/pictures?sort=id,desc&page=${pageNumber}&size=${pageSize}`);
                if (response.ok) {
                    const page = await response.json() as Page<Picture>;
                    this.setState((prev) => new UpdatedPictureListState(prev.isLoading, prev.pictures.concat(page.content.filter(p => {
                        if (loadedPictures.has(p.id)) return false;
                        loadedPictures.add(p.id);
                        return true;
                    }))));
                    pageNumber += 1;
                    isFinished = page.last;
                }
            } catch (error) {
                console.error("There was an error getting item pictures", error);
            } finally {
                this.setState(prev => new UpdatedPictureListState( false, prev.pictures));
                if (!isFinished)
                    window.addEventListener('scroll', loadMorePicturesIfNecessary);
            }
        }

        this.loadMorePicturesIfNecessary = loadMorePicturesIfNecessary;
    }

    componentDidMount() {
        this.setState((_, props) => new UpdatedPictureListState(false, props.initialPictureList || []));
        this.loadMorePicturesIfNecessary();
    }

    render() {
        const { pictures, isLoading } = this.state || new UnloadedPictureListState();
        return <div className="pictures">
            {pictures.map(p => (
                <div key={p.id} className="picture card">
                    <img src={`/api/pictures/${p.id}/file`} alt={p.fileName} title={p.fileName} className="card-img-top"/>
                    <div className="card-body">
                        <h5 className="card-title">{p.fileName}</h5>
                    </div>
                </div>
            ))}
            {isLoading ? <div className="spinner-border center" role="status">
                <span className="visually-hidden">Loading...</span>
            </div> : null}
        </div>;
    }
}
