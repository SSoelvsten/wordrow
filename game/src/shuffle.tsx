import React from "react";
import { resourceLimits } from "worker_threads";
import { GameInstance, getGame } from "./game-instance";

const instance: GameInstance = getGame();

export function shuffleTwo<A>(input: string[], check: string[]) {
    var result: Map<string, number>;
    const perms: string[][] = permutations(input);
    perms.forEach(p => {
        p.forEach((r, j) => {
            result.set(r, 0);
            for (let i = 0; i < r.length; i++) {
                const temp = result.get(r);
                result.set(r, Number(check[j][i] === r[i]) + temp!);
            }
        })
    });
    return result!;
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