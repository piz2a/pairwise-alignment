import React, {ChangeEventHandler, useState} from 'react';
import styled from "styled-components";
import './App.css';
import Algorithm, {ArrowProps, ElementProps, ScoreProps} from "./Algorithm";

interface InputProps {
    className: string;
    label: string;
    defaultValue: any;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

function StringInput({ className, label, defaultValue, onChange }: InputProps) {
    return (
        <div className="input">
            <span>{label}</span>
            <input type="text" className={className} defaultValue={defaultValue} onChange={onChange}/>
        </div>
    );
}

function NumberInput({ className, label, defaultValue, onChange }: InputProps) {
    return (
        <div className="numberInput">
            <span>{label}</span>
            <input type="number" className={className} defaultValue={defaultValue} onChange={onChange} />
        </div>
    );
}

function App() {
    const defaultString1 = "CTTAACT", defaultString2 = "CGGATCAT";
    const defaultScore: ScoreProps = {match: 5, mismatch: 3, gap: 2};
    const [algorithm, setAlgorithm] = useState("needleman-wunsch");
    const [string1, setString1] = useState(defaultString1);
    const [string2, setString2] = useState(defaultString2);
    const [score, setScore] = useState(defaultScore);

    const { array, arrows, resultArrows, alignmentResults } = Algorithm(algorithm, string1, string2, score);

    return (
        <div className="App">
            <div className="header">
                <h2>Pairwise Alignment</h2>
                <hr/>
            </div>
            <div className="main">
                <div className="left">
                    <div className="inputWrapper">
                        <div className="algorithmWrapper">
                            <div className="algorithmInput">
                                <span>Algorithm</span>
                                <select name="algorithm" onChange={event => setAlgorithm(event.target.value)}>
                                    <option value="needleman-wunsch">Needleman-Wunsch</option>
                                    <option value="smith-waterman">Smith-Waterman</option>
                                </select>
                            </div>
                        </div>
                        <div className="stringWrapper">
                            <StringInput className={"string1"} label={"String 1"} defaultValue={defaultString1}
                                         onChange={e => setString1(e.target.value)}/>
                            <StringInput className={"string2"} label={"String 2"} defaultValue={defaultString2}
                                         onChange={e => setString2(e.target.value)}/>
                        </div>
                        <div className="scoreWrapper">
                            <NumberInput className={"matchScore"} label={"Match Score(+)"}
                                         defaultValue={defaultScore.match}
                                         onChange={e => setScore({...score, match: parseFloat(e.target.value)})}/>
                            <NumberInput className={"mismatchScore"} label={"Mismatch Score(-)"}
                                         defaultValue={defaultScore.mismatch}
                                         onChange={e => setScore({...score, mismatch: parseFloat(e.target.value)})}/>
                            <NumberInput className={"gapPenalty"} label={"Linear Gap Penalty(-)"}
                                         defaultValue={defaultScore.gap}
                                         onChange={e => setScore({...score, gap: parseFloat(e.target.value)})}/>
                        </div>
                        <div className="resultWrapper">
                            <span>Alignment Results</span>
                            <textarea value={
                                alignmentResults.map(alignmentResult => `${alignmentResult[0]}\n${alignmentResult[1]}`).join('\n\n')
                            }/>
                        </div>
                    </div>
                </div>
                <div style={{borderLeft: "1px solid #000", height: "500px"}}></div>
                <div className="result">
                    <div className="tableWrapper">
                        {/* Alignment 결과 table로 그리기 */}
                        <table>
                            <tbody>
                            <tr>
                                {('  ' + string2).split('').map((char: string) => <th>{char}</th>)}
                            </tr>
                            {array.map((line: ElementProps[], i: number) => (
                                <tr>
                                    <th>{string1[i - 1]}</th>
                                    {line.map((element: ElementProps) => <td>{element.num}</td>)}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="linesWrapper">
                            {/* 회색 선, 빨간 선 그리는 부분 */}
                            {[
                                ...arrows.map(arrow => <Line arrow={arrow}/>),
                                ...resultArrows.map(arrow => <Line arrow={arrow} red={true}/>)
                            ]}
                        </div>
                    </div>
                </div>
                <div style={{borderLeft: "1px solid #000", height: "500px"}}></div>
                <div className="information">
                    <span>Hello</span>
                </div>
            </div>
            <div className="footer">
                <p>Copyright (c) Jiho Ahn (<a href="https://github.com/piz2a">piz2a</a>) / <a
                    href="https://ziho.kr/">Homepage</a></p>
            </div>
        </div>
    );
}

const LineDiv = styled.div`
    height: 1px;
    background: #999;
    position: absolute;
    transform-origin: 0 0;
`;

interface LineProps {
    arrow: ArrowProps;
    red?: boolean;
}

function Line({ arrow, red = false }: LineProps) {
    const squareSize = 2.14;
    const width = [1.7, 1.2, 1.2][arrow.direction];
    const deg = [45, 90, 0][arrow.direction];
    const [top0, left0] = [[3.7, 3.7], [3.7, 3.28], [3.28, 3.7]][arrow.direction];

    return (
        <LineDiv style={{
            ...(red ? {height: "2px", background: "red"} : {}),
            width: `${width}em`,
            transform: `rotate(${deg}deg)`,
            marginTop: `${top0 + squareSize * arrow.row}em`,
            marginLeft: `${left0 + squareSize * arrow.col}em`,
        }}/>
    );
}

export default App;
