"use strict";

/*

This file implements functionality that was server-side during the hunt.


*/


var ascii_uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var ALPHABET = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
var SCRABBLE = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10];
var MORSE = [2, 4, 4, 3, 1, 4, 3, 4, 2, 4, 3, 4, 2, 2, 3, 4, 4, 3, 3, 1, 3, 4, 3, 4, 4, 4];
var MOONS_OF_NEPTUNE = new Set(['NAIAD', 'THALASSA', 'DESPINA', 'GALATEA', 'LARISSA', 'HIPPOCAMP', 'PROTEUS', 'TRITON', 'NEREID', 'HALIMEDE', 'SAO', 'LAOMEDEIA', 'PSAMATHE', 'NESO']);
var MOONS_OF_SATURN = new Set(['PAN', 'DAPHNIS', 'ATLAS', 'PROMETHEUS', 'PANDORA', 'EPIMETHEUS', 'JANUS', 'AEGAEON', 'MIMAS', 'METHONE', 'ANTHE', 'PALLENE', 'ENCELADUS', 'TETHYS', 'TELESTO', 'CALYPSO', 'DIONE', 'HELENE', 'POLYDEUCES', 'RHEA', 'TITAN', 'HYPERION', 'IAPETUS', 'KIVIUQ', 'IJIRAQ', 'PHOEBE', 'PAALIAQ', 'SKATHI', 'ALBIORIX', 'BEBHIONN', 'SKOLL', 'ERRIAPUS', 'TARQEQ', 'SIARNAQ', 'TARVOS', 'HYRROKKIN', 'GREIP', 'MUNDILFARI', 'SUTTUNGR', 'JARNSAXA', 'NARVI', 'BERGELMIR', 'HATI', 'FARBAUTI', 'THRYMR', 'BESTLA', 'AEGIR', 'KARI', 'LOGE', 'FENRIR', 'YMIR', 'SURTUR', 'FORNJOT']);
var ENGLISH_WORDS = new Set();
fetch("/static/puzzle_resources/make-your-own-math-quiz/UKACD.txt").then(function (response) {
    response.text().then(function (text) {
        var words = text.split('\n').filter(function (word) { return word.length >= 3; }).map(word => word.toUpperCase().trim());
        words.forEach(item => ENGLISH_WORDS.add(item))
    });
})["catch"](function (e) {
    console.warn(e);
    alert("The puzzle failed to load some of its data. You'll be able to solve the first few questions, but it will break later on. Please contact us and describe the error so we can fix it.");
});
var q1to5_re = /^[0-9+\-]*$/;
var q6to8_re = /^[0-9+\-*]*$/;
var q9_re = /^[0-9+\-*\/()]*$/;
var q10_12_re = /^[0-9+\-*\/().]*$/;
var q13_on_re = /^[0-9+\-*\/().A-Z]*$/;
var q19 = /^[0-9+\-\/().A-Z]*$/;
var q22 = /^[A-Z+\-\*\/()]*$/;
var badzero = /[^.0-9]0\d/;
var baddot = /\.[^0-9]/;
var eval_re = /^(?:[0-9+\-*\/().]|[0-9]e[+-][0-9])*$/;
var evaluate = function (expression, variable_values, triple) {
    var to_eval = "";
    expression.split("").forEach(function (a, i) {
        if (ascii_uppercase.includes(a)) {
            var pos = ascii_uppercase.indexOf(a);
            var val = variable_values[pos];
            if (a === triple) {
                val *= 3;
            }
            to_eval += "(".concat(val, ")");
            if (i + 1 < expression.length && ascii_uppercase.includes(expression[i + 1])) {
                to_eval += '*';
            }
        }
        else {
            to_eval += a;
        }
    });
    _.zip('ABCDEFGHIJKLMNOPQRSTUVWXYZ', variable_values).forEach(function (_a) {
        var v = _a[1], val = _a[0];
        if (v === triple) {
            val *= 3;
        }
        to_eval = to_eval.replace(v, "(".concat(val, ")"));
    });
    if (badzero.test(to_eval) || baddot.test(to_eval) || to_eval.endsWith('.')) {
        throw new Error("That's not a valid math question!");
    }
    if (!eval_re.test(to_eval)) {
        console.error("bad eval: ", to_eval);
        throw new Error("Invalid eval. Please contact us and send us the input you tried.");
    }
    try {
        return eval(to_eval);
    }
    catch (e) {
        // note: divide by zeros will return NaN rather than causing an error
        console.error(e);
        throw new Error("That's not a valid math question!");
    }
};
var eq = function (n) {
    return function (x) { return Math.abs(x - n) < 1e-10; };
};
var ge = function (n) {
    return function (x) { return x >= n; };
};
var at_least_10b = ge(10000000000);
var withinpi = function (n) { return function (x) { return Math.abs(x - Math.PI) <= n; }; };
var alwaysTrue = function (x) { return true; };
function is_prime(n) {
    if (!is_integer(n)) {
        return false;
    }
    n = Math.round(n);
    if (n === 2 || n === 3)
        return true;
    if (n % 2 === 0 || n < 2)
        return false;
    // Write (n - 1) as 2^s * d
    var s = 0, d = n - 1;
    while ((d & 1) == 0) {
        d >>= 1;
        ++s;
    }
    var base = 2;
    var x = Math.pow(base, d) % n;
    if (x == 1 || x == n - 1)
        return true;
    for (var i = 1; i <= s; i++) {
        x = (x * x) % n;
        if (x === n - 1)
            return true;
    }
    return false;
}
function maxlen_12(question, answer, variable_values, triple, otherqs) {
    return question.length <= 12;
}
function backwards(grader) {
    function grade(question, answer, variable_values, triple, otherqs) {
        return grader(evaluate(_.reverse(question.split('')).join(''), variable_values, triple));
    }
    return grade;
}
function letters_in_set(group) {
    function grade(question, answer, vals, triple, otherqs) {
        var justletters = question.split('').filter((x) => ascii_uppercase.includes(x)).join("");
        return group.has(justletters);
    }
    return grade;
}
function dict_diff(alpha1, alpha2, diff) {
    function grade(q, ans, vals, trip, otherqs) {
        var res1 = evaluate(q, alpha1, trip);
        var res2 = evaluate(q, alpha2, trip);
        return eq(diff)(res2 - res1);
    }
    return grade;
}
function check_anagram(otherq) {
    function grade(q, ans, vals, trip, otherqs) {
        var justletters = q.split('').filter((x) => ascii_uppercase.includes(x)).join("");
        var other_justletters = otherqs[otherq - 1].split('').filter((x) => ascii_uppercase.includes(x)).join("");
        var arr1 = justletters.split('');
        var arr2 = other_justletters.split('');
        var is_anag = _.isEqual(arr1.sort(), arr2.sort());
        return ENGLISH_WORDS.has(justletters) && is_anag && justletters !== other_justletters;
    }
    return grade;
}
function is_integer(n) {
    return Math.abs(Math.round(n) - n) < 1e-11;
}
var num = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
var tens = "twenty thirty forty fifty sixty seventy eighty ninety".split(" ");
function num2words(n) {
    if (n < 20)
        return num[n];
    var digit = n % 10;
    if (n < 100)
        return tens[~~(n / 10) - 2] + (digit ? "-" + num[digit] : "");
    if (n < 1000)
        return num[~~(n / 100)] + " hundred" + (n % 100 == 0 ? "" : " and " + num2words(n % 100));
    return num2words(~~(n / 1000)) + " thousand" + (n % 1000 != 0 ? " " + num2words(n % 1000) : "");
}
function check_is_self_words(q, ans, vals, trip, otherqs) {
    var justletters = q.split('').filter((x) => ascii_uppercase.includes(x)).join('');
    var expected = num2words(ans).toUpperCase().split("").filter((x) => ascii_uppercase.includes(x)).join("");
    return justletters == expected;
}
function both(eg1, eg2) {
    function grade() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return eg1.apply(void 0, args) && eg2.apply(void 0, args);
    }
    return grade;
}
function shorter_than_answer(q, ans, vals, trip, otherqs) {
    return q.length < ans.toString().length;
}
function concat_with_other(otherq, grader) {
    function grade(q, ans, vals, trip, otherqs) {
        var fullq = q + otherqs[otherq - 1].replace('\n', '').replace(' ', '');
        var full_ans = evaluate(fullq, vals, trip);
        return grader(full_ans);
    }
    return grade;
}
function all_alpha(q, ans, vals, trip, otherqs) {
    return ascii_uppercase.split('').every(letter => q.includes(letter));
}
function is_even(x) {
    return is_integer(x) && Math.round(x) % 2 === 0;
}
function is_odd(x) {
    return is_integer(x) && Math.round(x) % 2 === 1;
}
// XXX the space after the second 500 is to make it a different question LOL
var prompts = "Write a math question whose answer is 10.\nWrite a math question whose answer is 100.\nWrite a math question whose answer is 9462.\nWrite a math question whose answer is at least 10 billion.\nWrite a math question which is at most 12 characters long, and whose answer is at least 10 billion.\nWrite a math question whose answer is 73 when read forwards or backwards.\nWrite a math question whose answer is 45 when read forwards but 34 when read backwards.\nWrite a math question whose answer is within 0.01 of pi.\nWrite a math question whose answer is within 0.00001 of pi.\nWrite a math question whose answer is 3.\nWrite a math question whose answer is 500.\nWrite a math question whose answer is 300 when the value of a letter is the number of symbols in its Morse code representation.\nWrite a math question whose answer is 500. \nWrite a math question where, when you remove everything but letters, you get the name of a moon of Neptune.\nWrite a math question where, when you remove everything but letters, you get the name of a moon of Saturn.\nWrite a math question whose answer is prime.\nWrite a math question where, when you remove everything but letters, you get an English word, and where the answer is even when the value of a letter is its Scrabble score.\nWrite a math question without * which is worth 1 more when the value of each letter is its Scrabble score compared to when the value of each letter is its default value.\nWrite a math question where, when you remove everything but letters, you get an English word which is an anagram of the word from question 18, and where the answer is odd when the value of a letter is its Scrabble score.\nWrite a math question without * which is worth 1 less when the value of each letter is its Scrabble score compared to when the value of each letter is its default value.\nWrite a math question containing no digits where, when you remove everything but letters, you get the English spelling of its answer.\nWrite a math question whose answer is an integer where, when you remove everything but letters, you get an English word which is at least 3 letters long.\nWrite a math question which is shorter than the length of its answer.\nWrite a math question whose answer is 25, but when you append question 24 to the end of it, the answer is 2524.\nWrite a math question containing every letter of the alphabet exactly once and not containing any digits.\nWrite a math question where, if you plug in A=the answer to (1), B=the answer to (2), etc, you get 42.".split('\n');
var graders = [eq(6), eq(10), eq(100), eq(9462), at_least_10b, at_least_10b,
eq(73), eq(45), withinpi(0.01), withinpi(0.00001), eq(3), eq(500), eq(300), eq(500), alwaysTrue, alwaysTrue, is_prime,
    is_even, alwaysTrue, is_odd, alwaysTrue, is_integer, is_integer, alwaysTrue, eq(25), alwaysTrue, eq(42)];
