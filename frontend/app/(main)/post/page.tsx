"use client"

import NewPostPhoto from "@/app/components/new-post-photo";
import { Tag, TagDotProps_ } from "@/app/components/tag";
import TagEditor, { TagEditorProps, TagEditorProps_ } from "@/app/components/tag-editor";
import { useState } from "react";


export default function Home() {
    const [editorProps, setEditorProps] = useState<TagEditorProps | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);

    const openEditor = (props: TagEditorProps_) => {
        setEditorProps({
            ...props,
            closeEditor: (f: (tags: Tag[]) => Tag[]) => {
                setTags(f(tags));
                setEditorProps(null);
            },
        });
    };

    const tagEditor = editorProps === null
        ? null
        : <TagEditor {...editorProps}></TagEditor>;

    const dotProps: TagDotProps_ = {
        addTag: tag => tags => [tag, ...tags],
        rmTag: tag => tags => tags.filter(t => t !== tag),
        openEditor
    };

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
            <NewPostPhoto imgSrc="/tango.jpg" dotProps={dotProps} />
            {tagEditor}
        </main>
    );
}
