import {Express} from "express";
import {ServePictures} from "./ServePictures.js";
import {ManagePictures} from "./ManagePictures.js";

export default function(app: Express, pictureService: ServePictures, pictureRepository: ManagePictures) {

    app.get("/api/pictures", async (req, res) => {
        const pageNumberString = req.query["page"];
        const pageNumber = pageNumberString ? Number(pageNumberString) : null;

        const pageSizeString = req.query["size"];
        const pageSize = pageSizeString ? Number(pageSizeString) : null;

        res.send(await pictureService.getPictures(pageNumber, pageSize))
    });

    app.get("/api/pictures/:id/file", async (req, res) => {
        const idString = req.params.id;
        if (!idString) {
            res.status(400);
            return;
        }

        const id = Number(idString);

        const file = await pictureRepository.findFileById(id);

        res.send(file);
    });

    // authenticate
    // {
    //     post("/api/pictures")
    //     {
    //         val
    //         part = call.receiveMultipart().readPart() as ? PartData.FileItem
    //         val
    //         fileName = part?.originalFileName
    //         val
    //         user = call.principal<AuthenticatedCatEmployee>()
    //         when
    //         {
    //             part == null
    //         ->
    //             call.respond(HttpStatusCode.BadRequest)
    //             fileName == null
    //         ->
    //             call.respond(HttpStatusCode.BadRequest)
    //             user == null
    //         ->
    //             call.respond(HttpStatusCode.Unauthorized)
    //         else ->
    //             {
    //                 val
    //                 pictureFile = PictureFile(
    //                     fileName,
    //                     part.streamProvider().use
    //                 {
    //                     it.toByteReadChannel().toByteArray()
    //                 }
    //             )
    //                 try {
    //                     val
    //                     picture = pictureService.addPicture(pictureFile, user)
    //                     call.respond(HttpStatusCode.Accepted, picture)
    //                 } catch (pictureAlreadyExists: PictureAlreadyExistsException) {
    //                     call.respond(HttpStatusCode.Conflict)
    //                 } catch (authenticationException: UnknownCatEmployeeException) {
    //                     call.respond(HttpStatusCode.Unauthorized)
    //                 }
    //             }
    //         }
    //     }
    // }
}