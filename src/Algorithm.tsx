interface Line {
    match: boolean;
    gapH: boolean;
    gapV: boolean;
}

export interface ScoreProps {
    match: number;
    mismatch: number;
    gap: number;
}

function Algorithm(algorithm: string, s1: string, s2: string, score: ScoreProps) {
    const array: number[][] = [];
    for (let i = 0; i <= s1.length; i++)
        array.push(new Array(s2.length + 1).fill(0));

    // array[i][j] = max(array[i-1][j-1] + match/mismatch, array[i-1][j] - gap, array[i][j-1] - gap)
    const getNewArrayValue = (i: number, j: number) => {
        const candidates = [
            i === 0 || j === 0 ? -Infinity : (array[i-1][j-1] + (s1[i-1] === s2[j-1] ? score.match : -score.mismatch)),  // from top left
            i === 0 ? -Infinity : (array[i-1][j] - score.gap),  // from top
            j === 0 ? -Infinity : (array[i][j-1] - score.gap),  // from left
        ];
        if (algorithm === "smith-waterman")
            candidates.push(0);
        return Math.max(...candidates);
    };

    for (let i = 0; i <= s1.length; i++) {
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0 && j === 0) continue; // array[0][0] = 0으로 유지
            array[i][j] = getNewArrayValue(i, j);
        }
    }

    console.log(array);
    return array;
}

export default Algorithm;