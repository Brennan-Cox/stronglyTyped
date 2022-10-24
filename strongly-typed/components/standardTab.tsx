import React, { useState } from "react";

//Contents are used purely for example.  Should be able to set up tab content and related js/ts functionality to be imported on the main-page
function StandardTab() {
    const [showMe, setShowMe] = useState(false);
    function toggle() {
        setShowMe(!showMe);
    }
    const Text = () => <div>You clicked the message!</div>;

    return (
        <div>
            <a onClick={toggle} className= "font-body font-semibold text-3xl">Contents of the standard tab</a>
            {showMe ? <Text /> : null}
        </div>
    )
}

export default StandardTab;