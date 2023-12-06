import {beforeAll, describe, expect, test} from "@jest/globals";
import {PictureService} from "../PictureService.js";
import {Picture} from "../Picture.js";
import {ManagePictures} from "../ManagePictures.js";
import {PictureInformation} from "../../../transfer/index.js";
import CatEmployee from "../../users/CatEmployee.js";
import {ManageCatEmployees} from "../../users/ManageCatEmployees.js";
import {PictureAlreadyExistsException} from "../PictureAlreadyExistsException.js";
import {UnknownCatEmployeeException} from "../../users/UnknownCatEmployeeException.js";

describe("given a user", () => {
    describe("when adding the users pictures", () => {

        const addedPictures: Picture[] = [];
        let response: PictureInformation;

        beforeAll(async () => {
            const pictureService = new PictureService({
                save: (picture) => {
                    addedPictures.push(picture);
                    return Promise.resolve(picture);
                },
                findByCatEmployeeIdAndFileName(_: number, __: String): Promise<Picture | null> {
                    return Promise.resolve(null);
                }
            } as ManagePictures, {
                findByEmail(email: string): Promise<CatEmployee | null> {
                    if (email != "8N8k") return Promise.resolve(null);

                    return Promise.resolve({
                        id: 920,
                        password: "OaH1Su",
                        isEnabled: true,
                        email: email,
                    });
                }
            } as ManageCatEmployees);

            response = await pictureService.addPicture({
                fileName: "KEDSlros",
                file: Buffer.of(247, 761, 879, 11),
                mimeType: "pV9UkazC",
            }, {
                email: "8N8k"
            });
        });

        test("then the added pictures are correct", () => {
           expect(addedPictures).toStrictEqual([{
               id: 0,
               catEmployeeId: 920,
               fileName: "KEDSlros",
               file: Buffer.of(247, 761, 879, 11),
               mimeType: "pV9UkazC",
           }]);
        });

        test("then the response data is correct", () => {
            expect(response.fileName).toBe(addedPictures[0].fileName);
        });
    });

    describe("and the user has pictures", () => {
        describe("when adding the same pictures", () => {
            const addedPictures: Picture[] = [];
            let exception: PictureAlreadyExistsException | null = null;

            beforeAll(async () => {
                const pictureService = new PictureService({
                    save: (picture) => {
                        addedPictures.push(picture);
                        return Promise.resolve(picture);
                    },
                    findByCatEmployeeIdAndFileName(catEmployeeId: number, fileName: string): Promise<Picture | null> {
                        return Promise.resolve(catEmployeeId != 920 || fileName != "gzF0"
                            ? null
                            : {
                                fileName: fileName,
                                file: Buffer.of(415),
                                catEmployeeId: catEmployeeId,
                                id: 527,
                                mimeType: "sqbVrQo10",
                            });
                    }
                } as ManagePictures, {
                    findByEmail(email: string): Promise<CatEmployee | null> {
                        if (email != "8N8k") return Promise.resolve(null);

                        return Promise.resolve({
                            id: 920,
                            password: "OaH1Su",
                            isEnabled: true,
                            email: email,
                        });
                    }
                } as ManageCatEmployees);

                try {
                    await pictureService.addPicture({
                        fileName: "gzF0",
                        file: Buffer.of(247, 761, 879, 11),
                        mimeType: "qntxhf2N",
                    }, {
                        email: "8N8k"
                    });
                } catch (e) {
                    if (e instanceof PictureAlreadyExistsException)
                        exception = e;
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
                const pictureService = new PictureService({
                    save: (picture) => {
                        addedPictures.push(picture);
                        return Promise.resolve(picture);
                    },
                    findByCatEmployeeIdAndFileName(catEmployeeId: number, fileName: string): Promise<Picture | null> {
                        return Promise.resolve(catEmployeeId != 920 || fileName != "gzF0"
                            ? null
                            : {
                                fileName: fileName,
                                file: Buffer.of(415),
                                catEmployeeId: catEmployeeId,
                                id: 527,
                                mimeType: "TyCSkFsQvR",
                            });
                    }
                } as ManagePictures, {
                    findByEmail(_: string): Promise<CatEmployee | null> {
                        return Promise.resolve(null);
                    }
                } as ManageCatEmployees);

                try {
                    await pictureService.addPicture({
                        fileName: "gzF0",
                        file: Buffer.of(247, 761, 879, 11),
                        mimeType: "pXuuBlE"
                    }, {
                        email: "8N8k"
                    });
                } catch (e) {
                    if (e instanceof UnknownCatEmployeeException)
                        exception = e;
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
});