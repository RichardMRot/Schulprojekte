let keyboard = document.querySelector('#keyboard #board');
let chord_input = document.querySelector('input');

let keyboard_notes = ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'H3',
'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'H4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 
'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'H5'
];

let colored_notes = []


create_keyboard();

function create_keyboard() {    
    let current_index = 0;
    //white keys
    for (let i = 0; i < 20; i++) {
        if (keyboard_notes[current_index].includes('#')) current_index++;
        keyboard.innerHTML += `
        <rect class="note" id="${keyboard_notes[current_index]}" onclick="play_note('${keyboard_notes[current_index]}')" 
        x="${1.9+(i*4.8)}%" y="22%" width="4.3%" height="70%" fill="white" ry="2%" />
        `
        current_index++;
    }
    1625
    //black keys
    current_index = 0;
    let two_three = 2;
    let counter = 0;
    for (let i = 0; i < 19; i++) {
        if (!keyboard_notes[current_index].includes('#')) current_index++;
        if (counter < two_three) {
            keyboard.innerHTML += `
            <rect class="note" id="${keyboard_notes[current_index]}" onclick="play_note('${keyboard_notes[current_index]}')" 
            x="${4.8+(i*4.8)}%" y="24%" width="3.2%" height="44%" fill="black" ry="2%">
            `
        }
        if (counter == two_three) {
            counter = -1;
            two_three = two_three == 2 ? 3 : 2;
        }
        counter++;
        current_index++;
    }
}



let current_marked_chords = [];

function find_chord() {
    
    colored_notes.forEach(element => {
        element.style.fill = element.style.fill == 'rgb(11, 173, 191)' ? 'black' : 'white';
    });
    colored_notes = [];

    let chord_name = chord_input.value;
    chord_name = chord_name.charAt(0).toUpperCase() + chord_name.substring(1);
    
    let chords = [];
    let root_note = '';
    let found = false;

    if (chord_regex.test(chord_name)) {
        found = true;
        root_note = chord_name.substring(0, chord_name.includes('#') || chord_name.includes('b') ? 2 : 1);
    }
    if (!keyboard_notes.includes(root_note+'3')) {
        for (let i = 0; i < enharmonic_notes.length; i++) {
            if (enharmonic_notes[i].includes(root_note)) {
                root_note = enharmonic_notes[i][enharmonic_notes[i].indexOf(root_note) == 1 ? 0 : 1];
            }
        }
    }
    //If the chord exists   
    if (found) {
        let root_index = keyboard_notes.indexOf(root_note+'3');
        chords.push(root_note+'3');
        chord_name = chord_name.replace(root_note, '');

        //If suspended chord
        if (chord_name.includes('sus2')) chords.push(keyboard_notes[root_index+2]);
        else if (chord_name.match(/^(sus)|(sus4)$/)) chords.push(keyboard_notes[root_index+5]);
        //Diminished
        else if (chord_name.match(/^(dim)|°$/)) {
            chords.push(keyboard_notes[root_index+3]);
            chords.push(keyboard_notes[root_index+6]);
        }
        //Normal
        else if (!chord_name.includes('5')) {
            //if Minor
            if (chord_name.charAt(0) == 'm' && (chord_name.length != 1 ? chord_name.charAt(1) != 'a' : true)) {
                chords.push(keyboard_notes[root_index+3]);
            }
            //If Major
            else chords.push(keyboard_notes[root_index+4]);
        }
        //Augmented
        if (chord_name.match(/^(aug)|\+$/)) chords.push(keyboard_notes[root_index+8]);
        //Normal fifth note
        if (!chord_name.match(/^(dim)|°$/) && !chord_name.match(/^(aug)|\+$/)) chords.push(keyboard_notes[root_index+7]);

        //Extra notes
        if (chord_name.includes('6')) chords.push(keyboard_notes[root_index+9]);

        //Added note chords
        else if (chord_name.includes('add')) {
            switch(true) {
                case (chord_name.includes('add13')):
                    chords.push(keyboard_notes[root_index+21]);
                    chord_name.replace('add13', '');
                    break;
                case (chord_name.includes('add11')):
                    chords.push(keyboard_notes[root_index+17]);
                    chord_name.replace('add11', '');
                    break;
                case (chord_name.includes('add9')):
                    chords.push(keyboard_notes[root_index+14]);
                    chord_name.replace('add9', '');
                    break;
                case (chord_name.includes('add6')):
                    chords.push(keyboard_notes[root_index+9])
                    chord_name.replace('add6', '');
                    break;
                case (chord_name.includes('add4')):
                    chords.push(keyboard_notes[root_index+5]);
                    chord_name.replace('add4', '');
                    break;
                case (chord_name.includes('add2')):
                    chords.push(keyboard_notes[root_index+2]);
                    chord_name.replace('add2', '');
                    break;
                default:
                    break;
            }
        }
        
        //Some extra notes stack
        switch (true) {
            case (chord_name.includes('13')):
                chords.push(keyboard_notes[root_index+21]);
            case (chord_name.includes('11')):
                chords.push(keyboard_notes[root_index+17]);
            case (chord_name.includes('9')):
                chords.push(keyboard_notes[root_index+14]);
            case (chord_name.includes('7')):
                if (chord_name.includes('maj')) chords.push(keyboard_notes[root_index+11]);
                else chords.push(keyboard_notes[root_index+10]);
                break;
            default:
                break;
        }
        
    }
    //If it doesn't
    else {
        alert('Not a chord')
    }
    chords.forEach(i => {
        keyboard.getElementById(i).style.fill = i.includes('#') ? '#0badbf' : '#0ecee3';
        colored_notes.push(keyboard.getElementById(i));
        //Play the note
        const synth = new Tone.Synth().toDestination();
        const now = Tone.now();
        synth.triggerAttackRelease(i.replace('H', 'B'), '8n');
        synth.triggerRelease(now+0.5);
    });
}




function play_chord() {
    colored_notes.forEach(i => {
        const synth = new Tone.Synth().toDestination();
        const now = Tone.now();
        synth.triggerAttackRelease(i.id.replace('H', 'B'), '8n');
        synth.triggerRelease(now+0.5);
    })
}


function play_note(note_name) {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease(note_name.replace('H', 'B'), '8n');
    synth.triggerRelease(now+0.5);
}