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

           addedPictureTag = await pictureTagService.addTag(204, "x8Rmke68Gae", { email: "g5EJbF8VWPq", password: "" });
       });

       test("then the added picture tag is correct", () => {
          expect(addedPictureTag).toStrictEqual({
              tag: "x8Rmke68Gae",
              tagId: 3,
              pictureId: 204,
          });
       });

       test("then the added tags are correct", () => {
          expect(addedTags).toStrictEqual([[204, "x8Rmke68Gae"]]);
       });
   });

   describe("and an unknown picture", () => {
       describe("when adding a picture tag", () => {
           const addedTags: [number, string][] = [];
           let addedPictureTag: PictureTag | null = null;
           let missingPictureException: PictureNotFoundException;

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

               try {
                   addedPictureTag = await pictureTagService.addTag(58, "x8Rmke68Gae", {
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
   });
});