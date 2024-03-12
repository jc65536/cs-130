import {
    FaceDetector,
    FilesetResolver,
    Detection
} from "@mediapipe/tasks-vision";

import "jimp";

const { Jimp } = window as any;

export const resize = async (name: string, src: Blob, cb: (_: File) => void) => {
    const img = await Jimp.read(await src.arrayBuffer());

    // @ts-ignore
    img.resize(480, Jimp.AUTO)
        .quality(90)
        // @ts-ignore
        .getBuffer(Jimp.MIME_JPEG, (_, buf) =>
            cb(new File([new Blob([buf])], name, { type: "image/jpeg" })));
};

let faceDetector: FaceDetector;

// Initialize the object detector
const initializefaceDetector = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU"
        },
        runningMode: "IMAGE"
    });
};

initializefaceDetector();

/**
 * Detect faces in still images on click
 */
export async function detectFace(target: HTMLImageElement, cb: (_: Blob) => void, errCb: () => void) {
    if (!faceDetector) {
        console.log("Wait for objectDetector to load before clicking");
        return;
    }

    // faceDetector.detect returns a promise which, when resolved, is an array of Detection faces
    const detections = faceDetector.detect(target).detections;

    displayImageDetections(detections, target, cb, errCb);
}

async function displayImageDetections(detections: Detection[], target: HTMLImageElement, cb: (_: Blob) => void, errCb: () => void) {
    const ratio = target.height / target.naturalHeight;
    console.log(ratio);

    for (let detection of detections) {
        const left = detection.boundingBox!.originX;
        const top = detection.boundingBox!.originY;
        const width = detection.boundingBox!.width;
        const height = detection.boundingBox!.height;

        console.log(left, top, width, height);

        const img = await Jimp.read(target.src);

        // @ts-ignore
        img.pixelate(width / 9, left, top, width, height)
            // @ts-ignore
            .getBuffer(Jimp.MIME_JPEG, (_, buf) => {
                cb(new Blob([buf]));
            });
        
        return;
    }

    errCb();
}
