"use client"

import NewPostPhoto from "@/app/components/new-post-photo";
import { backend_url } from "@/app/settings";
import { Tag, TagDotProps_ } from "@/app/components/tag";
import TagEditor, { TagEditorProps } from "@/app/components/tag-editor";
import { ChangeEvent, useState, useEffect } from "react";


export default function Home() {
    const [editorProps, setEditorProps] = useState<TagEditorProps | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [image, setImage] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>();
    // const [imageRes, setImageRes] = useState<string>();

    const closeEditor = (dotKey: number) => (f: (tags: Tag[]) => Tag[]) => {
        setTags(f(tags));
        setEditorProps(props => props?.dotKey === dotKey ? null : props);
    };

    const tagEditor = editorProps === null
        ? null
        : <TagEditor key={editorProps.dotKey} {...editorProps}></TagEditor>;

    const dotProps: TagDotProps_ = {
        addTag: tag => tags => [tag, ...tags],
        rmTag: tag => tags => tags.filter(t => t !== tag),
        openEditor: setEditorProps,
        closeEditor
    };

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!image) {
            setImagePreview(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(image);
        setImagePreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [image])

    // Function to handle file selection
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        setImage(file);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!image) {
            console.log('Please select an image');
            return;
        }

        // // Create FormData object to send the image
        const formData = new FormData();
        formData.append('image', image);

        try {
            uploadPhoto(formData);
        } catch (err) {
            console.error("The error is: " + err);
        }
    };

    const uploadPhoto = async (formData: FormData) => {
        try {
            const response = await fetch(backend_url('/posts/upload'), {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (response.ok) {
                console.log('Image uploaded successfully');

                // code to test that I can download the image back from the server
                // const jsonRes = await response.json();
                // console.log(jsonRes);
                // const imageRes = await fetch(backend_url('/posts/image/'+jsonRes.filename), {
                //     method: 'GET',
                //     credentials: 'include'
                // })
                // console.log("Downloaded image");
                // console.log(imageRes);

                // const imgBlob = await imageRes.blob();
                // const url = URL.createObjectURL(imgBlob);
                // console.log(url);
                // setImageRes(url);

            } else {
                console.error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <main>
            <div id="blur-setting-container">
                <p>Blur my face</p>
                <div>toggle button</div>
            </div>
            {/* code to test that I can download the image back from the server and also display it */}
            {/* {imageRes && <img src={imageRes} />} */}
            <div>Post image</div>
            <div>Post caption</div>
            <div>cancel button</div>
            <div>post button</div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} />
                    {imagePreview &&
                        <NewPostPhoto imgSrc={imagePreview} {...dotProps} />
                    }
                    <button type="submit">Post Outfit</button>
                </form>
            </div>
            {/* <NewPostPhoto imgSrc="/tango.jpg" {...dotProps} /> */}
            {tagEditor}
        </main>
    );
}
