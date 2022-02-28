// This code is an emulation of puzzle logic that, during the hunt, was
// server-sided. You should not look at it.

getLS = (tag,) => localStorage["mmm-" + tag];
setLS = (tag, val) => localStorage.setItem("mmm-" + tag, val);

// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

// ---

const allowed_characters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

function range(a, b) {
	if (b === undefined) {
		b = a;
		a = 0;
	}
	let ret = [];
	for (let i = a; i < b; i++) { ret.push(i); }
	return ret;
}

function make_map() {
	let m = new Map();
	allowed_characters.forEach(c => m.set(c, new Set()));
	return m;
}
let index_letter = new Map();
range(-15, 15).forEach(n => index_letter.set(n, make_map()));
let mid_letter = make_map();
let double_letter = make_map();
let triple_letter = make_map();
let sandwiching_letter = make_map();
let sandwiched_letter = make_map();

let weights = new Map();

function extractUniqueDouble(word) {
	let doubles = 0;
	let doubleLetter = null;
	let fail = false;
	range(word.length - 1).forEach(i => {
		if (word[i] === word[i+1]) {
			doubles += 1;
			if (doubles > 1) {
				fail = true;
			}
			doubleLetter = word[i];
		}
	});
	return fail ? null : doubleLetter;
}

function extractUniqueSandwich(word) {
	let sandwiches = 0;
	let bread = null;
	let filling = null;
	let fail = false;
	range(word.length - 2).forEach(i => {
		if (word[i] === word[i+2]) {
			if (word[i] === word[i+1]) {
				fail = true;
			}
			sandwiches += 1;
			if (sandwiches > 1) {
				fail = true;
			}
			bread = word[i];
			filling = word[i+1];
		}
	});
	return (sandwiches === 1 && !fail) ? [bread, filling] : null;
}

function extractUniqueTriple(word) {
	let counter = new Map();
	Array.from(word).forEach((c) => {
		counter.set(c, (counter.get(c) || 0) + 1);
	});
	let triples = 0;
	let fail = false;
	let triple = null;
	counter.forEach((value, key) => {
		if (value > 3) fail = true;
		if (value === 3) {
			triples += 1;
			if (triples > 1) fail = true;
			triple = key;
		}
	});
	return fail ? null : triple;
}

// for line in lines:
function process(line) {
	let [word, weight] = line.split(",");
	weights.set(word, +weight);

	range(word.length).forEach(i => {
		index_letter.get(i).get(word[i]).add(word);
		index_letter.get(-i-1).get(word[word.length-i-1]).add(word);
	});

	if (word.length % 2 === 1) {
		mid_letter.get(word[(word.length - 1) / 2]).add(word);
	}

	let dl = extractUniqueDouble(word);
	if (dl) {
		double_letter.get(dl).add(word);
	}

	let sl = extractUniqueSandwich(word);
	if (sl) {
		let [bread, filling] = sl;
		sandwiching_letter.get(bread).add(word);
		sandwiched_letter.get(filling).add(word);
	}

	let t = extractUniqueTriple(word);
	if (t) {
		triple_letter.get(t).add(word);
	}
}

fetch("/static/puzzle_resources/meta-etc/WORDS.txt").then(function (response) {
	response.text().then(function (text) {
		text.split('\n').forEach(item => process(item));
	});
})["catch"](function (e) {
	console.warn(e);
	alert("The puzzle failed to load some of its data. Please contact us and describe the error so we can fix it.");
});

/*
The symbols below mean the following:
[ first letter
] last letter
| middle letter (only for word of odd length)
\ diagonalize (n-th leftmost letter of n-th word)
/ anti-diagonalize (n-th rightmost letter of n-th word)
= double letter
- sandwiching letter (A in ABA)
+ sandwiched letter (B in ABA)
* letter that appears exactly 3 times
When used for ordering, the ordering letters will be consecutive
*/
ordering_mechanics = ["[", "]", "|", "=", "-", "+", "*", ""];
extraction_mechanics = ["[", "]", "|", "\\", "/", "=", "-", "+", "*"];

let meta = {"": {"answer": "", "mechanic": "_?", "solved": false,
	"feeders": ["CORRESPONDENCE", "DISCUSSION", "FORMULA", "LIGHTNING",
		"MEDITERRANEAN", "NATIONALIZATION", "OFFER", "PSYCHOLOGIST",
		"RECORDER", "SCHEME", "WILLINGNESS"], "solves": [...Array(11).fill(0)]}};
