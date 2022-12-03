import {ChangeEvent, FormEvent, useState} from "react";

export function PictureUploads() {
    const [files, setFiles] = useState<FileList>()

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files

        if (files) setFiles(files)
    }

    async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();

        const localFiles = files;
        if (!localFiles) return;

        const authHeader = localStorage.getItem("auth")
        if (!authHeader) return;

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
                    'Authorization': authHeader
                },
                body: formData
            }))
        }

        await Promise.all(promisedUploads)
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