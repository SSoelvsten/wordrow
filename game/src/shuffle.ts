const swap = <T>(array: T[], from: number, to: number) => {
  const temp = array[from];
  array[from] = array[to];
  array[to] = temp;
};

const getRandomNumber = (start: number, end: number) => {
  return start + Math.floor(Math.random() * (end - start));
};

export const shuffle = <T>(
  array: T[],
  startIndex: number,
  endIndex: number
) => {
  if (startIndex < 0) {
    startIndex = 0;
  }
  if (array.length < startIndex) {
    startIndex = array.length;
  }
  if (array.length < endIndex) {
    endIndex = array.length;
  }

  if (endIndex <= startIndex) return;

  // case: a single letter is left, i.e. cannot shuffle.
  if (startIndex + 1 === endIndex) {
    return;
  }

  // case: two letters left. It feels better to just swap them.
  if (startIndex + 2 === endIndex) {
    swap(array, startIndex, startIndex + 1);
    return;
  }

  // case: generally, swap index randomly with another.
  for (let i = startIndex; i < endIndex; i++) {
    const other = getRandomNumber(startIndex, endIndex);
    swap(array, i, other);
  }
};

export default shuffle;
