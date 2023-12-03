import {beforeAll, describe, expect, test} from "@jest/globals";
import {Picture} from "../../Picture.js";
import {ManagePictures} from "../../ManagePictures.js";
import {ManageCatEmployees} from "../../../users/ManageCatEmployees.js";
import {PictureTag} from "../PictureTag.js";
import {PictureTagService} from "../PictureTagService.js";
import {ManagePictureTags} from "../ManagePictureTags.js";
import CatEmployee from "../../../users/CatEmployee.js";
import {IncorrectEmployeeException} from "../../../users/IncorrectEmployeeException.js";
import {PictureNotFoundException} from "../../PictureNotFoundException.js";

describe("given cat pictures", () => {
    describe("when adding a picture tag", () => {
        const addedTags: [number, string][] = [];
        let addedPictureTag: PictureTag | null = null;

        beforeAll(async () => {
            const pictureTagService = new PictureTagService({
                findByEmail(email: string): Promise<CatEmployee | null> {
                    return Promise.resolve(email == "g5EJbF8VWPq" ? {
                        email: "g5EJbF8VWPq",
                        id: 107,
                        password: "",
                        isEnabled: true,
                    } : null);
                }
            } as ManageCatEmployees, {
                findById(id: number): Promise<Picture | null> {
                    return Promise.resolve(id == 204 ? {
                        id: id,
                        fileName: "8r2jagmLZBT",
                        catEmployeeId: 107,
                        file: Buffer.of(),
                        mimeType: "6KX66Tyy6"
                    } : null);
                }
            } as ManagePictures, {
                addTag(pictureId: number, tag: string): Promise<PictureTag> {
                    addedTags.push([pictureId, tag]);
                    return Promise.resolve({
                        tag: tag,
                        tagId: 3,
                        pictureId: pictureId,
                    });
                }
            } as ManagePictureTags);

            addedPictureTag = await pictureTagService.addTag(204, "x8Rmke68Gae", {email: "g5EJbF8VWPq", password: ""});
        });

        test("then the added picture tag is correct", () => {
            expect(addedPictureTag).toStrictEqual({
                tag: "x8rmke68gae",
                tagId: 3,
                pictureId: 204,
            });
        });

        test("then the added tags are correct", () => {
            expect(addedTags).toStrictEqual([[204, "x8rmke68gae"]]);
        });
    });

    describe("when deleting a picture tag", () => {
        const deletedTags: [number, number][] = [];

        beforeAll(async () => {
            const pictureTagService = new PictureTagService({
                findByEmail(email: string): Promise<CatEmployee | null> {
                    return Promise.resolve(email == "0YWSDi8fRYG" ? {
                        email: email,
                        id: 204,
                    } as CatEmployee : null);
                }
            } as ManageCatEmployees, {
                findById(id: number): Promise<Picture | null> {
                    return Promise.resolve(id == 518 ? {
                        id: id,
                        catEmployeeId: 204,
                    } as Picture : null);
                }
            } as ManagePictures, {
                deletePictureTag(pictureId: number, tagId: number): Promise<void> {
                    deletedTags.push([pictureId, tagId]);
                    return Promise.resolve();
                }
            } as ManagePictureTags);

            await pictureTagService.deleteTag(518, 460, {email: "0YWSDi8fRYG", password: ""});
        });

        test("then the deleted tags are correct", () => {
            expect(deletedTags).toStrictEqual([[518, 460]]);
        });
    });

    describe("and an unknown picture", () => {
        describe("when adding a picture tag", () => {
            const addedTags: [number, string][] = [];
            let missingPictureException: PictureNotFoundException;

            beforeAll(async () => {
                const pictureTagService = new PictureTagService({
                    findByEmail(email: string): Promise<CatEmployee | null> {
                        return Promise.resolve(email == "g5EJbF8VWPq" ? {
                            email: email,
                            id: 8,
                            password: "",
                            isEnabled: true,
                        } : null);
                    }
                } as ManageCatEmployees, {
                    findById(id: number): Promise<Picture | null> {
                        return Promise.resolve(id == 204 ? {
                            id: id,
                            fileName: "8r2jagmLZBT",
                            catEmployeeId: 107,
                            file: Buffer.of(),
                            mimeType: "6KX66Tyy6"
                        } : null);
                    }
                } as ManagePictures, {
                    addTag(pictureId: number, tag: string): Promise<PictureTag> {
                        addedTags.push([pictureId, tag]);
                        return Promise.resolve({
                            tag: tag,
                            tagId: 3,
                            pictureId: pictureId,
                        });
                    }
                } as ManagePictureTags);

                try {
                    await pictureTagService.addTag(58, "x8Rmke68Gae", {
                        email: "g5EJbF8VWPq",
                        password: ""
                    });
                } catch (e) {
                    if (e instanceof PictureNotFoundException)
                        missingPictureException = e;
                }
            });

            test("then a missing picture exception is thrown", () => {
                expect(missingPictureException).toBeDefined();
            });

            test("then the added tags are correct", () => {
                expect(addedTags).toStrictEqual([]);
            });
        });

        describe("when deleting a picture tag", () => {
            const deletedTags: [number, number][] = [];

            beforeAll(async () => {
                const pictureTagService = new PictureTagService({
                    findByEmail(email: string): Promise<CatEmployee | null> {
                        return Promise.resolve(email == "g5EJbF8VWPq" ? {
                            email: email,
                            id: 107,
                            password: "",
                            isEnabled: true,
                        } : null);
                    }
                } as ManageCatEmployees, {
                    findById(id: number): Promise<Picture | null> {
                        return Promise.resolve(id == 518 ? {
                            id: id,
                            catEmployeeId: 107,
                        } as Picture : null);
                    }
                } as ManagePictures, {
                    deletePictureTag(pictureId: number, tagId: number): Promise<void> {
                        deletedTags.push([pictureId, tagId]);
                        return Promise.resolve();
                    }
                } as ManagePictureTags);

                await pictureTagService.deleteTag(242, 17, {email: "0YWSDi8fRYG", password: ""});
            });

            test("then the deleted tags are correct", () => {
                expect(deletedTags).toStrictEqual([[242, 17]]);
            });
        });
    });

    describe("and the picture is owned by another cat employee", () => {
        describe("when adding a picture tag", () => {
            const addedTags: [number, string][] = [];
            let incorrectEmployeeException: IncorrectEmployeeException;

            beforeAll(async () => {
                const pictureTagService = new PictureTagService({
                    findByEmail(email: string): Promise<CatEmployee | null> {
                        return Promise.resolve(email == "g5EJbF8VWPq" ? {
                            email: "g5EJbF8VWPq",
                            id: 107,
                            password: "",
                            isEnabled: true,
                        } : null);
                    }
                } as ManageCatEmployees, {
                    findById(id: number): Promise<Picture | null> {
                        return Promise.resolve(id == 204 ? {
                            id: id,
                            fileName: "8r2jagmLZBT",
                            catEmployeeId: 431,
                            file: Buffer.of(),
                            mimeType: "6KX66Tyy6"
                        } : null);
                    }
                } as ManagePictures, {
                    addTag(pictureId: number, tag: string): Promise<PictureTag> {
                        addedTags.push([pictureId, tag]);
                        return Promise.resolve({
                            tag: tag,
                            tagId: 3,
                            pictureId: pictureId,
                        });
                    }
                } as ManagePictureTags);

                try {
                    await pictureTagService.addTag(204, "x8Rmke68Gae", {
                        email: "g5EJbF8VWPq",
                        password: ""
                    });
                } catch (e) {
                    if (e instanceof IncorrectEmployeeException)
                        incorrectEmployeeException = e;
                }
            });

            test("then an incorrect employee exception is thrown", () => {
                expect(incorrectEmployeeException).toBeDefined();
            });

            test("then the added tags are correct", () => {
                expect(addedTags).toStrictEqual([]);
            });
        });

        describe("when deleting a picture tag", () => {
            const deletedTags: [number, number][] = [];
            let incorrectEmployeeException: IncorrectEmployeeException;

            beforeAll(async () => {
                const pictureTagService = new PictureTagService({
                    findByEmail(email: string): Promise<CatEmployee | null> {
                        return Promise.resolve(email == "yPWhXEP" ? {
                            email: email,
                            id: 703,
                        } as CatEmployee : null);
                    }
                } as ManageCatEmployees, {
                    findById(id: number): Promise<Picture | null> {
                        return Promise.resolve(id == 803 ? {
                            id: id,
                            catEmployeeId: 941,
                        } as Picture : null);
                    }
                } as ManagePictures, {
                    deletePictureTag(pictureId: number, tagId: number): Promise<void> {
                        deletedTags.push([pictureId, tagId]);
                        return Promise.resolve();
                    }
                } as ManagePictureTags);

                try {
                    await pictureTagService.deleteTag(803, 17, {email: "yPWhXEP", password: ""});
                } catch (e) {
                    if (e instanceof IncorrectEmployeeException)
                        incorrectEmployeeException = e;
                }
            });

            test("then an incorrect employee exception is thrown", () => {
                expect(incorrectEmployeeException).toBeDefined();
            });

            test("then the deleted tags are correct", () => {
                expect(deletedTags).toStrictEqual([]);
            });
        });
    });
});