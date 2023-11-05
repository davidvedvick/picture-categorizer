import {beforeAll, describe, expect, test} from "@jest/globals";
import {PictureService} from "../PictureService.js";
import {Picture} from "../Picture.js";
import {ManagePictures} from "../ManagePictures.js";
import {PictureResponse} from "../PictureResponse.js";

describe("given a user", () => {
    describe("when adding the users pictures", () => {

        const addedPictures: Picture[] = [];
        let response: PictureResponse;

        beforeAll(async () => {
            const pictureService = new PictureService({
                save: (picture) => {
                    addedPictures.push(picture);
                    return Promise.resolve(picture);
                }
            } as ManagePictures);

            response = await pictureService.addPicture({
                fileName: "KEDSlros",
                file: Buffer.of(247, 761, 879, 11)
            }, {
                email: "8N8k",
                password: "OaH1Su"
            });
        })

        test("then the pictures have the correct user", () => {
            expect(addedPictures.map(p => p.catEmployeeId)).toBe([920]);
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
});