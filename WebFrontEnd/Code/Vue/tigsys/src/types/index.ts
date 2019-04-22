
export interface pageText_IF {
    text: string
}
let durations = [400, 600, 800]
export class pageText {
    text: string
    cssClass: string
    animatedClass: string
    isVisible: boolean
    lottieAnime: any
    duration: number
    constructor(text, cssClass, animatedClass, isVisible) {
        this.text = text
        this.cssClass = cssClass
        this.animatedClass = `animated ${animatedClass}`
        this.isVisible = isVisible
        this.duration = durations[Math.random() * durations.length]
    }
}

export interface ILocation{
    mchAdrPvn:string,
    mchAdrCty:string,
    mchAdrReg:string,
    mchLocLng:number,
    mchLocLat:number,
  }