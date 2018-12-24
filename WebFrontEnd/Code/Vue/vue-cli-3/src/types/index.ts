
export interface pageText_IF {
    text: string
}
export class pageText {
    text: string
    cssClass: string
    isVisible: boolean
    constructor(text, cssClass, isVisible) {
        this.text = text
        this.cssClass = "animated " + cssClass
        this.isVisible = isVisible
    }
}