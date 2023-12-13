export interface ScoreProps {
    match: number;
    mismatch: number;
    gap: number;
}

interface CoordinateProps {
    row: number;
    col: number;
}

export interface ElementProps {  // 행렬 한 칸에 포함된 정보
    num: number;
    from: boolean[];  // [topleft에서 왔는지, top에서 왔는지, left에서 왔는지]
}

export enum Direction {
    rightBottom = 0,
    bottom = 1,
    right = 2,
}

export interface ArrowProps extends CoordinateProps {
    // 여기서 CoordinateProps의 row와 col은 화살표의 시작 지점을 의미한다.
    direction: Direction;
}

interface AlgorithmResultProps {
    array: ElementProps[][];
    arrows: ArrowProps[];
    resultArrows: ArrowProps[];
    alignmentResults: string[][];
    alignmentScore: number;
}

function Algorithm(algorithm: string, s1: string, s2: string, score: ScoreProps): AlgorithmResultProps {
    const array: ElementProps[][] = [];
    // Array initialization
    for (let i = 0; i <= s1.length; i++) {
        array.push([]);
        for (let j = 0; j <= s2.length; j++) {
            array[i].push({num: 0, from: [false, false, false]})
        }
    }

    // array[i][j] = max(array[i-1][j-1] + match/mismatch, array[i-1][j] - gap, array[i][j-1] - gap)
    const getNewElement = (i: number, j: number): ElementProps => {
        const candidates = [
            i === 0 || j === 0 ? -Infinity : (array[i-1][j-1].num + (s1[i-1] === s2[j-1] ? score.match : -score.mismatch)),  // from topleft
            i === 0 ? -Infinity : (array[i-1][j].num - score.gap),  // from top
            j === 0 ? -Infinity : (array[i][j-1].num - score.gap),  // from left
        ];  // 최댓값이 될 후보
        if (algorithm === "smith-waterman")
            candidates.push(0);  // Smith-Waterman 알고리즘은 최댓값 후보에 0도 추가해야 함
        const max = Math.max(...candidates);
        return { num: max, from: candidates.slice(0, 3).map(candidate => candidate === max) };
    };

    let maxOfTable = -Infinity;  // 현재 테이블에서 최댓값
    let maxCoordinates: CoordinateProps[] = [];  // 현재 테이블에서 최댓값을 가지는 좌표들을 모은 리스트
    const arrows: ArrowProps[] = [];
    // 각 칸마다 값을 구하는 과정
    for (let i = 0; i <= s1.length; i++) {
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0 && j === 0) continue; // array[0][0] = 0으로 유지
            array[i][j] = getNewElement(i, j);

            if (array[i][j].num > maxOfTable) {
                maxCoordinates = [{row: i, col: j}];
                maxOfTable = array[i][j].num;
            }
            else if (array[i][j].num === maxOfTable) {
                maxCoordinates.push({row: i, col: j});
            }

            // 화살표 추가
            array[i][j].from.forEach((fromThisDirection, index) => {
                if (fromThisDirection) {
                    arrows.push({row: i - [1, 1, 0][index], col: j - [1, 0, 1][index], direction: index});
                }
            })

        }
    }
    // Smith-Waterman 알고리즘은 table에서의 최댓값이 있는 지점에서 backtracking을 시작하지만
    // Needleman-Wunsch 알고리즘은 table에서의 오른쪽 끝에서 backtracking을 시작한다.
    // 여기서 maxCoordinates는 backtracking을 시작하는 좌표들의 모음이므로,
    // Needleman-Wunsch 알고리즘일 경우 최대 여부와 관계없이 오른쪽 아래의 칸에서 backtracking을 시작하도록 한다.
    if (algorithm === "needleman-wunsch")
        maxCoordinates = [{row: s1.length, col: s2.length}];
    console.log(`maxOfTable: ${maxOfTable}, algorithm: ${algorithm}`);
    console.log(...maxCoordinates.map(coordinate => `(${coordinate.row}, ${coordinate.col})`));

    // Backtracking (BFS)
    let coordinateResults: CoordinateProps[][] = [];
    let queue: CoordinateProps[][] = maxCoordinates.map(maxCoordinate => [maxCoordinate]);
    const resultArrows: ArrowProps[] = [];
    console.log('initial queue:', queue);
    while (queue.length > 0) {
        const newQueue: CoordinateProps[][] = [];
        queue.forEach(trace => {
            if (trace[0].row === 0 && trace[0].col === 0) {
                coordinateResults.push(trace);
                return;
            }
            const firstElement = array[trace[0].row][trace[0].col];
            if (algorithm === "smith-waterman" && firstElement.num === 0) {
                coordinateResults.push(trace);
                return;
            }
            let newFirstCoordinates: CoordinateProps[] = [];
            [0, 1, 2].forEach(i => {
                if (firstElement.from[i]) {
                    // backtracking 결과 앞에 있는 칸의 정보를 얻음
                    const newFirstCoordinate = {row: trace[0].row - [1, 1, 0][i], col: trace[0].col - [1, 0, 1][i]};
                    newFirstCoordinates.push(newFirstCoordinate);
                    // 이를 바탕으로 화살표를 구함
                    resultArrows.push({...newFirstCoordinate, direction: [Direction.rightBottom, Direction.bottom, Direction.right][i]});
                }
            });
            newQueue.push(...newFirstCoordinates.map(newFirstCoordinate => [newFirstCoordinate, ...trace]));
        });
        queue = newQueue;
    }

    console.log("coordinateResults:");
    const alignmentResults: string[][] = [];
    coordinateResults.forEach(r => {
        // Coordinate Results 출력
        console.log(...r.map(coordinate => `(${coordinate.row}, ${coordinate.col})`));

        // Alignment 완료된 서열 구하기
        const gapString = "-";
        let newString1 = "";
        let newString2 = "";
        r.slice(1).forEach((coordinate, i) => {
            const d_row = coordinate.row - r[i].row;  // 이전 칸(r[i])와 현재 칸(coordinate)의 행 차이
            const d_col = coordinate.col - r[i].col;  // 이전 칸와 현재 칸의 열 차이
            if (d_row === 1 && d_col === 1) {
                resultArrows.push({...r[i], direction: Direction.rightBottom});
                newString1 += s1[coordinate.row - 1];
                newString2 += s2[coordinate.col - 1];
            } else if (d_row === 1 && d_col === 0) {
                newString1 += s1[coordinate.row - 1];
                newString2 += gapString;
            } else if (d_row === 0 && d_col === 1) {
                newString1 += gapString;
                newString2 += s2[coordinate.col - 1];
            }
        });
        alignmentResults.push([newString1, newString2]);
    });

    const alignmentScore = algorithm === "needleman-wunsch" ? array[s1.length][s2.length].num : maxOfTable;
    return {array, arrows, resultArrows, alignmentResults, alignmentScore};
}

export default Algorithm;