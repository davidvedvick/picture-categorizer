export class PictureNotFoundException extends Error {
    constructor(pictureId: number) {
        super(`A picture with ${pictureId} could not be found.`);
    }
}