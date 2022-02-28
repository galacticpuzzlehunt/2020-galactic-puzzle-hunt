// preprocessing

let DATA = `ACEROLA	FALSE	0.01267636684	7	Stock up on revives before the Elite Four, and fight like a 	famed riser or Arizona city
ALEXIEL	TRUE	0.01216788986	4	My mirror-blades, carved from the fair Earth, can be made from	nephrite, for instance
ALFONSE	FALSE	0.00744047619	9	In our kingdom, the trees loom tall and proud, and the resin	might be said of a report or milk
AMELIA	FALSE	0.005235890653	7	Growing from a villager to a general fills my heart with 	rapture
ANNA	FALSE	0.02535273369	5	T-this broom? N-no, it's not made of 	a material that can be maraging
ARCHIE	FALSE	0.01708553792	8	Our latest plan to reawaken Kyogre is by playing a 	late Baroque instrumental composition
BASTET	FALSE	0.03472222222	11	Nyaa, compared to Anubis, my combo condition activates more often on 	average
CAENIS	TRUE	0.008916126188	7	My past was transformative, but at least I didn't turn into the	final state of the Little Mermaid
DEEPCOLOR	FALSE	0.02397486772	5	Want me to draw something? My commission fee is one 	commonly purchased nesosilicate
DOROTHEA	FALSE	0.008542768959	8	Singing is my main talent, although I seem to be known for my 	refractoriness
ETHAN	FALSE	0.01047178131	4	When Typhlosion attacks, his skin lights up like a	cured and smoked salmon
EXUSIAI	FALSE	0.01901455026	5	Penguin Logistics has a tendency to leave business establishments in	something you might find on a match or online
EYJAFJALLA	FALSE	0.02562830688	9	Research sometimes takes me to dangerous settings, like a volcano or a	tropical cyclone
GAIUS	FALSE	0.006889329806	8	During my many adventures, my actions resulted in a	disaster possibly caused by chromosomal celebrations
IKE	FALSE	0.007991622575	6	I fight for my friends, not for any 	resource given in generous amount
IRIS	FALSE	0.01570767196	7	My anthology of fairy tales is precious to me. I must polish its cover to keep it 	shiny
ISKANDAR	FALSE	0.03995811287	5	Inside my Reality Marble, the Macedonian army's victory is etched in 	a go piece
IZANAGI	FALSE	0.03141534392	9	When I declared my intent to visit Izanami, the other deities had shocked 	responses
LAPPLAND	FALSE	0.01736111111	7	Do you think Texas is the literary type? Maybe I'll quiz her on the 	Iliad's counterpart
LEO	FALSE	0.004684744268	5	I take more pride in my knowledge than in being a	historical English currency
LILELE	FALSE	0.01873897707	8	I want to become a famous performer, as I do not have an impressive	lineage
MAY	TRUE	0.004405615293	8	Without proper Hidden Machines, one can get into deep trouble as a 	seeker of the uncharted
N	FALSE	0.01377865961	5	Unlike us, Zekrom does not require sustenance, but it nevertheless enjoys a 	double beef sirloin with backbone
NIGHTINGALE	FALSE	0.0140542328	9	Shining is a proficient fighter and healer, but I do worry about her 	unwillingness to change course
NINIAN	FALSE	0.005787037037	8	I can do anything to protect the ones I love, including partaking in	endeavors connoting risk
NOIR CORNE	FALSE	0.02232142857	8	It's almost Yato's birthday! I'm planning to 	prepare food in an oven for several hours, even days
OAK	TRUE	0.005664362519	5	My grandson...what was his name again? Anyways, his favorite food is a 	dish made from scorched rice crusts
ODIN	FALSE	0.04794973545	4	Don't provoke Freyr, or you might get hit with a	mineral mass
OLIVIA	FALSE	0.02314814815	6	Now that I'm here, I expect everyone to fight with	energy and passion
OSCAR	TRUE	0.002412598851	7	I try to stay calm and cheerful, but Kieran deserves a	righteous act of retribution
OWEN	TRUE	0.01048956022	5	I promise you that I will protect you from	heat-induced injuries
PLESSIE	FALSE	0.04133597884	5	My water can slow down an	archer's projectile
RAMA	FALSE	0.03169091711	7	Hey, NEET! You will hear a word from Lady Parvati, and it will be 	hotly critical
RED HARE	FALSE	0.02617945326	9	Want to race? My gallops and kicks are	prone to bursting strongly and powerfully
REDLUCK	FALSE	0.03417107584	3	I'm a competitive eater and a monk. I love my fork and sing the very best 	lyrical composition with stanzas
ROZUEL	FALSE	0.04464285714	6	For my healing, I require no 	note for payment
SAKUYA	FALSE	0.05125661376	5	My dance can't be stopped, even by	strong winds
SEN	TRUE	0.007972065768	8	To help me climb, my agile body, strong claws, and impulsive nature	overlap to boost effectiveness
STEVEN	FALSE	0.009369488536	9	A Pokemon Champion should always behave in a manner that is 	associated with Crusades-era ideals
TAMADRA	FALSE	0.03802910053	10	This magic star is precious! Approach it with 	resoluteness or a prosecutor's goal
TATE	FALSE	0.01598324515	5	Liza and I just received an invitation to join a somewhat shady 	community bound by shared belief
THOMAS EDISON	TRUE	0.01625881834	6	Innovation? For most, it's a terrible burden. For me, it's a	cinch
THORNS	FALSE	0.02066798942	4	My sword is envenomed, so handle it carefully like a 	Yasmin, Ken, or Cloe, for instance
TYPHON	FALSE	0.02810846561	8	My black dragon is real, not an	imagined visual effect
TYRE	FALSE	0.02976190476	7	The best way to prepare beef bento is not to roast, but to 	cook by dunking in fat
YAGYU MUNENORI	FALSE	0.03444664903	9	As an emotionless follower of facts and logic, I will not be	affected by hurtful or traumatic remarks
YAN QING	FALSE	0.02893518519	9	I bow to no one, especially not to a foreign	person who subjugates vanquished peoples
YANG GUIFEI	FALSE	0.03720238095	3	I like lychees! But not when their seeds are squeezed into	a lubricant`;

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

