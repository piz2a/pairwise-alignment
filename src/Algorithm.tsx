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

interface AlgorithmProps {
    s1: string;
    s2: string;
    scores: ScoreProps
}

function Algorithm(algorithm: string, s1: string, s2: string, score: ScoreProps) {
    return <></>
}

function NeedlemanWunsch() {
}

function SmithWaterman() {
}

export default Algorithm;