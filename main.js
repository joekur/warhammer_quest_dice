// probability a single die rolls x
function probDie(x) {
  if (x === 0) {
    return (1/6);
  } else if (x === 1) {
    return (1/2 + 1/36);
  } else if (x === 2) {
    return 1/6 + (1/6 * probDie(1));
  } else {
    return Math.pow((1/6), x-2) * probDie(2);
  }
}

// probability `dice` dice roll exactly `sum`
function probDice(dice, sum) {
  result = 0.0;
  possibilitiesByCount(dice, sum).forEach(function(combObj) {
    let count = combObj.count;
    let comb = combObj.combination;

    let thisProb = 1.0;
    comb.forEach(function(dieValue) {
      thisProb = thisProb * probDie(dieValue);
    })
    result += count * thisProb;
  });
  return result;
}

// eg 2, 2 would return:
// [[0,2], [1,1], [2,0]]
function possibilities(dice, sum) {
  let result = [];
  if (sum === 0) {
    return [range(1, dice).map(() => 0)];
  } else if (dice === 1) {
    return [[sum]];
  }

  for (let x = 0; x <= sum; x++) {
    let thisSlice = possibilities(dice - 1, sum - x).map(function(comb) {
      comb.unshift(x);
      return comb;
    });
    result = result.concat(thisSlice);
  }
  return result;
}

function possibilitiesByCount(dice, sum) {
  let allPossibilities = possibilities(dice, sum);
  let result = {};

  allPossibilities.forEach(function(poss) {
    poss = poss.sort();
    let count = (result[poss] && result[poss].count) || 0;
    result[poss] = {count: count+1, combination: poss};
  });

  return Object.values(result);
}

// probability `dice` dice roll at least a total of `sum`
function probDiceAtLeast(dice, sum) {
  result = 1.0;
  for(die=0; die < sum; die++) {
    result = result - probDice(dice, die);
  }
  return result;
}

function range(start, count) {
  return Array.apply(0, Array(count))
    .map(function (element, index) {
    return index + start;
  });
}

let $diceInput = $('input[name="dice"]');
let $sumInput = $('input[name="sum"]');
let $submit = $('#submit');
let $result = $('#result');
let $result_explanation = $('#result_explanation');

$submit.click(function() {
  let dice = parseInt($diceInput.val());
  let sum = parseInt($sumInput.val());
  $result.text((probDiceAtLeast(dice, sum) * 100).toFixed(1) + '%');
});
