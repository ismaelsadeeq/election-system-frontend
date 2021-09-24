import React, { useState, useRef, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import styles from './stylesheets/navStyle.module.css'
import { useHistory } from "react-router-dom";
import {useGlobalContext} from './context/context';
import style from './stylesheets/registerPu.module.css';
import {url} from './url'
import axios from 'axios';
import helpers from './helpers';

function RegisterPu() {
  const data = {
    name:'',
    puName:'',
    pollingUnitName:'',
    pollingUnitNumber:'',
    voters:''
  }
  let history = useHistory();
  const {
    token,
    setToken
  } = useGlobalContext();
  const [showLinks, setShowLinks] = useState(false);
  const [search,setSearch] = useState(true)
  const [info,setInfo] = useState(data)
  const [displayLga,setDisplayLga] = useState(false)
  const [lga,setLga] = useState(undefined);
  const [count,setCount] =  useState(0)
  const [pu,setPu] = useState(false)
  const [searchedPu,setSeachedPu] = useState(undefined)
  const [createPu,setCreatePu] = useState(false)
  const [searchPu,setSearchPu] = useState(false)
  const [puData,setPuData] = useState([])
  const [limit,setLimit] = useState(false)
  const [id,setId] = useState('');
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
  const getLga  = async (e)=>{
    e.preventDefault()
    axios({
      method: 'POST', 
      url: `${url}/utilities/lga/name`,
      headers:{
        Authorization:`Bearer ${token}`
      },
      data:info
    }).then(response =>{
      console.log(response.data);
      if(response.data.message === "lga name is required"){
        info.name = undefined;
        return alert("lga name is required")
      }
      if(response.data.message ==="lga doest not exist"){
        info.name = undefined;
        return alert("local government does not exist")
      }
      if(response.data.message ==="successful"){
        setLga(response.data.data);
        setId(response.data.data.id)
        setSearch(false)
        setDisplayLga(true)
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const getPus = (e)=>{
    e.preventDefault()
    axios({
      method: 'GET',
      url: `${url}/utilities/lga/pu/${lga.id}?currentPage=${count}&pageLimit=10`,
      headers:{
        Authorization:`Bearer ${token}`
      },
    }).then(response =>{
      console.log(response.data);
      if(response.data.message === "No Polling units"){
        setPuData(response.data.data)
        setDisplayLga(false)
        return setPu(true)
      }
      if(response.data.message ==="successful"){
        setPuData(response.data.data)
        setDisplayLga(false)
        return setPu(true);
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const quit = ()=>{
    setPu(false)
    setDisplayLga(false)
    setInfo(data)
    setSearch(true)
  }
  const getBack = (e)=>{
    e.preventDefault()
    setPu(false)
    setCreatePu(undefined)
    setSearchPu(false)
    setSeachedPu(false)
    setDisplayLga(true)
  }
  const searchForPu =  async(e)=>{
    e.preventDefault()
    axios({
      method: 'POST',
      url: `${url}/utilities/lga/pu`,
      headers:{
        Authorization:`Bearer ${token}`
      },
      data:info
    }).then(response =>{
      console.log(response.data);
      if(response.data.message === "pu name is required"){
        info.name = undefined;
        setInfo(info)
        return alert("something went wrong")
      }
      if(response.data.message ==="pu doest not exist"){
        return alert("polling unit does not exist")
      }
      if(response.data.message ==="successful"){
        setSearchPu(false)
        info.puName = ''
        setInfo(info)
        setSeachedPu(response.data.data)
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const getNext = async ()=>{
    if(limit){
      return alert("There are no other polling unit")
    } 
    setCount(count +1)
    console.log(count);
    axios({
      method: 'GET',
      url: `${url}/utilities/lga/pu/${lga.id}?currentPage=${count+1}&pageLimit=10`,
      headers:{
        Authorization:`Bearer ${token}`
      },
    }).then(response =>{
      console.log(response.data);
      if(response.data.message === "No Polling units"){
        setPuData(response.data.data)
        setDisplayLga(false)
        return setPu(true)
      }
      if(response.data.message ==="successful"){
        if(response.data.data.length == 0){
          setLimit(true)
          return alert("There are no other polling unit")
        }
        setPuData(response.data.data)
        setDisplayLga(false)
        return setPu(true);
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const goBack = async (e)=>{
    e.preventDefault()
    setCount(count-1)
    if(count==0){
      return alert("this is the first page")
    }
    axios({
      method: 'GET',
      url: `${url}/utilities/lga/pu/${lga.id}?currentPage=${count-1}&pageLimit=10`,
      headers:{
        Authorization:`Bearer ${token}`
      },
    }).then(response =>{
      console.log(response.data);
      if(response.data.message === "No Polling units"){
        return alert("There are no other polling unit")
      }
      if(response.data.message ==="successful"){
        setPuData(response.data.data)
        setDisplayLga(false)
        return setPu(true);
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const deletePu = async (e,id)=>{
    e.preventDefault()
    axios({
      method: 'DELETE',
      url: `${url}/utilities/delete-pu/${id}`,
      headers:{
        Authorization:`Bearer ${token}`
      },
    }).then(response =>{
      console.log(response.data);
      if(response.data.message === "polling unit successfully deleted"){
        alert("Polling unit deleted")
        return getPus(e)
      }
      if(response.data.message ==="something went wrong"){
        return alert("something went wrong")
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const createAPu = async(e)=>{
    e.preventDefault()
    axios({
      method: 'POST',
      url: `${url}/utilities/create-pu/${id}`,
      headers:{
        Authorization:`Bearer ${token}`
      },
      data:info
    }).then(response =>{
      console.log(response.data);
      if(response.data.message === "data is required"){
        alert("something went wrong")
        return getBack(e)
      }
      if(response.data.message ==="something went wrong"){
        alert("something went wrong")
        return getBack(e)
      }
      if(response.data.message ==="polling unit successfully created"){
        alert("polling unit created")
        return getBack(e)
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
      <div className={style.container}>
        {
          search?
            <div>
              <h3>Adamawa State Government</h3>
              <div className={style.field}>
                <label>Local Government</label>
                <input name="name" type="text" placeholder="Enter local government name" value={info.name} onChange={(e)=>{changeHandler(e)}} required/>
                <button className={style.btnn} onClick={(e)=>{getLga(e)}}>Search</button>
              </div>
            </div>
            :null
        }
        {
          displayLga?<div>
          <button className={style.btn} onClick={(e)=>{quit(e)}}>Back</button>
          <h3>{lga.name}</h3>
          <button className={style.btn} onClick={(e)=>{getPus(e)}}>Get polling units</button>
          <button className={style.btn} onClick={(e)=>{setPu(false)
            setDisplayLga(false)
            setSearchPu(true)}
          }>Search polling Unit</button>
        </div>:null

        }
        {
          pu?<div>
              <button className={style.btn} onClick={(e)=>{getBack(e)}}>Back</button>
              <div>
              <button className={style.btn} onClick={()=>{
                setCreatePu(true)
                setPu(false)
                }}>Create Polling Unit</button>
            </div>
            {
              puData.length === 0?
              <div>
                There is no polling unit currently
              </div>:
              <div> 
              {
                puData.map((payload)=>{
                  return <div>
                    <p>Name: {payload.name} </p><p>Number: {payload.puNumber}</p><p>Voters: {payload.voters}</p>
                    <button className={style.btn} onClick={(e)=>{deletePu(e,payload.id)}}>Delete</button>
                  </div>
                })
              }
              {
                count>0?<button className={style.btn} onClick={(e)=>{goBack(e)}}>Back</button>
                :null
              }
              <button className={style.btn} onClick={getNext}>Next</button>
            </div>
            }
          </div>
          :
          null
        }
        {
          searchPu?<div>
            <button className={style.btn} onClick={(e)=>{getBack(e)}}>Back</button>
            <form>
              <div className={style.field}>
              <label>Polling Unit</label>
              <input className={style.inpu} name="puName" type="text" placeholder="Enter polling unit Name" value={info.puName}  onChange={(e)=>{changeHandler(e)}}  required/><button className={style.btnn} onClick={(e)=>{searchForPu(e)}}>Search</button>
              </div>
            </form>
          </div>
          :null
        }
        {
          searchedPu?
            <div>
              <button className={style.btn} onClick={(e)=>{getBack(e)}}>Back</button>
                    <p>Name: {searchedPu.name} </p><p>Number: {searchedPu.puNumber}</p><p>Voters: {searchedPu.voters}</p>
                    <button className={style.btn} onClick={(e)=>{deletePu(e,searchedPu.id)}}>Delete</button>
                  </div>
          :null
        }
        {
          createPu ?
          <div>
            <button className={style.btn} onClick={(e)=>{getBack(e)}}>Back</button>
            <form onSubmit={(e)=>{createAPu(e)}}>
              <h3>Create A polling Unit</h3>
              <div className={style.field}>
              <label>Polling Unit Name</label>
              <input className={style.inpu} name="pollingUnitName" type="text" placeholder="Enter polling unit name" value={info.pollingUnitName}  onChange={(e)=>{changeHandler(e)}}  required/>
              </div>
              <div className={style.field}>
              <label>Polling Unit Number</label>
              <input className={style.inpu} name="pollingUnitNumber" type="text" placeholder="Enter polling unit number" value={info.pollingUnitNumber}  onChange={(e)=>{changeHandler(e)}}  required/>
              </div>
              <div className={style.field}>
              <label>Voters</label>
              <input className={style.inpu} name="voters" type="text" placeholder="Enter Number of voters" value={info.voters}  onChange={(e)=>{changeHandler(e)}}  required/>
              </div>
              <button className={style.btnn} type="submit">Create</button>
            </form>
          </div>
          :null
        }
      </div>
    </div>
  )
}

export default RegisterPu
