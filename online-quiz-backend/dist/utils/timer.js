"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTimer = startTimer;
exports.resetTimer = resetTimer;
exports.startQuestionTimer = startQuestionTimer;
function startTimer(duration, callback) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(() => {
        minutes = parseInt((timer / 60).toString(), 10);
        seconds = parseInt((timer % 60).toString(), 10);
        console.log(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        if (--timer < 0) {
            clearInterval(interval);
            callback();
        }
    }, 1000);
}
function resetTimer(duration) {
    return duration;
}
function startQuestionTimer(duration, onTimeout) {
    let timer = duration;
    const interval = setInterval(() => {
        console.log(`Time remaining: ${timer} seconds`);
        if (--timer < 0) {
            clearInterval(interval);
            onTimeout(); // Trigger the timeout callback
        }
    }, 1000);
}
