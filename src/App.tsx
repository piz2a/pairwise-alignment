import React, {ChangeEventHandler, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {ScoreProps} from "./Algorithm";

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
    const defaultString1 = "CTAACGTAG", defaultString2 = "ACTAATG";
    const defaultScore: ScoreProps = {match: 8, mismatch: 5, gap: 3};
    const [algorithm, setAlgorithm] = useState("needleman-wunsch");
    const [string1, setString1] = useState(defaultString1);
    const [string2, setString2] = useState(defaultString2);
    const [score, setScore] = useState(defaultScore);

    return (
        <div className="App">
            <div className="header">
                <h2>Pairwise Alignment</h2>
                <hr/>
            </div>
            <div className="main">
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
                        <NumberInput className={"matchScore"} label={"Match Score"} defaultValue={defaultScore.match}
                                     onChange={e => setScore({...score, match: parseFloat(e.target.value)})}/>
                        <NumberInput className={"mismatchScore"} label={"Mismatch Score"}
                                     defaultValue={defaultScore.mismatch}
                                     onChange={e => setScore({...score, mismatch: parseFloat(e.target.value)})}/>
                        <NumberInput className={"gapPenalty"} label={"Linear Gap Penalty"}
                                     defaultValue={defaultScore.gap}
                                     onChange={e => setScore({...score, gap: parseFloat(e.target.value)})}/>
                    </div>
                </div>
                <div style={{borderLeft: "1px solid #000", height: "500px"}}></div>
                <div className="result">
                    {algorithm} {string1} {string2} {score.match} {score.mismatch} {score.gap}
                </div>
            </div>
            <div className="footer">
                <p>Copyright (c) Jiho Ahn (<a href="https://github.com/piz2a">piz2a</a>) / <a
                    href="https://ziho.kr/">Homepage</a></p>
            </div>
        </div>
    );
}

export default App;
