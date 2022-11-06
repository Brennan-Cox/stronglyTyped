import { useState } from "react";
import React from 'react';

/**
 * create element array characters elements and booleans and a respective index
 */
var elementArr: JSX.Element[] = []
var characters: string[] = []
var correct: boolean[] = []
var drillTexts: string[] = ['drill1', 'drill2']
var drillIndex: number = 0

//cursor index
var charIndex: number = 0

function TutorialsTab() {

    //hook designed to allow for refresh when element is set
    var [displayArr, SetElementArr] = useState(elementArr)

    /**
     * Method will allow for selection of a drill on click from html buttons
     * @param drill 
     */
    function selectDrill(drill: number) {

        drillIndex = drill
        setInitalText(drillTexts[drillIndex])
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
        if (key === 'Backspace' && charIndex > 0) {

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
    function inputCharacter(input: HTMLInputElement) {

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
        /***************************end test here ********************/
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
    function setInitalText(input: string) {
        //split up this string into an array of characters (global)
        characters = input.split('');

        //reset fields (global)
        elementArr = []
        correct = []
        charIndex = 0

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
            <div className="flex justify-center mt-20 mr-20 px-20 bg-mint rounded-3xl w-1/2">
                <div>
                    <br />
                    <DisplayTutorialText />
                    <input onKeyDown={e => backspace(e.key)} onChange={(e) => inputCharacter(e.target)} className="bg-stgray-200 resize-none text-white rounded-2xl pd-10 pl-2 pr-2" name="input" id="input"></input>
                    <br />
                    <button onClick={() => setInitalText(drillTexts[drillIndex])}>reset</button>
                </div>
            </div>
        </div>
    )
}

export default TutorialsTab;