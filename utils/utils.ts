export const formatAMPM = (date: Date) => {
  if (date) {
    var hours = date.getHours();
    let minutes: string | number = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  } else {
    console.error("formatAMPM Error:", date);
    return "";
  }
};
