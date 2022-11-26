const swap = (arr: any[], i: number, j: number) => {
  const tmp = arr[i]
  arr[i] = arr[j];
  arr[j] = tmp;
}

export const shuffle = (arr: any[], i: number, j: number) => {
  // fix bad indices
  if (i < 0) { i = 0; }
  if (arr.length < i) { i = arr.length; }
  if (arr.length < j) { j = arr.length; }

  // case: end before start
  if (j <= i) return;

  // case: a single letter is left, i.e. cannot shuffle.
  if (i + 1 === j) {
    return;
  }

  // case: two letters left. It feels better to just swap them.
  if (i + 2 === j) {
    swap(arr, i, i+1);
    return;
  }

  // case: generally, swap index randomly with another.
  for (let k: number = i; k < j; k++) {
    const other = i + Math.floor(Math.random() * (j-i));
    swap(arr, k, other);
  }
}

export default shuffle;
