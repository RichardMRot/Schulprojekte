let scale_from_select = document.querySelector('#transpose_from');
let steps_transposed_input = document.querySelector('#steps');
let scale_to_select = document.querySelector('#transpose_to');

let textarea_from = document.querySelector('#textarea_from');
let textarea_to = document.querySelector('#textarea_to');


fillWithScales('major');

function fillWithScales(minor_major) {

    let scale_array = minor_major == 'major' ? major_scales : minor_scales;

    for (let i = 0; i < major_scales.length; i++) {
        scale_from_select.innerHTML += `<option value="${scale_array[i]}">${scale_array[i]}</option>`;
        scale_to_select.innerHTML += `<option value="${scale_array[i]}">${scale_array[i]}</option>`;
    }

    let c_value = document.querySelector('#transpose_from').value = 'C';
    c_value.selected = 'selected';

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

        let current_line = lines[i];
        
        if (chord_lines[i] == true) {

            let can_transpose_current_char = true;

            for (let j = 0; j < lines[i].length; j++) {

                if (!/[\s/]/.test(current_line.charAt(j)) && can_transpose_current_char) {

                    can_transpose_current_char = false;
                    let new_index = major_scales.indexOf(current_line.charAt(j)) + parseInt(steps_transposed_input.value);
                    if (new_index < 0) new_index += major_scales.length;
                    new_index = new_index % (major_scales.length);
                    current_line = current_line.replaceAt(j, major_scales[new_index]);

                }
                else if (/[\s/]/.test(current_line.charAt(j))) can_transpose_current_char = true;
            }   
        }
        textarea_to.innerHTML += `${current_line}\n`;
    }

}