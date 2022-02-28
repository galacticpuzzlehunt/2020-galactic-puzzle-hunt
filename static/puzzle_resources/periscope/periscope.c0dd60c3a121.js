/*
We model the periscope with the lasers pointing up and the meta boxes on the
bottom, even though we'll present it flipped 45 degrees on the main diagonal
(such that the lasers start from the right side pointing left).

This is the starting state:

   3 4 5                3 4 5
   _ _ _                _ _ _
2 |\ \ /| 6          2 |6 7 8| 6
1 |\ / /| 7          1 |3 4 5| 7
0 |\ \ /| 8          0 |0 1 2| 8
   R G B                R G B

Note that initially puzzles 0, 1 and 8 should be unlocked and visible.

`periscope_state` is a 9 character string representing the state of the scope.
The 9 characters are either 0 or 1 and represent the states of the nine mirrors,
indexed as shown on the diagram on the right.

/ is represented by 0
\ is represented by 1

Thus, the inital value of `periscope_state` is: 110100110. This is also the
value that the periscope is reset to.

The puzzle ordering is as follows (spoilers):

# | Answer   | Title
- + -------- + -----------------------
0 | ONETOONE | Mr. Worldwide
1 | SPEEDBAG | Letter Boxing
2 | TOPRATED | ⚾
3 | BOROUGHS | Divide and Conquer
4 | MISOSOUP | The Seasons Change
5 | BABYIMPS | Thrifty/Thrifty
6 | UNPEOPLE | Board Games with Shrek
7 | HORRIBLE | crosswerd
8 | TODDLERS | Mixed Message
9 | ???????? | Periscope (Meta)

Each puzzle's answer corresponds to one of the nine mirrors. Submitting that
answer (if the puzzle is visible) should flip that mirror.

The map is:

# | Answer   | Title                  | mirror #
- + -------- + ---------------------- + --------
0 | ONETOONE | Mr. Worldwide          |  3
1 | SPEEDBAG | Letter Boxing          |  1
2 | TOPRATED | :baseball:             |  6
3 | BOROUGHS | Divide and Conquer     |  8
4 | MISOSOUP | The Seasons Change     |  5
5 | BABYIMPS | Thrifty/Thrifty        |  2
6 | UNPEOPLE | Board Games with Shrek |  4
7 | HORRIBLE | crosswerd              |  0
8 | TODDLERS | Mixed Message          |  7
9 | ???????? | Periscope (Meta)       | N/A
*/

STARTING_STATE = '110100110'
MIRROR_MAP = [3, 1, 6, 8, 5, 2, 4, 0, 7]


function flip(mirror) {
  if (mirror == "1") {
    return "0";
  } else if (mirror == "0") {
    return "1";
  }
}

function get_visible(state) {
  // R G and B start at mirrors 0, 1, 2 respectively heading upwards
  lasers = [0, 1, 2];
  for(i = 0; i < lasers.length; i++) {
    laser = lasers[i];
    // add 3 for up, subtract 3 for down. Add 1 to go right, Sub 1 for left
    nxt = [new Map(
      [[-3, -1], [-1, -3], [1, 3], [3, 1]]
    ), new Map([[-3, 1], [1, -3], [3, -1], [-1, 3]])];
    d = 3;
    while(true) {
      d = nxt[parseInt(state[laser])].get(d);
      if ((d == -1) && (laser % 3) == 0) {
        laser /= 3;
        break;
      }
      if ((d == 1) && (laser % 3) == 2) {
        laser = 9 - ((laser + 1) / 3);
        break;
      }
      if ((d == -3) && (laser < 3)) {
        laser += 9; // unlock the meta if the laser heads down
        break
      }
      if ((d == 3) && (laser > 5)) {
        laser -= 3;
        break
      }
      laser += d
    }
    lasers[i] = laser
  }
  return lasers
}

function is_lasered(i, lasers) {
  if (i < 9) {
    return lasers.includes(i);
  } else {
    return lasers.includes(i) || lasters.includes(i + 1) || lasers.includes(i + 2);
  }
}

function annotate_puzzles() {
  state = localStorage.getItem('periscope-state');
  if (!state) {
    state = STARTING_STATE;
  }
  lasers = get_visible(state);

  for (puzzle = 0; puzzle < 9; puzzle++) {
    btn_class = 'puzzle-btn-' + puzzle
    btn = document.getElementsByClassName(btn_class)[0]
    if (is_lasered(puzzle, lasers)) {
      btn.style.display = "";
    } else {
      btn.style.display = "none";
    }
  }

  laser_strings = ['laser-red', 'laser-green', 'laser-blue'];

  for (puzzle = 0; puzzle < 9; puzzle++) {
    box_class = 'puzzle-box-' + puzzle;
    elements = document.getElementsByClassName(box_class);
    Array.from(elements).forEach(element => {
      laser_strings.forEach(laser_string => {
        element.classList.remove(laser_string);
      });
    });
  }

  for (puzzle = 0; puzzle < 3; puzzle++) {
    box_class = 'meta-box-' + puzzle;
    elements = document.getElementsByClassName(box_class);
    Array.from(elements).forEach(element => {
      laser_strings.forEach(laser_string => {
        element.classList.remove(laser_string);
      });
    });
  }

  for (i = 0; i < lasers.length; i++) {
    laser = lasers[i];
    box_class = '-box-';
    if (laser < 9) {
      box_class = 'puzzle' + box_class + laser;
    } else {
      box_class = 'meta' + box_class + (laser - 9);
    }
    elements = document.getElementsByClassName(box_class);
    Array.from(elements).forEach(element => {
      element.classList.add(laser_strings[i]);
    });
  }
}

function submit(puzzle_index) {
  puzzle_index = parseInt(puzzle_index)
  state = localStorage.getItem('periscope-state');
  if (!state) {
    state = STARTING_STATE;
  }
  lasers = get_visible(state);

  new_state = state
  mirror_index = MIRROR_MAP[puzzle_index]
  new_state = new_state.substring(0, mirror_index)
    + flip(new_state[mirror_index])
    + new_state.substring(mirror_index+1, new_state.length);

  localStorage.setItem('periscope-state', new_state);
  annotate_puzzles();
  return '';
}

function reset() {
  localStorage.setItem('periscope-state', STARTING_STATE);
  annotate_puzzles();
  return '';
}

annotate_puzzles();
