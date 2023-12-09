import React, {ChangeEvent, FormEvent, useState} from "react";
import {instance as auth} from "../Security/AuthorizationService";
import {PictureInformation} from "../../../transfer";
import {fetchAuthenticated} from "../Security/UserModel";

interface PictureUploadsProps {
    onUploadCompleted: (uploadedPictures: PictureInformation[]) => void;
}

export function PictureUploads(props: PictureUploadsProps) {
    const [files, setFiles] = useState<FileList>();
    const [isUploading, setIsUploading] = useState(false);

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;

        if (files) setFiles(files);
    }

    async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
        setIsUploading(true);

        try {
            formEvent.preventDefault();

            const localFiles = files;
            if (!localFiles) return;

            if (!auth().isLoggedIn()) return;

            const promisedUploads: Promise<Response>[] = [];
            for (let i = 0; i < localFiles.length; i++) {
                const file = localFiles.item(i);
                if (!file) continue;

                const formData = new FormData();
                formData.set("file", file);
                promisedUploads.push(fetchAuthenticated(
                    "/api/pictures",
                    {
                        method: "POST",
                        body: formData
                    }));
            }

            const responses = await Promise.all(promisedUploads);
            props.onUploadCompleted(
                await Promise.all(responses
                    .filter(r => r.ok)
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