let initial_extractions = "]=\\+*|=/*-[";


// set intersection, except null is the universe
function intersect(s1, s2) {
	if (s1 === null) return s2;
	if (s2 === null) return s1;
	let s = new Set();
	s1.forEach(e => {
		if (s2.has(e)) {
			s.add(e);
		}
	});
	return s;
}

function getUpdateSet(cond, letter) {
	// A condition will have the form of (index, letter) or (symbol, letter)
	if (typeof cond === "number") {
		return index_letter.get(cond).get(letter);
	} else {
		switch (cond) {
			case '|': return mid_letter.get(letter);
			case '=': return double_letter.get(letter);
			case '-': return sandwiching_letter.get(letter);
			case '+': return sandwiched_letter.get(letter);
			case '*': return triple_letter.get(letter);
		}
	}

}

// lazy https://prng.di.unimi.it/xoshiro128plus.c or something
function MyRandom(seed) {
	this.s = [0xf09f9089,0xf09f9089,0xf09f9089,0xf09f9089];
	let i = 0;
	// this seeding strat makes no sense
	for (let s of seed) {
		this.s[i] = (this.s[i] << 4) ^ s.charCodeAt(0);
		i = (i + 1) % 4;
	}
}

MyRandom.prototype.next = function() {
	let res = (this.s[0] + this.s[3]) >>> 0; // unsigned 32-bit thing
	let t = this.s[1] << 9;
	this.s[2] ^= this.s[0];
	this.s[3] ^= this.s[1];
	this.s[1] ^= this.s[2];
	this.s[0] ^= this.s[3];
	this.s[2] ^= t;
	this.s[3] = (this.s[3] << 11) | (this.s[3] >> 21);
	return res / 4294967296;
};
MyRandom.prototype.weighted_choice = function(candidates) {
	// array of [candidate, weight] pairs
	let weightSum = 0;
	for (let cw of candidates) { weightSum += cw[1]; }
	let x = this.next() * weightSum;
	for (let cw of candidates) {
		x -= cw[1];
		if (x < 0) {
			return cw[0];
		}
	}
	// shrug
	return candidates[0][0];
};
// choose k without replacement
MyRandom.prototype.sample = function(population, k) {
	let remaining = population.slice();
	let ret = [];
	for (let i of range(k)) {
		let x = Math.floor(this.next() * remaining.length);
		ret.push(remaining.splice(x, 1)[0]);
	}
	return ret;
};

function find_word(rng, conditions) {
	// A condition will have the form of (index, letter) or (symbol, letter)
	let candidates = null;
	conditions.forEach(condition => {
		let [cond, letter] = condition;
		let update_set = getUpdateSet(cond, letter);

		candidates = intersect(candidates, update_set);
	});

	if (candidates.size === 0) {
		return false;
	} else {
		candidates = [...candidates]; // Need to sort to make deterministic
		candidates.sort();
		return rng.weighted_choice(candidates.map(w => [w, weights.get(w)]));
	}
}
MyRandom.prototype.shuffle = function (xs) {
	for (let i = xs.length - 1; i >= 1; i--) {
		let j = Math.floor(this.next() * (i + 1));
		let t = xs[i];
		xs[i] = xs[j];
		xs[j] = t;
	}
};

function ord(x) { return x.charCodeAt(0); }
function chr(x) { return String.fromCharCode(x); }

function test_combination(rng, answer, ordering, extraction, starting) {
	if (starting === undefined) starting = " ";
	let candidate_answers = [];
	for (let i of range(answer.length)) {
		let extract_letter = answer[i];
		let order_letter = chr(ord(starting) + i);
		let conditions = [];

		if (ordering === "[") {
			conditions.push([0, order_letter]);
		} else if (ordering === "]") {
			conditions.push([-1, order_letter]);
		} else if (ordering !== "") {
			conditions.push([ordering, order_letter]);
		}

		if (extraction === "[") {
			conditions.push([0, extract_letter]);
		} else if (extraction === "]") {
			conditions.push([-1, extract_letter]);
		} else if (extraction === "\\") {
			conditions.push([i, extract_letter]);
		} else if (extraction == "/") {
			conditions.push([-i-1, extract_letter]);
		} else {
			conditions.push([extraction, extract_letter]);
		}

		let result = find_word(rng, conditions);
		if (!result) {
			return false;
		}
		candidate_answers.push(result);
	}

	return candidate_answers;
}


