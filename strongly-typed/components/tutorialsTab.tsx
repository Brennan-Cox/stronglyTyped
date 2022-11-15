import { useState } from "react";
import React from 'react';
import Image from 'next/image';

/**
 * create element array characters elements and booleans and a respective index
 */
var elementArr: JSX.Element[] = []
var characters: string[] = []
var correct: boolean[] = []
var testStarted: boolean = false
var startTime: number = 0
var testEnded: boolean = false;

//cursor index
var charIndex: number = 0

function TutorialsTab(props: any) {

    //hook designed to allow for refresh when element is set
    var [displayArr, SetElementArr] = useState(props.initialText)
    var [displayResults, SetDisplayResults] = useState(false)
    var [wpm, SetWpm] = useState('')
    var [accuracy, SetAccuracy] = useState('')
    var [averageWpm, SetAvgWpm] = useState('')
    var [averageAcc, SetAvgAccuracy] = useState('')
    

    /**
     * This function will ensure that a new element will be set in the HTML document
     */
    function updateElementArray() {

        //new obj cpy of desired obj
        var tempElementArr: JSX.Element[] = []
        elementArr.forEach(element => {
            tempElementArr.push(element)
        })
        //set this obj
        SetElementArr(tempElementArr)
    }

    /**
     * Function is called on event handle key down
     * In the case of call if backspace is allowed then backspace
     * @param key 
     */
    function backspace(key: string) {
        if (key === 'Backspace' && charIndex > 0 && !testEnded) {

            //set element white at current index
            resetJSXElement()

            //go to previous element
            charIndex--

            updateCursor()

            //update the element array
            updateElementArray()
        }
    }

    /**
     * Function indended to grab input and process
     * @param character
     */
    function inputCharacter(input: HTMLTextAreaElement) {

        //start "timer" for test upon first text entry
        if (!testStarted) {
            testStarted = true;
            const date: Date = new Date()
            startTime = date.getTime()
        }
        //do not allow input if test is ended and results are displayed
        if (testEnded) {
            input.value = ''
            return
        }

        //get the character at index
        let nextCharacter = input.value
        if (nextCharacter === characters[charIndex]) {

            //if the next character recieved is the same as expected
            correct[charIndex] = true
            updateJSXElement()
        } else {
            //if next character is not the same as expected
            correct[charIndex] = false
            updateJSXElement()
        }
        //go next and update
        charIndex++
        if (charIndex == characters.length) {
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
        //split up test string into an array of characters (global)
        characters = props.test.text.split('');

        //reset fields (global)
        elementArr = []
        correct = []
        charIndex = 0
        startTime = 0
        testStarted = false
        testEnded = false
        SetDisplayResults(false)

        //set each JSX element as a span with a single character of white text
        characters.forEach((character, i) => {
            let element: JSX.Element = <span className="text-white" key={i}>{character}</span>
            elementArr.push(element)
            correct.push(false)
        })
        updateCursor()
        //you may simply set the element array because display is a different object
        SetElementArr(elementArr)
    }

    /**
     * update based on if the input character was correct
     */
    function updateJSXElement() {

        //green good red bad
        if (correct[charIndex]) {
            elementArr[charIndex] = <span className="text-green-900" key={charIndex}>{characters[charIndex]}</span>
        } else {
            elementArr[charIndex] = <span className="text-red-900" key={charIndex}>{characters[charIndex]}</span>
        }
    }

    /**
     * sets an element letter back to white
     */
    function resetJSXElement() {
        elementArr[charIndex] = <span className="text-white" key={charIndex}>{characters[charIndex]}</span>
    }

    /**
     * underlines an element letter to show where a user will type next
     */
    function updateCursor() {
        elementArr[charIndex] = <span className="text-white underline" key={charIndex}>{characters[charIndex]}</span>
    }

    /**
     * Calculates results of performing
     */
    function endDrill() {
        testEnded = true;
        const date: Date = new Date()
        var endTime: number = date.getTime()
        var numWords: number = characters.length / 5;
        var testMinutes: number = ((endTime - startTime) / 1000) / 60 
        var wpm: number = numWords / testMinutes
        SetWpm(wpm.toFixed(2))

        var correctCount = 0
        correct.forEach((result) => {
            if (result) {
                correctCount++
            }
        })
        var accuracy: number = ((correctCount / correct.length) * 100)
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
        //setAverageScore() from database, may be able to pull and store in page on load
        //check if high score needs updating


        SetDisplayResults(true)
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
            body: JSON.stringify({ user_id: userID, type: "tutorial", test_id: testID, wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) }),
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
            body: JSON.stringify({ user_id: userID, type: "tutorial", test_id: testID, wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) }),
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

    /** 
     * Checks to see if there is a value at the given index and returns
     * an element with the users score values. If not it returns placeholder data
     * 
     * @param index 
     * @returns JSX.Element
     */
    function ScoreRow(index: any): JSX.Element {
        var index = index.index
        if (props.scores.at(index) != undefined) {
            return (<td>{props.scores.at(index).high_wpm} WPM / {props.scores.at(index).high_accuracy}%</td>)
        } else {
            return (<td>0 WPM / 0% Acc</td>)
        }
    }

    /**
     * Returns an image tag containing the keyboard diagram according to which test is
     * selected in the tutorials tab.
     * @returns JSX.Element
     */
    function keyboardImage() : JSX.Element {
        if (props.test.name == "Index Fingers") {
            return <Image src="/index-fingers.png" alt="" width={1346} height={445} />
        }
        else if (props.test.name == "Middle Fingers") {
            return <Image src="/middle-fingers.png" alt="" width={1346} height={445} />
        }
        else if (props.test.name == "Ring Fingers") {
            return <Image src="/ring-fingers.png" alt="" width={1346} height={445} />
        }
        else if (props.test.name == "Pinky Fingers") {
            return <Image src="/pinky-fingers.png" alt="" width={1346} height={445} />
        }
        else if (props.test.name == "Math Symbols") {
            return <Image src="/math-symbols.png" alt="" width={1346} height={445} />
        }
        else if (props.test.name == "Syntax Symbols") {
            return <Image src="/syntax-symbols.png" alt="" width={1346} height={445} />
        }
        else if (props.test.name == "Punctuation") {
            return <Image src="/punctuation.png" alt="" width={1346} height={445} />
        }
        return <div></div>
    }

    return (
        <div className="flex justify-between">
            <div className="py-20  px-5">
                <table className=" border-l border-r bg-stgray-200">
                    <thead className="text-mint">
                        <tr className="border-b border-t border-white text-3xl">
                            <th className="px-4 py-2">Tutorial</th>
                            <th className="px-4 py-2">High Score</th>
                        </tr>
                    </thead>
                    <tbody className="text-white text-2xl">
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><a href="/tutorials/1">Index Fingers</a></td>
                            <ScoreRow index={0}/>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><a href="/tutorials/2">Middle Fingers</a></td>
                            <ScoreRow index={1}/>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><a href="/tutorials/3">Ring Fingers</a></td>
                            <ScoreRow index={2}/>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><a href="/tutorials/4">Pinky Fingers</a></td>
                            <ScoreRow index={3}/>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><a href="/tutorials/5">Math Symbols</a></td>
                            <ScoreRow index={4}/>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><a href="/tutorials/6">Syntax Symbols</a></td>
                            <ScoreRow index={5}/>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><a href="/tutorials/7">Punctuation</a></td>
                            <ScoreRow index={6}/>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-20 bg-mint rounded-3xl w-1/2">
                <div className="text-lg">
                    <h2 className="text-3xl font-bold pt-10">{props.test.name}</h2>
                    <br/>
                    <div>{displayArr}</div>
                    <br/>
                    <textarea onClick={() => setInitialText()} onKeyDown={e => backspace(e.key)} onChange={(e) => inputCharacter(e.target)} className="text-white bg-stgray-200 resize-none rounded-xl w-80 h-7" placeholder="Click here and start typing to begin!"></textarea>
                    <br/>
                    <button onClick={() => setInitialText()} className = "text-white bg-stgray-200 rounded-md mt-5 pr-2 pl-2"><a href={"/tutorials/"+props.test.id}>Reset Drill</a></button>
                    <br/>
                    <div className = {displayResults ? "block" : "hidden"}>
                        <br/>
                        <h3 className = "text-xl font-bold">Drill Complete!</h3>
                        <p>Words Per Minute: {wpm}</p>
                        <p>Accuracy: {accuracy}%</p>
                        <h4>Average Performance:</h4>
                        <p>WPM: {averageWpm} Accuracy: {averageAcc}%</p>
                    </div>

                    <div className="py-6 px-3">
                        {keyboardImage()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TutorialsTab;