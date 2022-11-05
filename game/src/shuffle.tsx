import React from "react";
import { resourceLimits } from "worker_threads";

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
                
            }*/
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

const swapElements = (arr: any[], i: any, j: any) => {
    var arr2 = arr.map(c => c);
    arr2[i] = arr[j];
    arr2[j] = arr[i];
    return arr2;
}
