
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { MdDataObject, MdEdit } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import Papa from "papaparse";

import "../CSS/details.css";
import "../CSS/modal.css"
import "../CSS/edit-modal.css"

import TeamTable from "../components/team_table";

const TeamDetails = (props)=>{

    const allowedExtensions = ["csv"];
    const [data,setData] = useState([]);
    const [summary,setSummary] = useState({});
    const [edit,setEdit] = useState({edit: false,index: undefined});
    const [Delete,setDelete] = useState({delete: false,index: undefined});
    const [editData,setEditData] = useState({});
    const [searchMatch,setMatch] = useState([]);

    document.addEventListener('keydown', function(event){
        if(event.key == 'Enter')
        {
            props.RosterFun(searchMatch);
        }
    })

    function handleImportClick(event)
    {
        if(event.target.id == "btn-1" || event.target.id == "btn-2")
        {
            document.getElementById("modal-container").style.display = "grid";
        }

        if(event.target.id == "btn-3"){
            document.getElementById("modal-container").style.display = "none";
            document.getElementById('input-details').style.display = "none";
        }

        if(event.target.id == "import-complete")
        {
            props.RosterFun(data.slice(0,13));
            props.CopyFun(data.slice(0,13));
            document.getElementById('message').style.display = 'none';
            document.getElementById("modal-container").style.display = "none";
            document.getElementById('input-details').style.display = "none";

            document.getElementById('btn-2').innerText = 'Re-Import Team';
            document.getElementById('btn-2').style.background = 'transparent';
            document.getElementById('btn-2').style.border = '1px solid grey';
            props.ImportFun(true);
        }
    }

    function handleFileInputChange(e)
    {
        const inputFile = e.target.files[0];
        const fileExt = inputFile.type.split('/')[1];
        if(allowedExtensions.includes(fileExt))
        {
            Papa.parse(inputFile,{
                header: true,
                complete: function(results){
                    setData(results.data);
                    props.Overview(results.data);

                    // console.log(results.data);

                    const hasEmptyValue = results.data.some((obj) => Object.values(obj).some((value) => String(value).trim() === ''));
                    if(hasEmptyValue)
                    {
                        document.getElementById('import-complete').classList.remove('import-btn-3');
                        document.getElementById('import-complete').disabled = true;
                        document.getElementById("err-msg-container").style.display = "block";
                        document.querySelector('.ok-msg').innerText = '';
                        document.getElementById('input-details').style.display = 'none';
                        document.querySelector('.err-message').innerText = 'Your sheet has missing data.Please ensure all cells are filled out.'
                    }
                    else{
                        document.getElementById('import-complete').classList.add('import-btn-3');
                        document.getElementById('import-complete').disabled = false;
                        document.getElementById("err-msg-container").style.display = "none";
                        document.getElementById('input-details').style.display = 'block';
                        document.querySelector('.ok-msg').innerText = 'File Must be .csv format';
                        document.querySelector('.err-message').innerText = ''
                    }

                    let country = [];
                    let position = [];

                    let summary = {
                        total: results.data.length,
                        Defender:0,
                        Midfielder:0,
                        Forward:0,
                        Goalkeeper:0
                    };

                    let starters = [];

                    results.data.forEach((item)=>{
                        summary[item.Position]++;
                        
                        if(!country.includes(item.Nationality))
                            country.push(item.Nationality);

                        if(!position.includes(item.Position))
                            position.push(item.Position);

                        if(item.Starter == 'Yes')
                            starters.push(item);

                    });

                    console.log("file input change length",starters.length)

                    if(!hasEmptyValue)
                        setSummary(summary);
                    props.StarterFun(starters);
                    props.PositionFun(position)
                    props.CountryFun(country)

                    // document.getElementById('input-details').style.display = "block";

                },
            })
        }else{
            document.querySelector('.err-message').innerText = 'Roster file must be in .csv format';
        }
    }

    function handleEditChange(e)
    {
        let id = e.target.id;
        if(id == 'edit-player-name')
        {
            setEditData({...editData,'Player Name': e.target.value});
        }   

        if(id == 'edit-player-number')
            setEditData({...editData,'Jersey Number': e.target.value});

        if(id == 'edit-height')
            setEditData({...editData,Height: e.target.value})

        if(id == 'edit-weight')
            setEditData({...editData,Weight: e.target.value})

        if(id == 'edit-nation')
            setEditData({...editData,Nationality: e.target.value})

        if(id == 'edit-position')
            setEditData({...editData,Position: e.target.value})
    }

    function handleEditSubmit(e)
    {
        let newEdit = props.Roster;
        console.log(editData)
        let feed = {
            ...editData,
            'Flag Image': props.Roster[edit.index]['Flag Image'],
            'Appearances': props.Roster[edit.index]['Appearances'],
            'Minutes Played': props.Roster[edit.index]['Minutes Played'],
        }
        if(!feed['Player Name'])
            feed['Player Name'] = props.Roster[edit.index]['Player Name'];
        if(!feed['Jersey Number'])
            feed['Jersey Number'] = props.Roster[edit.index]['Jersey Number'];
        if(!feed['Height'])
            feed['Height'] = props.Roster[edit.index]['Height']
        if(!feed['Weight'])
            feed['Weight'] = props.Roster[edit.index]['Weight']
        if(!feed['Nationality'])
            feed['Nationality'] = props.Roster[edit.index]['Nationality'];
        if(!feed['Position'])
            feed['Position'] = props.Roster[edit.index]['Position'];
        if(!feed['Starter'])
            feed['Starter'] = props.Roster[edit.index]['Starter'];        

        let newOverview = props.Data;
        newOverview[edit.index] = feed;
        props.Overview(newOverview);

        let start = [];
        let goal = {};
        let defenders = []
        let midfielder = []
        let forwards = [];

        newOverview.forEach((item)=>{
            if(item.Starter == 'Yes')
                start.push(item);            
        });

        start.forEach((item)=>{
            if(item.Position == 'Goalkeeper')
                goal = item;

            if(item.Position == 'Defender')
                defenders.push(item)

            if(item.Position == 'Midfielder')
                midfielder.push(item)

            if(item.Position == 'Forward')
                forwards.push(item)
        })

        console.log(goal)
        console.log(defenders)
        console.log(midfielder)
        console.log(forwards)

        props.Goal(goal)
        props.Mid(midfielder)
        props.Def(defenders)
        props.Forward(forwards)

        console.log("Edit submit chage start lenth",start.length)
        props.StarterFun(start);

        newEdit[edit.index] = feed;
        props.RosterFun(newEdit);
        // setData(newEdit);
        setEdit({edit:false,index: undefined});
    }

    function handleDeleteClick(e)
    {
        let deleteUpdate = props.Roster;
        deleteUpdate.splice(Delete.index,1);
        props.RosterFun(deleteUpdate);

        let starters = [];
        let goal = {}
        let defenders = []
        let mid = []
        let forwards = [];

        let newStart = props.Data;
        newStart.splice(Delete.index,1);

        newStart.forEach((item)=>{
            if(item.Starter == 'Yes')
                starters.push(item);
        })

        starters.forEach((item)=>{
            if(item['Position'] == 'Goalkeeper')
                goal = item;

            if(item['Position'] == 'Midfielder')
                mid.push(item)

            if(item['Position'] == 'Forward')
                forwards.push(item)

            if(item['Position'] == 'Defender')
                defenders.push(item)
        });

        props.StarterFun(starters);
        if(starters.length == 11)
        {
            props.Goal(goal)
            props.Mid(mid)
            props.Def(defenders)
            props.Forward(forwards)
        }
        
        let overviewUpdate = props.Data;
        overviewUpdate.splice(Delete.index,1);
        props.Overview(overviewUpdate);
        setData(overviewUpdate);

        
        setDelete({delete: false,index: undefined});
        setEdit({edit: false,index: undefined});
    }

    function handleRadioChange(e)
    {
        console.log(e.target.value);
        setEditData({...editData,Starter: e.target.value})
    }
    

    function handleSearch(e)
    {
        console.log(e.target.value);
        let players = props.Data;

        let query = e.target.value.toLowerCase();
        let match = [];

        players.forEach((item)=>{
            if(item['Player Name'].toLowerCase().includes(query))
            {
                if(!match.includes(item))
                    match.push(item);
            }

            if(item['Position'].toLowerCase().includes(query))
            {
                if(!match.includes(item))
                    match.push(item);
            }

        });

        console.log(match);
        setMatch(match);
    }

    return(
        <>
            <main className="details-container">
                <div className="details-nav">
                        <div>
                            <h6>Roster Details</h6>
                            <div className="team-name">
                                <h2 contentEditable>My Team</h2>
                                <MdEdit/>
                            </div>
                        </div>
                        <div className="details-action">
                            <div>
                                <input type="text"onChange={handleSearch} id="players-field" placeholder="Find Players"/>
                                <IoSearchSharp className="search-icon"/>
                                <RxCross2 id="btn-cross-8" onClick={(e)=>{
                                                    props.RosterFun(props.Copy);
                                                    document.getElementById('players-field').value = '';
                                                }} 
                                            />
                            </div>
                            <button id="btn-2" onClick={handleImportClick}>Import Team</button>
                        </div>  
                </div>
                <div className="player-details">
                        <TeamTable Roster={props.Roster} Edit={setEdit} Delete={setDelete}/>
                        {
                            props.Import == false ? <div className="message" id="message">
                                                            <h4>You do not have any players on the roster.</h4>
                                                            <button id="btn-1" onClick={handleImportClick}>Import Team</button>
                                                        </div> : <p></p>
                        }
                </div>
            </main>
            <div className="modal-container" id="modal-container">
                <main className="modal">
                    <div className="modal-head">
                        <h3>Importer</h3>
                        <RxCross2 id="btn-3" onClick={handleImportClick}/>
                    </div>
                    <div className="modal-body">
                        <div className="input-select">
                            <h5>Roaster File</h5>
                            <input className="roster-upload-file" type="file" onChange={handleFileInputChange} placeholder="select file" id="roaster-file"/>
                            <p className="ok-msg">File Must be .csv format</p>
                            <div className="err-msg" id="err-msg-container">
                                <p>Error</p>
                                <p className="err-message"></p>
                            </div>
                        </div>
                        <div className="input-details" id="input-details">
                            <h4>File Summary</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Total Players</th>
                                        <th>Goalkeepers</th>
                                        <th>Defenders</th>
                                        <th>Midfielders</th>
                                        <th>Forwards</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{summary.total}</td>
                                        <td>{summary.Goalkeeper}</td>
                                        <td>{summary.Defender}</td>
                                        <td>{summary.Midfielder}</td>
                                        <td>{summary.Forward}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={handleImportClick} className="" id="import-complete">Import</button>
                    </div>
                </main>
            </div>
            {
                    edit.edit ? <div className="edit-modal-container" id="edit-modal-container">
                                    <main className="edit-modal">
                                        <div className="edit-modal-head">
                                            <h4>Edit Player</h4>
                                            <RxCross2 onClick={()=> setEdit({edit: false,index: undefined})} className="cross-btn" />
                                        </div>
                                        <div className="edit-modal-body">
                                            <div className="field-one">
                                                <div className="field-name">
                                                    <p>Player Name</p>
                                                    <input onChange={handleEditChange} id="edit-player-name" type="text" defaultValue={props.Roster[edit.index]['Player Name']} value={editData['Player Name']}/>
                                                </div>
                                                <div className="jersey-field">
                                                    <p>Jersey Number</p>
                                                    <input onChange={handleEditChange} id="edit-player-number" type="text" defaultValue={props.Roster[edit.index]['Jersey Number']} value={editData['Jersey Number']}/>
                                                </div>
                                            </div>
                                            <div className="field-two">
                                                <div>
                                                    <p>Height</p>
                                                    <input onChange={handleEditChange} id="edit-height" type="text" defaultValue={props.Roster[edit.index]['Height']} value={editData.Height}/>
                                                </div>
                                                <div>
                                                    <p>Weight</p>
                                                    <input onChange={handleEditChange} id="edit-weight" type="text" defaultValue={props.Roster[edit.index]['Weight']} value={editData.Weight} />
                                                </div>
                                            </div>
                                            <div className="field-three">
                                                <p>Nationality</p>
                                                <select id="edit-nation" onChange={handleEditChange}>
                                                   {
                                                        props.Country.map((item,index)=>{
                                                            return(
                                                                item === props.Roster[edit.index]['Nationality'] ? <option key={index} value={item} selected>{item}</option> : <option key={index} value={item}>{item}</option>
                                                            )
                                                        })
                                                   }
                                                </select>
                                            </div>
                                            <div className="field-four">
                                                <p>Position</p>
                                                <select id="edit-position" onChange={handleEditChange}>
                                                    {
                                                        props.Position.map((item,index)=>{
                                                            return(
                                                                item === props.Roster[edit.index]['Position'] ? <option key={index} value={item} selected>{item}</option> : <option key={index} value={item}>{item}</option>
                                                            )
                                                        })
                                                   }
                                                </select>
                                            </div>
                                            <div className="field-five">
                                                <p>Starter</p>
                                                <div>
                                                    <input type="radio" id="Yes" onClick={handleRadioChange} value="Yes" name="Starter"/><label htmlFor="Yes">Yes</label>
                                                    <input type="radio" id="No" onClick={handleRadioChange} value="No" name="Starter"/><label htmlFor="No">No</label>
                                                </div>
                                                {/* <div>
                                                    {
                                                        roster[edit.index]['Starter'] == 'Yes'? <input onClick={handleRadioChange} type="radio" value="Yes" name="starter" id="yes" checked/> : <input onClick={handleRadioChange} type="radio"  value="Yes" name="starter" id="yes"/>
                                                    }
                                                    <label htmlFor="yes">Yes</label>
                                                </div>
                                                <div>
                                                    {
                                                        roster[edit.index]['Starter'] == 'No'? <input onClick={handleRadioChange} type="radio" value="No" name="starter" id="No"checked /> : <input onClick={handleRadioChange} type="radio" value="No" name="starter" id="No"/>
                                                    }
                                                    <label htmlFor="No">No</label>
                                                </div> */}
                                            </div>
                                            <div className="edit-btn-container">
                                                <button onClick={handleEditSubmit}>Edit Player</button>
                                            </div>
                                        </div>
                                    </main>
                                </div> : <p></p>
            }

            {
                Delete.delete ? <div className="delete-modal-container" id="delete-modal-container">
                                    <div className="delete-modal">
                                        <div className="delete-modal-header">
                                            <h4>Are you sure ?</h4>
                                            <RxCross2 className="cross-btn" onClick={()=> setDelete({delete: false,index: undefined})}/>
                                        </div>
                                        <div className="delete-modal-body">
                                            <p>This action cannot be undone.</p>
                                            <div>
                                                <button onClick={()=> setDelete({delete: false,index: undefined})}>Cancel</button>
                                                <button onClick={handleDeleteClick}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div> : <p></p>
            }
        </>
    )
};


export default TeamDetails;