
import { useState , useEffect } from "react";
import "../CSS/navbar.css";
import "../CSS/container.css";

import Navbar from "../partials/navbar";
import TeamDetails from "./team_details";
import Overview from "./overview";

const Container = ()=>{
    const [page,setPage] = useState(0);
    const [overviewData,setOverviewData] = useState([]);
    const [imported,setImported] = useState(false);
    const [alert,setAlert] = useState({display: true , heading: "No player data found" , message: "Please importer your roster first"});
    const [starters,setStarters] = useState([]);
    const [roster,setRoster] = useState([]);
    const [copy,setCopy] = useState([]);
    const [countries,setCountry] = useState([]);
    const [positions,setPosition] = useState([]);
    const [goalkeeper,setGoalkeeper] = useState({});
    const [defender,setDefender] = useState([]);
    const [midfielder,setMidFielder] = useState([]);
    const [forward,setForward] = useState([]);

    return(
        <div className="body">
            <Navbar Set={setPage}/>
            {
                page === 0 ? <TeamDetails Goal={setGoalkeeper} 
                                          Data={overviewData}
                                          Def={setDefender}
                                          Mid={setMidFielder}
                                          Forward={setForward}
                                          StarterFun={setStarters} 
                                          CountryFun={setCountry} 
                                          PositionFun={setPosition} 
                                          Country={countries} 
                                          Position={positions} 
                                          RosterFun={setRoster} 
                                          Roster={roster} 
                                          Alert={setAlert}
                                          CopyFun={setCopy}
                                          Copy={copy} 
                                          Import={imported}
                                          ImportFun={setImported}
                                          Overview={setOverviewData}/> 
                                                                        : <Overview Starter={starters} 
                                                                                    Alert={alert} 
                                                                                    Overview={overviewData}
                                                                                    Def={defender}
                                                                                    Mid={midfielder}
                                                                                    Forward={forward}
                                                                                    Goal={goalkeeper}/>
            }
        </div>
    )
}

export default Container;