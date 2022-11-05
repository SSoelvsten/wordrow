import React from "react";

export function shuffle<A>(input: A[], set: String[]) {
    const permutations = findAllPermutations(input);
    permutations.map(arr => {
      set.map(word => {
        for (let i = 0; i < word.length; i++) {
          
          
        }
      })
    })
    return
}

function findAllPermutations<A>(arr :A[]) {
    if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
    return arr.reduce(
      (acc, item, i) =>
        acc.concat(
          findAllPermutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((val) => [
            item,
            ...val,
          ])
        ),
      []
    );
  };