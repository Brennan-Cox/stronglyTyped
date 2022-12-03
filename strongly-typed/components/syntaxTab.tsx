import { useState } from "react";
import React from 'react';
import Image from 'next/image';

/**
 * create element array characters elements and booleans and a respective index
 */
 var elementLines: JSX.Element[][] = []
 var characters: string[][] = []
 var testStarted: boolean = false
 var startTime: number = 0
 var testEnded: boolean = false;
 var charsTyped: number = 0;
 let elementIDs: number = 0

 var correct: boolean[] = []

 //cursor index
 var lineIndex: number = 0
 var charIndex: number = 0
 var firstCharIndex: number = 0;

 var missed: number[] = []

function SyntaxTab(props: any) {

    //set initial state and hooks
    var [displayArr, SetElementArr] = useState(props.initialText)
    var [displayResults, SetDisplayResults] = useState(false)
    var [wpm, SetWpm] = useState('')
    var [accuracy, SetAccuracy] = useState('')
    var [averageWpm, SetAvgWpm] = useState('')
    var [averageAcc, SetAvgAccuracy] = useState('')

    var [showTutorialRecommendation, SetRecommend] = useState(false)
    var [showUnlockedChallenge, setUnlockedChallenge] = useState(false)
    var [tutorialTabNumber, SetTutorialTabNum] = useState(1)


    /**
     * this should take a few arrays and separate by divs
     * @param elementArrArr 
     * @returns JSX.Element[]
     */
     function toSingleJSXArray(elementArrArr: JSX.Element[][]): JSX.Element[] {
        let condensedArray: JSX.Element[] = []
        elementArrArr.forEach(elements => {
            let condensed: JSX.Element = <div key={elementIDs++}>{elements}</div>
            condensedArray.push(condensed)
        })
        return condensedArray
    }


    /**
     * This function will ensure that a new element will be set in the HTML document
     */
     function updateElementArray() {
        SetElementArr(toSingleJSXArray(elementLines))
    }

    /**
     * Location of first character on current line
     * Used for various functions including skipping whitespace and preventing backspacing into whitespace
     */
    function setFirstCharIndex() {
        firstCharIndex = 0
        while (characters[lineIndex][firstCharIndex] === ' ') {
            firstCharIndex++
            if (firstCharIndex == characters[lineIndex].length) {
                lineIndex++
                firstCharIndex = 0
            }
            else if (characters[lineIndex][firstCharIndex] === '}' && firstCharIndex == characters[lineIndex].length - 1) {
                charIndex = firstCharIndex
                updateJSXElement(true)
                lineIndex++
                firstCharIndex = 0
            }
        }

        if (lineIndex == characters.length - 1 && characters[lineIndex][0] == '}') {
            charIndex = 0
            updateJSXElement(true)
            endDrill()
        }
    }

    /**
     * Function is called on event handle key down
     * In the case of call if backspace is allowed then backspace
     * @param key 
     */
    function backspaceOrEnter(key: string) {
        if (key === 'Backspace' && !testEnded) {

            //no backspacing if at first character of first line
            if (lineIndex == 0 && charIndex == 0) {
                return;
            }

            //set element white at current index
            resetJSXElement()

            //go to previous element in current line
            if (charIndex > firstCharIndex) {
                charIndex--
            }
            else { //handles returning to previous line(s)
                lineIndex--
                charIndex = characters[lineIndex].length - 1
                while (characters[lineIndex][charIndex] === ' ' || characters[lineIndex][charIndex] === '}') {
                    lineIndex--
                    charIndex = characters[lineIndex].length - 1
                }
            }
            charsTyped--
            correct.pop()
            updateCursor()

            //update the element array
            updateElementArray()
        }
        else if (key === "Enter" && !testEnded) {
            //only allow progression to next line at end of line
            if (charIndex == characters[lineIndex].length) {
                lineIndex++
                setFirstCharIndex()
                charIndex = firstCharIndex

                if (!testEnded) {
                    updateCursor()
                }
                
                //update the element array
                updateElementArray()
            }
        }
    }

    /**
     * Function indended to grab input and process
     * @param input - textarea
     */
    function inputCharacter(input: HTMLTextAreaElement) {

        //start "timer" for test upon first text entry
        if (!testStarted) {
            testStarted = true;
            const date: Date = new Date()
            startTime = date.getTime()
        }
        //do not allow input if test is ended and results are displayed
        //or if user is at the end of a line of syntax
        if (testEnded || charIndex == characters[lineIndex].length) {
            input.value = ''
            return
        }

        //get the character at index
        let nextCharacter = input.value

        //ignore if user hit Enter key
        if (nextCharacter === "\n") {
            input.value = ''
            return
        }

        if (nextCharacter === characters[lineIndex][charIndex]) {
            //if the next character recieved is the same as expected
            correct.push(true)
            updateJSXElement(true)
        } else {
            correct.push(false)
            updateJSXElement(false)
            missed[characters[lineIndex][charIndex].charCodeAt(0)]++
        }
        //go next and update
        charsTyped++
        charIndex++
        //end test if on last line and typed last character
        if (lineIndex == characters.length - 1 && charIndex == characters[lineIndex].length) {
            endDrill()
        }
        updateCursor()
        updateElementArray()
        //clear input
        input.value = ''
    }

    /**
     * This will set an initial text of a given string
     * @param input 
     */
    function setInitialText() {
        //populate 2d characters array
        characters = []

        let lines: string[] = props.test.text.split('$')
        lines.forEach((line, x) => {
            characters.push(line.split(''))
        })

        for (let i = 0; i < 256; i++) {
            missed.push(0)
        }

        //reset fields (global)
        elementLines = []
        lineIndex = 0
        charIndex = 0
        firstCharIndex = 0
        correct = []
        charsTyped = 0
        startTime = 0
        testStarted = false
        testEnded = false
        elementIDs = 0
        SetDisplayResults(false)

        //set each JSX element as a span with a single character of white text
        characters.forEach((line) => {
            let jsxLine: JSX.Element[] = []
            line.forEach((character) => {
                if (character === ' ') {
                    let element: JSX.Element = <span className="text-white" key={elementIDs++}>&nbsp;</span>
                    jsxLine.push(element)
                }
                else {
                    let element: JSX.Element = <span className="text-white" key={elementIDs++}>{character}</span>
                    jsxLine.push(element)
                }
            })
            elementLines.push(jsxLine)
        })
        updateCursor()
        //you may simply set the element array because display is a different object
        updateElementArray()
    }

    /**
     * update based on if the input character was correct
     */
    function updateJSXElement(correct: boolean) {

        //green good red bad
        if (correct) {
            elementLines[lineIndex][charIndex] = <span className="text-green-900" key={elementIDs++}>{characters[lineIndex][charIndex]}</span>
        } else {
            elementLines[lineIndex][charIndex] = <span className="text-red-900" key={elementIDs++}>{characters[lineIndex][charIndex]}</span>
        }
    }

    /**
     * sets an element letter back to white
     */
    function resetJSXElement() {
        elementLines[lineIndex][charIndex] = <span className="text-white" key={elementIDs++}>{characters[lineIndex][charIndex]}</span>
    }

    /**
     * underlines an element letter to show where a user will type next
     */
    function updateCursor() {
        elementLines[lineIndex][charIndex] = <span className="text-white underline" key={elementIDs++}>{characters[lineIndex][charIndex]}</span>
    }

    /**
     * Calculates results of performing
     */
    function endDrill() {
        testEnded = true;
        const date: Date = new Date()
        var endTime: number = date.getTime()
        var numWords: number = charsTyped / 5;
        var testMinutes: number = ((endTime - startTime) / 1000) / 60 
        var wpm: number = numWords / testMinutes
        SetWpm(wpm.toFixed(2))

        var charsCorrect: number = 0
        correct.forEach((result) => {
            if (result) {
                charsCorrect++
            }
        })
        var accuracy: number = ((charsCorrect / charsTyped) * 100)
        SetAccuracy(accuracy.toFixed(2))
        var aveWpm: number = 0;
        var aveAcc: number = 0;
        if (props.averageScore.at(0) != undefined) {
            aveWpm = props.averageScore.at(0).total_wpm / props.averageScore.at(0).attempts
            aveAcc = props.averageScore.at(0).total_accuracy / props.averageScore.at(0).attempts
        }
        SetAvgWpm(aveWpm.toFixed(2))
        SetAvgAccuracy(aveAcc.toFixed(2))

        updateAverageScore(props.userID, props.test.id, wpm, accuracy)
        updateHighScore(props.userID, props.test.id, wpm, accuracy)
        unlockNextChallenge(props.userID, props.test.id, wpm, accuracy)

        SetDisplayResults(true)
        recommendTutorial()
    }

    /**
     * 
     * @param userID Sends a request to the API route to update the average score. Database handles
     * updating the table with the wpm, accuracy and the number of attempts.
     * 
     * @param testID 
     * @param wpm 
     * @param accuracy 
     */
    async function updateAverageScore(userID: number, testID: number, wpm: number, accuracy: number) {
        await fetch('/api/updateaveragescores', {
            method: "PUT",
            body: JSON.stringify({ user_id: userID, type: "syntax", test_id: testID, wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
    }

    /**
     * Sends a request to the API route to update leaderboards. Database handles updating
     * the table if the user beats their highscore.
     * 
     * @param userID 
     * @param testID 
     * @param wpm 
     * @param accuracy 
     */
    async function updateHighScore(userID: number, testID: number, wpm: number, accuracy: number) {

        var response: Response = await fetch('/api/updateleaderboards', {
            method: "PUT",
            body: JSON.stringify({ user_id: userID, type: "syntax", test_id: testID, wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) }),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (response.ok) {
            var results = await response.json()
            var didBeatHighscore = results.didBeatHighscore
            if (didBeatHighscore) {
                //Update scores in menu
            }
            // Can display a message to the user saying they beat their highscore
        }
    }

    async function unlockNextChallenge(userID: number, testID: number, wpm: number, accuracy: number) {

        var response: Response = await fetch('/api/unlockNextChallenge', {
            method: "PUT",
            body: JSON.stringify({ user_id: userID, test_id: testID, wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) }),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (response.ok) {
            var results = await response.json()
            var didUnlockNext = results.didUnlock
            console.log(props.testID)
            if (didUnlockNext) {
                setUnlockedChallenge(true)
            }
        }
    }

    /**
     * Will return a score row if the score row should be there
     * @param attributes 
     * @returns 
     */
    function ScoreRow(attributes: any): JSX.Element {

        //get the challenge string and the index passed in
        var challenge = attributes.challenge
        var index = attributes.index

        let contains: boolean = false
        props.unlocked.forEach((lock: any) => {
            if (lock.test_id == index + 1) {
                contains = true
            }
        })

        if (contains) {
            return <tr className="border-b border-white px-3">
                <td className="py-3 hover:text-mint"><a href={"/syntax/" + (index + 1)}>{challenge}</a></td>
                <td>{props.scores.at(index).high_wpm} WPM / {props.scores.at(index).high_accuracy}% Acc</td>
            </tr>
        } else {
            return <tr className="hidden"></tr>
        }
    }

    /** 
     * Checks to see if there is a value at the given index and returns
     * an element with the users score values. If not it returns placeholder data
     * 
     * @param index 
     * @returns JSX.Element
     */
    function LeaderRow(index: any): JSX.Element {
        var index = index.index
        const lBoard: any = props.leaderScores.at(index)
        if (lBoard != undefined && lBoard.high_wpm != 0) {
            return (<tr className="border-b border-white">
                <td>{props.leaderScores.at(index).username}</td>
                <td>{props.leaderScores.at(index).high_wpm} WPM / {props.leaderScores.at(index).high_accuracy}% Acc</td>
            </tr>)
        } else {
            return (<tr className="hidden"></tr>)
        }
    }

    function recommendTutorial() {
        let missedChar: string = getMostMissedChar().toUpperCase()
        if (missedChar !== "NONE" && missedChar != " ") {
            let indexFinger: string = "NBHJYUVGFTR"
            let middleFinger: string = "CDEIKM"
            let ringFinger: string = "OLWSX"
            let pinkyFinger: string = "QAZ`P:'"
            let mathSymbols: string = "123#4$5%6^78*9(0)-=+/<>"
            let syntaxSymbols: string = "?\"\{\[\}\]|\\&_;"
            let punctuationSymbols: string = "!,.@~"
            let tabNum: number = 0
            if (indexFinger.includes(missedChar)) {

                tabNum = 1
            } else if (middleFinger.includes(missedChar)) {

                tabNum = 2
            } else if (ringFinger.includes(missedChar)) {

                tabNum = 3
            } else if (pinkyFinger.includes(missedChar)) {

                tabNum = 4
            } else if (mathSymbols.includes(missedChar)) {

                tabNum = 5
            } else if (syntaxSymbols.includes(missedChar)) {

                tabNum = 6
            } else if (punctuationSymbols.includes(missedChar)) {

                tabNum = 7
            } else {


                throw new Error("issue in identifying tutorial recommendation")
            }
            SetTutorialTabNum(tabNum)
            SetRecommend(true)
        }
    }

    function getMostMissedChar(): string {
        let maxIndex: number = 0;
        let max: number = 0;
        missed.forEach((index, i) => {
            if (index > max) {
                max = index
                maxIndex = i
            }
        })
        if (max != 0) {
            return String.fromCharCode(maxIndex)
        } else {
            return "none"
        }
    }

    function formatName(name: string): JSX.Element[] {
        let splitted: string[] = name.split('|')
        let display: JSX.Element[] = []
        splitted.forEach((split, index) => {
            if (index == 0) {
                display.push(<div>{split}</div>)
            } else {
                display.push(<div className="text-lg">{split}</div>)
            }
        })
        return display
    }

    return (
        <div>

            <div className="w-full relative mt-4">
                <div className="w-full h-full flex flex-col absolute top-0 left-0 justify-center items-center z-10">
                    <div className="text-white text-2xl">Select a mode from the menu on the left.</div>
                    <div className="text-white text-2xl">Type the text on the screen as fast and as accurately as you can!</div>
                    <div className="text-white text-2xl">Correct letters will highlight green, incorrect will highlight red.</div>
                    <div className="text-white text-2xl">You must use the ENTER key to progress to the next line.</div>
                </div>
                <Image src="/message-box.png" alt="" width={846} height={190} />
            </div>

            <div className="flex justify-between">

                <div className="py-20  px-5">
                    <table className=" border-l border-r bg-stgray-200">
                        <thead className="text-mint">
                            <tr className="border-b border-t border-white text-3xl">
                                <th className="px-3 py-2">Java Challenges</th>
                                <th className="px-3 py-2">High Score</th>
                            </tr>
                        </thead>
                        <tbody className="text-white text-2xl">
                            <ScoreRow index={0} challenge={"Java 1"}/>
                            <ScoreRow index={1} challenge={"Java 2"}/>
                            <ScoreRow index={2} challenge={"Java 3"}/>
                            <ScoreRow index={3} challenge={"Java 4"}/>
                            <ScoreRow index={4} challenge={"Java 5"}/>
                        </tbody>
                        <thead className="text-mint">
                            <tr className="border-b border-t border-white text-3xl">
                                <th className="px-3 py-2">Python Challenges</th>
                                <th className="px-3 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="text-white text-2xl">
                            <ScoreRow index={5} challenge={"Python 1"}/>
                            <ScoreRow index={6} challenge={"Python 2"}/>
                            <ScoreRow index={7} challenge={"Python 3"}/>
                            <ScoreRow index={8} challenge={"Python 4"}/>
                            <ScoreRow index={9} challenge={"Python 5"}/>
                        </tbody>
                        <thead className="text-mint">
                            <tr className="border-b border-t border-white text-3xl">
                                <th className="px-3 py-2">C++ Challenges</th>
                                <th className="px-3 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="text-white text-2xl">
                            <ScoreRow index={10} challenge={"C++ 1"}/>
                            <ScoreRow index={11} challenge={"C++ 2"}/>
                            <ScoreRow index={12} challenge={"C++ 3"}/>
                            <ScoreRow index={13} challenge={"C++ 4"}/>
                            <ScoreRow index={14} challenge={"C++ 5"}/>
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-20 bg-mint rounded-3xl w-1/2">
                    <div className="text-lg">
                        <h2 className="text-3xl font-bold pt-10">{formatName(props.test.name)}</h2>
                        <br/>
                        <div className="text-left p-4">{displayArr}</div>
                        <br/>
                        <textarea onClick={() => setInitialText()} onKeyDown={e => backspaceOrEnter(e.key)} onChange={(e) => inputCharacter(e.target)} className="text-white bg-stgray-200 resize-none rounded-xl w-80 h-7" placeholder="Click here and start typing to begin!"></textarea>
                        <br/>
                        <button className="text-white bg-stgray-200 rounded-md mt-5 pr-2 pl-2"><a href={"/syntax/"+props.test.id}>Reset Drill</a></button>
                        <br/>
                        <div className={displayResults ? "block" : "hidden"}>
                            <br/>
                            <h3 className = "text-xl font-bold">Drill Complete!</h3>
                            <p>Words Per Minute: {wpm}</p>
                            <p>Accuracy: {accuracy}%</p>
                            <h4>Average Performance:</h4>
                            <p>WPM: {averageWpm} Accuracy: {averageAcc}%</p>
                        </div>
                        <div className={showUnlockedChallenge ? "block" : "hidden"}>
                            <br />
                            <button className="text-white bg-stgray-200 rounded-md mt-5 pr-2 pl-2"><a href={"/syntax/" + (props.testID + 1)}>Next Challenge</a></button>
                        </div>
                        <div className={showTutorialRecommendation ? "block" : "hidden"}>
                            <br />
                            <button className="text-white bg-stgray-200 rounded-md mt-5 pr-2 pl-2"><a href={"/tutorials/" + tutorialTabNumber}>Recommended Tutorial</a></button>
                        </div>
                        <img src="http://i.stack.imgur.com/SBv4T.gif" alt="this slowpoke moves"  width="250" />
                    </div>
                </div>
                <div className="py-20 px-5">
                    <table className=" border-l border-r bg-stgray-200">
                        <thead className="text-mint">
                            <tr className="border-b border-t border-white text-3xl">
                                <th className="py-2">Leaderboard</th>
                            </tr>
                            <tr className="border-b border-white text-2xl">
                                <th className="px-4 py-2">UserName</th>
                                <th className="px-4 py-2">High Score</th>
                            </tr>
                        </thead>
                        <tbody className="text-white text-2xl">
                            <LeaderRow index={0} />
                            <LeaderRow index={1} />
                            <LeaderRow index={2} />
                            <LeaderRow index={3} />
                            <LeaderRow index={4} />
                            <LeaderRow index={5} />
                            <LeaderRow index={6} />
                            <LeaderRow index={7} />
                            <LeaderRow index={8} />
                            <LeaderRow index={9} />
                            <LeaderRow index={10} />
                            <LeaderRow index={11} />
                            <LeaderRow index={12} />
                            <LeaderRow index={13} />
                            <LeaderRow index={14} />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SyntaxTab;