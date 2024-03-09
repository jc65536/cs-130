"use client"

import NewPostPhoto from "@/app/components/new-post-photo";
import { backend_url } from "@/app/settings";
import { Tag, TagDotProps_ } from "@/app/components/tag";
import TagEditor, { TagEditorProps } from "@/app/components/tag-editor";
import { ChangeEvent, useState, useEffect, MouseEvent, useRef } from "react";


export default function Home() {
    const blurRef = useRef<HTMLInputElement>(null);
    const photoRef = useRef<HTMLInputElement>(null);
    const capRef = useRef<HTMLInputElement>(null);

    const [editorProps, setEditorProps] = useState<TagEditorProps | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [image, setImage] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>();
    // const [imageRes, setImageRes] = useState<string>();

    useEffect(() => {
        console.log(tags);
    }, [tags]);

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
        setEditorProps(null);
        setTags([]);
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

    const post = async (e: MouseEvent<HTMLButtonElement>) => {
        const blur = blurRef.current?.checked;
        const caption = capRef.current?.value;

        const reader = new FileReader();
        reader.onloadend = () => {
            const imageData = reader.result;
            console.log({
                blur,
                caption,
                tags,
            });
        };

        if (image !== undefined)
            reader.readAsDataURL(image);
    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <div id="blur-setting-container">
                    <label>
                        Blur my face
                        <input type="checkbox" name="blur" id="blur" ref={blurRef} />
                    </label>
                </div>
                <div>
                    <input type="file" onChange={handleFileChange} id="photo" ref={photoRef} />
                    {imagePreview && <NewPostPhoto imgSrc={imagePreview} {...dotProps} />}
                </div>
                {/* <NewPostPhoto imgSrc="/tango.jpg" {...dotProps} /> */}
                {tagEditor}
                <p>
                    <label>
                        Caption:
                        <input name="caption" id="caption" ref={capRef}></input>
                    </label>
                </p>

                <button type="button" id="cancel">Cancel</button>
                <button type="submit" onClick={post}>Post Outfit</button>
            </form>
        </main>
    );
}
