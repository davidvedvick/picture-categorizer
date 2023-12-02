import {Express} from "express";
import {ServePictureTags} from "./ServePictureTags.js";
import {ManageJwtTokens} from "../../security/ManageJwtTokens.js";

export default function(app: Express, pictureTagService: ServePictureTags, manageJwtTokens: ManageJwtTokens) {
    app.post("/api/pictures/tags", async (req, res) => {
        const token = req.get('authorization');
        if (!token) {
            res.sendStatus(400);
            return;
        }

        const authenticatedUser = await manageJwtTokens.decodeToken(token);
        if (!authenticatedUser || !authenticatedUser.email) {
            res.sendStatus(401);
            return;
        }

        const pictureTag = await pictureTagService.addTag(req.body.pictureId, req.body.tag, authenticatedUser);
        if (pictureTag) {
            res.status(202).send(pictureTag);
            return;
        }
    });
}