// This code is an emulation of game logic that, during the hunt, was
// server-sided. You should not look at it. In addition, the state token was
// cryptographically non-introspectable and non-tamperable.


function bold(s) {
	return `<strong>${s}</strong>`;
}

function base36decode(c) {
	if ('0' <= c && c <= '9') {
		return c.charCodeAt(0) - '0'.charCodeAt(0);
	}
	if ('A' <= c && c <= 'Z') {
		return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
	}
	throw new Error("bad base36");
}
function base36encode(n) {
	if (0 <= n && n <= 9) {
		return String.fromCharCode('0'.charCodeAt(0) + n);
	}
	if (10 <= n && n <= 35) {
		return String.fromCharCode('A'.charCodeAt(0) + n - 10);
	}
	throw new Error("bad base36");
}

const bazaar = {
	baseCost: [5, 0],
	name: "Bazaar",
	description: "An open place where people are selling stuff. One guy is looking at a sword from a guy who sells swords.",
	play: state => {
		state.add("You run around the place and gawk at all the cool merch on sale. Whee!");
		state.addActions(2);
		state.addCoins(1);
		state.addCards(1);
	},
	examine: arg => {
		switch (arg) {
			case "sword":
				return "Cool sword! It's much longer than the other swords on display.";
			case "swords":
			case "table":
				return "The swords on the table are all relatively short.";
			case "guy":
			case "guys":
				return "One guy is looking at a sword from a guy who sells swords.";
		}
	},
};
const city = {
	baseCost: [5, 0],
	name: "City",
	description: "A busy place with tall yellow brick buildings. A few trees add color to the city. People walk around.",
	play: state => {
		state.add("You hop around the buildings.");
		state.addActions(2);
		state.addCards(1);
	},
	examine: arg => {
		switch (arg) {
			case "brick":
			case "building":
			case "buildings":
				return "The city has lots of official-looking buildings.";
			case "tree":
			case "trees":
			case "bush":
			case "bushes":
				return "Green trees. Or are they really tall bushes?";
			case ["people"]:
				return "People going about their business in the city.";
		}
	},
};
const crossroads = {
	baseCost: [2, 0],
	name: "Crossroads",
	description: "Signs point in various directions. There's grass, bushes, and a few sad-looking trees.",
	play: state => {
		state.add("You grab the signpost and swing yourself around it. Yay!");
		state.addActions(3);
		state.addCards(0);
	},
	examine: arg => {
		switch (arg) {
			case "sign":
			case "signs":
				return "Signs point in various directions.";
			case "grass":
			case "tree":
			case "trees":
			case "bush":
			case "bushes":
				return "Grass, bushes, and two trees that look mostly dead surround the crossroads.";
		}
	},
};
const smithy = {
	baseCost: [4, 0],
	name: "Smithy",
	description: "Two guys are working on an axe in front of a red-hot furnace.",
	play: state => {
		state.add("You ask politely to borrow one of their hammers. It has the perfect amount of heft to swing around for a bit. Whee!");
		state.addActions(0);
		state.addCards(3);
	},
	examine: arg => {
		switch (arg) {
			case "axe":
				return "A cool axe with some fascinating engravings on the side.";
			case "furnace":
				return "At least, you think it's a furnace? It glows red in the background. You don't feel like getting closer.";
			case "guy":
			case "guys":
				return "The smiths in the smithy, hard at work hammering on the axe.";
		}
	},
};
const lostCity = {
	baseCost: [5, 0],
	name: "Lost City",
	description: "A place shrouded in mysterious-looking mist. Still, it's a bit of a misnomer now. A few birds circle in the air.",
	play: state => {
		state.addActions(2);
		state.addCards(2);
	},
	examine: arg => {
		switch (arg) {
			case "place":
			case "mist":
				return "Mysterious. You reminisce about the struggles you faced to find this place.";
			case "bird":
			case "birds":
				return "The birds are barely visible in the mist.";
		}
	},
};
const willOWisp = {
	baseCost: [0, 0],
	name: "Will-o'-Wisp",
	defaced: true,
	play: state => {
		state.addActions(1);
		let s = state.secondFromTop();
		if (s && state.costsAtMost(s, 2)) {
			state.addCards(2);
		} else {
			state.addCards(1);
		}
	},
};
const bridge = {
	baseCost: [4, 0],
	name: "Bridge",
	defaced: true,
	play: state => {
		state.addActions(0);
		state.addCoins(1);
		state.addDiscount(1);
	},
};
const familiar = {
	baseCost: [3, 1],
	name: "Familiar",
	defaced: true,
	play: state => {
		state.addActions(1);
		state.addCards(1);
	},
};
const menagerie = {
	baseCost: [3, 0],
	name: "Menagerie",
	defaced: true,
	play: state => {
		// NOTE: assume we've already been set
		state.addActions(1);
		if (state.unplayedCardsAreDistinct()) {
			state.addCards(3);
		} else {
			state.addCards(1);
		}
	},
};
const sage = {
	baseCost: [3, 0],
	name: "Sage",
	defaced: true,
	play: state => {
		state.addActions(1);
		while (state.top() && !state.costsAtLeast(state.top(), 3)) {
			state.discardTop();
		}
		state.addCards(1);
	},
};
const patrician = {
	baseCost: [2, 0],
	name: "Patrician",
	defaced: true,
	play: state => {
		state.addActions(1);
		let s = state.secondFromTop();
		if (s !== null && state.costsAtLeast(s, 5)) {
			state.addCards(2);
		} else {
			state.addCards(1);
		}
	},
};
const platinum = {
	baseCost: [9, 0],
	name: "Platinum",
	description: "You have a lot of these. You're a very rich ruler!",
	nonplayable: true,
};
const colony = {
	baseCost: [11, 0],
	name: "Colony",
	description: "A distant expanse of buildings, flanked in green. It fills you with a sense of victory.",
	nonplayable: true,
};

