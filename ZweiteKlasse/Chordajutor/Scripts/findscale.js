let textarea_from = document.querySelector('#textarea_from');
let div_found_scale = document.querySelector('#found_scale');


function find_scale() {

    div_found_scale.innerHTML = '';
    
    //Find all chords and put them in an array.
    let chords = find_chords_in_textarea();

    let scale_occurances = [];
    let major_counter = 0;
    let minor_counter = 0;
    let first_chord = chords[0];
    let last_chord = chords[chords.length-1];

    //Count which scale comes most often for
    for (let i = 0; i < chords.length; i++) {

        let current_chord = chords[i];
        let already_contained = false;
        let minor_major;
        if (current_chord.charAt(current_chord.length-1) == 'm') {
            minor_counter++;
            minor_major = 'minor';
        }
        else {
            major_counter++;
            minor_major = 'major';
        }

        for (let j = 0; j < scale_occurances.length; j++) {
            if (scale_occurances[j][0] == current_chord) {
                already_contained = true;
                break;
            }
        }

        if (!already_contained) {
            let current_scale;
            if (current_chord.charAt(current_chord.length-1) == 'm') current_scale = get_array_of_scale(current_chord.substring(0, current_chord.length-1).toLowerCase(), minor_major);
            else current_scale = get_array_of_scale(current_chord, minor_major);
            let counter = 0;
            let array_avoid_duplications = [];
            for (let j = 0; j < chords.length; j++) {
                if (current_scale.includes(chords[j]) && !array_avoid_duplications.includes(chords[j])) {
                    counter++;
                    array_avoid_duplications.push(chords[j]);
                }
            }
            scale_occurances.push([current_chord, counter])
        }
    }
    
    sort_occurance_array(scale_occurances);

    //Deduce which key it is in
    let top_keys = [];

    for (let i = 0; i < scale_occurances.length; i++) {
        if (scale_occurances[i][1] == scale_occurances[0][1]) top_keys.push(scale_occurances[i][0]);
    }

    let answer;
    if (top_keys.length == 1) answer = top_keys[0];
    else {
        if (top_keys.includes(last_chord)) answer = last_chord; //Ends in the tonic
        else if (top_keys.includes(first_chord)) answer = first_chord; //Starts with the tonic
        else answer = 'likely ' + top_keys[0];
    }

    if (answer.charAt(answer.length-1) == 'm') answer = answer.substring(0, answer.length-1) + '-minor';
    else answer = answer + '-major';

    console.log(top_keys)
    div_found_scale.innerHTML = 'Scale: ' + answer;

}


function find_chords_in_textarea() {
    let chords = [];
    let lines = textarea_from.value.split('\n');
    let chord_lines = [];

    for (let i = 0; i < lines.length; i++) {

        let words = lines[i].replace(/\s+/g, ' ').trim(); //https://stackoverflow.com/questions/16974664/how-to-remove-the-extra-spaces-in-a-string
        words = words.split(/\/|\s+/g); //https://stackoverflow.com/questions/14912502/how-do-i-split-a-string-by-whitespace-and-ignoring-leading-and-trailing-whitespa
        chord_lines[i] = true;
        let temporary_chords_array = [];

        for (let j = 0; j < words.length; j++) {

            if (!chord_regex.test(words[j])) {
                chord_lines[i] = false;
                temporary_chords_array = [];
                break;
            }
            else {
                temporary_chords_array.push(words[j]);
            }
        }
        console.log(temporary_chords_array)

        for (let j = 0; j < temporary_chords_array.length; j++) {
            let current_chord = temporary_chords_array[j];
            let found = false;
            if (current_chord.length >= 3 && /^[A-H][#|b](m|M)$/.test(current_chord.substring(0, 3))) {
                chords.push(current_chord.substring(0, 3));
                found = true;
            }
            if (!found && current_chord.length >= 2 && /^[A-H][#|b|m|M]$/.test(current_chord.substring(0, 2))) {
                chords.push(current_chord.substring(0, 2));
                found = true;
            }
            
            if (!found && /^[A-H]$/.test(current_chord.substring(0, 1))) chords.push(current_chord.substring(0, 1));
        }
    }
    return chords;
}


function sort_occurance_array(array) {
    let sorted = false;
    while (!sorted) {
        sorted = true;
        for (let i = 1; i < array.length; i++) {
            if (array[i][1] > array[i-1][1]) {
                let helpArray = array[i-1];
                array[i-1] = array[i];
                array[i] = helpArray;
                sorted = false;
            }
        }
    }
}
