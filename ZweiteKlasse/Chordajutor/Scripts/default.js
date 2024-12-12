let flat_notes = ["A", "B", "H", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];
let sharp_notes = ["A", "A#", "H", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

let enharmonic_notes = [['C#', 'Db'], ['D#', 'Eb'], ['E#', 'F'], ['F#', 'Gb'], ['G#', 'Ab'], ['A#', 'B'], ['H', 'Cb']];

let fifths_sharp_major = ["F", "C", "G", "D", "A", "E", "H", "F#", "C#", "G#"];             // Start: C, 1 | End: C#, 8
let fifths_sharp_minor = ["d", "a", "e", "h", "f#", "c#", "g#", "d#", "a#", "e#", "h#"];    // Start: a, 1 | End: a#, 8
let fifths_flat_major = ["G", "C", "F", "B", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"];           // Start: C, 1 | End: Cb, 8
let fifths_flat_minor = ["e", "a", "d", "g", "c", "f", "b", "eb", "ab", "db", "gb"];        // Start: a, 1 | End: ab, 8

let transposing_values = ["Cb", "Gb", "Db", "Ab", "Eb", "B", "F", "C", "G", "D", "A", "E", "H", "F#", "C#"]

let notes_current_scale = [];

let chord_regex = /^([A-Ha-h])([#b]?)(M|m)?(maj(7)?|7|dim|aug|°|\+|sus2|sus4|sus)?([5-6]|[8-9]|11|13|add2|add(2|4|6|9|11|13)|7b5|7#9)?$/;



//https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-specific-index-in-javascript
String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length)
}


//Return array of a certain scale
function get_array_of_scale(scale, major_minor) {
    let scale_array = [];
    let major_fifths = [];
    let minor_fifths = [];
    let start_index = 0;
    //Major scale
    if (major_minor == "major") {
        //Sharp
        if (scale == "C" || (fifths_sharp_major.includes(scale) && scale != "F")) {
            major_fifths = fifths_sharp_major.slice();
            minor_fifths = fifths_sharp_minor.slice();
            start_index = fifths_sharp_major.indexOf(scale);
        }
        //Flat
        else {
            major_fifths = fifths_flat_major.slice();
            minor_fifths = fifths_flat_minor.slice();
            start_index = fifths_flat_major.indexOf(scale);
        }
        //Assigning the values to the array
        scale_array[0] = major_fifths[start_index];
        scale_array[1] = minor_fifths[start_index-1].charAt(0).toUpperCase()+minor_fifths[start_index-1].substring(1)+'m';
        scale_array[2] = minor_fifths[start_index+1].charAt(0).toUpperCase()+minor_fifths[start_index+1].substring(1)+'m';
        scale_array[3] = major_fifths[start_index-1];
        scale_array[4] = major_fifths[start_index+1];
        scale_array[5] = minor_fifths[start_index].charAt(0).toUpperCase()+minor_fifths[start_index].substring(1)+'m';
        scale_array[6] = minor_fifths[start_index+2].charAt(0).toUpperCase()+minor_fifths[start_index+2].substring(1)+'m';
    }
    //Minor scale
    else {
        scale = scale.toLowerCase();
        //Sharp
        if (scale == "a" || (fifths_sharp_minor.includes(scale) && scale != "d")) {
            major_fifths = fifths_sharp_major.slice();
            minor_fifths = fifths_sharp_minor.slice();
            start_index = fifths_sharp_minor.indexOf(scale);
        }
        //Flat
        else {
            major_fifths = fifths_flat_major.slice();
            minor_fifths = fifths_flat_minor.slice();
            start_index = fifths_flat_minor.indexOf(scale);
        }

        //Assigning the values to the array
        scale_array[0] = minor_fifths[start_index].charAt(0).toUpperCase()+minor_fifths[start_index].substring(1)+'m';
        scale_array[1] = minor_fifths[start_index+2].charAt(0).toUpperCase()+minor_fifths[start_index+2].substring(1)+'m';
        scale_array[2] = major_fifths[start_index];
        scale_array[3] = minor_fifths[start_index-1].charAt(0).toUpperCase()+minor_fifths[start_index-1].substring(1)+'m';
        scale_array[4] = minor_fifths[start_index+1].charAt(0).toUpperCase()+minor_fifths[start_index+1].substring(1)+'m';
        scale_array[5] = major_fifths[start_index-1];
        scale_array[6] = major_fifths[start_index+1];
    }
    return scale_array;
}



// made with ChatGPT
// Function to capture the current animation time
function captureAnimationStates() {
    const animatedElements = document.querySelectorAll('body, .shapes'); // Adjusted selector
    const states = [];

    animatedElements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element);
        const animationDuration = parseFloat(computedStyle.animationDuration) * 1000; // Convert to milliseconds
        const animationDelay = parseFloat(computedStyle.animationDelay) * 1000; // Convert to milliseconds
        const animationPlayState = computedStyle.animationPlayState;

        let animationStartTime = element.getAttribute('data-animation-start-time');
        
        if (!animationStartTime) {
            animationStartTime = Date.now() - animationDelay; // Adjusted to account for delay
            element.setAttribute('data-animation-start-time', animationStartTime);
        }

        const currentTime = (Date.now() - animationStartTime) % animationDuration; // Normalize the time

        states.push({
            index: index,
            currentTime: currentTime,
            playState: animationPlayState
        });
    });

    sessionStorage.setItem('animationStates', JSON.stringify(states));
}

// Call this function before navigating away
window.onbeforeunload = captureAnimationStates;



// Function to restore the animation state
function restoreAnimationStates() {
    const animatedElements = document.querySelectorAll('body, .shapes'); // Adjusted selector
    const states = JSON.parse(sessionStorage.getItem('animationStates'));

    if (states) {
        states.forEach((state) => {
            const { index, currentTime, playState } = state;
            const element = animatedElements[index];
            const computedStyle = window.getComputedStyle(element);
            const animationDuration = parseFloat(computedStyle.animationDuration) * 1000; // Convert to milliseconds

            // Calculate the new start time based on the normalized saved current time
            const newStartTime = Date.now() - currentTime;
            element.setAttribute('data-animation-start-time', newStartTime);

            // Set the animation properties to reflect the saved state
            element.style.animationDelay = `-${currentTime}ms`;
            element.style.animationPlayState = playState;

            // Optionally, force a reflow to ensure the animation restarts correctly
            element.offsetHeight;
        });
    }
}

// Call this function on page load
window.onload = restoreAnimationStates;