COLONY_BUFFER = 10;

function State() {
	this.history = []; // for reconstruction
	this.play_history = []; // for display
	this.hand = [bazaar, city, crossroads, lostCity, smithy];
	this.deck = [willOWisp, willOWisp, willOWisp, bridge, bridge, bridge, familiar, menagerie, menagerie, bridge, bridge, sage, sage, familiar, patrician, patrician, patrician, ...Array(11).fill(platinum), colony];

	for (let i = 0; i < this.hand.length; i++) {
		this.hand[i] = Object.assign({position: -1 - i}, this.hand[i]);
	}
	for (let i = 0; i < this.deck.length; i++) {
		this.deck[i] = Object.assign({position: i + 1}, this.deck[i]);
	}
	this.played_positions = new Set();
	this.place = 0;
	this.actions = 1;
	this.coins = 0;
	this.discount = 0;
}
State.prototype.here = function() {
	if (0 <= this.place && this.place < this.hand.length) {
		return this.hand[this.place];
	}
	return null;
};
State.prototype.inventory = function() {
	if (this.coins === 1) {
		return "You have 1 coin."
	} else {
		return `You have ${this.coins} coins.`;
	}
};
State.prototype.exits = function() {
	if (this.place === 0) {
		return "You can go east.";
	} else if (this.place === this.hand.length - 1) {
		return "You can go west.";
	} else {
		return "You can go west or east.";
	}
};
State.prototype.look_here = function() {
	let name = this.here().defaced ? `Defaced Location #${this.here().position}` : this.here().name;
	let xs = [
		bold(name),
		this.here().description,
		this.exits(),
	];
	if (this.played_positions.has(this.here().position)) {
		xs.push("\nYou have already played here.");
	}
	if (this.here().position === 29) {
		xs.push("\nYou're satisfied with how far you've traveled, and you know there's nothing more to see.");
	} else if (this.here().position > 29) {
		xs.push("\nYou've traveled further than you thought possible! (Something broke! Email us at galacticpuzzlesetters@gmail.com)");
	}
	return xs.join("\n");
};

function StateCarrier(state) {
	this.state = state;
	this.messages = [];
}

StateCarrier.prototype.add = function(message) {
	this.messages.push(message);
};
StateCarrier.prototype.addCoins = function(amt) {
	this.state.coins += amt;
	if (amt == 1) {
		this.add("You found 1 coin!");
	} else {
		this.add(`You found ${amt} coins!`);
	}
};
StateCarrier.prototype.addCards = function(amt) {
	let trueAmt = 0;
	for (let i = 0; i < amt; i++) {
		if (this.state.deck.length === 0) break;
		this.state.hand.push(this.state.deck.shift());
		trueAmt += 1;
	}
	if (trueAmt == 1) {
		this.add("1 new location is accessible!")
	} else if (trueAmt) {
		this.add(`${trueAmt} new locations are accessible!`);
	}
}

