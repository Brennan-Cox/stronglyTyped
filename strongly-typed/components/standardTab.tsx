import { useEffect, useState } from "react";
import React from 'react';
import { Game } from "./GameUtility";
import { GameUtility } from "./GameUtility";
import Image from 'next/image';



function StandardTab(props: any) {

    //get game from props
    var standardGame: Game = props.gameInstance

    //initial state preHydration
    var [displayArr, SetElementArr] = useState(GameUtility.stringArrayToJSXArray(''.split('')))

    //by calling useEffect a render is triggered after hydrating, this causes the "browser specific" value to be available
    //I.E no server hydration discrepency
    useEffect(() => SetElementArr(GameUtility.toSingleJSXArray(standardGame.linesToDisplay)), [])

    //related to the statistics display section
    var [displayResults, SetDisplayResults] = useState(false)
    var [wpm, SetWpm] = useState('')
    var [accuracy, SetAccuracy] = useState('')
    var [averageWpm, SetAvgWpm] = useState('')
    var [averageAcc, SetAvgAccuracy] = useState('')

    //how much time should be allowed?
    var allowedTime: number = props.test.id == 4 ? 300:60;
    var timerStarted: boolean = false
    var [timerDisplay, setTimer] = useState(allowedTime)

    //the tutoial recommendation button
    var [showTutorialRecommendation, SetRecommend] = useState(false)
    var [tutorialTabNumber, SetTutorialTabNum] = useState(1)

    /**
     * function will step next if there is still someting
     * to type in a line it will go to the next character
     * otherwise it will scroll if possible
     * all else it will end the game and log the time
     * @param input 
     */
    function callNext(input: HTMLTextAreaElement) {
        if (!timerStarted) {
            startTimer()
            timerStarted = true
        }
        if (standardGame.next(input)) {
            SetElementArr(GameUtility.toSingleJSXArray(standardGame.linesToDisplay))
        } else {
            if (!standardGame.testEnded) {
                endDrill(standardGame, allowedTime - timerDisplay)
            }
        }
    }

    /**
     * timer operates using date class in order to be more precise
     * 
     */
    function startTimer() {
        let interval = setInterval(() => {
            if (timerDisplay > 0 && !standardGame.testEnded) {
                timerDisplay--
                setTimer(timerDisplay)
            } else {
                if (!standardGame.testEnded) {
                    endDrill(standardGame, allowedTime)
                }
            }
        }, 1000)
    }

    /**
     * function will step back on a singe line if available
     * changing current text white moving back and moving cursor back
     * @param key 
     */
    function callPrev(key: string) {
        if (key === 'Backspace' && props.test.id != 5) {
            standardGame.callPrev()
            SetElementArr(GameUtility.toSingleJSXArray(standardGame.linesToDisplay))
        }
    }

    /**
  * Calculates results of performing
  */
    function endDrill(game: Game, seconds: number) {

        game.testEnded = true;
        const date: Date = new Date()
        var numWords: number = game.correct.length / 5;
        var wpm: number = numWords / (seconds / 60)
        SetWpm(wpm.toFixed(2))

        var correctCount = 0
        game.correct.forEach((result) => {
            if (result) {
                correctCount++
            }
        })
        var accuracy: number = ((correctCount / game.correct.length) * 100)
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
        recommendTutorial()
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
        standardGame.missed.forEach((index, i) => {
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
            body: JSON.stringify({ user_id: userID, type: "standard", test_id: testID, wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) }),
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
            body: JSON.stringify({ user_id: userID, type: "standard", test_id: testID, wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) }),
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
     * Checks to see if there is a value at the given index and returns
     * an element with the users score values. If not it returns placeholder data
     * 
     * @param index 
     * @returns JSX.Element
     */
    function LeaderRow(index: any): JSX.Element {
        var index = index.index
        if (props.leaderScores.at(index) != undefined && props.leaderScores.at(index).high_wpm != 0) {
            return (<tr className="border-b border-white">
                <td>{props.leaderScores.at(index).username}</td>
                <td>{props.leaderScores.at(index).high_wpm} WPM / {props.leaderScores.at(index).high_accuracy}%</td>
            </tr>)
        } else {
            return (<tr className="hidden"></tr>)
        }
    }

    let testName: JSX.Element[] = []
    let parts: string[] = props.test.name.split('|')
    testName.push(<div>{parts[0]}</div>)
    if (parts.length > 1) {
        testName.push(<p className="text-lg">{parts[1]}</p>)
    }

    return (
        <div>

            {/* Trying to get an image displayed here with text that we can put on top of it. This will serve as the
             instructions for the confused or overwhelmed user */}

             {/* bg-[url('/message.box.png')] */}

            <div className="w-full relative mt-4" >
                <div className="w-full h-full flex flex-col absolute top-0 left-0 justify-center items-center z-10 px-5">
                    {/* <div className="text-white text-2xl">Select a mode from the menu on the left.</div>
                    <div className="text-white text-2xl">Type the text on the screen as fast as you can before time runs out!</div>
                    <div className="text-white text-2xl">Correct letters will highlight green, incorrect will highlight red.</div> */}
                </div>
                <Image src="/message-box-standard.png" alt="" width={846} height={159} />
            </div>

            <div className="flex justify-between">
                <div className="py-20 px-5">
                    <table className=" border-l border-r bg-stgray-200">
                        <thead className="text-mint">
                            <tr className="border-b border-t border-white text-3xl">
                                <th className="px-4 py-2">Game Mode</th>
                                <th className="px-4 py-2">High Score</th>
                            </tr>
                        </thead>
                        <tbody className="text-white text-2xl">
                            <tr className="border-b border-white px-3">
                                <td className="py-4 hover:text-mint"><a href="/standard/1">Standard</a></td>
                                <ScoreRow index={0} />
                            </tr>
                            <tr className="border-b border-white px-3">
                                <td className="py-4 hover:text-mint"><a href="/standard/2">Difficult</a></td>
                                <ScoreRow index={1} />
                            </tr>
                            <tr className="border-b border-white px-3">
                                <td className="py-4 hover:text-mint"><a href="/standard/3">Symbols</a></td>
                                <ScoreRow index={2} />
                            </tr>
                            <tr className="border-b border-white px-3">
                                <td className="py-4 hover:text-mint"><a href="/standard/4">Endurance</a></td>
                                <ScoreRow index={3} />
                            </tr>
                            <tr className="border-b border-white px-3">
                                <td className="py-4 hover:text-mint"><a href="/standard/5">Hardcore</a></td>
                                <ScoreRow index={4} />
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-20 bg-mint rounded-3xl w-1/3">
                    <div className="text-lg">
                        <h2 className="text-3xl font-bold pt-10">{testName}</h2>
                        <br />
                        <div>{displayArr}</div>
                        <br />
                        <div className="px-5">
                            <textarea onKeyDown={e => callPrev(e.key)} onChange={(e) => callNext(e.target)} className="text-white bg-stgray-200 rounded-xl resize-none w-full h-7" placeholder="Click here and start typing to begin!"></textarea>
                        </div>
                        <br />
                        <button className="text-white bg-stgray-200 rounded-md mt-5 pr-2 pl-2"><a href={"/standard/" + props.test.id}>Reset Test</a></button>
                        <h3 className="text-xl font-bold pt-10">Timer</h3>
                        <div className="text-white text-3xl">{timerDisplay}</div>
                        <br />
                        <div className={displayResults ? "block" : "hidden"}>
                            <br />
                            <h3 className="text-xl font-bold">Drill Complete!</h3>
                            <p>Words Per Minute: {wpm}</p>
                            <p>Accuracy: {accuracy}%</p>
                            <h4 className="text-xl font-bold">Average Performance:</h4>
                            <p>WPM: {averageWpm} Accuracy: {averageAcc}%</p>
                        </div>
                        <div className={showTutorialRecommendation ? "block" : "hidden"}>
                            <br />
                            <button className="text-white bg-stgray-200 rounded-md mt-5 pr-2 pl-2"><a href={"/tutorials/" + tutorialTabNumber}>Recommended Tutorial</a></button>
                        </div>
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

export default StandardTab;