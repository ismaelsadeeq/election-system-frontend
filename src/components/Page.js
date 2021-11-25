import React,{useState,useEffect} from 'react'
import logo from '../assets/images/nacoss.jpg'
import logo2 from '../assets/images/poly.jpg'
import styles from './stylesheets/page.module.css'
import axios from "axios";
import {url} from './url';
import {election} from './sideData'
import {useParams} from 'react-router-dom'
function Page() {
  const {id} = useParams()
  const [data,setData] = useState(election);
  const [noElection,setNoElection] = useState(false);
  const [notPublished,setNotPublished] = useState(false);
  const [published,setPublished] = useState(false)

  const getData = ()=>{
     axios({
      method: 'GET',
      url: `${url}/election/detail`
    }).then(response=>{
      console.log(response.data);
      if(response.data.message === "No election at the moment"){
        setNoElection(true);
        setData([])
      }
      if(response.data.message === "election not published"){
        setNotPublished(true);
        setData(response.data.data)
      }
      if(response.data.message === "completed"){
        setPublished(true)
        setData(response.data.data)
      }
      
    })
    .catch(error=>{
      console.log(error);
    })
  }
  useEffect(() => {
    getData()
    console.log(data);
  },[id])
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div >
          <img className={styles.image2} src={logo} alt="inec nigeria logo"></img>
          <img className={styles.image2} src={logo2} alt="inec nigeria logo"></img>
        </div>
        <div>
          <h3 className={styles.heading}>
          Adamawa State Nigeria Election System
          </h3>
        </div>
      </div>
      <div>
        { noElection?<div>
          <h4 className={styles.result}>There is no Election currently</h4>
          </div>:null
        }
        {
          notPublished ? <div>
          <h4 className={styles.result}>{data.name} is currently going on
            Results will be published when its over!!!</h4>
          </div>:null
        }
        {
          published ? <div>
            <h4 className={styles.result}>{data.name}</h4>
            <p className={styles.result}>{data.date}</p>
            {
              data.parties.map((payload)=>{
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
            </div>:null
        }
      </div>
    </div>
  )
}

export default Page
