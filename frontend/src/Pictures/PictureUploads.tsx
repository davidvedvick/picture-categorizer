import React, {ChangeEvent, FormEvent, useState} from "react";
import {instance as auth} from "../Security/AuthorizationService";
import {PictureTransfer} from "../../../transfer";

interface PictureUploadsProps {
    onUploadCompleted: (uploadedPictures: PictureTransfer[]) => void;
    onUnauthenticated: () => void;
}

export function PictureUploads(props: PictureUploadsProps) {
    const [files, setFiles] = useState<FileList>()
    const [isUploading, setIsUploading] = useState(false);

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files

        if (files) setFiles(files);
    }

    async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
        setIsUploading(true);

        try {
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
                    "/api/pictures",
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${jwtToken.token}`
                        },
                        body: formData
                    }));
            }

            const responses = await Promise.all(promisedUploads);
            if (responses.findIndex(r => r.status === 403) > -1) props.onUnauthenticated();
            else props.onUploadCompleted(
                await Promise.all(responses
                    .filter(r => r.status === 202)
                    .map(r => r.json())));
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="col-sm-12">
            {
                isUploading
                    ? <div className="spinner-border text-center" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    : <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="cat-pics" className="form-label">Upload your cat pics!</label>
                            <input className="form-control" type="file" id="cat-pics" onChange={handleFileChange} multiple/>
                        </div>
                        <p>
                            <button type="submit" className="btn btn-primary mb-3">Upload</button>
                        </p>
                    </form>
            }
        </div>
    );
}