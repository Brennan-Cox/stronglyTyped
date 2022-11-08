import { useState } from "react";
import React from 'react';

/**
 * create element array characters elements and booleans and a respective index
 */
var elementArr: JSX.Element[] = []
var characters: string[] = []
var correct: boolean[] = []
var tutorialTitles: string[] = ["Index Fingers", "Middle Fingers", "Ring Fingers", "Pinky Fingers", "Math Symbols", "Syntax Symbols", "Punctuation"]
var drillTexts: string[] = ["Example text for Drill one Something Uppercase a few $ymbol$ and. punctuation!", 
                            "Another set of text for Drill Two let's get this project done ASAP please dear lord this semester is killing me"]
var drillIndex: number = 0
var testStarted: boolean = false
var startTime: number = 0
var testEnded: boolean = false;


//cursor index
var charIndex: number = 0

function TutorialsTab() {

    //hook designed to allow for refresh when element is set
    var [displayArr, SetElementArr] = useState(elementArr)
    var [displayResults, SetDisplayResults] = useState(false)
    var [wpm, SetWpm] = useState('')
    var [accuracy, SetAccuracy] = useState('')

    /**
     * Method will allow for selection of a drill on click from html buttons
     * @param drill 
     */
    function selectDrill(drill: number) {

        drillIndex = drill
        setInitialText(drillTexts[drillIndex])
    }

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
     * react HTML reference method
     * @returns 
     */
    function DisplayTutorialText(): JSX.Element {
        //render change
        return (<div>{displayArr}</div>)
    }

    /**
     * This will set an initial text of a given string
     * @param input 
     */
    function setInitialText(input: string) {
        //split up this string into an array of characters (global)
        characters = input.split('');

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

        //setAverageScore() from database, may be able to pull and store in page on load
        //check if high score needs updating

        SetDisplayResults(true)
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
                            <td className="py-4 hover:text-mint"><button onClick={e => selectDrill(0)}>Index Fingers</button></td>
                            <td>WPM / %Acc</td>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><button onClick={e => selectDrill(1)}>Middle Fingers</button></td>
                            <td>WPM / %Acc</td>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><button>Ring Fingers</button></td>
                            <td>WPM / %Acc</td>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><button>Pinky Fingers</button></td>
                            <td>WPM / %Acc</td>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><button>Math Symbols</button></td>
                            <td>WPM / %Acc</td>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><button>Syntax Symbols</button></td>
                            <td>WPM / %Acc</td>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><button>Punctuation</button></td>
                            <td>WPM / %Acc</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-20 bg-mint rounded-3xl w-1/2">
                <div className="text-lg">
                    <h2 className="text-3xl font-bold pt-10">{tutorialTitles[drillIndex]}</h2>
                    <br/>
                    <DisplayTutorialText/>
                    <br/>
                    <textarea onKeyDown={e => backspace(e.key)} onChange={(e) => inputCharacter(e.target)} className="text-white bg-stgray-200 resize-none rounded-xl w-80 h-7" placeholder="Click here and start typing to begin!"></textarea>
                    <br/>
                    <button onClick={() => setInitialText(drillTexts[drillIndex])} className = "text-white bg-stgray-200 rounded-md mt-5 pr-2 pl-2">Reset Drill</button>
                    <br/>
                    <div className = {displayResults ? "block" : "hidden"}>
                        <br/>
                        <h3 className = "text-xl font-bold">Drill Complete!</h3>
                        <p>Words Per Minute: {wpm}</p>
                        <p>Accuracy: {accuracy}%</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TutorialsTab;