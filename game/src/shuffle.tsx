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

// ----------------------------------------------------------------------------
// Here be dragons
/*
export function shuffleTwo<A>(input: string[], check: string[]) {
    var result: Map<string, number> = new Map;
    const perms: string[][] = permutations(input);
    perms.forEach(r => {
        const p = r.join();
        result.set(p, 0);
        for (let k = 0; k < check.length; k++) {
            /*for (let i = 0; i < r.length; i++) {
                const temp = result.get(r);
                const checkWord = check[k];
                console.log("r: " + r + " c: " + checkWord);
                for (let l = 0; l < checkWord.length; l++) {
                    result.set(r, Number(checkWord[l] === r[i]) + temp!);
                }
            }*//*
            result.set(p, result.get(p)! + hammingDist(p, check[k]));
        }
    });
    return result;
}

function hammingDist(str1: string, str2: string)
{
    let i = 0, count = 0;
    while (i < str1.length)
    {
        if (str1[i] != str2[i])
            count++;
        i++;
    }
    return count;
}

const permutations = (arr: any) => {
    if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
    return arr.reduce(
      (acc: any, item: any, i: any) =>
        acc.concat(
          permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((val: any) => [
            item,
            ...val,
          ])
        ),
      []
    );
  };

function findAllPermutations<A>(arr: A[]) {
    var result: A[][] = [];
    var index = 1;
    var p = arr.map((_, i) => i);
    while (index < arr.length) {
        p[index] = p[index] - 1;
        var j = 0;
        if (index % 2 === 0) j = p[index];
        swapElements(arr, j, index);
        result.push(arr);
        index = 1;
        while (p[index] == 0) {
            p[index] = index;
            index += 1;
        }
    }
  };
*/
