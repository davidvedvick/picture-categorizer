import {ChangeEvent, FormEvent, useState} from "react";
import {instance as auth} from "../Security/AuthorizationService";

interface PictureUploadsProps {
    onUploadCompleted: () => void;
    onUnauthenticated: () => void;
}

export function PictureUploads(props: PictureUploadsProps) {
    const [files, setFiles] = useState<FileList>()

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files

        if (files) setFiles(files)
    }

    async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();

        const localFiles = files;
        if (!localFiles) return;

        if (!auth().isLoggedIn()) return;
        const jwtToken = auth().getUserToken()
        if (!jwtToken) return;

        const promisedUploads: Promise<Response>[] = []
        for (let i = 0; i < localFiles.length; i++) {
            const file = localFiles.item(i)
            if (!file) continue;

            const formData = new FormData();
            formData.set("file", file)
            promisedUploads.push(fetch(
            "/api/pictures/",
            {
                method: 'POST',
                headers: {
                    'Authorization': jwtToken.token
                },
                body: formData
            }));
        }

        const responses = await Promise.all(promisedUploads);
        if (responses.findIndex(r => r.status === 403) > -1) props.onUnauthenticated();
        else props.onUploadCompleted();
    }

    return (
        <div className="col-sm-12">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="cat-pics" className="form-label">Upload your cat pics!</label>
                    <input className="form-control" type="file" id="cat-pics" onChange={handleFileChange} multiple />
                </div>
                <p><button type="submit" className="btn btn-primary mb-3">Upload</button></p>
            </form>
        </div>
    )
}