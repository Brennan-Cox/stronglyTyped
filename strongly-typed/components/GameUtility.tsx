import React from "react"
/**
 * This section allows for managment of scrolling functionality
 * It should "hand" consecutive words to the gameIterator 
 */
 export class Game {

    //from tutorial tab
    props: any

    //lines to be scrolled
    lines: string[][]

    //element representation of focused area
    linesToDisplay: JSX.Element[][]

    //the element to type and focus on
    focusIndex: number

    //the last element focused on
    lastLoadedIndex: number

    //how many lines to display
    displayLines: number

    //the current JSX.Element to focus on
    lineOfFocus: JSX.Element[]

    //line iterator (btw this this initialized through a method)
    lineItterator: GameIterator

    testEnded: boolean

    //keeps a catalog of the letters typed and if they were correct or not
    correct: boolean[]

    //keeps a boolean array of the ASCII chart missed
    missed: number[]

    /**
     * To start a game you must define the game string, the allowed characters per line
     * and how many lines you want to display
     * @param props from tutorials tab
     * @param testString 
     * @param charactersPerLine 
     * @param displayLines (> 0 and odd)
     */
    constructor(testString: string[], charactersPerLine: number, displayLines: number) {

        //valid size?
        if (!GameUtility.validDisplayRange(displayLines)) {
            throw new Error("Invalid input, displayLines param must be > 0 and odd")
        }
        this.displayLines = displayLines

        //get lines in appropriate format
        this.lines = GameUtility.getLines(testString, charactersPerLine)

        //initialize
        this.linesToDisplay = []
        this.focusIndex = 0
        this.lastLoadedIndex = this.initializeLinesToDisplay()
        let startIndex = Math.floor(this.displayLines / 2)
        this.lineOfFocus = this.linesToDisplay[startIndex]

        //hand to lineIterator
        this.lineItterator = new GameIterator(this.lines[this.focusIndex], this.lineOfFocus)
        this.testEnded = false
        //this.startTime = -1

        this.correct = []
        this.missed = []
        for (let i = 0; i < 256; i++) {
            this.missed.push(0)
        }
    }

    setItterator(stringArray: string[], elementArray: JSX.Element[]) {
        this.lineItterator = new GameIterator(stringArray, elementArray)
    }

    /**
     * This method will identify if there is another valid
     * JSX.Element to change focus to
     * @returns 
     */
    hasNext(): boolean {

        return this.focusIndex < this.lastLoadedIndex - 1
    }

    /**
     * This method will go to the next focus element and simulate scroll
     */
    next(input: HTMLTextAreaElement): boolean {
        /* 
        if (this.startTime === -1) {
            this.startTime = new Date().getTime()
        }*/
        if (!this.testEnded && this.lineItterator.hasNext()) {

            this.lineItterator.next(input, this.correct, this.missed)
            return true
        } else if (!this.testEnded && this.hasNext()) {

            let nextJSXArray: JSX.Element[] = []
            if (this.lastLoadedIndex < this.lines.length) {
                nextJSXArray = GameUtility.stringArrayToJSXArray(this.lines[this.lastLoadedIndex++])
            } else {
                nextJSXArray = GameUtility.stringArrayToJSXArray('_'.split(''))
            }

            let newLinesToDisplay: JSX.Element[][] = []
            for (let i = 1; i < this.linesToDisplay.length; i++) {
                newLinesToDisplay.push(this.linesToDisplay[i])
            }
            newLinesToDisplay.push(nextJSXArray)

            this.linesToDisplay = newLinesToDisplay
            this.focusIndex++
            this.setItterator(this.lines[this.focusIndex],
                this.linesToDisplay[Math.floor(this.displayLines / 2)])
            input.value = ''
            return true
        } else {
            input.value = ''
            return false
        }
    }

    /**
     * calls the prev function of the line itterator
     */
    callPrev() {
        this.lineItterator.prev(this.correct)
    }

    getJSXLinesToDisplay(): JSX.Element[][] {
        return this.linesToDisplay
    }

    /**
     * Instance method to initialize the lines to display
     * ONLY used in constructor when a game is started
     * @returns the index of the last JSX.Element in the array (with content) to load
     */
    private initializeLinesToDisplay(): number {

        //lines to display
        let toGenerate = this.displayLines
        let index = 0
        let half = toGenerate / 2 - 1
        let finalLoaded = 0

        //empty section padded before
        while (index < half) {
            this.linesToDisplay.push(GameUtility.stringArrayToJSXArray('_'.split('')))
            index++
        }

        //section that has elements
        while (index < toGenerate && finalLoaded < this.lines.length) {
            this.linesToDisplay.push(GameUtility.stringArrayToJSXArray(this.lines[finalLoaded++]))
            index++
        }

        //section padded after
        while (index < toGenerate) {
            this.linesToDisplay.push(GameUtility.stringArrayToJSXArray('_'.split('')))
            index++
        }
        return finalLoaded
    }
}

