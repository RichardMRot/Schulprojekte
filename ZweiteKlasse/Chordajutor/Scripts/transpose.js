let scale_from_select = document.querySelector('#transpose_from');
let steps_transposed_input = document.querySelector('#steps');
let scale_to_select = document.querySelector('#transpose_to');

let textarea_from = document.querySelector('#textarea_from');
let textarea_to = document.querySelector('#textarea_to');

let enharmonic_button = document.querySelector('#enharmonic_button');
let enharmonic_toggled_to = 'sharp'; //'sharp' or 'flat'


function enharmonic_change() {
    if (enharmonic_toggled_to == 'flat') {
        enharmonic_toggled_to = 'sharp';
        enharmonic_button.innerHTML = 'Enharmonic change (#)';
    } else {
        enharmonic_toggled_to = 'flat';
        enharmonic_button.innerHTML = 'Enharmonic change (b)';
    }
    if (textarea_to.innerHTML != '') {
        transpose();
    }
}


function transpose() {

    textarea_to.innerHTML = '';
    
    let lines = textarea_from.value.split('\n');
    let chord_lines = [];

    for (let i = 0; i < lines.length; i++) {

        let words = lines[i].replace(/\s+/g, ' ').trim(); //https://stackoverflow.com/questions/16974664/how-to-remove-the-extra-spaces-in-a-string
        words = words.split(/\s+/g); //https://stackoverflow.com/questions/14912502/how-do-i-split-a-string-by-whitespace-and-ignoring-leading-and-trailing-whitespa
        chord_lines[i] = true;

        for (let j = 0; j < words.length; j++) {

            if (!chord_regex.test(words[j])) {
                chord_lines[i] = false;
            }
        }
    }
    for (let i = 0; i < chord_lines.length; i++) {

        let current_line = lines[i]+' ';
        
        if (chord_lines[i] == true) {

            let can_transpose_current_char = true;

            for (let j = 0; j < current_line.length; j++) {

                if (current_line.charAt(j) != ' ' && can_transpose_current_char) {

                    can_transpose_current_char = false;

                    let chord;
                    //If the chord has a # or a b
                    if (/#|b/.test(current_line.charAt(j+1))) {
                        chord = current_line.substring(j, j+2);
                    }
                    //Otherwise
                    else chord = current_line.charAt(j);


                    let used_array = !chord.includes('b') ? sharp_notes : flat_notes;
                    let transposed_index = used_array.indexOf(chord) + parseInt(steps_transposed_input.value);
                    if (transposed_index < 0) transposed_index += used_array.length;
                    transposed_index = transposed_index % (used_array.length);
                    
                    //In case of the enharmonic change
                    if (used_array == sharp_notes && enharmonic_toggled_to == 'flat') used_array = flat_notes;
                    else if (used_array == flat_notes && enharmonic_toggled_to == 'sharp') used_array = sharp_notes;

                    //Original chord has no # or b
                    if (chord.length == 1) {
                        let transposed_value = used_array[transposed_index];
                        let help_string = current_line.substring(j+1);
                        current_line = current_line.substring(0, j) + transposed_value + help_string;
                    }
                    //Otherwise
                    else {
                        let transposed_value = used_array[transposed_index];
                        if (transposed_value.length == 2) {
                            current_line = current_line.replaceAt(j, transposed_value.charAt(0));
                        } else {
                            current_line = current_line.substring(0, j) + transposed_value + current_line.substring(j+2);
                        }
                    }

                }
                else if (current_line.charAt(j) == ' ') {
                    can_transpose_current_char = true;
                }
            }   
        }
        textarea_to.innerHTML += `${current_line}\n`;
    }

}