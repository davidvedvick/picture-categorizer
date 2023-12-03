import React from "react";
import {Tag} from "../../../transfer";

export function PictureTag(props: Tag) {
    const [isShowing, setIsShowing] = React.useState(false);

    return <>
        <div className="btn-group tag">
            <button type="button" className="btn btn-primary">{props.tag}</button>
            <button type="button" className={`btn btn-primary dropdown-toggle dropdown-toggle-split ${isShowing && 'show'}`} aria-expanded={isShowing} onClick={() => setIsShowing(prevState => !prevState)}>
                <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className={`dropdown-menu ${isShowing && 'show'}`} data-popper-placement="bottom-start">
                <li>Delete</li>
            </ul>
        </div>
    </>;
}