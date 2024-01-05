import { beforeAll, describe, expect, test } from "@jest/globals";
import { Picture } from "../../Picture.js";
import { ManagePictures } from "../../ManagePictures.js";
import { PictureFile } from "../../PictureFile.js";
import { ResizingPictureFileService } from "../ResizingPictureFileService.js";
import { ManageResizedPictures } from "../ManageResizedPictures.js";
import { ResizedPictureId } from "../ResizedPictureId.js";
import { ResizePictureRequest } from "../ResizePictureRequest.js";

describe("given a cat picture", () => {
    describe("when getting the resized picture", () => {
        let picture: PictureFile | null;

        beforeAll(async () => {
            const pictureService = new ResizingPictureFileService(
                {
                    findByRequest({ pictureId, maxHeight, maxWidth }: ResizePictureRequest): ResizedPictureId | null {
                        return pictureId == 390 && maxWidth == 400 && maxHeight == 400
                            ? new ResizedPictureId(936)
                            : null;
                    },
                    findById(id: number): ResizedPictureId | null {
                        return new ResizedPictureId(id);
                    },
                    findFileById(id: number): Buffer {
                        return id == 936 ? Buffer.of(220, 788) : Buffer.of();
                    },
                } as ManageResizedPictures,
                {
                    findById(id: number): Promise<Picture | null> {
                        return Promise.resolve(
                            id == 390 ? ({ mimeType: "941c3qkaS5", fileName: "hcjCmiqvAHB" } as Picture) : null,
                        );
                    },
                } as ManagePictures,
                {
                    promiseResize(): Promise<ResizedPictureId | null> {
                        return Promise.resolve(null);
                    },
                },
            );

            picture = await pictureService.getPictureFile(390);
        });

        test("then the picture is correct", () => {
            expect(picture).toStrictEqual({
                mimeType: "941c3qkaS5",
                fileName: "hcjCmiqvAHB",
                file: Buffer.of(220, 788),
            });
        });
    });
});
