// source: https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/cryptography/rail-fence-cipher/railFenceCipher.js

const DIRECTIONS = { UP: -1, DOWN: 1 };

const buildFence = (rowsNum) =>
  Array(rowsNum)
    .fill(null)
    .map(() => []);

const getNextDirection = ({ railCount, currentRail, direction }) => {
  switch (currentRail) {
    case 0:
      // Go down if we're on top of the fence.
      return DIRECTIONS.DOWN;
    case railCount - 1:
      // Go up if we're at the bottom of the fence.
      return DIRECTIONS.UP;
    default:
      // Continue with the same direction if we're in the middle of the fence.
      return direction;
  }
};

const addCharToRail = (targetRailIndex, letter) => {
  function onEachRail(rail, currentRail) {
    return currentRail === targetRailIndex ? [...rail, letter] : rail;
  }
  return onEachRail;
};

const fillEncodeFence = ({ fence, currentRail, direction, chars }) => {
  if (chars.length === 0) {
    // All chars have been placed on a fence.
    return fence;
  }

  const railCount = fence.length;

  // Getting the next character to place on a fence.
  const [letter, ...nextChars] = chars;
  const nextDirection = getNextDirection({
    railCount,
    currentRail,
    direction,
  });

  return fillEncodeFence({
    fence: fence.map(addCharToRail(currentRail, letter)),
    currentRail: currentRail + nextDirection,
    direction: nextDirection,
    chars: nextChars,
  });
};

const fillDecodeFence = (params) => {
  const { strLen, chars, fence, targetRail, direction, coords } = params;

  const railCount = fence.length;

  if (chars.length === 0) {
    return fence;
  }

  const [currentRail, currentColumn] = coords;
  const shouldGoNextRail = currentColumn === strLen - 1;
  const nextDirection = shouldGoNextRail
    ? DIRECTIONS.DOWN
    : getNextDirection({ railCount, currentRail, direction });
  const nextRail = shouldGoNextRail ? targetRail + 1 : targetRail;
  const nextCoords = [
    shouldGoNextRail ? 0 : currentRail + nextDirection,
    shouldGoNextRail ? 0 : currentColumn + 1,
  ];

  const shouldAddChar = currentRail === targetRail;
  const [currentChar, ...remainderChars] = chars;
  const nextString = shouldAddChar ? remainderChars : chars;
  const nextFence = shouldAddChar
    ? fence.map(addCharToRail(currentRail, currentChar))
    : fence;

  return fillDecodeFence({
    strLen,
    chars: nextString,
    fence: nextFence,
    targetRail: nextRail,
    direction: nextDirection,
    coords: nextCoords,
  });
};

const decodeFence = (params) => {
  const { strLen, fence, currentRail, direction, code } = params;

  if (code.length === strLen) {
    return code.join("");
  }

  const railCount = fence.length;

  const [currentChar, ...nextRail] = fence[currentRail];
  const nextDirection = getNextDirection({ railCount, currentRail, direction });

  return decodeFence({
    railCount,
    strLen,
    currentRail: currentRail + nextDirection,
    direction: nextDirection,
    code: [...code, currentChar],
    fence: fence.map((rail, idx) => (idx === currentRail ? nextRail : rail)),
  });
};

const encodeRailFenceCipher = (string, railCount) => {
  const fence = buildFence(railCount);

  const filledFence = fillEncodeFence({
    fence,
    currentRail: 0,
    direction: DIRECTIONS.DOWN,
    chars: string.split(""),
  });

  return filledFence.flat().join("");
};

const decodeRailFenceCipher = (string, railCount) => {
  const strLen = string.length;
  const emptyFence = buildFence(railCount);
  const filledFence = fillDecodeFence({
    strLen,
    chars: string.split(""),
    fence: emptyFence,
    targetRail: 0,
    direction: DIRECTIONS.DOWN,
    coords: [0, 0],
  });

  return decodeFence({
    strLen,
    fence: filledFence,
    currentRail: 0,
    direction: DIRECTIONS.DOWN,
    code: [],
  });
};

const encryptedText = encodeRailFenceCipher("hello", 2);
console.log(encryptedText);
console.log(decodeRailFenceCipher("hello", 5));