var extra_graders = {
    6: maxlen_12,
    7: backwards(eq(73)),
    8: backwards(eq(34)),
    15: letters_in_set(MOONS_OF_NEPTUNE),
    16: letters_in_set(MOONS_OF_SATURN),
    18: letters_in_set(ENGLISH_WORDS),
    19: dict_diff(ALPHABET, SCRABBLE, 1),
    21: dict_diff(SCRABBLE, ALPHABET, 1),
    20: check_anagram(18),
    22: check_is_self_words,
    23: letters_in_set(ENGLISH_WORDS),
    24: shorter_than_answer,
    25: concat_with_other(24, eq(2524)),
    26: all_alpha
};
var variables = { 13: MORSE, 18: SCRABBLE, 20: SCRABBLE };
var edit_distances = [null, 1, 1, 2, 2, 2, 25, 3, 5, 5, 4, 50, 1, 0, 0, 2, 0, 50, 0, 10, 0, 35, 25, 0, 50, 100, 0];
var all_rules = { 2: [], 5: [], 9: [], 10: [], 12: [] };
all_rules[2].push("\n    The students don't like it when a question changes very much from the previous question. \n    You wouldn't want to upset them. You should do your best to keep the questions as similar\n    to each other as possible. We've provided a maximum\n    <a href='https://en.wikipedia.org/wiki/Levenshtein_distance'>edit distance</a>\n    allowed from each question to the next to help keep the students happy.");
all_rules[5].push("Starting with question five, math questions may include &ldquo;*&rdquo;.");
all_rules[9].push("Starting with question nine, math questions may include &ldquo;(&rdquo;, &ldquo;)&rdquo; and &ldquo;/&rdquo;.");
all_rules[10].push("Starting with question ten, math questions may include &ldquo;.&rdquo;.");
all_rules[12].push("Starting with question twelve, math questions may include the letters A through Z. By default, they take the value corresponding to their position in the alphabet. For example, A = 1, and B = 2. Two letters next to each other are automatically considered to be multiplied together, so for example, the answer to the question &ldquo;CAB&rdquo; is 6.");
function get_regex(n) {
    if (n <= 4) {
        return q1to5_re;
    }
    else if (n <= 8) {
        return q6to8_re;
    }
    else if (n == 9) {
        return q9_re;
    }
    else if (n <= 11) {
        return q10_12_re;
    }
    else if ([19, 21].includes(n)) {
        return q19;
    }
    else if ([22, 26].includes(n)) {
        return q22;
    }
    else {
        return q13_on_re;
    }
}
function get_student_answers(questions, triple) {
    var results = _.range(26).map(function (n) { var _a; return (evaluate(questions[n].replace(' ', '').replace('\n', ''), (_a = variables[n + 1]) !== null && _a !== void 0 ? _a : ALPHABET, triple)); });
    results.push(evaluate(questions[26].replace(' ', '').replace('\n', ''), results, triple));
    return results;
}
var distance = function (s, t) {
    if (!s.length)
        return t.length;
    if (!t.length)
        return s.length;
    var arr = [];
    for (var i = 0; i <= t.length; i++) {
        arr[i] = [i];
        for (var j = 1; j <= s.length; j++) {
            arr[i][j] =
                i === 0
                    ? j
                    : Math.min(arr[i - 1][j] + 1, arr[i][j - 1] + 1, arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1));
        }
    }
    return arr[t.length][s.length];
};
function edit_distance(s1, s2) {
    s1 = s1.replace(' ', '').replace('\n', '');
    s2 = s2.replace(' ', '').replace('\n', '');
    return distance(s1, s2);
}
function disp(fl) {
    if (fl === Infinity) {
        return '∞';
    }
    if (is_integer(fl)) {
        return Math.round(fl).toString();
    }
    return fl.toPrecision(5);
}
function render_html(studs, questions) {
    var res = "<h4>The Results</h4><p><span id='r'></span>\n    Good job! All four students in the competition have completed your quiz, though they may not have gotten all the answers right. \n    If you're not happy with their performance, you can always change some questions and the students will complete your new quiz. They're very studious and very consistent.</p>\n    ";
    res += "<table class='results'><tbody><tr><th>#</th><th>Question</th><th>Student 1's Answer</th><th>Student 2's Answer</th><th>Student 3's Answer</th><th>Student 4's Answer</th></tr>";
    // for qno, row in enumerate(zip(*studs)):
    _.zip.apply(_, studs).forEach(function (row, qno) {
        res += `<tr><th>${qno + 1}</th><td>What is `.concat(questions[qno], "?</td>");
        // res += "".join(f'<td>{disp(x)}</td>' for x in row)
        res += row.map(function (x) { return "<td>".concat(disp(x), "</td>"); }).join('');
    });
    res += '</tbody></table>';
    return res;
}
function mock_fetch(questions) {
    var answers = [];
    var results = [];
    // for index,question in enumerate(questions):
    questions.forEach(function (question, index) {
        var _a, _b, _c;
        var n = index + 1;
        var lettervals = (n < 27 ? (_a = variables[n]) !== null && _a !== void 0 ? _a : ALPHABET : results);
        var response_if_correct = "correct";
        var res;
        var expression;
        try {
            expression = question.replace(' ', '').replace('\n', '');
            var allowed = get_regex(n);
            if (!allowed.test(expression)) {
                throw new Error("That's not a valid math question!");
            }
            res = (evaluate(expression, lettervals, ""));
            results.push(res);
            console.log(n, question, res);
        }
        catch (e) {
            console.log(e);
            answers.push('malformed');
            results.push(0);
            return;
        }
        if (edit_distances[index] !== null && !question.endsWith('CHEAT')) {
            var prevq = questions[index - 1];
            if (edit_distance(prevq, question) > edit_distances[index]) {
                response_if_correct = "edit";
            }
        }
        if (question.endsWith('CHEAT')) {
            question = question.substring(0, question.length - 5);
        }
        try {
            // console.log(res);
            if (graders[index](res) && ((_c = (_b = extra_graders[n]) === null || _b === void 0 ? void 0 : _b.call(extra_graders, expression, res, lettervals, "", questions)) !== null && _c !== void 0 ? _c : true)) {
                answers.push(response_if_correct);
            }
            else {
                answers.push('incorrect');
            }
        }
        catch (e) {
            answers.push("incorrect");
        }
    });
    var reply = { 'answers': answers };
    if (!answers.length) {
        return reply;
    }
    if (answers.every(function (x) { return x === 'correct'; })) {
        if (answers.length === 27) {
            var studs = 'LUTZ'.split('').map(function (letter) { return get_student_answers(questions, letter); });
            reply['students'] = render_html(studs, questions);
        }
        else {
            reply['newq'] = { 'q': prompts[answers.length - 1], 'dist': edit_distances[answers.length], 'rules': all_rules[answers.length + 1] };
        }
    }
    return reply;
}
