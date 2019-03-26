var period = 60 * 1000 * 60 * 2
var startTime = new Date().getTime();
var count = 0
var end = new Date().getTime() + period
var interval = 1000
var currentInterval = interval

function loop(){
    count++
    var offset=new Date().getTime()-(startTime+count*interval)
    currentInterval=interval-offset
    //do something
    setTimeout(loop,currentInterval)
}
setTimeout(loop,currentInterval)
