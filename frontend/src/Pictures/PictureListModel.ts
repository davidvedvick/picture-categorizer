import {Picture} from "./Picture";
import {BehaviorSubject, filter, firstValueFrom, fromEvent} from "rxjs";
import {Page} from "../Page";
import {ReadonlyBehaviorSubject} from "../ReadonlyBehaviorSubject";
import {CancellationToken} from "../CancellationToken";

const pageSize = 20;

interface PictureListModel {
    get isLoading(): ReadonlyBehaviorSubject<boolean>;
    get pictures(): ReadonlyBehaviorSubject<Picture[]>;

    watchFromScrollState(cancellationToken: CancellationToken): Promise<void>;
}

class PictureListViewModel implements PictureListModel {

    private readonly isLoadingSubject = new BehaviorSubject(false);

    private readonly picturesSubject;

    constructor(private readonly document: Document, initialPictures: Picture[] = []) {
        this.picturesSubject = new BehaviorSubject<Picture[]>(initialPictures);
    }

    get isLoading(): ReadonlyBehaviorSubject<boolean> {
        return this.isLoadingSubject;
    }

    get pictures(): ReadonlyBehaviorSubject<Picture[]> {
        return this.picturesSubject;
    }

    async watchFromScrollState(cancellationToken: CancellationToken) {
        const loadedPictures = new Set<number>();
        let nextPageNumber = 0;
        while (!cancellationToken.isCancelled) {
            this.isLoadingSubject.next(true);
            try {
                const promisedResponse = fetch(`/api/pictures?sort=id,desc&page=${nextPageNumber}&size=${pageSize}`);
                await Promise.any([promisedResponse, cancellationToken.promisedCancellation]);
                if (cancellationToken.isCancelled) return;

                const response = await promisedResponse;
                if (!response.ok) return;

                const page = await response.json() as Page<Picture>;
                this.picturesSubject.next(this.pictures.value.concat(page.content.filter(p => {
                    if (loadedPictures.has(p.id)) return false;
                    loadedPictures.add(p.id);
                    return true;
                })));
                if (page.last) return;
                nextPageNumber = Math.max(nextPageNumber, page.number + 1);
            } catch (error) {
                console.error("There was an error getting item pictures", error);
            } finally {
                this.isLoadingSubject.next(false);
            }

            const events = fromEvent(this.document, 'scroll')
                .pipe(
                    filter(() => {
                        const fifthLastNote = this.document.querySelector('div.pictures div.picture:nth-last-child(5)');
                        if (!fifthLastNote) return false;

                        const rect = fifthLastNote.getBoundingClientRect();
                        return rect.top <= 0;
                    }),
                );

            await Promise.any([firstValueFrom(events), cancellationToken.promisedCancellation]);
        }
    }
}

export function newPictureListModel(document: Document, initialPictures: Picture[] = []): PictureListModel {
    return new PictureListViewModel(document, initialPictures);
}
