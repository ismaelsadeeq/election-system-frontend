import React,{useState,useRef,useEffect} from 'react'
import { FaBars } from 'react-icons/fa';
import { useHistory } from "react-router-dom";
import styles from './stylesheets/navStyle.module.css'
import style from './stylesheets/userDashboard.module.css'
import {useGlobalContext} from './context/context'
import helpers from './helpers';
import {url} from './url'
import axios from 'axios';

function Dashboard() {

  let history = useHistory();
  const {
    token,
    setToken
  } = useGlobalContext();

  const [showLinks, setShowLinks] = useState(false);
  const [election,setElection] = useState([]);
  const [noElection,setNoElection] = useState(false)
  const [submitResult,setSubmitResult] = useState(false)
  const [parties,setParties] = useState([]);
  const [pu,setPu] = useState(undefined);
  const [info,setInfo] =useState({})
  const [id,setId] = useState([])
  
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
  const getPollingUnit = ()=>{
    axios({
      method: 'GET',
      url: `${url}/utilities/polling-unit`,
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).then(response=>{
     if(response.data.message === "pu doest not exist"){
        alert("something went wrong")
     }
     if(response.data.message === "successful"){
        setPu(response.data.data);
     }
     
   })
   .catch(error=>{
     console.log(error);
   })
 }
  const getElection = ()=>{
    axios({
      method: 'GET',
      url: `${url}/election/user/detail`,
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).then(response=>{
      console.log(response.data);
      if(response.data.message === "No election at the moment"){
        setNoElection(true);
        setElection([])
      }
      if(response.data.message === "result already submitted"){
        setSubmitResult(true);
        setElection(response.data.data);
      }
      if(response.data.message === "completed"){
        setElection(response.data.data)
      }
    })
   .catch(error=>{
     console.log(error);
   })
 }
 const getParties = ()=>{
  axios({
    method: 'GET',
    url: `${url}/election/user/parties`,
    headers:{
      Authorization:`Bearer ${token}`
    }
  }).then(response=>{
    
    if(response.data.message === "completed"){
      console.log(response.data.data);
      setParties(response.data.data)
    }
  })
 .catch(error=>{
   console.log(error);
 })
}
  const sendResult = async(e)=>{
    e.preventDefault()
    let parties = Object.keys(info)
    let totalVotes = 0
    for(let i = 0;i<parties.length;i++){
      totalVotes += parseInt(info[`${parties[i]}`])
    }
    if(totalVotes> parseInt(pu.voters)){
      return alert("number of votes can not be greater than registered voters");
    }
    let payload = {
      totalVotes:pu.voters,
      results:info
    }
    axios({
      method: 'POST',
      url: `${url}/election/submit`,
      headers:{
        Authorization:`Bearer ${token}`
      },
      data:payload
    }).then(response=>{
      console.log(response.data)
      if(response.data.message === "data is required"){
        alert("something went wrong");
      }
      if(response.data.message === "result already submitted"){
        alert("result already submitted");
      }
      if(response.data.message === "votes exceeds registered voters"){
        alert("something went wrong");
      }
      if(response.data.message === "result submitted"){
        alert("result submitted successfully")
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
  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (showLinks) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = '0px';
    }
    setTheToken()
    getPollingUnit()
    getElection()
    getParties()
  }, [showLinks,token])
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
                <a href='/sign-in' onClick={logOut}>logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div  className={style.election}>
        {
          pu?
          <div>
            <h3 className={style.header}>{pu.name} Polling Unit</h3>
            <h3  className={style.header}>{pu.voters} Voters</h3>
            <h3  className={style.header}>Polling Unit Number {pu.puNumber}</h3>
          </div>
          :null
        }
        {
          election?
          <div>
            <h4 className={style.header}>{election.name}</h4>
            {!noElection&&!submitResult?
              <h4>Submit Result</h4>
              :
              null
            }
            <form onSubmit={(e)=>{sendResult(e)}}>
              {
                parties.map((payload)=>{
                  return (
                    <div className={style.field}>
                      <label>{payload.name}</label>
                      <input name={payload.id} type="text" placeholder="Enter Result" value={info.id} onChange={(e)=>{changeHandler(e)}} required></input>
                    </div>
                  )
                })
              }
              {!noElection&&!submitResult?
               <button type="submit" className={style.btn}>Submit</button>
              :
              null}
            </form>
          </div>
          :null
        }
        {
          noElection?
          <div>
              <p>Oops there is no election currently at the moment</p>
           </div>:
          null
        }
        {
          submitResult? <div>
              <p>Result already submitted !!!</p>
           </div>
          :null
        }
      </div>
    </div>
  )
}

export default Dashboard
