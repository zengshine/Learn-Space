
export interface pageText_IF {
    text: string
}
export class pageText {
    text: string
    cssClass: string
    animatedClass: string
    isVisible: boolean
    lottieAnime: any
    constructor(text, cssClass, animatedClass, isVisible) {
        this.text = text
        this.cssClass = cssClass
        this.animatedClass = `animated ${animatedClass}`
        this.isVisible = isVisible
    }
}