import {BehaviorSubject, filter, firstValueFrom, fromEvent} from "rxjs";
import {Page} from "../Page";
import {ReadonlyBehaviorSubject} from "../ReadonlyBehaviorSubject";
import {CancellationToken} from "../CancellationToken";
import {PictureInformation} from "../../../transfer";

const pageSize = 20;

interface PictureListModel {
    get isLoading(): ReadonlyBehaviorSubject<boolean>;
    get pictures(): ReadonlyBehaviorSubject<PictureInformation[]>;

    watchFromScrollState(cancellationToken: CancellationToken): Promise<void>;
}

class PictureListViewModel implements PictureListModel {

    private readonly loadedPictures;
    private readonly isLoadingSubject = new BehaviorSubject(false);
    private readonly picturesSubject;

    constructor(private readonly document: Document, initialPictures: PictureInformation[] = []) {
        this.loadedPictures = new Set<number>(initialPictures.map(p => p.id));
        this.picturesSubject = new BehaviorSubject<PictureInformation[]>(initialPictures.sort((a, b) => b.id - a.id));
    }

    get isLoading(): ReadonlyBehaviorSubject<boolean> {
        return this.isLoadingSubject;
    }

    get pictures(): ReadonlyBehaviorSubject<PictureInformation[]> {
        return this.picturesSubject;
    }

    async watchFromScrollState(cancellationToken: CancellationToken) {
        let nextPageNumber = 0;
        while (!cancellationToken.isCancelled) {
            this.isLoadingSubject.next(true);
            try {
                const promisedResponse = fetch(`/api/pictures?page=${nextPageNumber}&size=${pageSize}`);
                await Promise.any([promisedResponse, cancellationToken.promisedCancellation]);
                if (cancellationToken.isCancelled) return;

                const response = await promisedResponse;
                if (!response.ok) return;

                const page = await response.json() as Page<PictureInformation>;
                this.picturesSubject.next(this.pictures.value.concat(page.content.filter(p => {
                    if (this.loadedPictures.has(p.id)) return false;
                    this.loadedPictures.add(p.id);
                    return true;
                })));
                if (page.last) return;
                nextPageNumber = Math.max(nextPageNumber, page.number + 1);
            } catch (error) {
                console.error("There was an error getting item pictures", error);
            } finally {
                this.isLoadingSubject.next(false);
            }

            const events = fromEvent(this.document, "scroll")
                .pipe(
                    filter(() => {
                        const fifthLastNote = this.document.querySelector("div.pictures div.picture:nth-last-child(5)");
                        if (!fifthLastNote) return false;

                        const rect = fifthLastNote.getBoundingClientRect();
                        return rect.top <= 0;
                    }),
                );

            await Promise.any([firstValueFrom(events), cancellationToken.promisedCancellation]);
        }
    }
}

export function newPictureListModel(document: Document, initialPictures: PictureInformation[] = []): PictureListModel {
    return new PictureListViewModel(document, initialPictures);
}
