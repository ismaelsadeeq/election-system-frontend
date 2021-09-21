const getToken = () =>{
  let list = localStorage.getItem('token')
  if(list){
    return JSON.parse(localStorage.getItem('token'))
  } else{
    return null
  }
}
module.exports = {
  getToken
}