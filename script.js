$(function() {
    var timeLength = $('.time-length').text(),
        breakLength = $('.break-length').text(),
        sessionTimer = 1,
        time,
        start,
        end,
        interval,
        difference,
        minutes,
        seconds,
        paused,
        pausedString;

    //change timer color for session or break
    function adjustTimerColor() {
        if (sessionTimer === 0) {
            $('.timer-div').css('color', 'midnightblue');
        } else {
            $('.timer-div').css('color', 'midnightblue');
        }
    }

    //initial sync of timer and time-length
    $('.timer').html("Session<br>" + timeLength + ":00");
    adjustTimerColor();

    //param timeLength or breakLength , Session 0r Break, '.time-length' or '.break-length'
    function syncValues(timerLength, timerName, timeLengthClass) {
        if (timerLength < 10) {
            timerLength = "0" + timerLength;
        }
        $(timeLengthClass).text(timerLength);
        $('.timer').html(timerName + "<br>" + timerLength + ":00");
    }


    //minus timeLength
    $('.minus').on('click', function() {
        if (timeLength < 1) {
            return;
        }
        timeLength--;
        if (sessionTimer === 1) {
            clearInterval(interval);
            paused = undefined;
            syncValues(timeLength, 'Session', '.time-length');
        } else {
            if (timeLength < 10) {
                timeLength = "0" + timeLength;
            }
            $('.time-length').text(timeLength);
        }
    });

    //plus timeLength
    $('.plus').on('click', function() {
        timeLength++;
        if (sessionTimer === 1) {
            clearInterval(interval);
            paused = undefined;
            syncValues(timeLength, 'Session', '.time-length');
        } else {
            if (timeLength < 10) {
                timeLength = "0" + timeLength;
            }
            $('.time-length').text(timeLength);
        }
    });

    //break minus
    $('.minus-break').on('click', function() {
        if (breakLength < 1) {
            return;
        }
        breakLength--;
        if (sessionTimer === 0) {
            clearInterval(interval);
            paused = undefined;
            syncValues(breakLength, 'Break', '.break-length');
        } else {
            if (breakLength < 10) {
                breakLength = "0" + breakLength;
            }
            $('.break-length').text(breakLength);
        }
    });

    //break plus
    $('.plus-break').on('click', function() {
        breakLength++;
        if (sessionTimer === 0) {
            clearInterval(interval);
            paused = undefined;
            syncValues(breakLength, 'Break', '.break-length');
        } else {
            if (breakLength < 10) {
                breakLength = "0" + breakLength;
            }
            $('.break-length').text(breakLength);
        }
    });

    //start timer
    $('.start').on('click', function() {
        if (sessionTimer === 0) {
            startInterval('.break-length', 0, "Break");
        } else {
            startInterval('.time-length', 1, "Session");
        }
    });

    //reset
    $('.reset').on('click', function() {
        clearInterval(interval);
        timeLength = $('.time-length').text();
        $('.timer').html("Session<br>" + timeLength + ":00");
        paused = undefined;
        sessionTimer = 1;
        adjustTimerColor();
    });

//'.time-length' or '.break-length'
//sessionTimer = 0 0r 1
//"Break" or "Session"

    function startInterval(timerLengthClass, sessionTimerValue, timerLabel){
        sessionTimer = sessionTimerValue;
        time = parseInt($(timerLengthClass).text(), 10);

        if (paused !== undefined) {
            paused = paused.slice(-5);
            pausedString = paused.split(':');
            end = moment().add(pausedString[0], 'm').add(pausedString[1], 's');
        } else {
            end = moment().add(time, 'm');
        }

        interval = setInterval(function() {
            adjustTimerColor();
            start = moment();

            if (end.diff(start) > 0) {
                difference = end.diff(start, 's');
                if (difference > 60) {
                    minutes = Math.floor(difference / 60);
                    if (minutes < 10) {
                        minutes = "0" + minutes;
                    }
                    seconds = difference - minutes * 60;
                    if (seconds < 10) {
                        seconds = "0" + seconds;
                    }
                } else {
                    minutes = "0" + "0";
                    seconds = difference;
                    if (seconds < 10) {
                        seconds = "0" + difference;
                    }
                    if (seconds < 1) {
                        playSound();
                        navigator.vibrate(1000);
                    }
                }
                $('.timer').html(timerLabel + "<br>" + minutes + ":" + seconds);
            } else {
                clearInterval(interval);
                paused = undefined;
                if(sessionTimer === 1) {
                    startInterval('.break-length', 0, "Break");
                } else {
                    startInterval('.time-length', 1, "Session");
                }
            }
        }, 500);

        //stop timer
        $('.stop').on('click', function() {
            clearInterval(interval);
            paused = $('.timer').text();
        });
    }
});
