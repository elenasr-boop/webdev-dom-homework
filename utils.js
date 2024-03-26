export function dateRender(time) { // прописывание времени комментария
    let hours = '';
    let result = '';
    let min = '';
  
    if (time.getHours() < 10) {
      hours = '0' + time.getHours();
    } else {
      hours = time.getHours();
    }
  
    if (time.getMinutes() < 10) {
      min = '0' + time.getMinutes();
    } else {
      min = time.getMinutes();
    }
  
    result = `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear() - 2000} ${hours}:${min}`;
  
    return result;
  }

export  function safeString(str) {
    return str.replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }