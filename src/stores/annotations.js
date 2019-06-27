import {writable} from 'svelte/store'

const annotations = writable([])
export const annotationModalIsActive = writable(true)

let ID=0;



export function activateAnnotationModal() {
    annotationModalIsActive.set(true)
}

export function deactivateAnnotationModal() {
    annotationModalIsActive.set(false)
}

export function addAnnotation(annotation) {
    annotation.id = ID;
    ID += 1;
    annotations.update(anns => [...anns, annotation])
}

export function removeAnnotation(annotationID) {
    annotations.update(anns => anns.filter(ann => ann.id !== annotationID))

}


export default annotations