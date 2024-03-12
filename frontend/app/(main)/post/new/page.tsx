"use client"

import NewPostPhoto from "./new-post-photo";
import { backend_url } from "@/app/settings";
import { Tag, TagDotProps_ } from "./tag";
import TagEditor, { TagEditorProps } from "./tag-editor";
import { ChangeEvent, useState, useEffect, MouseEvent, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { fn } from "@/app/util";
import "./new-post.css";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const blurRef = useRef<HTMLInputElement>(null);
    const photoRef = useRef<HTMLInputElement>(null);
    const capRef = useRef<HTMLTextAreaElement>(null);

    const [editorProps, setEditorProps] = useState<TagEditorProps | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [image, setImage] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>();
    // const [imageRes, setImageRes] = useState<string>();

    const onUploadClick = () => {
        photoRef.current?.click();
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

        const blur = blurRef.current?.checked;
        const caption = capRef.current?.value;

        const postMetadataRes = await fetch(backend_url('/posts/new'), {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'tags': tags,
                'blur': blur,
                'caption': caption
            })
        }).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error when creating new post! Error status: ${res.status}`);
            }
            return res.json();
        });
        const postId = postMetadataRes.postId;

        // // Create FormData object to send the image
        const imageData = new FormData();
        imageData.append('image', image);

        try {
            uploadPhoto(imageData, postId);
        } catch (err) {
            console.error("The error is: " + err);
        }
    };

    const uploadPhoto = async (formData: FormData, postId: string) => {
        try {
            const response = await fetch(backend_url('/posts/upload-image/' + postId), {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (response.ok) {
                console.log('Image uploaded successfully');
                router.push(`/post/${postId}`)
            } else {
                console.error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <h1 className="new-post-header">New Post</h1>
            <div id="file-upload-wrapper">
                <div className="upload-box" onClick={onUploadClick}>
                    <FaUpload />
                    <h4 className="upload-box-header">Choose Image to Upload</h4>
                    <input type="file" onChange={handleFileChange} className="photo-select" ref={photoRef} hidden />
                </div>
                <small>Files Supported: JPG, PNG</small>
            </div>

            <div id="photo-editor">
                <div className="image-tags">
                    {imagePreview && <NewPostPhoto imgSrc={imagePreview} {...dotProps} />}
                    {tagEditor}
                </div>
                <div className="settings">
                    <div className="file-change-wrapper" onClick={onUploadClick}>
                        <FaUpload /> Change image
                    </div>
                    <div className="blur-contain">
                        <label htmlFor="blur-switch" className="blur-label">Blur my face</label>
                        <input type="checkbox" id="blur-switch" className="toggle" ref={blurRef} />
                    </div>
                    <textarea className="caption" ref={capRef} placeholder="Start typing your caption."></textarea>
                    <button type="submit">
                        <MdOutlineAddAPhoto className="add-post-icon" />
                        <h4 className="add-post-header">Add Post</h4>
                    </button>
                </div>
            </div>
        </form>
    );
}