StateCarrier.prototype.addActions = function(amt) {
	this.state.actions += amt - 1;
	if (amt == 0) {
		this.add("You feel more tired.");
	} else if (amt >= 2) {
		this.add("You feel more energetic!");
	}
}

StateCarrier.prototype.addDiscount = function(amt) {
	this.state.discount += amt;
}

StateCarrier.prototype.costsAtMost = function(card, threshold) {
	let [coinCost, potion_cost] = card.baseCost;
	coinCost = Math.max(coinCost - this.state.discount, 0);
	return coinCost <= threshold && potion_cost == 0;
}
StateCarrier.prototype.costsAtLeast = function(card, threshold) {
	let [coinCost, potion_cost] = card.baseCost;
	coinCost = Math.max(coinCost - this.state.discount, 0);
	return coinCost >= threshold && potion_cost >= 0;
}
StateCarrier.prototype.top = function() {
	if (this.state.deck.length > 0) {
		return this.state.deck[0];
	}
	return null;
}
StateCarrier.prototype.secondFromTop = function() {
	if (this.state.deck.length > 1) {
		return this.state.deck[1];
	}
	return null;
}
StateCarrier.prototype.discardTop = function() {
	this.state.deck.shift();
}
StateCarrier.prototype.unplayedCardsAreDistinct = function() {
	let seen = new Set();
	for (let card of this.state.hand) {
		if (!this.state.played_positions.has(card.position)) {
			if (seen.has(card.name)) {
				// console.log("Repeat: " + card.name);
				return false;
			}
			// console.log("Not repeat: " + card.name);
			seen.add(card.name);
		}
	}
	return true;
}

function actions_to_adjective(a) {
	if (a <= 1) {
		return "tired";
	} else if (a == 2) {
		return "somewhat energetic";
	} else if (a == 3) {
		return "pretty energetic";
	} else if (a >= 4) {
		return Array(a - 3).fill("super").join(" ") + " energetic";
	}
}

function examine(state, arg) {
	if (["me", "myself", "self"].includes(arg)) {
		return `You are a monarch.\n\nYou feel ${actions_to_adjective(state.actions)}. In fact, if you had to quantify your energy level, you would describe it as ${state.actions}.`;
	} else if (["coin", "coins"].includes(arg)) {
		if (state.coins == 1) {
			return "A shiny gold coin.";
		} else if (state.coins) {
			return `${state.coins} shiny gold coins.`;
		} else {
			return "You don't have any coins.";
		}
	} else {
		let desc = state.here().examine(arg);
		if (desc) {
			return desc;
		} else {
			return `I don't know what '${arg}' is.`;
		}
	}
}

function start(state) {
	return [
		bold("Action Adventure"),
		"",
		"You've worked so hard and spent so long building your kingdom. You've overseen so many expansions of your territory (including your base) that you can't even count them on your fingers, all while steering clear of any illicit transactions. So you think you've earned some time for yourself. Today, you're not going to deal with any purchasing or tidying up after yourself, and you're not going to think about any effects you might have on other people. You're just going to kick back, relax, and " + bold(">play") + ".",
		"",
		state.look_here()
	].join("\n");
}

// nondestructive but idk if i need this shrug
function withOneAdded(s, x) {
	let s2 = new Set(s);
	s2.add(x);
	return s2;
}

function silently_reconstruct(history, place) {
	let state = new State();
	for (let p of history) {
		state.place = p;
		if (state.here() === null || state.here().nonplayable || state.played_positions.has(state.here().position)) {
			return null;
		}
		let carrier = new StateCarrier(state);
		state.history.push(state.place);
		let shortName = state.here().defaced ? `? #${state.here().position}` : state.here().name;
		state.play_history.push(shortName);
		state.played_positions = withOneAdded(state.played_positions, state.here().position);
		state.here().play(carrier);
		// drop carrier.messages
	}
	if (place !== undefined) {
		state.place = place;
	}
	if (state.here() !== null) {
		return state;
	}
	return null;
}

function serialize(state) {
	let ret = [base36encode(state.place)];
	state.history.forEach(n => {
		ret.push(base36encode(n));
	});
	return ret.join('');
}

