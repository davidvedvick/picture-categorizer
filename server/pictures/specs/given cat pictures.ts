import { beforeAll, describe, expect, test } from "@jest/globals";
import { PictureInformation } from "../../../transfer/index.js";
import { Page } from "../../Page.js";
import { PictureService } from "../PictureService.js";
import { Picture } from "../Picture.js";
import { ManagePictures } from "../ManagePictures.js";
import { ManageCatEmployees } from "../../users/ManageCatEmployees.js";
import { PictureFile } from "../PictureFile.js";
import { ManagePictureTags } from "../tags/ManagePictureTags.js";
import { PictureTag } from "../tags/PictureTag.js";

describe("given cat pictures", () => {
    describe("when getting the first page", () => {
        let page: Page<PictureInformation>;

        beforeAll(async () => {
            const pictureService = new PictureService(
                {
                    findAll(pageNumber: number | null, pageSize: number | null): Promise<Picture[]> {
                        return Promise.resolve(
                            pageNumber == 0 && pageSize == 5
                                ? [
                                      {
                                          id: 823,
                                          catEmployeeId: 521,
                                          mimeType: "",
                                          fileName: "xKLbRIuf",
                                      } as Picture,
                                      {
                                          id: 437,
                                          catEmployeeId: 521,
                                          fileName: "jwKJ996Yo",
                                      } as Picture,
                                ]
                                : [],
                        );
                    },
                    countAll(): Promise<number> {
                        return Promise.resolve(10);
                    },
                } as ManagePictures,
                {} as ManageCatEmployees,
                {} as ManagePictureTags,
            );

            page = await pictureService.getPictureInformation(0, 5);
        });

        test("then the returned pictures are correct", () => {
            expect(page.content).toStrictEqual([
                {
                    id: 823,
                    catEmployeeId: 521,
                    fileName: "xKLbRIuf",
                    headlineTag: null,
                } as PictureInformation,
                {
                    id: 437,
                    catEmployeeId: 521,
                    fileName: "jwKJ996Yo",
                    headlineTag: null,
                } as PictureInformation,
            ]);
        });

        test("then it is not the last page", () => {
            expect(page.last).toBeFalsy();
        });

        test("then it is the correct page number", () => {
            expect(page.number).toBe(0);
        });
    });

    describe("when getting the last page", () => {
        let page: Page<PictureInformation>;

        beforeAll(async () => {
            const pictureService = new PictureService(
                {
                    findAll(pageNumber: number | null, pageSize: number | null): Promise<Picture[]> {
                        return Promise.resolve(pageNumber == 1 && pageSize == 3 ? [{} as Picture] : []);
                    },
                    countAll(): Promise<number> {
                        return Promise.resolve(6);
                    },
                } as ManagePictures,
                {} as ManageCatEmployees,
                {} as ManagePictureTags,
            );

            page = await pictureService.getPictureInformation(1, 3);
        });

        test("then the returned pictures are correct", () => {
            expect(page.content).toHaveLength(1);
        });

        test("then it is the last page", () => {
            expect(page.last).toBeTruthy();
        });

        test("then it is the correct page number", () => {
            expect(page.number).toBe(1);
        });
    });

    describe("when getting all picture information", () => {
        let page: Page<PictureInformation>;

        beforeAll(async () => {
            const pictureService = new PictureService(
                {
                    findAll(pageNumber: number | null, pageSize: number | null): Promise<Picture[]> {
                        return Promise.resolve(
                            pageNumber == null && pageSize == null ? [{} as Picture, {} as Picture, {} as Picture] : [],
                        );
                    },
                    countAll(): Promise<number> {
                        return Promise.resolve(-638);
                    },
                } as ManagePictures,
                {} as ManageCatEmployees,
                {} as ManagePictureTags,
            );

            page = await pictureService.getPictureInformation();
        });

        test("then the returned pictures are correct", () => {
            expect(page.content).toHaveLength(3);
        });

        test("then it is the last page", () => {
            expect(page.last).toBeTruthy();
        });

        test("then it is the correct page number", () => {
            expect(page.number).toBe(0);
        });
    });

    describe("when getting a picture", () => {
        let picture: PictureFile | null;

        beforeAll(async () => {
            const pictureService = new PictureService(
                {
                    findById(id: number): Promise<PictureFile | null> {
                        return Promise.resolve(
                            id == 644
                                ? {
                                    id: id,
                                    mimeType: "zXHTufH",
                                    catEmployeeId: 99,
                                    fileName: "9ZVugNotp",
                                    file: Buffer.of(),
                                }
                                : null,
                        );
                    },
                    findFileById(id: number): Promise<Uint8Array> {
                        return Promise.resolve(id == 644 ? Buffer.of(322, 379, 706) : Buffer.of());
                    },
                } as ManagePictures,
                {} as ManageCatEmployees,
                {} as ManagePictureTags,
            );

            picture = await pictureService.getPictureFile(644);
        });

        test("then the picture is correct", () => {
            expect(picture).toStrictEqual({
                mimeType: "zXHTufH",
                fileName: "9ZVugNotp",
                file: Buffer.of(322, 379, 706),
            });
        });
    });

    describe("when updating a picture description tag", () => {
        let picture: PictureInformation | null;
        let updatedPictureTag: { pictureId: number; descriptionTagId: number } | null = null;

        beforeAll(async () => {
            const pictureService = new PictureService(
                {
                    findById(id: number): Promise<PictureFile | null> {
                        return Promise.resolve(
                            id == 470
                                ? {
                                    id: id,
                                    mimeType: "zXHTufH",
                                    catEmployeeId: 99,
                                    fileName: "OdWSgeWOx5A",
                                    file: Buffer.of(),
                                }
                                : null,
                        );
                    },
                    setPictureTagId(id: number, descriptionTagId: number): Promise<PictureInformation | null> {
                        updatedPictureTag = {
                            pictureId: id,
                            descriptionTagId: descriptionTagId,
                        };
                        return Promise.resolve({
                            id: 285,
                            catEmployeeId: 406,
                            headlineTag: "U6e8Ju3",
                            fileName: "OdWSgeWOx5A",
                        });
                    },
                } as ManagePictures,
                {} as ManageCatEmployees,
                {
                    getOrAddTag(pictureId: number, name: string): Promise<PictureTag> {
                        return Promise.resolve(
                            name == "U6e8Ju3"
                                ? {
                                    tagId: 470,
                                    tag: "U6e8Ju3",
                                    pictureId: pictureId,
                                }
                                : ({} as PictureTag),
                        );
                    },
                } as ManagePictureTags,
            );

            picture = await pictureService.updateHeadlineTag(285, "U6e8Ju3");
        });

        test("then the updated picture tag is correct", () => {
            expect(updatedPictureTag).toStrictEqual({
                pictureId: 285,
                descriptionTagId: 470,
            });
        });

        test("then the updated picture is correct", () => {
            expect(picture).toStrictEqual({
                id: 285,
                catEmployeeId: 406,
                headlineTag: "U6e8Ju3",
                fileName: "OdWSgeWOx5A",
            } as PictureInformation);
        });
    });
});