function convert(line){
    stuff = line.split("\t");
    special = (stuff[1] == "TRUE");
    p_char = +stuff[2];
    keyword_len = stuff[3];
    charname = toTitleCase(stuff[0]);
    clue = stuff[4];
    clue2 = stuff[5];
    return {"name": charname,
            "special": special,
            "p_char": p_char,
            "keyword_len": +keyword_len,
            "quote": clue,
            "clue": clue2,
            "imgurl": `/static/puzzle_resources/thrifty-thrifty/img/${charname.toLowerCase().replace(' ', '_')}.png`,
	   };
}

let data = DATA.split("\n");

let STAR = "&#11088;"
let CHARDICT = [];
let NAME_TO_CHARDICT = {};
let CHARNAMES = [];
let PROBS = [];
let PITYDICT = [];
let UNNORM_PITY_PROBS = [];
let unnorm_total = 0.0;
for (let i = 0; i < data.length; i++){
    converted_data = convert(data[i]);
    CHARDICT.push(converted_data);
    NAME_TO_CHARDICT[converted_data["name"]] = converted_data;
    CHARNAMES.push[converted_data["name"]];
    PROBS.push(converted_data["p_char"])
    if (converted_data["special"]){
	PITYDICT.push(converted_data);
	UNNORM_PITY_PROBS.push(converted_data["p_char"]);
	unnorm_total += converted_data["p_char"];
    }
}
let PITYPROBS = []
for (let i = 0; i < UNNORM_PITY_PROBS.length; i++){
    PITYPROBS.push(UNNORM_PITY_PROBS[i] / unnorm_total);
}

let SINGLE_BUTTON = '<button class="button" onclick="pull(1)">Pull x1</button>'
let DOUBLE_BUTTON = '<button class="button" onclick="pull(1)">Pull x1</button> <button class="button" onclick="pull(10)">Pull x10</button>'
let TRIPLE_BUTTON = '<button class="button" onclick="pull(1)">Pull x1</button> <button class="button" onclick="pull(10)">Pull x10</button> <button class="button" onclick="pull(100)">Pull x100</button>'

// more preprocessing

function randomChoice(p) {
    let rnd = p.reduce( (a, b) => a + b ) * Math.random();
    return p.findIndex( a => (rnd -= a) < 0 );
}

function choice(item_list, probs){
    let random_index = randomChoice(probs);
    return item_list[random_index];
}

function pull_single(starting_pity, collection){
    pity = starting_pity + 1;
    if (pity % 10 == 0)
	char_info = choice(PITYDICT, p=PITYPROBS);
    else
	char_info = choice(CHARDICT, p=PROBS);
    return char_info;
}

function present(char_info){
    let text = [
	`<h2><p>${char_info['name']}</h2></p>`,
	`<img class=\"center-fit\" src=${char_info['imgurl']}>`,
	`<p>\"${char_info['quote']}<br>`,
	`${char_info['clue']}.\"</p>`,
	`<p>${STAR.repeat(char_info['keyword_len'])}</p>`,
    ]
    return text.join("\n");
}