function find_answers(rng, answer, meta_id, req_extraction) {
	// """ Returns a list of answers """

	let ordering = rng.sample(ordering_mechanics, ordering_mechanics.length);
	let extraction;
	if (req_extraction === undefined) {
		extraction = rng.sample(extraction_mechanics, extraction_mechanics.length);
	} else {
		extraction = [req_extraction];
	}

	let result = null;
	for (let o of ordering) {
		let poss_start = null;
		if (o !== "") {
			poss_start = allowed_characters.slice(0, 27-answer.length);
			rng.shuffle(poss_start);
		}

		for (let e of extraction) {
			if (o === e) { // Ordering cannot be the same as extraction
				continue;
			}

			if (poss_start === null) {
				result = test_combination(rng, answer, o, e);
				if (result) {
					return [result, o + e];
				}
			} else {
				for (let s of poss_start) {
					let result = test_combination(rng, answer, o, e, s);
					if (result) {
						rng.shuffle(result);
						return [result, o + e];
					}
				}
			}
		}
	}

	throw ("Unable to create meta " + meta_id);
}

// unlike python we are using the hex string because we don't have big ints
// well we do but like it's kind of a pain
// the internal meta_id is "" for the root beta but we should display as "0"
function make_meta(meta_id) {
	if (meta[meta_id]) {
		return true;
	}

	let parent_id = meta_id.slice(0, -1);
	if (!meta[parent_id]) {
		if (!make_meta(parent_id)) {
			return false;
		}
	}
	let parent_meta = meta[parent_id];
	let last_digit = parseInt(meta_id[meta_id.length - 1], 16) - 1;
	if (parent_meta.solves[last_digit] != 0) {
		return false;
	}

	let answer = parent_meta.feeders[last_digit];
	let rng = new MyRandom(meta_id);

	let fm = null;
	if (meta_id.length === 1) {
		fm = find_answers(rng, answer, meta_id, initial_extractions[meta_id-1]);
	} else {
		fm = find_answers(rng, answer, meta_id);
	}
	let [feeders, mechanic] = fm;

	let L = answer.length;
	// 2 = not a meta, either directly provided or blurred
	let solves = [...Array(L).fill(2)];

	// Density of hidden answers decreases as depth increases
	let depth = meta_id.length;
	let num_hidden = Math.floor(Math.max(L / (Math.pow(depth + 1, 0.5)), 1))
	// limit recursion // if depth >= 96: num_hidden = 0

	let hidden = rng.sample(range(L), num_hidden);

	for (let i of hidden) {
		// 0 = meta (1 = solved in the original version)
		solves[i] = 0;
	}

	for (let i of range(L)) {
		if (solves[i] === 2 && rng.next() < 0.125) {
			// -1 = blurred
			solves[i] = -1;  // Randomly blur some un-hidden answers
		}
	}

	meta[meta_id] = {"answer": answer, "mechanic": mechanic, "solved": false,
		"feeders": feeders, "solves": solves};
	return true;
}

let id_string = "123456789abcdef";

let current_meta = 0;
let show_meta = true;
let blurred = true;

// {'id': id} -> {'hint': string, 'answer': string, 'puzzles': Array<{'answer': string, 'meta': boolean}>}
// {'id': id, 'guess': guess} -> {..., 'correct': boolean}

function postHuntSubmit(body) {
	let unblur = body.unblur;
	let str_id = body.id.toLowerCase();
	let guess = body.guess;

	if (!Array.from(str_id).every(c => id_string.includes(c))) {
		return {'error': "That's not a valid meta puzzle ID!"};
	}
	if (!make_meta(str_id)) {
		return {'error': "That's not a valid meta puzzle ID!"};
	}
	let cur_meta = meta[str_id];

	let is_correct_puzzle = false;
	if (str_id) {
		if (guess && guess.toUpperCase() == cur_meta["answer"]) {
			setLS(str_id, true);
			is_correct_puzzle = true;
		} else {
			is_correct_puzzle = !!getLS(str_id);
		}
	}

	let data = {
		'hint': cur_meta['mechanic'],
	};

	let ret_puzzles = [];
	for (let i = 0; i < cur_meta.feeders.length; i++) {
		let sid = id_string[i];
		let feeder = cur_meta.feeders[i];
		let solve_status = cur_meta.solves[i];
		if (solve_status === 0) {
			if (getLS(str_id + sid)) {
				ret_puzzles.push({'meta': true, 'answer': feeder});
			} else {
				ret_puzzles.push({'meta': true});
			}
		} else if (solve_status === -1 && !unblur) {
			ret_puzzles.push({});
		} else {
			ret_puzzles.push({'answer': feeder});
		}
	}

	data['puzzles'] = ret_puzzles;
	if (guess && guess.toUpperCase() == cur_meta["answer"]) {
		data['correct'] = true;
	}
	if (is_correct_puzzle) {
		data['answer'] = cur_meta["answer"];
	}
	return data;
}
// return {'error': 'An error occurred! Try waiting a few seconds and refreshing. If the problem persists, email us what you did at galacticpuzzlesetters@gmail.com'}

