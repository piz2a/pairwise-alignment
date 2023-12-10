import React from 'react';
import logo from './logo.svg';
import './App.css';

interface InputProps {
    className: string;
    label: string;
    defaultValue?: string;
}

function Input({ className, label, defaultValue = "" }: InputProps) {
    return (
        <div className="input">
            <span>{label}</span>
            <input type="text" className={className} defaultValue={defaultValue} />
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <div className="header">
                <h2>Pairwise Alignment</h2>
            </div>
            <div className="main">
                <div className="inputWrapper">
                    <Input className={"string1"} label={"String 1"} defaultValue={"CTAACGTAG"} />
                    <Input className={"string2"} label={"String 2"} defaultValue={"ACTAATG"} />
                </div>
                <div className="result">

                </div>
            </div>
            <div className="footer">
                <p>Copyright (c) Jiho Ahn (<a href="https://github.com/piz2a">piz2a</a>) / <a href="https://ziho.kr/">Homepage</a></p>
            </div>
        </div>
    );
}

export default App;
