const swap = (arr: any[], i: number, j: number) => {
  const tmp = arr[i]
  arr[i] = arr[j];
  arr[j] = tmp;
}

export const shuffle = (arr: any[], i: number, j: number) => {
  if (i < 0) { i = 0; }
  if (arr.length < i) { i = arr.length; }
  if (arr.length < j) { j = arr.length; }

  if (j <= i) return;

  for (let k: number = i; k < j; k++) {
    const other = i + Math.floor(Math.random() * (j-i));
    swap(arr, k, other);
  }
}

export default shuffle;
