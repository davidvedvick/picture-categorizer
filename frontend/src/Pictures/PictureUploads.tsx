import React, { ChangeEvent, FormEvent, useState } from "react";
import { instance as auth } from "../Security/AuthorizationService";
import { PictureInformation } from "../../../transfer";
import { fetchAuthenticated } from "../Security/UserModel";
import { PrimaryButton } from "../components/PrimaryButton";
import { Spinner } from "../components/Spinner";
import { VisuallyHidden } from "../components/VisuallyHidden";

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
                promisedUploads.push(
                    fetchAuthenticated("/api/pictures", {
                        method: "POST",
                        body: formData,
                    }),
                );
            }

            const responses = await Promise.all(promisedUploads);
            props.onUploadCompleted(await Promise.all(responses.filter((r) => r.ok).map((r) => r.json())));
        } finally {
            setIsUploading(false);
        }
    }

    return isUploading ? (
        <Spinner>
            <VisuallyHidden>Loading...</VisuallyHidden>
        </Spinner>
    ) : (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="cat-pics">Upload your cat pics!</label>
                <input className="form-control" type="file" id="cat-pics" onChange={handleFileChange} multiple />
            </div>
            <p>
                <PrimaryButton type="submit">Upload</PrimaryButton>
            </p>
        </form>
    );
}