function pull_python(collection, num_pulls){
    // This mimics _pull(), since pull() did some more error handling we don't care about
    let size = 0;
    if (collection){
	for (char_name in collection){
	    size += collection[char_name]["count"];
	}
    }

    // First validate token and pull_count
    if (num_pulls == 1) {
	let reward = pull_single(size, collection);
	return [true, [present(reward)], [reward["name"]], collection];
    }
    if (num_pulls == 10){
	let chars = [];
	for (let i = 0; i < 10; i++) {
	    chars.push(pull_single(size + i, collection));
	}
	return [true,
		chars.map(present),
		chars.map(a => a["name"]),
		collection];
    }
    if (num_pulls == 100 && Object.keys(collection).length == 48) {
	let chars = [];
	for (let i = 0; i < 100; i++) {
	    chars.push(pull_single(size + i, collection));
	}
	return [true, [], chars.map(a => a["name"]), collection];
    }
    return [false, [], [], {}];
}

function pick_button(verified_collection){
    if (Object.keys(verified_collection).length == 48)
	return [TRIPLE_BUTTON, "Your collection. Click on a name to view. Congrats, you've collected them all and unlocked Pull x100!"];
    return [DOUBLE_BUTTON, "Your collection. Click on a name to view."];
}

function pull_python_wrapper(collection, count){
    let [valid, return_html, return_names, new_collection] = pull_python(collection, count);
    let [button_html, collection_html] = pick_button(new_collection);
    return {'valid': valid,
            'html_body': return_html,
            'names': return_names,
            'button_html': button_html,
            'collection_html': collection_html,
           };
}

function pull(count){
    collection = localStorage.thrifty_thrifty_collection;
    if (!collection){
	collection = "{\"chars\": {}}";
    }
    
    data = pull_python_wrapper(JSON.parse(collection)["chars"], count);
    if (data["valid"]) {
	collection = JSON.parse(collection);
	if (!collection.hasOwnProperty("chars")) {
	    collection.chars = {};
	}
	collection.button_html = data.button_html
	collection.collection_text = data.collection_html
	content_html = ""
	for (let i = 0; i < count; i++) {
	    name = data.names[i];
	    if (name in collection.chars) {
		collection.chars[name].count += 1;
		content_html += data.html_body[i];
	    }
	    else {
		content_html += "<h2><p>NEW! -- " + data.html_body[i].slice(7);
		collection.chars[name] = {}
		collection.chars[name].count = 1;
		collection.chars[name].name = "<a onClick=\"show('" + name + "')\">" + name + "</a>";
		collection.chars[name].html = data.html_body[i];
	    }
	}
	if (count == 100){
	    content_html = "You pulled 100 times. Your collection has been updated below."
	}
	document.getElementById("content_html").innerHTML = content_html;
	document.getElementById("buttons").innerHTML = data.button_html;

	localStorage.thrifty_thrifty_collection = JSON.stringify(collection);
	updateCollection();
    }
}

function show(item_name) {
    collection = localStorage.thrifty_thrifty_collection;
    if (collection == undefined){
	return;
    }
    collection = JSON.parse(collection);
    document.getElementById("content_html").innerHTML = collection.chars[item_name].html;    
}

function updateCollection() {
    collection = localStorage.thrifty_thrifty_collection;
    if (collection == undefined) {
	curr_count = 0;
	curr_collection = "You currently have nothing! Click the button above to start, it only costs $1 per pull!";
	button_html = '<button class="button" onclick="pull(1)">Pull</button>';
    }
    else {
	collection = JSON.parse(collection);
	curr_count = Object.values(collection.chars).map(v => v.count).reduce((a, b) => a+b, 0)
	curr_collection = Object.values(collection.chars)
	    .sort((x, y) => x.count > y.count ? -1 : 1)
	    .map(v => v.name + ": " + v.count)
	    .reduce((a, b) =>  a + "<br>" +  b , "");
	curr_collection = collection.collection_text + curr_collection;
	button_html = collection.button_html;
    }
    document.getElementById("counter").innerHTML = "$" + curr_count;
    document.getElementById("collectionList").innerHTML = curr_collection;
    document.getElementById("buttons").innerHTML = button_html;
}

// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
	let cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
	    let cookie = cookies[i].trim();
	    if (cookie.substring(0, name.length + 1) === (name + '=')) {
		cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		break;
	    }
	}
    }
    return cookieValue;
}


window.onload = updateCollection

