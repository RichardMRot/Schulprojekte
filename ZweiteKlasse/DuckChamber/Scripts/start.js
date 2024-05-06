let click_button = new Audio("SoundAssets/select.wav");

function start() {
    click_button.play();
    setTimeout(function() {
        window.location.href = 'Subpages/name.html';
    }, 180);
}