function handle_one(state, sentence) {
	let words = sentence.trim().split(/\s+/g);
	if (words.length === 0 || (words.length === 1 && words[0] === '')) {
		return ["", state];
	}

	let [verb, ...args] = words;
	verb = verb.toLowerCase();
	let raw_arg = args.join(" "); // used for restore
	let arg = raw_arg.toLowerCase();

	if (state.actions === 0) {
		if (["r", "restart"].includes(verb)) {
			if (arg) {
				return [`I don't understand ${arg}.`, state];
			}
			state = new State();
			return [["Restarting!", "", start(state)].join("\n"), state];
		} else if (["u", "undo"].includes(verb)) {
			if (arg) {
				return [`I don't understand ${arg}.`, state];
			}
			state = silently_reconstruct(state.history.slice(0, state.history.length - 1), state.history[state.history.length - 1]);
			return [[
				state.look_here(),
				"(Previous play undone.)",
			].join("\n"), state];
		} else {
			return ["You're too tired to do anything. (You can still " + bold("undo") + " or " + bold("restart") + ".)", state];
		}
	}

	let msgs = [];

	if (["u", "undo"].includes(verb)) {
		if (arg) {
			return [`I don't understand ${arg}.`, state];
		}
		if (state.history.length === 0) {
			return ["Nothing to undo.", state];
		} else {
			state = silently_reconstruct(state.history.slice(0, state.history.length - 1), state.history[state.history.length - 1]);
			return [[
				state.look_here(),
				"(Previous play undone.)",
			].join("\n"), state];
		}
	} else if (["r", "restart"].includes(verb)) {
		if (arg) {
			return [`I don't understand ${arg}.`, state];
		}
		state = new State();
		return [[
			"Restarting!",
			"",
			start(state)
		].join("\n"), state];
	} else if (["n", "north", "s", "south", "ne", "nw", "se", "sw", "northeast", "northwest", "southeast", "southwest", "up", "down", "in", "out", "d"].includes(verb)) {
		if (arg) {
			return [`I don't understand ${arg}.`, state];
		}
		msgs.push("You can't go that way.");
	} else if (["w", "west"].includes(verb)) {
		if (arg) {
			return [`I don't understand ${arg}.`, state];
		}
		if (state.place > 0) {
			state.place -= 1;
			msgs.push(state.look_here());
		} else {
			msgs.push("You can't go that way.");
		}
	} else if (["e", "east"].includes(verb)) {
		if (arg) {
			return [`I don't understand ${arg}.`, state];
		}
		if (state.place < state.hand.length - 1) {
			state.place += 1;
			msgs.push(state.look_here());
		} else {
			msgs.push("You can't go that way.");
		}
	} else if (["p", "play"].includes(verb)) {
		if (arg) {
			return [`I don't understand ${arg}.`, state];
		}
		if (state.here().nonplayable) {
			msgs.push("Boring, you don't want to play here.");
		} else if (state.played_positions.has(state.here().position)) {
			msgs.push("You already played here, repeating is boring.");
		} else {
			let carrier = new StateCarrier(state);
			state.history.push(state.place);
			let shortName = state.here().defaced ? `? #${state.here().position}` : state.here().name;
			state.play_history.push(shortName);
			state.played_positions = withOneAdded(state.played_positions, state.here().position);
			// console.log(state.played_positions);
			state.here().play(carrier);
			Array.prototype.push.apply(msgs, carrier.messages);
		}

		if (state.actions === 0) {
			msgs.push("You're too tired to do anything.")
			msgs.push(`Game over! (You can still ${bold("undo")} and ${bold("restart")}.)`);
		}
	} else if (["l", "look"].includes(verb)) {
		if (arg) {
			msgs.push(examine(state, arg));
		} else {
			msgs.push(state.look_here());
		}
	} else if (["x", "ex", "examine"].includes(verb)) {
		if (arg) {
			msgs.push(examine(state, arg));
		} else {
			return ["You need to specify something to examine.", state];
		}
	} else if (["i", "inv", "inventory"].includes(verb)) {
		if (arg) {
			return [`I don't understand ${arg}.`, state];
		}
		msgs.push(state.inventory())
	} else if (["save"].includes(verb)) {
		if (arg) {
			return [`I don't understand ${arg}.`, state];
		}
		msgs.push("Use this command to restore your game state: <code>restore " + serialize(state) + "</code>");
	} else if (["restore"].includes(verb)) {
		if (!raw_arg) {
			return ["You need to specify a game state to restore.", state];
		}
		let state2 = deserialize(raw_arg);
		if (!state2) {
			return ["Illegal game state! This shouldn't happen unless you tampered with the game state yourself. If you encountered this legitimately, email us what you did at galacticpuzzlesetters@gmail.com", state];
		}
		state = state2;
		msgs.push(state.look_here());
		msgs.push("[State restored.]");
	} else if (["hint", "help", "hints"].includes(verb)) {
		if (arg) {
			return [`I don't understand ${arg}.`, state];
		}
		return [[
			'Some commands you can use in this game:',
			'<ul>',
			'<li>"east", "e", "west", or "w": Walk in some direction.</li>',
			'<li>"look" or "l": Look around your current position.</li>',
			'<li>"examine" or "x": Look more closely at yourself or something in the environment.</li>',
			'<li>"inventory" or "i": List what you\'re carrying.</li>',
			'<li>"play" or "p": Play in the current location.</li>',
			'<li>"undo" or "u": Undo up until the last time you played.</li>',
			'<li>"restart" or "r": Restart the game. (You can\'t undo a restart.)</li>',
			'<li>"save": Print a command you can use to restore your current state.</li>',
			'</ul>',
			'You can enter multiple commands in one line separated by semicolons.',
		].join("\n"), state];
	} else if (["xyzzy", "plugh", "plover"].includes(verb)) {
		msgs.push("A hollow voice says, 'Insert red herring here.'")
	} else {
		return [`I don't understand ${sentence}.`, state];
	}

	return [msgs.join("\n"), state];
}