/**  
 *  This section should allow for functionality of processing a single 
 *  JSX.Element array at a time
 */
export class GameIterator {

    line: JSX.Element[]
    characters: string[]
    correct: boolean[]
    cursorIndex: number

    constructor(characters: string[], line: JSX.Element[]) {
        this.line = line
        this.characters = characters
        this.correct = GameUtility.createBooleanArray(characters.length)
        this.cursorIndex = 0
        this.updateCursor()
    }

    updateCursor() {
        this.line[this.cursorIndex] = GameUtility.cursorElement(this.characters[this.cursorIndex])
    }

    hasNext(): boolean {

        return this.cursorIndex < this.characters.length
    }

    hasPrev(): boolean {
        return this.cursorIndex > 0
    }

    next(input: HTMLTextAreaElement, correct: boolean[], missed: number[]) {

        let charInput: string = input.value
        let characterExpected: string = this.characters[this.cursorIndex]
        if (charInput === characterExpected) {
            this.line[this.cursorIndex] = GameUtility.correctArray(characterExpected)
            correct.push(true)
        } else {
            missed[characterExpected.charCodeAt(0)]++
            this.line[this.cursorIndex] = GameUtility.incorrectArray(characterExpected)
            correct.push(false)
        }
        this.cursorIndex++
        this.updateCursor()
        input.value = ''
    }

    prev(correct: boolean[]) {

        if (this.hasPrev()) {
            this.line[this.cursorIndex] = GameUtility.regularArray(this.characters[this.cursorIndex])
            this.cursorIndex--
            this.updateCursor()
            correct.pop()
        }
    }
}

/** 
 * Class designed to contain utility functions
*/
export class GameUtility {

    /**
     * The static attribute that assigns a key to each element
     */
    static elementIDs = 0

    static cursorElement(character: string): JSX.Element {
        return <span className="text-white underline" key={this.elementIDs++}>{character}</span>
    }

    /**
     * Method takes a string and converts it into a JSX.Element array of spans
     * @param characters 
     * @returns JSX.Element
     */
    static stringArrayToJSXArray(characters: string[]): JSX.Element[] {

        let elementArr: JSX.Element[] = []
        characters.forEach((character) => {
            let element: JSX.Element
            if (character == '_') {

                element = <br key={this.elementIDs++}/>
            } else {
                element = <span className="text-white" key={this.elementIDs++}>{character}</span>
            }
            elementArr.push(element)
        })
        return elementArr
    }

    /**
     * Creates a false boolean array of a given size
     * @param length 
     * @returns boolean[]
     */
    static createBooleanArray(length: number): boolean[] {
        let array: boolean[] = []
        for (let i = 0; i < length; i++) {
            array.push(false);
        }
        return array
    }

    /**
     * Checks if valid display range
     * @param displayLines 
     * @returns boolean
     */
    static validDisplayRange(displayLines: number): boolean {

        if (displayLines > 1 && displayLines % 2 === 1) {

            return true
        }
        return false
    }

