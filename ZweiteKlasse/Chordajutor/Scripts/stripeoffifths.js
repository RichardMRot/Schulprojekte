let left_stripe = document.querySelector('#left_stripe');
let show_scale_div = document.querySelector('#show_scale');
let right_stripe = document.querySelector('#right_stripe');
let scale_chords = document.querySelector('#scale_chords');

function update_scale(new_scale, major_minor) {
    if (show_scale_div.style.display = 'none') {
        show_scale_div.style.display = 'flex';
        left_stripe.style.marginRight = '2%';
        right_stripe.style.marginLeft = '2%';
    }
    show_scale_div.innerHTML = new_scale;
    update_chords(new_scale, major_minor)
}


fill_stripes();

function fill_stripes() {
    
    for (let i = 0; i < 8; i++) {
        left_stripe.innerHTML += `
        <tr>
            <td class="major_scale" onclick="update_scale('${fifths_flat_major[i+1]}', 'major')">${fifths_flat_major[i+1]}</td>
            <td class="minor_scale" onclick="update_scale('${fifths_flat_minor[i+1]}', 'minor')">${fifths_flat_minor[i+1]}</td>
        </tr>
        `;
        right_stripe.innerHTML += `
        <tr>
            <td class="minor_scale" onclick="update_scale('${fifths_sharp_minor[i+1]}', 'minor')">${fifths_sharp_minor[i+1]}</td>
            <td class="major_scale" onclick="update_scale('${fifths_sharp_major[i+1]}', 'major')">${fifths_sharp_major[i+1]}</td>
        </tr>
        `;
    }
}

let chords_visible = false;
function update_chords(new_scale, minor_major) {

    if (!chords_visible) {
        scale_chords.innerHTML += `
        <h3>Chords:</h3>

        <table id="chords">
            <tr>
                <th>I</th>
                <th>ii</th>
                <th>iii</th>
                <th>IV</th>
                <th>V</th>
                <th>vi</th>
                <th>vii°</th>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>`
        chords_visible = true;
        scale_chords.style.display = 'block';
    }

    let chord_row = document.querySelector('#chords tr:nth-child(2)');
    chord_row.scrollIntoView();

    notes_current_scale = get_array_of_scale(new_scale, minor_major)

    for (let i = 0; i < 7; i++) {
        chord_row.querySelector('td:nth-child('+(i+1)+')').innerHTML = notes_current_scale[i];
    }


}