function setup(containerSelector, unblur) {
	let outer = $(containerSelector);
	let id = '';
	let errorState = false;
	async function submit(guess) {
		if (guess) {
			guess = guess.toUpperCase().trim();
		}
		let csrftoken = getCookie('csrftoken');
		try {
			/*
			let body = { id: id, guess: guess };
			if (unblur) {
				body.unblur = unblur;
			}
			let result = await fetch("/puzzle/meta-etc/submit", {
				method: 'POST',
				body: JSON.stringify(body),
				headers: { "X-CSRFToken": csrftoken },
			});
			let res = await result.json();
			*/
			let body = { id: id, guess: guess, unblur: unblur };
			let res = postHuntSubmit(body);
			outer.find('.meta-wrong').hide();
			if (guess) {
				if (!res.correct) {
					outer.find('.meta-wrong-answer').text(guess);
					outer.find('.meta-wrong').show();
				}
			}
			if (res.error) {
				errorState = true;
				outer.find('.hint').text('');
				outer.find('.puzzles').empty().append($(document.createElement('li')).addClass('meta-wrong').text(res.error));
			} else {
				errorState = false;
			}
			if (res.hint) {
				outer.find('.hint').text(res.hint);
			}
			if (res.puzzles) {
				outer.find('.puzzles').empty();
				res.puzzles.forEach((x, i) => {
					let idchar = "123456789abcdef"[i];
					let li = $(document.createElement('li'));
					let text = `Puzzle ${idchar}: `;
					if (x.meta) {
						let a = $(document.createElement('a'));
						a.attr('href', '#');
						if (x.answer) {
							a.text(text + x.answer);
						} else {
							a.text(text + '<unsolved>');
						}
						a.click(e => {
							e.preventDefault();
							id += idchar;
							submit();
						});
						li.append(a);
					} else if (x.answer) {
						li.text(text + x.answer);
					} else {
						li.text(text);
						let blurspan = $(document.createElement('span'));
						blurspan.addClass('blurry');
						blurspan.text('░░░░░░░░');
						li.append(blurspan);
					}

					outer.find('.puzzles').append(li);
				});
			}
			outer.find('.meta-puzzle-id').text(id || '0');
			if (res.answer) {
				outer.find('.guess-form').hide();
				outer.find('.meta-correct').show();
				outer.find('.meta-correct-answer').text(res.answer);
			} else {
				if (id === '') {
					outer.find('.guess-form').hide();
				} else {
					outer.find('.guess-form').show();
				}
				outer.find('.meta-correct').hide();
			}
			if (id) {
				outer.find('.meta-back').show();
			} else {
				outer.find('.meta-back').hide();
			}
		} catch (e) {
			console.error(e);
			outer.find('.puzzles').empty();
			outer.find('.puzzles').append($(document.createElement('li')).addClass('error').text(e));
		}
	}

	outer.find('.guess-form').on('submit', () => {
		let t = outer.find('.guess-text');
		t.select();
		submit(t.val());
	});

	outer.find('.meta-back').click(e => {
		e.preventDefault();
		if (errorState) {
			id = '';
		} else {
			id = id.slice(0, -1);
		}
		submit();
	});
	outer.find('.meta-jump').click(e => {
		e.preventDefault();
		let choice = prompt('What puzzle would you like to go to?');
		if (choice) {
			choice = choice.trim().toLowerCase();
			if (choice == '0') {
				choice = '';
			}
			id = choice;
			submit();
		}
	});
	submit("");
}
