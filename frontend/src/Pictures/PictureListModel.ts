import { filter, firstValueFrom, fromEvent } from "rxjs";
import { CancellationToken } from "../CancellationToken";
import { PictureInformation } from "../../../transfer";
import { InteractionState, mutableInteractionState, UpdatableInteractionState } from "../interactions/InteractionState";
import { AccessPictures, PictureAccess } from "./AccessPictures";

const pageSize = 20;

interface PictureListModel {
    get isLoading(): InteractionState<boolean>;
    get pictures(): InteractionState<PictureInformation[]>;

    watchFromScrollState(cancellationToken: CancellationToken): Promise<void>;

    updatePicture(pictureId: number): Promise<void>;
}

export class PictureListViewModel implements PictureListModel {
    private readonly loadedPictures: Map<number, PictureInformation>;
    private readonly isLoadingSubject = mutableInteractionState(false);
    private readonly picturesSubject: UpdatableInteractionState<PictureInformation[]>;

    constructor(
        private readonly document: Document,
        private readonly pictureAccess: AccessPictures,
        initialPictures: PictureInformation[] = [],
    ) {
        this.loadedPictures = new Map<number, PictureInformation>(initialPictures.map((p) => [p.id, p]));
        this.picturesSubject = mutableInteractionState<PictureInformation[]>(
            initialPictures.sort((a, b) => b.id - a.id),
        );
    }

    get isLoading(): InteractionState<boolean> {
        return this.isLoadingSubject;
    }

    get pictures(): InteractionState<PictureInformation[]> {
        return this.picturesSubject;
    }

    async updatePicture(pictureId: number): Promise<void> {
        const updatedPicture = await this.pictureAccess.getPictureInformation(pictureId);
        const existingPicture = this.loadedPictures.get(pictureId);
        if (existingPicture && updatedPicture) {
            Object.assign(existingPicture, updatedPicture);
        }
    }

    async watchFromScrollState(cancellationToken: CancellationToken) {
        let nextPageNumber = 0;
        while (!cancellationToken.isCancelled) {
            this.isLoadingSubject.value = true;
            try {
                const promisedResponse = this.pictureAccess.getPictures(nextPageNumber, pageSize);
                await Promise.any([promisedResponse, cancellationToken.promisedCancellation]);
                if (cancellationToken.isCancelled) return;

                const page = await promisedResponse;
                this.picturesSubject.value = this.pictures.value.concat(
                    page.content.filter((p) => {
                        if (this.loadedPictures.has(p.id)) return false;
                        this.loadedPictures.set(p.id, p);
                        return true;
                    }),
                );

                if (page.last) return;
                nextPageNumber = Math.max(nextPageNumber, page.number + 1);
            } catch (error) {
                console.error("There was an error getting item pictures", error);
            } finally {
                this.isLoadingSubject.value = false;
            }

            const events = fromEvent(this.document, "scroll").pipe(
                filter(() => {
                    const fifthLastPicture = this.document.querySelector("div.pictures div.picture:nth-last-child(5)");
                    if (!fifthLastPicture) return false;

                    const rect = fifthLastPicture.getBoundingClientRect();
                    return rect.top <= 0;
                }),
            );

            await Promise.any([firstValueFrom(events), cancellationToken.promisedCancellation]);
        }
    }
}

export function newPictureListModel(document: Document, initialPictures: PictureInformation[] = []): PictureListModel {
    return new PictureListViewModel(document, new PictureAccess(), initialPictures);
}
