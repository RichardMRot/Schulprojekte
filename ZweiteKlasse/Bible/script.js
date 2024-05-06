
let whichBook;
let idNumber;
let chapter = 0;
let verse1 = 0;
let verse2 = 0;
let books = fetchBooks();


document.querySelector('#old').addEventListener('click', function () {
    if (document.querySelector('#old select').value != null) {
        document.querySelector('#old').classList.add('chosen');
        whichBook = document.querySelector('#old select').value.replaceAll(/ /g, '_');
        document.querySelector('#new').classList.remove('chosen');
        setChapters();
        
        chapter = 0;
        document.querySelector('#verse').innerHTML = '';
        document.querySelector('#content p').innerHTML = '';
    }
});
document.querySelector('#new').addEventListener('click', function() {
    if (document.querySelector('#new select').value != null) {
        document.querySelector('#new').classList.add('chosen');
        whichBook = document.querySelector('#new select').value.replaceAll(/ /g, '_');
        document.querySelector('#old').classList.remove('chosen');
        setChapters();
        
        chapter = 0;
        document.querySelector('#verse').innerHTML = '';
        document.querySelector('#content p').innerHTML = '';
    }
});


function setBooks() {
    for (let i = 0; i < 39; i++) {
        document.querySelector('#old select').innerHTML += `
        <option value="${books[i][0]}">${books[i][0]}</option>`;
    }
    for (let i = 39; i < 66; i++) {
        document.querySelector('#new select').innerHTML += `
        <option value="${books[i][0]}">${books[i][0]}</option>`;
    }
}

function setChapters() {
    for (let i = 0; i < 66; i++) {
        if (books[i][0].replaceAll(/ /g, '_') == whichBook) idNumber = i;
    }

    document.querySelector('#search').style.display = 'none';
    document.querySelector('#chapter').innerHTML = '<h2>Chapters:</h2>';
    for (let i = 1; i <= books[idNumber][1]; i++) {
        document.querySelector('#chapter').innerHTML += `<div class="chooseCh" onclick="selectChapter(this, ${i})"><p>${i}</p></div>`;
        console.log()
    }
    verse1 = 0;
    verse2 = 0;
}


function selectChapter(chosen, number) {
    if (chosen.classList.contains('chosen')) {
        chapter = 0;
        chosen.classList.remove('chosen');
    }
    else {
        if (chapter != 0) {
            document.querySelector('#chapter .chosen').classList.remove('chosen');
        }
        chapter = number;
        chosen.classList.add('chosen');
        document.querySelector('#search').style.display = 'block';
        setVerses();
    }
    document.querySelector('#content p').innerHTML = '';
}

function setVerses() {
    fetch(`https://bible.helloao.org/api/ENGWEBP/${whichBook}/${chapter}.json`)
        .then( (response) => {
            return response.json();
        })

        .then( (chapter) => {
            verse1 = 0;
            verse2 = 0;
            let length = chapter.chapter.content[chapter.chapter.content.length-1].number;
            
            document.querySelector('#verse').innerHTML = '<h2>Verses:</h2>';
            for (let i = 1; i <= length; i++) {
                document.querySelector('#verse').innerHTML += `<div class="chooseVe" onclick="selectVerse(this, ${i})"><p>${i}</p></div>`
            }
        })

        .catch( (error) => {
            throw error;
        })
}

function selectVerse(chosen, number) {
    if (chosen.classList.contains('chosen')) {
        if (number == verse1) {
            verse1 = verse2;
            chosen.classList.remove('chosen');
            verse2 = 0;
        }
        else if (number == verse2) {
            verse2 = 0;
            chosen.classList.remove('chosen');
        }
        search(false);
    }
    else {
        if (verse2 != 0) {
            if (number > verse1) {
                verse2 = 0;
                document.querySelectorAll('#verse .chosen')[1].classList.remove('chosen');
            }
            else {
                verse1 = 0;
                document.querySelectorAll('#verse .chosen')[0].classList.remove('chosen');
            }
        }
        if (verse1 == 0) {
            verse1 = number;
            chosen.classList.add('chosen');
        }
        else if (verse2 == 0) {
            if (number > verse1) verse2 = number;
            else {
                let help = verse1;
                verse1 = number;
                verse2 = help;
            }
            chosen.classList.add('chosen');
        }
        search(false);
    }
}


