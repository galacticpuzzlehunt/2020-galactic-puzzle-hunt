function normalize_guess(guess) {
    return guess.toUpperCase().replace(/[^A-Z]/g, '');
}

let answers = [
    'APOTOFU',
    'FASIBWMITINI',
    'GEVAXEGOMUZIXO',
    'KOLARVUBENA',
    'LOSMODAFQEYUNE',
    'MALORBILI',
    'SARODARVAXE',
    'TEIGIA'
];

function make_guess(id, guess) {
    if (!guess)
        return;
    guess = normalize_guess(guess);
    id = parseInt(id);
    document.getElementById("response"+id).innerHTML = 
        guess === answers[id-1] ?  "Correct!" : "Incorrect";
}
