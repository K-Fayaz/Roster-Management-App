
import { useState } from "react";

import { MdEdit } from "react-icons/md";
import { IoWarningSharp } from "react-icons/io5";


import "../CSS/formation-style.css";
import "../CSS/formation-modal.css";


const Overview = (props)=>{  
    
    const [details,setDetails] = useState(props.Goal);

    function handleDetailsClick(e)
    {
        let id = e.target.id.split('-');

        if(id[0] == 'goal')
        {
            setDetails(props.Goal);
        }

        if(id[0] == 'def')
        {
            setDetails(props.Def[id[1]]);
        }

        if(id[0] == 'mid')
        {
            setDetails(props.Mid[id[1]])
        }

        if(id[0] == 'for')
        {
            setDetails(props.Forward[id[1]]);
        }
    }
    
    return(
        <>
            <div className="formation-container">
                <div className="formation">
                    <div className="formation-head">
                        <h3>Formation Overview</h3>
                        <div className="formation-team-name">
                            <h4>My Team</h4>
                            <MdEdit className="formation-edit-btn"/>
                        </div>
                    </div>
                    <div className="formation-field-container">
                        <div className="formation-field">
                            {
                                props.Starter.length == 11 ? <div>
                                                                <div className="goalkeeper">
                                                                    <div id="goal" onClick={handleDetailsClick}>{props.Goal['Jersey Number']}</div>
                                                                    <p>{props.Goal['Player Name']}</p>
                                                                </div>

                                                                {
                                                                    props.Def.map((item,index)=>{
                                                                        return(
                                                                            <div key={index} className={`defender defender-${index}`}>
                                                                                <div id={`def-${index}`} onClick={handleDetailsClick}>{item['Jersey Number']}</div>
                                                                                <p>{item['Player Name']}</p>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                                {
                                                                    props.Mid.map((item,index)=>{
                                                                        return(
                                                                            <div key={index} className={`midfielder mid-${index}`}>
                                                                                <div id={`mid-${index}`} onClick={handleDetailsClick}>{item['Jersey Number']}</div>
                                                                                <p>{item['Player Name']}</p>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                                {
                                                                    props.Forward.map((item,index)=>{
                                                                        return(
                                                                            <div key={index} className={`forward for-${index}`}>
                                                                                <div id={`for-${index}`} onClick={handleDetailsClick}>{item['Jersey Number']}</div>
                                                                                <p>{item['Player Name']}</p>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                            </div> : <p></p>
                            }
                        </div>
                        <div className="formation-demo">
                            {
                                props.Starter.length == 11 ? <div className="top-section">
                                                                <img src={`${details['Player Image']}`} alt="image"/>
                                                                <div className="player-main-details">
                                                                    <h1>{details['Player Name']}</h1>
                                                                    <h2>{details['Position']}</h2>
                                                                </div>
                                                                <div className="player-main-stats">
                                                                    <div>
                                                                        <h5>Height</h5>
                                                                        <p>{details['Height']} m</p>
                                                                    </div>
                                                                    <div>
                                                                        <h5>Weight</h5>
                                                                        <p>{details['Weight']} kg</p>
                                                                    </div>
                                                                    <div>
                                                                        <h5>Nationality</h5>
                                                                        <div>
                                                                            <img src={`${details['Flag Image']}`} alt="flag"/>
                                                                            <p>{details['Nationality']}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div> : <p></p>
                            }
                            {
                                props.Starter.length ==  11 ? <div className="bottom-section">
                                                                <div className="player-sub-stats">
                                                                    <div>
                                                                        <h1>{details['Appearances']}</h1>
                                                                        <p>Appearances</p>
                                                                    </div>
                                                                    <div>
                                                                        <h1>{details['Minutes Played']}</h1>
                                                                        <p>Minutes played</p>
                                                                    </div>
                                                                </div>
                                                                <div className="player-sub-stats">
                                                                    {
                                                                        details['Position'] == 'Goalkeeper' ? <div><h1>{details['Clean Sheets']}</h1><p>Clean Sheets</p></div> : <div><h1>{details['Goals ']}</h1><p>Goals</p></div> 
                                                                    }
                                                                    {
                                                                        details['Position'] == 'Goalkeeper' ? <div><h1>{details['Saves']}</h1><p>Saves</p></div> : <div><h1>{details['Assists']}</h1><p>Assists</p></div> 
                                                                    }
                                                                </div>
                                                            </div> : <p></p>
                            }
                        </div>
                    </div>
                </div>
                {
                    props.Starter.length != 11 ? <div className="formation-modal-container">
                                        <div className="formation-modal">
                                            {
                                                props.Starter.length == 0 ? <div className="formation-modal-head">
                                                                                <div>
                                                                                    <IoWarningSharp className="warning"/>
                                                                                    <h4>No player data found</h4>
                                                                                </div>
                                                                                <p>Please importer your roster first</p>
                                                                            </div> : <p></p>
                                            }
                                            {
                                                props.Starter.length > 11 ? <div className="formation-modal-head">
                                                                                <div>
                                                                                    <IoWarningSharp className="warning"/>
                                                                                    <h4>Too many starters</h4>
                                                                                </div>
                                                                                <p>Your team has too many starters for one or more of the position in the 4-3-3 formation</p>
                                                                            </div> : <p></p>
                                            }
                                            {
                                                props.Starter.length < 11 && props.Starter.length != 0 ? <div className="formation-modal-head">
                                                                                <div>
                                                                                    <IoWarningSharp className="warning"/>
                                                                                    <h4>Not enough starters</h4>
                                                                                </div>
                                                                                <p>Your team does'nt have enough starters for one or more of the position in the 4-3-3 formation</p>
                                                                            </div> : <p></p>
                                            }
                                        </div>
                                    </div> : <p></p>
                }
            </div>
        </>
    )
};

export default Overview;