import React, { useState, useRef, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import styles from './stylesheets/navStyle.module.css'
import style from './stylesheets/dashboard.module.css'
import { useHistory } from "react-router-dom";
import {useGlobalContext} from './context/context'
import helpers from './helpers';
import {url} from './url'
import axios from 'axios';

function AdminDashboard() {
  let data ={
    name:'',
    partyName:'',
    contestantName:'',
    titleName:'',
    topName:'',
    bottomTitleName:'',
    bottomName:''
  }
  let history = useHistory();
  const {
    token,
    setToken
  } = useGlobalContext();
  const [showLinks, setShowLinks] = useState(false);
  const [electionStatus,setElectionStatus] = useState(false)
  const [election,setElection] = useState(undefined)
  const [party,setParty] = useState(false);
  const [candidate,setCandidate] = useState(false);
  const [info,setInfo] = useState(data)
  const [partyDisplay,setPartyDisplay] = useState([])
  const [candidateDisplay,setCandidateDisplay] = useState([])
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };
  const setTheToken = () =>{
    setToken(helpers.getToken());
    if(helpers.getToken() == null){
      history.push("/sign-in")
    }
  }
  const logOut = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  const getElection =async ()=>{
    axios({
      method: 'GET',
      url: `${url}/election/admin`,
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).then(response =>{
      if(response.data.message === "user is not an admin"){
        alert("unauthorize")
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      if(response.data.message ==="No election at the moment"){
        setElection(undefined);
      }
      if(response.data.message ==="completed"){
        setElection(response.data.data)
        let electionStatus = parseInt(response.data.data.status)
        setElectionStatus(electionStatus)
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const deleteElection = async (e)=>{
    e.preventDefault()
    axios({
      method: 'DELETE',
      url: `${url}/election`,
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).then(response =>{
      if(response.data.message === "user is not an admin"){
        alert("unauthorize")
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      if(response.data.message ==="election deleted"){
        getElection()
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const upPublishElection = async(e)=>{
    e.preventDefault()
    axios({
      method: 'PUT',
      url: `${url}/election/un-publish`,
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).then(response =>{
      console.log(response.data);
      if(response.data.message === "user is not an admin"){
        alert("unauthorize")
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      if(response.data.message ==="election un-published"){
        getElection()
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const publishElection = async(e)=>{
    e.preventDefault()
    axios({
      method: 'PUT',
      url: `${url}/election/publish`,
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).then(response =>{
      if(response.data.message === "user is not an admin"){
        alert("unauthorize")
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      if(response.data.message ==="election published"){
        getElection()
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  function changeHandler (e){
    const property = e.target.name;
    const value = e.target.value;
    setInfo(ev => ({
      ...ev,
      [property] : value,
    }))  
  }
  const createElection = (e)=>{
    e.preventDefault()
    if(info.name.length<=0){
      return alert("please enter election name")
    }
    axios({
      method: 'POST',
      url: `${url}/election/create`,
      headers:{
        Authorization:`Bearer ${token}`
      },
      data:info
    }).then(response =>{
      if(response.data.message === "user is not an admin"){
        alert("unauthorize")
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      if(response.data.message === "there is an election currently going on"){
        alert("something went wrong")
        history.push("/admin-dashboard")
      }
      if(response.data.message === "data is required"){
        alert("empty data sent")
        history.push("/admin-dashboard")
      }
      if(response.data.message ==="Election successfully created"){
        setParty(true)
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const createParty = (e)=>{
    e.preventDefault()
    setCandidate(true)
  }
  const created = async(e)=>{
    e.preventDefault();
    let fistTitle = info.titleName;
    let secondTitle = info.bottomTitleName;
    let obj = {}
    obj[fistTitle] = info.topName;
    obj[secondTitle] = info.bottomName;
    let secondObj = info
    secondObj.contestantName = obj;
    setInfo(secondObj)
    axios({
      method: 'POST',
      url: `${url}/election/create/party`,
      headers:{
        Authorization:`Bearer ${token}`
      },
      data:info
    }).then(response =>{
      if(response.data.message === "user is not an admin"){
        alert("unauthorize")
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      if(response.data.message === "data is required"){
        alert("something went wrong")
        history.push("/admin-dashboard");
      }
      if(response.data.message === "party exist"){
        return alert("party already existed");
      }
      if(response.data.message === "party successfully created"){
        let parties  = partyDisplay;
        parties.push(info.partyName);
        let candidates = candidateDisplay;
        candidates.push(info.contestantName);
        setPartyDisplay(parties)
        setCandidateDisplay(candidates)
        setCandidate(false)
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (showLinks) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = '0px';
    }
    setTheToken()
    getElection()
  }, [showLinks,token]);
  return (
    <div>
      <nav className={styles.height}>
        <div className={styles.navCenter}>
          <div className={`${styles.navHeader}`}>
            INEC ADAMAWA STATE
            <button className={styles.navToggle} onClick={toggleLinks}>
              <FaBars />
            </button>
          </div>
        <div className={styles.linksContainer} ref={linksContainerRef}>
          <ul className={styles.links} ref={linksRef}>
              <li>
                <a href='/admin-dashboard'>home</a>
              </li>
              <li>
                <a href='/reg-pu'>polling unit</a>
              </li>
              <li>
                <a href='/sign-in' onClick={logOut}>logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      { election?
        <div className={style.election}>
          <div>
            <h4 className={styles.result}>{election.name}</h4>
              <p className={styles.result}>{election.date}</p>
              {
                election.parties.map((payload)=>{
                  let contestant = JSON.parse(payload.contestantName);
                  let objectKeys = Object.keys(contestant);
                  return <div>
                  <h4 className={styles.result}>{payload.name}</h4>
                  {objectKeys.map((payload)=>{
                    return <div>
                      <p className={styles.result}>{payload}: {contestant[`${payload}`]}</p>
                    </div>
                  })
                  }
                  <p className={styles.result}>Votes: {payload.votes}</p>
                  </div>
                })
              }
            </div>
            <div>
              <form onSubmit={(e)=>{
                deleteElection(e)
              }}>
                <button type="submit" className={style.btn}>Delete election</button>
              </form>
              { electionStatus?
                <form onSubmit={(e)=>{
                    upPublishElection(e)
                  }}>
                  <button type="submit" className={style.btn}>Un-publish election</button>
               </form>:
               <form onSubmit={(e)=>{
                  publishElection(e)
                  }}>
                  <button type="submit" className={style.btn}>publish election</button>
               </form>
              }
            </div>
        </div>:
          <div className={style.election}>
            <div>
              {!party?
                <div>
                <h3>Create Election</h3>
                <form>
                <div className={style.field}>
                 <label>Name</label>
                  <input name="name" type="text" placeholder="Election Name" value={info.name} onChange={(e)=>{changeHandler(e)}} required></input>
                  </div>
                  <div>
                  </div>
                  <button type="submit" className={style.btnn} onClick={(e)=>{createElection(e)}}>Create</button>
                </form>
                </div>:
                <div>
                <h3 className={style.field}>{info.name}</h3>
                {
                  
                }
                {
                  candidate?
                  <div>
                  <div className={style.field}>
                    <label>Party Name</label>
                    <input name="partyName" type="text" placeholder="Party" value={info.partyName} onChange={(e)=>{changeHandler(e)}} required></input>
                  </div>
                  <div className={style.field}>
                    <label>Title Name</label>
                    <input name="titleName" type="text" placeholder="Title" value={info.titleName} onChange={(e)=>{changeHandler(e)}} required></input>
                    </div>
                    <div className={style.field}>
                    <label>Contestant Name</label>
                    <input name="topName" type="text" placeholder="Contestant" value={info.topName} onChange={(e)=>{changeHandler(e)}} required></input>
                    </div>
                    <div className={style.field}>
                    <label>Assistant Title</label>
                    <input name="bottomTitleName" type="text" placeholder="Assistant Title" value={info.bottomTitleName} onChange={(e)=>{changeHandler(e)}} ></input>
                    </div>
                    <div className={style.field}>
                    <label className={style.kaki}>Assistant Name</label>
                    <input name="bottomName" type="text" placeholder="Assistant Contestant" value={info.bottomName} onChange={(e)=>{changeHandler(e)}} ></input>
                    </div>
                    <div className={style.field}>
                    <button type="submit" className={style.btnn} onClick={(e)=>{created(e)}}>Create Party</button>
                    </div>
                  </div>
                  :null
                }
                {!candidate?
                <div>
                  <button className={style.btnn} onClick={(e)=>{createParty(e)}}>Add party</button>
                  {
                    candidateDisplay.length > 1?
                    <div>
                  <button className={style.btnn} onClick={(e)=>{createParty(e)}}>Finish</button>
                  </div>
                  :null
                  }
                </div>
                  :null
                }
                </div>
              }
              
            </div>
          </div>
      }
      
    </div>
  )
}

export default AdminDashboard
  