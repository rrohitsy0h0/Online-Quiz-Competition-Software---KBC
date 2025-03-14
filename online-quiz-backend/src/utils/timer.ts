export function startTimer(duration: number, callback: () => void) {
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

export function resetTimer(duration: number) {
    return duration;
}

export function startQuestionTimer(duration: number, onTimeout: () => void) {
    let timer = duration;
    const interval = setInterval(() => {
        console.log(`Time remaining: ${timer} seconds`);
        if (--timer < 0) {
            clearInterval(interval);
            onTimeout(); // Trigger the timeout callback
        }
    }, 1000);
}