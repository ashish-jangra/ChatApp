const formatNum = num => ("0"+num).slice(-2);
export const getHomeTimeString = (date) => {
  if(!date)
    date = new Date();
  else
    date = new Date(date);
  let today = new Date();
  today.setHours(0,0,0);
  if(date < today){
    return formatNum(date.getDate())+"/"+formatNum(date.getMonth()+1)+"/"+date.getFullYear();
  }
  let hours = date.getHours()%12 || 12;
  let ampm = [' am', ' pm'][Math.floor(date.getHours()/12)];
  return formatNum(hours)+":"+formatNum(date.getMinutes())+ampm
}

export const getChatTimeString = (date) => {
  if(!date)
    date = new Date();
  else
    date = new Date(date);
  let hours = date.getHours()%12 || 12;
  let ampm = [' am', ' pm'][Math.floor(date.getHours()/12)];
  return formatNum(hours)+":"+formatNum(date.getMinutes())+ampm
}