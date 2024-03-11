"use client"

import NewPostPhoto from "@/app/components/new-post-photo";
import { backend_url } from "@/app/settings";
import { Tag, TagDotProps_ } from "@/app/components/tag";
import TagEditor, { TagEditorProps } from "@/app/components/tag-editor";
import { ChangeEvent, useState, useEffect, MouseEvent, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import { MdOutlineAddAPhoto, MdOutlineClose } from "react-icons/md";
import { fn } from "@/app/util";
import "@/app/new-post.css";

export default function Home() {
    const blurRef = useRef<HTMLInputElement>(null);
    const photoRef = useRef<HTMLInputElement>(null);
    const capRef = useRef<HTMLTextAreaElement>(null);

    const [editorProps, setEditorProps] = useState<TagEditorProps | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [image, setImage] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>();
    // const [imageRes, setImageRes] = useState<string>();

    const onUploadClick = () => {
        // `current` points to the mounted file input element
        if (photoRef.current) photoRef.current.click();
    };

    const closeEditor = (dotKey: number) => fn(setTags).effectAfter(_ =>
        setEditorProps(props => props?.dotKey === dotKey ? null : props));

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
        const file_upload = document.getElementById('file-upload-wrapper');
        const file_change = document.getElementById('photo-editor');
        if (file_upload) file_upload.style.display = 'none';
        if (file_change) file_change.style.display = 'flex';

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

        console.log({
            blur,
            caption,
            tags,
        });

        if (image !== undefined) {
            const imageData = new FormData();
            imageData.append("image", image);
            console.log(imageData);
        }
    };

    return (
        <main>
            <form className="post-form" onSubmit={handleSubmit}>
                <div className="cancel-header">
                    <button type="button" className="cancel"><MdOutlineClose className="cancel-x"/></button>
                </div>
                <h4 className="new-post-header">New Post</h4>
                <div id="file-upload-wrapper">
                    <div className="upload-box" onClick={onUploadClick}>
                        <FaUpload />
                        <h4 className="upload-box-header">Choose Image to Upload</h4>
                        <input type="file" onChange={handleFileChange} className="photo-select" ref={photoRef} hidden/>
                    </div>
                    <small>Files Supported: JPG, PNG</small>
                </div>

                <div id="photo-editor">
                    <div className="image-tags">
                        {imagePreview && <NewPostPhoto imgSrc={imagePreview} {...dotProps} />}
                        {tagEditor}
                    </div>
                    <div className="settings">
                        <div className="settings-top">
                            <div id="file-change-wrapper">
                                <div className="upload-box" onClick={onUploadClick}>
                                    <FaUpload />
                                    <input type="file" onChange={handleFileChange} className="photo-select" ref={photoRef} hidden/>
                                </div>
                                <small>Change Image</small>
                            </div>
                            <div className="blur-contain">
                                <input type="checkbox" className="blur" ref={blurRef} />
                                <label className="blur-label">Blur my face</label>
                            </div>
                            
                        </div>
                        <div className="settings-bottom">
                            <textarea className="caption" ref={capRef} placeholder="Start typing your caption."></textarea>
                        </div>
                        <div className="add-post-contain">
                                <button type="submit" onClick={post}>
                                    <MdOutlineAddAPhoto className="add-post-icon"/>
                                    <h4 className="add-post-header">Add Post</h4>
                                </button>
                        </div>
                    </div>
                </div>
                
            </form>
        </main>
    );
}
