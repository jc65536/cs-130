import { Tag } from "@/app/components/tag";

export type NewPostPhotoProps = {
    imgSrc: string,
    addTag: (tag: Tag) => void,
    rmTag: (tag: Tag) => void,
};

export default function NewPostPhoto(props: NewPostPhotoProps) {
    return (
        <div>
            new post photo
        </div>
    );
}
