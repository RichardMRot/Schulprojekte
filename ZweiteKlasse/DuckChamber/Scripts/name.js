let click_button = new Audio("../SoundAssets/select.wav");
let no_name = new Audio("../SoundAssets/negative.wav");

let input = document.querySelector('input');

function play() {
    if (input.value != '') {
        click_button.play();
        setTimeout(function() {
            localStorage['name'] = input.value;
            window.location.href = 'spritegame.html';
        }, 180);
    }
    else {
        no_name.play();
        input.style.animation = 'none';
        input.offsetHeight;
        input.style.animation = 'noName 0.6s ease 1';
    }
}