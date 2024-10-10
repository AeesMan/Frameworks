import React from "react";
import {links, social} from "./data";
function Sidebar() {
    return(
        <ul className='links'>
            {links.map((link) =>{
                return(
                    <li key={link.id}>
                        <a href={link.url}>{link.text}</a>
                    </li>
                );
            })}
        </ul>
    );
}
function Social() {
    return(
        <ul className='links'>
            {social.map((soc) =>{
                return(
                    <li key={soc.id}>
                        <a href={soc.url}>{soc.icon}</a>
                    </li>
                );
            })}
        </ul>
    );
  }
export {Sidebar, Social};