function deserialize(record) {
	try {
		let place = base36decode(record[0]);
		let history = [];
		for (let i = 1; i < record.length; i++) {
			history.push(base36decode(record[i]));
		}
		return silently_reconstruct(history, place);
	} catch (e) {
		return null;
	}
}

function post_hunt_submit(obj) {
	const input = obj.i;
	const record = obj.s; // "encrypted"/encoded game state

	let msgs = [];
	let state = null;
	if (record) {
		state = deserialize(record);
		if (!state) {
			return {'s': record, 'o': ["You're in an illegal state! This shouldn't happen unless you tampered with the game state yourself."], 'h': 'none'};
		}
	} else {
		state = new State();
		msgs.push(start(state));
	}

	for (let sentence of input.split(';')) {
		let [msg, state2] = handle_one(state, sentence);
		msgs.push(msg);
		state = state2;
	}

	return {'s': serialize(state), 'o': msgs.join("\n"), 'h': state.play_history.join(', ') || 'none'};
}

document.addEventListener('DOMContentLoaded', () => {
	let state = '';
	async function submit(chat) {
		$('#chattext').prop("disabled", true);
		if (chat) {
			$('#chats').append($(document.createElement('div')).addClass('command').text('> ' + chat));
		}
		let csrftoken = getCookie('csrftoken');
		try {
			/*
			let result = await fetch("/puzzle/action-adventure/submit", {
				method: 'POST',
				body: JSON.stringify({ i: chat, s: state }),
				headers: { "X-CSRFToken": csrftoken },
			});
			let res = await result.json();
			*/
			let res = post_hunt_submit({ i: chat, s: state });
			console.log(res);
			if (!state) {
				$('#chats').empty();
			}
			if (res.s) {
				state = res.s;
			}
			if (res.h) {
				$('#play-history').text(res.h);
			}
			if (res.o) {
				$('#chats').append($(document.createElement('div')).html(res.o));
				$('#chats').scrollTop($('#chats').prop('scrollHeight'));
			}
			if (res.error) {
				$('#chats').append($(document.createElement('div')).addClass('error').text(res.error));
				$('#chats').scrollTop($('#chats').prop('scrollHeight'));
			}
		} catch (e) {
			console.error(e);
			$('#chats').append($(document.createElement('div')).addClass('error').text(e));
		}
		$('#chattext').val("").prop("disabled", false).focus();
	}

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

	$('#send-chat-form').on('submit', () => submit($('#chattext').val()));
	submit("");
});
// p
// e;e;e;e;e;p
// w;w;w;w;p
// e;p
// e;p
// e;e;e;e;e;p
// e;p
// e;p
// w;w;w;w;p
// e;e;e;e;e;e;p

// p;e;e;e;e;e;p;w;w;w;w;p;e;p;e;p;e;e;e;e;e;p;e;p;e;p;w;w;w;w;p;e;e;e;e;e;e;p
