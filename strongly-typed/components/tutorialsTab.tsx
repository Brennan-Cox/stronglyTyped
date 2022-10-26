function TutorialsTab() {

    return (
        <div>
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
                            <td className="py-4 hover:text-mint"><button>Index Fingers</button></td>
                            <td>WPM / %Acc</td>
                        </tr>
                        <tr className="border-b border-white px-3">
                            <td className="py-4 hover:text-mint"><button>Middle Fingers</button></td>
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
        </div>
    )
}

export default TutorialsTab;