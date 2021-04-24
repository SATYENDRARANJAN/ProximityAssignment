export const getColor=(data)=>{
   
    if (data['value'] >0 && data['value']<=50) return '#407038'
    else if (data['value'] >50 && data['value']<=100) return '#5BEB45'
    else if (data['value'] >100 && data['value']<=200) return '#FCF6A1'
    else if (data['value'] >200 && data['value']<=300) return '#F6943E'
    else if (data['value'] >301 && data['value']<=400) return '#E62020'
    else return '#6C0B1B'
  }
 

export const  getDate=(date_ob)=>{
    // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);
  
  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  
  // current year
  let year = date_ob.getFullYear();
  
  // current hours
  let hours = date_ob.getHours();
  
  // current minutes
  let minutes = date_ob.getMinutes();
  
  // current seconds
  let seconds = date_ob.getSeconds();
  
  // prints date & time in YYYY-MM-DD HH:MM:SS format
  console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
  return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
  }
  