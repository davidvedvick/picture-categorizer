import { beforeAll, describe, expect, test } from "@jest/globals";
import { Picture } from "../../Picture.js";
import { ManagePictures } from "../../ManagePictures.js";
import { ManageCatEmployees } from "../../../users/ManageCatEmployees.js";
import { PictureTag } from "../PictureTag.js";
import { PictureTagService } from "../PictureTagService.js";
import { ManagePictureTags } from "../ManagePictureTags.js";
import CatEmployee from "../../../users/CatEmployee.js";
import { IncorrectEmployeeException } from "../../../users/IncorrectEmployeeException.js";
import { PictureNotFoundException } from "../../PictureNotFoundException.js";
import { TagService } from "../TagService.js";
import { Tag } from "../../../../transfer/index.js";

describe("given cat pictures", () => {
    describe("when getting picture tags", () => {
        let tags: Tag[] = [];

        beforeAll(async () => {
            const tagService = new TagService({
                getPictureTags(pictureId: number): Promise<PictureTag[]> {
                    switch (pictureId) {
                    case 823:
                        return Promise.resolve([
                                {
                                    tagId: 914,
                                    tag: "QQh9LTd",
                                    pictureId: pictureId,
                                } as PictureTag,
                                {
                                    tagId: 1,
                                    tag: "UsbY0dnDhv",
                                    pictureId: pictureId,
                                } as PictureTag,
                        ]);
                    case 437:
                        return Promise.resolve([
                                {
                                    tagId: 931,
                                    tag: "OTIaxGyHE",
                                    pictureId: pictureId,
                                } as PictureTag,
                        ]);
                    default:
                        return Promise.resolve([]);
                    }
                },
            } as ManagePictureTags);

            tags = await tagService.getTags(823);
        });

        test("then the returned tags are correct", () => {
            expect(tags).toStrictEqual([
                { id: 914, tag: "QQh9LTd" },
                { id: 1, tag: "UsbY0dnDhv" },
            ]);
        });
    });

    describe("when adding a picture tag", () => {
        const addedTags: [number, string][] = [];
        let addedPictureTag: PictureTag | null = null;

        beforeAll(async () => {
            const pictureTagService = new PictureTagService(
                {
                    findByEmail(email: string): Promise<CatEmployee | null> {
                        return Promise.resolve(
                            email == "g5EJbF8VWPq"
                                ? {
                                    email: "g5EJbF8VWPq",
                                    id: 107,
                                    password: "",
                                    isEnabled: true,
                                }
                                : null,
                        );
                    },
                } as ManageCatEmployees,
                {
                    findById(id: number): Promise<Picture | null> {
                        return Promise.resolve(
                            id == 204
                                ? {
                                    id: id,
                                    fileName: "8r2jagmLZBT",
                                    catEmployeeId: 107,
                                    file: Buffer.of(),
                                    mimeType: "6KX66Tyy6",
                                    headlineTagId: null,
                                }
                                : null,
                        );
                    },
                } as ManagePictures,
                {
                    getOrAddTag(pictureId: number, tag: string): Promise<PictureTag> {
                        addedTags.push([pictureId, tag]);
                        return Promise.resolve({
                            tag: tag,
                            tagId: 3,
                            pictureId: pictureId,
                            rank: 0,
                        });
                    },
                } as ManagePictureTags,
            );

            addedPictureTag = await pictureTagService.addTag(204, "x8Rmke68Gae", { email: "g5EJbF8VWPq" });
        });

        test("then the added picture tag is correct", () => {
            expect(addedPictureTag).toStrictEqual({
                tag: "x8rmke68gae",
                tagId: 3,
                pictureId: 204,
                rank: 0,
            });
        });

        test("then the added tags are correct", () => {
            expect(addedTags).toStrictEqual([[204, "x8rmke68gae"]]);
        });
    });

    describe("when promoting a picture tag", () => {
        const employeeEmail = "esZUPS3ZsOA";
        const employeeId = 248;
        const pictureIdUnderTest = 302;
        const tagIdUnderTest = 670;

        let promotedPictureTag: PictureTag | null = null;

        beforeAll(async () => {
            const pictureTagService = new PictureTagService(
                {
                    findByEmail(email: string): Promise<CatEmployee | null> {
                        return Promise.resolve(
                            email == employeeEmail
                                ? {
                                    email: email,
                                    id: employeeId,
                                    password: "",
                                    isEnabled: true,
                                }
                                : null,
                        );
                    },
                } as ManageCatEmployees,
                {
                    findById(id: number): Promise<Picture | null> {
                        return Promise.resolve(
                            id == pictureIdUnderTest
                                ? {
                                    id: id,
                                    fileName: "8r2jagmLZBT",
                                    catEmployeeId: employeeId,
                                    file: Buffer.of(),
                                    mimeType: "6KX66Tyy6",
                                    headlineTagId: null,
                                }
                                : null,
                        );
                    },
                } as ManagePictures,
                {
                    promotePictureTag(pictureId: number, tagId: number): Promise<PictureTag | null> {
                        return Promise.resolve(
                            pictureId == pictureIdUnderTest && tagId == tagIdUnderTest
                                ? {
                                    tagId: tagId,
                                    pictureId: pictureId,
                                    tag: "FWrL95NJ2",
                                    rank: 510,
                                }
                                : null,
                        );
                    },
                } as ManagePictureTags,
            );

            promotedPictureTag = await pictureTagService.promoteTag(pictureIdUnderTest, tagIdUnderTest, {
                email: employeeEmail,
            });
        });

        test("then the promoted picture tag is correct", () => {
            expect(promotedPictureTag).toStrictEqual({
                tagId: tagIdUnderTest,
                pictureId: pictureIdUnderTest,
                tag: "FWrL95NJ2",
                rank: 510,
            });
        });
    });

    describe("when deleting a picture tag", () => {
        const deletedTags: [number, number][] = [];

        beforeAll(async () => {
            const pictureTagService = new PictureTagService(
                {
                    findByEmail(email: string): Promise<CatEmployee | null> {
                        return Promise.resolve(
                            email == "0YWSDi8fRYG"
                                ? ({
                                    email: email,
                                    id: 204,
                                } as CatEmployee)
                                : null,
                        );
                    },
                } as ManageCatEmployees,
                {
                    findById(id: number): Promise<Picture | null> {
                        return Promise.resolve(
                            id == 518
                                ? ({
                                    id: id,
                                    catEmployeeId: 204,
                                } as Picture)
                                : null,
                        );
                    },
                } as ManagePictures,
                {
                    deletePictureTag(pictureId: number, tagId: number): Promise<void> {
                        deletedTags.push([pictureId, tagId]);
                        return Promise.resolve();
                    },
                } as ManagePictureTags,
            );

            await pictureTagService.deleteTag(518, 460, { email: "0YWSDi8fRYG" });
        });

        test("then the deleted tags are correct", () => {
            expect(deletedTags).toStrictEqual([[518, 460]]);
        });
    });

    describe("and the tag already exists", () => {
        describe("when adding a picture tag", () => {
            const addedTags: [number, string][] = [];
            let addedPictureTag: PictureTag | null = null;

            beforeAll(async () => {
                const pictureTagService = new PictureTagService(
                    {
                        findByEmail(email: string): Promise<CatEmployee | null> {
                            return Promise.resolve(
                                email == "g5EJbF8VWPq"
                                    ? {
                                        email: "g5EJbF8VWPq",
                                        id: 107,
                                        password: "",
                                        isEnabled: true,
                                    }
                                    : null,
                            );
                        },
                    } as ManageCatEmployees,
                    {
                        findById(id: number): Promise<Picture | null> {
                            return Promise.resolve(
                                id == 204
                                    ? {
                                        id: id,
                                        fileName: "8r2jagmLZBT",
                                        catEmployeeId: 107,
                                        file: Buffer.of(),
                                        mimeType: "6KX66Tyy6",
                                        headlineTagId: null,
                                    }
                                    : null,
                            );
                        },
                    } as ManagePictures,
                    {
                        getOrAddTag(pictureId: number, tag: string): Promise<PictureTag> {
                            addedTags.push([pictureId, tag]);
                            return Promise.resolve({
                                tag: tag,
                                tagId: 3,
                                pictureId: pictureId,
                                rank: 0,
                            });
                        },
                    } as ManagePictureTags,
                );

                addedPictureTag = await pictureTagService.addTag(204, "x8Rmke68Gae", { email: "g5EJbF8VWPq" });
            });

            test("then the added picture tag is correct", () => {
                expect(addedPictureTag).toStrictEqual({
                    tag: "x8rmke68gae",
                    tagId: 3,
                    pictureId: 204,
                    rank: 0,
                });
            });

            test("then the added tags are correct", () => {
                expect(addedTags).toStrictEqual([[204, "x8rmke68gae"]]);
            });
        });
    });

    describe("and an unknown picture", () => {
        describe("when adding a picture tag", () => {
            const addedTags: [number, string][] = [];
            let missingPictureException: PictureNotFoundException;

            beforeAll(async () => {
                const pictureTagService = new PictureTagService(
                    {
                        findByEmail(email: string): Promise<CatEmployee | null> {
                            return Promise.resolve(
                                email == "g5EJbF8VWPq"
                                    ? {
                                        email: email,
                                        id: 8,
                                        password: "",
                                        isEnabled: true,
                                    }
                                    : null,
                            );
                        },
                    } as ManageCatEmployees,
                    {
                        findById(id: number): Promise<Picture | null> {
                            return Promise.resolve(
                                id == 204
                                    ? {
                                        id: id,
                                        fileName: "8r2jagmLZBT",
                                        catEmployeeId: 107,
                                        file: Buffer.of(),
                                        mimeType: "6KX66Tyy6",
                                        headlineTagId: null,
                                    }
                                    : null,
                            );
                        },
                    } as ManagePictures,
                    {
                        getOrAddTag(pictureId: number, tag: string): Promise<PictureTag> {
                            addedTags.push([pictureId, tag]);
                            return Promise.resolve({
                                tag: tag,
                                tagId: 3,
                                pictureId: pictureId,
                                rank: 0,
                            });
                        },
                    } as ManagePictureTags,
                );

                try {
                    await pictureTagService.addTag(58, "x8Rmke68Gae", { email: "g5EJbF8VWPq" });
                } catch (e) {
                    if (e instanceof PictureNotFoundException) missingPictureException = e;
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
                const pictureTagService = new PictureTagService(
                    {
                        findByEmail(email: string): Promise<CatEmployee | null> {
                            return Promise.resolve(
                                email == "g5EJbF8VWPq"
                                    ? {
                                        email: email,
                                        id: 107,
                                        password: "",
                                        isEnabled: true,
                                    }
                                    : null,
                            );
                        },
                    } as ManageCatEmployees,
                    {
                        findById(id: number): Promise<Picture | null> {
                            return Promise.resolve(
                                id == 518
                                    ? ({
                                        id: id,
                                        catEmployeeId: 107,
                                    } as Picture)
                                    : null,
                            );
                        },
                    } as ManagePictures,
                    {
                        deletePictureTag(pictureId: number, tagId: number): Promise<void> {
                            deletedTags.push([pictureId, tagId]);
                            return Promise.resolve();
                        },
                    } as ManagePictureTags,
                );

                await pictureTagService.deleteTag(242, 17, { email: "0YWSDi8fRYG" });
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
                const pictureTagService = new PictureTagService(
                    {
                        findByEmail(email: string): Promise<CatEmployee | null> {
                            return Promise.resolve(
                                email == "g5EJbF8VWPq"
                                    ? {
                                        email: "g5EJbF8VWPq",
                                        id: 107,
                                        password: "",
                                        isEnabled: true,
                                    }
                                    : null,
                            );
                        },
                    } as ManageCatEmployees,
                    {
                        findById(id: number): Promise<Picture | null> {
                            return Promise.resolve(
                                id == 204
                                    ? {
                                        id: id,
                                        fileName: "8r2jagmLZBT",
                                        catEmployeeId: 431,
                                        file: Buffer.of(),
                                        mimeType: "6KX66Tyy6",
                                        headlineTagId: null,
                                    }
                                    : null,
                            );
                        },
                    } as ManagePictures,
                    {
                        getOrAddTag(pictureId: number, tag: string): Promise<PictureTag> {
                            addedTags.push([pictureId, tag]);
                            return Promise.resolve({
                                tag: tag,
                                tagId: 3,
                                pictureId: pictureId,
                                rank: 0,
                            });
                        },
                    } as ManagePictureTags,
                );

                try {
                    await pictureTagService.addTag(204, "x8Rmke68Gae", { email: "g5EJbF8VWPq" });
                } catch (e) {
                    if (e instanceof IncorrectEmployeeException) incorrectEmployeeException = e;
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
                const pictureTagService = new PictureTagService(
                    {
                        findByEmail(email: string): Promise<CatEmployee | null> {
                            return Promise.resolve(
                                email == "yPWhXEP"
                                    ? ({
                                        email: email,
                                        id: 703,
                                    } as CatEmployee)
                                    : null,
                            );
                        },
                    } as ManageCatEmployees,
                    {
                        findById(id: number): Promise<Picture | null> {
                            return Promise.resolve(
                                id == 803
                                    ? ({
                                        id: id,
                                        catEmployeeId: 941,
                                    } as Picture)
                                    : null,
                            );
                        },
                    } as ManagePictures,
                    {
                        deletePictureTag(pictureId: number, tagId: number): Promise<void> {
                            deletedTags.push([pictureId, tagId]);
                            return Promise.resolve();
                        },
                    } as ManagePictureTags,
                );

                try {
                    await pictureTagService.deleteTag(803, 17, { email: "yPWhXEP" });
                } catch (e) {
                    if (e instanceof IncorrectEmployeeException) incorrectEmployeeException = e;
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
