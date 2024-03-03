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
        console.log(formData);
        try {
            uploadPhoto(formData);
        } catch (err) {
            console.error("The error is: "+err);
        }
    };

    // if I uncomment the body of this, I get these weird errors
    // Warning: An error occurred during hydration. 
    //    The server HTML was replaced with client content in <#document>
    // Uncaught Error: There was an error while hydrating. 
    //    Because the error happened outside of a Suspense boundary, 
    //    the entire root will switch to client rendering.
    // Uncaught TypeError: process.exit is not a function
    // The above error occurred in the <ServerRoot> component:
    const uploadPhoto = async (formData: FormData) => {
        // try {
        //     const response = await fetch(backend_url('/posts/upload'), {
        //         method: 'POST',
        //         credentials: 'include',
        //         body: formData,
        //     });

        //     if (response.ok) {
        //         console.log('Image uploaded successfully');
        //     } else {
        //         console.error('Failed to upload image');
        //     }
        // } catch (error) {
        //     console.error('Error:', error);
        // } 
    }

    return (
        <main>
            <div id="blur-setting-container">
                <p>Blur my face</p>
                <div>toggle button</div>
            </div>
            <div>Post image</div>
            <div>Post caption</div>
            <div>cancel button</div>
            <div>post button</div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} />
                    <>
                        {imagePreview && 
                            <NewPostPhoto imgSrc={imagePreview} {...dotProps} />
                        }
                    </>
                    <button type="submit">Post Outfit</button>
                </form>
            </div>
            {/* <NewPostPhoto imgSrc="/tango.jpg" {...dotProps} /> */}
            {tagEditor}
        </main>
    );
}
