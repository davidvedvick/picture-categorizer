import {describe, expect, test} from "@jest/globals";
import {PictureService} from "../PictureService.js";
import {Picture} from "../Picture.js";
import {ManagePictures} from "../ManagePictures.js";
import e from "express";

describe("given a user", () => {
    test("when adding the users pictures", async () => {
        const addedPictures: Picture[] = [];
        const pictureService = new PictureService({
            save: (picture) => {
                addedPictures.push(picture);
                return Promise.resolve(picture);
            }
        } as ManagePictures);

        const response = await pictureService.addPicture({
            fileName: "KEDSlros",
            file: Buffer.of(247, 761, 879, 11)
        }, {
            email: "8N8k",
            password: "OaH1Su"
        });

        test("then the pictures have the correct user", () => {
            expect(addedPictures.map(p => p.catEmployeeId)).toBe([920]);
        });

        test("then the picture has the correct path", () => {
           expect(addedPictures.map(p => p.fileName)).toBe(["KEDSlros"]);
        });

        test("then the picture bytes are correct", () => {
           expect(addedPictures.flatMap(p => p.file)).toBe([247, 761, 879, 11]);
        });

        test("then the response data is correct", () => {
            expect(response.fileName).toBe(addedPictures[0].fileName);
        });
    });
});