function fetchBooks() {
    let arr = [];
    fetch(`https://bible.helloao.org/api/ENGWEBP/books.json`)
        .then( (response) => {
            return response.json();
        })

        .then( (books) => {
            for (let i = 0; i < 66; i++) arr[i] = [books.books[i].name, books.books[i].numberOfChapters];

            arr[21][0] = 'Song of Songs';

            setTimeout(() => {
                setBooks();
            }, 50);
        })

        .catch( (error) => {
            throw error;
        })
    
    return arr;
}


function resetVerses() {
    verse1 = 0;
    verse2 = 0;
    let versesArray = document.querySelectorAll('#verse .chosen');
    for (let i = 0; i < versesArray.length; i++) {
        versesArray[i].classList.remove('chosen');
    }
}


function search(fullChapter) {
    if (chapter != 0) {

        let content = document.querySelector('#content p');
        content.innerHTML = ''

        fetch(`https://bible.helloao.org/api/ENGWEBP/${whichBook}/${chapter}.json`)
            .then( (response) => {
                return response.json();
            })

            .then( (chapterJson) => {

                let length = chapterJson.chapter.content.length;
                let chapterData = chapterJson.chapter.content;

                if (!fullChapter) {
                    if (verse2 != 0) {
                        for (let i = 0; i < length; i++) {
                            if (chapterData[i].number >= verse1 && chapterData[i].number <= verse2) {
                                if (chapterData[i].type == 'verse') {
                                    for (let j = 0; j < chapterData[i].content.length; j++) {
                                        if (typeof chapterData[i].content[j] == 'string') {
                                            content.innerHTML += (content.innerHTML == '' ? '' : ' ') + chapterData[i].content[j];
                                        }
                                        else if (typeof chapterData[i].content[j] == 'object') {
                                            if ('text' in chapterData[i].content[j]) content.innerHTML += (content.innerHTML == '' ? '' : ' ') + chapterData[i].content[j].text;
                                            if ('content' in chapterData[i].content[j]) content.innerHTML += (content.innerHTML == '' ? '' : ' ') + chapterData[i].content[j].content.text;
                                        }
                                    }
                                }
                                else if (chapterData[i].type == 'line_break' && content.innerHTML != '') content.innerHTML += '<br>';
                            }
                        }
                    }
                    else if (verse1 != 0) {
                        for (let i = 0; i < length; i++) {
                            if (chapterData[i].type == 'verse' && chapterData[i].number == verse1) {
                                for (let j = 0; j < chapterData[i].content.length; j++) {
                                    if (typeof chapterData[i].content[j] == 'string') {
                                        content.innerHTML += (content.innerHTML == '' ? '' : ' ') + chapterData[i].content[j];
                                    }
                                    else if (typeof chapterData[i].content[j] == 'object') {
                                        if ('text' in chapterData[i].content[j]) content.innerHTML += (content.innerHTML == '' ? '' : ' ') + chapterData[i].content[j].text;
                                        if ('content' in chapterData[i].content[j]) content.innerHTML += (content.innerHTML == '' ? '' : ' ') + chapterData[i].content[j].content.text;
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    for (let i = 0; i < length; i++) {
                        if (chapterData[i].type == 'verse') {
                            for (let j = 0; j < chapterData[i].content.length; j++) {
                                if (typeof chapterData[i].content[j] == 'string') content.innerHTML += (content.innerHTML == '' ? '' : ' ') + chapterData[i].content[j];
                                else if (typeof chapterData[i].content[j] == 'object') {
                                    if ('text' in chapterData[i].content[j]) content.innerHTML += (content.innerHTML == '' ? '' : ' ') + chapterData[i].content[j].text;
                                    if ('content' in chapterData[i].content[j]) content.innerHTML += (content.innerHTML == '' ? '' : ' ') + chapterData[i].content[j].content.text;
                                }
                            }
                        }
                        else if (chapterData[i].type == 'line_break') content.innerHTML += '<br>';
                    }
                    resetVerses();
                }
                content.scrollIntoView({block: 'start', behavior: 'smooth'});
            })

            .catch( (error) => {
                throw error;
            })

    }
}