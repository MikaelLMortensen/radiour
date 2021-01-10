let timeText = ""
let offsetMinutes:number = 0
let offsetHours:number = 0
let hour:number = 0
let minute:number = 0
let second:number = 0
let year:number=2000
let month:number=1
let day:number=1
let lastUpdated = 0
radio.setGroup(17)
getTime()
sevenSegment.startSevenSegPin0()

// offsetHours = 7
// offsetMinutes = 10

radio.onReceivedValue(function (name: string, value: number) {

    switch(name) {
        case "hour":
        offsetHours = value
        break;
        case "minute":
        offsetMinutes = value
        break;
        case "second":
        second = value
        break;
        case "year":
        year = value
        break;
        case "month":
        month = value
        break;
        case "day":
        day = value
        break;
    }
    lastUpdated = input.runningTime()
})

input.onButtonPressed(Button.A, function () {
    basic.showString(GetTimeString())
})

input.onButtonPressed(Button.AB, function () {
    getTime()
})

input.onButtonPressed(Button.B, function () {

    let totalSeconds = Math.round((input.runningTime() - lastUpdated) / 1000)

    basic.showString("H:" + offsetHours.toString() + " M:" + offsetMinutes.toString() + " S:" + totalSeconds.toString())
    //basic.showString(GetDateString() + "  ")
})

function getTime() {
    radio.sendString("gettime")
}

function GetDateString() : string {
    let date = year.toString() +  "-"
    if (month < 10) {
        date += "0"
    }
    date += month.toString() + "-"
    if (day < 10){
        date += "0"
    }
    date += day.toString()
    
    return date
}

function GetTimeString() : string {
    let timeText = ""
    if (hour < 10) {
        timeText = timeText + "0"
    }
    timeText = timeText + hour.toString() + ","
    if (minute < 10) {
        timeText = timeText + "0"
    }
    timeText = timeText + minute.toString()
    return timeText
}

function updateTime() {
    let totalSeconds = Math.floor((input.runningTime() - lastUpdated) / 1000)

    // update clock every 15 minutes
    if (totalSeconds > 15*60) {
        getTime()
    }

    totalSeconds = totalSeconds + (offsetHours * 3600)
    totalSeconds = totalSeconds + (offsetMinutes * 60)

    if (totalSeconds >= 3600) {
        hour = Math.floor(totalSeconds / 3600)
        totalSeconds = Math.floor(totalSeconds - (hour * 3600))
    }
    if (totalSeconds >= 60) {
        minute = Math.floor(totalSeconds / 60)
        totalSeconds = Math.floor(totalSeconds - (minute * 60))
    }
    second = totalSeconds
    if (second < 0) {
        second = 60 + second
    }   
}

let currentSegText = ""
let newSegText = ""

basic.forever(function () {
    updateTime()    
    newSegText = GetTimeString()
    if (newSegText != currentSegText) {
        currentSegText = newSegText;
        sevenSegment.writeString(currentSegText)
    }
    basic.pause(5000)
})