import { beforeAll, describe, expect, test } from "@jest/globals";
import { PictureService } from "../PictureService.js";
import { Picture } from "../Picture.js";
import { ManagePictures } from "../ManagePictures.js";
import { PictureInformation } from "../../../transfer/index.js";
import CatEmployee from "../../users/CatEmployee.js";
import { ManageCatEmployees } from "../../users/ManageCatEmployees.js";
import { PictureAlreadyExistsException } from "../PictureAlreadyExistsException.js";
import { UnknownCatEmployeeException } from "../../users/UnknownCatEmployeeException.js";
import { PictureFile } from "../PictureFile.js";
import { IncorrectEmployeeException } from "../../users/IncorrectEmployeeException.js";
import { ManagePictureTags } from "../tags/ManagePictureTags.js";
import { ManageResizedPictures } from "../resizing/ManageResizedPictures.js";

describe("given a user", () => {
    describe("when adding the users pictures", () => {
        const addedPictures: Picture[] = [];
        let response: PictureInformation;

        beforeAll(async () => {
            const pictureService = new PictureService(
                {
                    save: (picture) => {
                        addedPictures.push(picture);
                        return Promise.resolve(picture);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    findByCatEmployeeIdAndFileName(_: number, __: string): Promise<Picture | null> {
                        return Promise.resolve(null);
                    },
                } as ManagePictures,
                {
                    findByEmail(email: string): Promise<CatEmployee | null> {
                        if (email != "8N8k") return Promise.resolve(null);

                        return Promise.resolve({
                            id: 920,
                            password: "OaH1Su",
                            isEnabled: true,
                            email: email,
                        });
                    },
                } as ManageCatEmployees,
                {} as ManagePictureTags,
                {} as ManageResizedPictures,
            );

            response = await pictureService.addPicture(
                {
                    fileName: "KEDSlros",
                    file: Buffer.of(247, 761, 879, 11),
                    mimeType: "pV9UkazC",
                },
                {
                    email: "8N8k",
                },
            );
        });

        test("then the added pictures are correct", () => {
            expect(addedPictures).toStrictEqual([
                {
                    id: 0,
                    catEmployeeId: 920,
                    fileName: "KEDSlros",
                    file: Buffer.of(247, 761, 879, 11),
                    mimeType: "pV9UkazC",
                    headlineTagId: null,
                },
            ]);
        });

        test("then the response data is correct", () => {
            expect(response.fileName).toBe(addedPictures[0].fileName);
        });
    });

    describe("when deleting a picture", () => {
        const employeeEmail = "z6ZBLPIAY";
        const employeeId = 737;
        const pictureId = 466;

        let deletedPictureId = -1;
        let deletedPictureTagId = -1;
        let deletedResizedPictureId = -1;
        let arePictureDependenciesDeletedFirst = false;

        beforeAll(async () => {
            const pictureService = new PictureService(
                {
                    findById(id: number): Promise<PictureFile | null> {
                        return Promise.resolve(
                            id == pictureId
                                ? {
                                    id: id,
                                    mimeType: "zXHTufH",
                                    catEmployeeId: employeeId,
                                    fileName: "9ZVugNotp",
                                    file: Buffer.of(),
                                }
                                : null,
                        );
                    },
                    deletePicture(id: number): Promise<void> {
                        deletedPictureId = id;
                        arePictureDependenciesDeletedFirst =
                            deletedPictureTagId === id && deletedResizedPictureId === id;
                        return Promise.resolve();
                    },
                } as ManagePictures,
                {
                    findByEmail(email: string): Promise<CatEmployee | null> {
                        if (email != employeeEmail) return Promise.resolve(null);

                        return Promise.resolve({
                            id: employeeId,
                            password: "OaH1Su",
                            isEnabled: true,
                            email: email,
                        });
                    },
                } as ManageCatEmployees,
                {
                    deleteAllPictureTags(pictureId: number): Promise<void> {
                        deletedPictureTagId = pictureId;
                        return Promise.resolve();
                    },
                } as ManagePictureTags,
                {
                    delete(id: number) {
                        deletedResizedPictureId = id;
                    },
                } as ManageResizedPictures,
            );

            await pictureService.deletePicture(pictureId, { email: employeeEmail });
        });

        test("then the deleted picture is correct", () => {
            expect(deletedPictureId).toBe(pictureId);
        });

        test("then the deleted picture tag ID is correct", () => {
            expect(deletedPictureTagId).toBe(pictureId);
        });

        test("then items dependent on the picture are deleted first", () => {
            expect(arePictureDependenciesDeletedFirst).toBeTruthy();
        });
    });

    describe("and the user has pictures", () => {
        describe("when adding the same pictures", () => {
            const addedPictures: Picture[] = [];
            let exception: PictureAlreadyExistsException | null = null;

            beforeAll(async () => {
                const pictureService = new PictureService(
                    {
                        save: (picture) => {
                            addedPictures.push(picture);
                            return Promise.resolve(picture);
                        },
                        findByCatEmployeeIdAndFileName(
                            catEmployeeId: number,
                            fileName: string,
                        ): Promise<Picture | null> {
                            return Promise.resolve(
                                catEmployeeId != 920 || fileName != "gzF0"
                                    ? null
                                    : {
                                        fileName: fileName,
                                        file: Buffer.of(415),
                                        catEmployeeId: catEmployeeId,
                                        id: 527,
                                        mimeType: "sqbVrQo10",
                                        headlineTagId: null,
                                    },
                            );
                        },
                    } as ManagePictures,
                    {
                        findByEmail(email: string): Promise<CatEmployee | null> {
                            if (email != "8N8k") return Promise.resolve(null);

                            return Promise.resolve({
                                id: 920,
                                password: "OaH1Su",
                                isEnabled: true,
                                email: email,
                            });
                        },
                    } as ManageCatEmployees,
                    {} as ManagePictureTags,
                    {} as ManageResizedPictures,
                );

                try {
                    await pictureService.addPicture(
                        {
                            fileName: "gzF0",
                            file: Buffer.of(247, 761, 879, 11),
                            mimeType: "qntxhf2N",
                        },
                        {
                            email: "8N8k",
                        },
                    );
                } catch (e) {
                    if (e instanceof PictureAlreadyExistsException) exception = e;
                }
            });

            test("then an exception is thrown", () => {
                expect(exception).not.toBeNull();
            });

            test("then the picture is not added", () => {
                expect(addedPictures).toStrictEqual([]);
            });
        });
    });

    describe("and the user doesn't exist", () => {
        describe("when adding pictures", () => {
            const addedPictures: Picture[] = [];
            let exception: UnknownCatEmployeeException | null = null;

            beforeAll(async () => {
                const pictureService = new PictureService(
                    {
                        save: (picture) => {
                            addedPictures.push(picture);
                            return Promise.resolve(picture);
                        },
                        findByCatEmployeeIdAndFileName(
                            catEmployeeId: number,
                            fileName: string,
                        ): Promise<Picture | null> {
                            return Promise.resolve(
                                catEmployeeId != 920 || fileName != "gzF0"
                                    ? null
                                    : {
                                        fileName: fileName,
                                        file: Buffer.of(415),
                                        catEmployeeId: catEmployeeId,
                                        id: 527,
                                        mimeType: "TyCSkFsQvR",
                                        headlineTagId: null,
                                    },
                            );
                        },
                    } as ManagePictures,
                    {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        findByEmail(_: string): Promise<CatEmployee | null> {
                            return Promise.resolve(null);
                        },
                    } as ManageCatEmployees,
                    {} as ManagePictureTags,
                    {} as ManageResizedPictures,
                );

                try {
                    await pictureService.addPicture(
                        {
                            fileName: "gzF0",
                            file: Buffer.of(247, 761, 879, 11),
                            mimeType: "pXuuBlE",
                        },
                        {
                            email: "8N8k",
                        },
                    );
                } catch (e) {
                    if (e instanceof UnknownCatEmployeeException) exception = e;
                }
            });

            test("then an exception is thrown", () => {
                expect(exception).not.toBeNull();
            });

            test("then the picture is not added", () => {
                expect(addedPictures).toStrictEqual([]);
            });
        });
    });

    describe("and it is not the user's picture", () => {
        describe("when deleting a picture", () => {
            let deletedPictureId: number = -1;
            let incorrectEmployeeException: IncorrectEmployeeException | null = null;
            const employeeEmail = "7DSwDwf";
            const employeeId = 659;
            const pictureId = 633;

            beforeAll(async () => {
                const pictureService = new PictureService(
                    {
                        findById(id: number): Promise<PictureFile | null> {
                            return Promise.resolve(
                                id == pictureId
                                    ? {
                                        id: id,
                                        mimeType: "zXHTufH",
                                        catEmployeeId: 560,
                                        fileName: "9ZVugNotp",
                                        file: Buffer.of(),
                                    }
                                    : null,
                            );
                        },
                        deletePicture(id: number): Promise<void> {
                            deletedPictureId = id;
                            return Promise.resolve();
                        },
                    } as ManagePictures,
                    {
                        findByEmail(email: string): Promise<CatEmployee | null> {
                            if (email != employeeEmail) return Promise.resolve(null);

                            return Promise.resolve({
                                id: employeeId,
                                password: "OaH1Su",
                                isEnabled: true,
                                email: email,
                            });
                        },
                    } as ManageCatEmployees,
                    {} as ManagePictureTags,
                    {} as ManageResizedPictures,
                );

                try {
                    await pictureService.deletePicture(pictureId, { email: employeeEmail });
                } catch (err) {
                    if (err instanceof IncorrectEmployeeException) incorrectEmployeeException = err;
                }
            });

            test("then the picture is not deleted", () => {
                expect(deletedPictureId).toBe(-1);
            });

            test("then an incorrect employee exception is thrown", () => {
                expect(incorrectEmployeeException).toBeDefined();
            });
        });
    });
});
