import {beforeAll, describe, expect, test} from "@jest/globals";
import {PictureService} from "../PictureService.js";
import {Picture} from "../Picture.js";
import {ManagePictures} from "../ManagePictures.js";
import {PictureResponse} from "../PictureResponse.js";
import CatEmployee from "../../users/CatEmployee.js";
import {ManageCatEmployees} from "../../users/ManageCatEmployees.js";
import {PictureAlreadyExistsException} from "../PictureAlreadyExistsException.js";

describe("given a user", () => {
    describe("when adding the users pictures", () => {

        const addedPictures: Picture[] = [];
        let response: PictureResponse;

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
                file: Buffer.of(247, 761, 879, 11)
            }, {
                email: "8N8k",
                password: "OaH1Su"
            });
        });

        test("then the pictures have the correct user", () => {
            expect(addedPictures.map(p => p.catEmployeeId)).toStrictEqual([920]);
        });

        test("then the picture has the correct path", () => {
           expect(addedPictures.map(p => p.fileName)).toStrictEqual(["KEDSlros"]);
        });

        test("then the picture bytes are correct", () => {
           expect(addedPictures.map(p => p.file)).toStrictEqual([Buffer.of(247, 761, 879, 11)]);
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
                        file: Buffer.of(247, 761, 879, 11)
                    }, {
                        email: "8N8k",
                        password: "OaH1Su"
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
});