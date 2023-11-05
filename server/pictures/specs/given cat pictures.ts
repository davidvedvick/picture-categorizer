import {beforeAll, describe, expect, test} from "@jest/globals";
import {PictureResponse} from "../PictureResponse.js";
import {Page} from "../../Page.js";
import {PictureService} from "../PictureService.js";
import {Picture} from "../Picture.js";
import {ManagePictures} from "../ManagePictures.js";
import {ManageCatEmployees} from "../../users/ManageCatEmployees.js";

describe("given cat pictures", () => {
   describe("when getting the first page", () => {
       let page: Page<PictureResponse>

       beforeAll(async () => {
           const pictureService = new PictureService({
               findAll(pageNumber: number | null, pageSize: number | null): Promise<Picture[]> {
                   return Promise.resolve(pageNumber == 0 && pageSize == 5 ? [{} as Picture, {} as Picture] : []);
               },
               countAll(): Promise<number> {
                   return Promise.resolve(10);
               }
           } as ManagePictures, {
           } as ManageCatEmployees);

           page = await pictureService.getPictures(0, 5);
       });

       test("then the returned pictures are correct", () => {
          expect(page.content).toHaveLength(2);
       });

       test("then it is not the last page", () => {
          expect(page.last).toBeFalsy();
       });
   });

   describe("when getting the last page", () => {
       let page: Page<PictureResponse>

       beforeAll(async () => {
           const pictureService = new PictureService({
               findAll(pageNumber: number | null, pageSize: number | null): Promise<Picture[]> {
                   return Promise.resolve(pageNumber == 1 && pageSize == 3 ? [{} as Picture] : []);
               },
               countAll(): Promise<number> {
                   return Promise.resolve(6);
               }
           } as ManagePictures, {
           } as ManageCatEmployees);

           page = await pictureService.getPictures(1, 3);
       });

       test("then the returned pictures are correct", () => {
           expect(page.content).toHaveLength(1);
       });

       test("then it is the last page", () => {
           expect(page.last).toBeTruthy();
       });
   });

    describe("when getting all pictures", () => {
        let page: Page<PictureResponse>

        beforeAll(async () => {
            const pictureService = new PictureService({
                findAll(pageNumber: number | null, pageSize: number | null): Promise<Picture[]> {
                    return Promise.resolve(pageNumber == null && pageSize == null ? [{} as Picture, {} as Picture, {} as Picture] : []);
                },
                countAll(): Promise<number> {
                    return Promise.resolve(-638);
                }
            } as ManagePictures, {
            } as ManageCatEmployees);

            page = await pictureService.getPictures();
        });

        test("then the returned pictures are correct", () => {
            expect(page.content).toHaveLength(3);
        });

        test("then it is the last page", () => {
            expect(page.last).toBeTruthy();
        });
    });
});