    static shuffleArray(stringArr: string[]): string[] {
        
        for (let j = 0; j < 2; j++) {
            let length = stringArr.length
            for (let i = 0; i < length; i++) {
                stringArr.push(stringArr[i])
            }
        }

        let currentIndex: number = stringArr.length, randomIndex;

        while (currentIndex != 0) {

            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--;

            [stringArr[currentIndex], stringArr[randomIndex]] = [
                stringArr[randomIndex], stringArr[currentIndex]]
        }
        return stringArr
    }

    /**
     * ********REQUIRES TESTING TO ENSURE RELIABILITY*************
     * Breaks into stringarrayarray or basically a array of chararrays
     * @param string 
     * @param limit 
     * @returns string[][] (lines)
     */
    static getLines(words: string[], limit: number): string[][] {

        let lines: string[][] = []
        let line: string[] = []
        let manyInLine = 0

        words.forEach((word, index) => {

            //add word size and word in char form
            manyInLine += word.length
            word.split('').forEach(character => {
                line.push(character)
            })

            /*
            If you may add more than just a space to a line and this isn't the last
            word
                add space to end and continue to next word

            Otherwise (on last word or line full)
                push the line
                reset the line and many variables
            */
            if (limit - manyInLine > 1 && index < words.length - 1) {
                line.push(' ')
                manyInLine++
            } else {
                lines.push(line)
                manyInLine = 0
                line = []
            }
        })
        return lines
    }

    /**
     * this should take a few arrays and separate by divs
     * @param elementArrArr 
     * @returns JSX.Element[]
     */
    static toSingleJSXArray(elementArrArr: JSX.Element[][]): JSX.Element[] {
        let condensedArray: JSX.Element[] = []
        elementArrArr.forEach(elements => {
            let condensed: JSX.Element = <div key={this.elementIDs++}>{elements}</div>
            condensedArray.push(condensed)
        })
        return condensedArray
    }

    /**
     * This will return a green letter
     * @param character 
     * @returns 
     */
    static correctArray(character: string): JSX.Element {
        return <span className="text-green-900" key={this.elementIDs++}>{character}</span>
    }

    /**
     * This will return a red letter
     * @param character 
     * @returns 
     */
    static incorrectArray(character: string): JSX.Element {
        return <span className="text-red-900" key={this.elementIDs++}>{character}</span>
    }

    /**
     * Will return a white letter
     * @param character 
     * @returns 
     */
    static regularArray(character: string): JSX.Element {
        return <span className="text-white" key={this.elementIDs++}>{character}</span>
    }
}

/**
 * before function call :
 * var tutorialGame: Game
 * var currentProp: any
 * 
 * //if not the exact same instance of props then assume new game
    if (currentProp != props) {
        tutorialGame = new Game(props.test.text, 10, 3)
        currentProp = props
    }

    //set initial state and hooks
    var [displayArr, SetElementArr] = useState(GameUtility.toSingleJSXArray(tutorialGame.linesToDisplay))
    var [displayResults, SetDisplayResults] = useState(false)
    var [wpm, SetWpm] = useState('')
    var [accuracy, SetAccuracy] = useState('')
    var [averageWpm, SetAvgWpm] = useState('')
    var [averageAcc, SetAvgAccuracy] = useState('')

    
     * function will step next if there is still someting
     * to type in a line it will go to the next character
     * otherwise it will scroll if possible
     * all else it will end the game and log the time
     * @param input 
     
     function callNext(input: HTMLTextAreaElement) {
        if (tutorialGame.next(input)) {
            SetElementArr(GameUtility.toSingleJSXArray(tutorialGame.linesToDisplay))
        } else {
            if (!tutorialGame.testEnded) {
                endDrill(tutorialGame)
            }
        }
    }

    
     * function will step back on a singe line if available
     * changing current text white moving back and moving cursor back
     * @param key 
     
    function callPrev(key: string) {
        if (key === 'Backspace') {
            tutorialGame.callPrev()
            SetElementArr(GameUtility.toSingleJSXArray(tutorialGame.linesToDisplay))
        }
    }
 */