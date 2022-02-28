ANSWERS = [
    [],
    ["SOTS", "GUIDES"],
    ["GLORIFY", "AIRPURIFIER"],
    ["GARLIC", "DISGUISE"],
    ["REMOVAL", "DAYTRIP"],
    ["INFLUENCE", "WOO"],
    ["SNOWSTORMS", "PELTMONGERS"],
    [],
]

function normalize_puzzle_answer(answer) {
  return answer.toUpperCase().replace(/[^A-Z]/g, "");
}

function submit(index, guess, side) {
  index = parseInt(index);
  guess = normalize_puzzle_answer(guess);
  side = (side == "left") ? 0 : 1;
  return guess == ANSWERS[index][side] ? "Correct!" : "Incorrect...";
}
