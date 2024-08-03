import { PictureListViewModel } from "../PictureListModel";
import { PictureInformation } from "../../../../transfer";
import { AccessPictures } from "../AccessPictures";

describe("given pictures", () => {
    describe("when updating a picture", () => {
        const viewModel = new PictureListViewModel(
            new Document(),
            {
                getPictureInformation(pictureId: number): Promise<PictureInformation | null> {
                    if (pictureId === 454)
                        return Promise.resolve({
                            id: 454,
                            headlineTag: "hW1yful",
                        } as PictureInformation);

                    return Promise.resolve(null);
                },
            } as AccessPictures,
            [
                {
                    id: 211,
                } as PictureInformation,
                {
                    id: 433,
                } as PictureInformation,
                {
                    id: 454,
                } as PictureInformation,
            ],
        );

        beforeAll(async () => {
            await viewModel.updatePicture(454);
        });

        test("then the updated pictures are correct", () => {
            expect(viewModel.pictures.value).toStrictEqual([
                {
                    id: 454,
                    headlineTag: "hW1yful",
                } as PictureInformation,
                {
                    id: 433,
                } as PictureInformation,
                {
                    id: 211,
                } as PictureInformation,
            ]);
        });
    });
});
