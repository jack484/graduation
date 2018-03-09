// 格式化时间
export function formatDate(date,fmt) {
	var o = {
	  	"M+" : date.getMonth()+1,                 //月份
	  	"d+" : date.getDate(),                    //日
	  	"h+" : date.getHours(),                   //小时
	  	"m+" : date.getMinutes(),                 //分
	  	"s+" : date.getSeconds(),                 //秒
	  	"q+" : Math.floor((date.getMonth()+3)/3), //季度
	  	"S"  : date.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt))
	  fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
	  if(new RegExp("("+ k +")").test(fmt))
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	return fmt;
}

export function formatDateTime (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
	  if (new RegExp(`(${k})`).test(fmt)) {
	      let str = o[k] + ''
	      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
	    }
  }
  return fmt
}
function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

// 时间格式化
export  function dateFilters(_value) {
  let d = new Date(_value)
  let year = d.getFullYear()
  let month = d.getMonth() + 1;
  let day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate()
  let hour = d.getHours()
  let minutes = d.getMinutes()
  let seconds = d.getSeconds()
  // return  year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
  return  year+ '-' + month + '-' + day
}

// 获取sessionkey
export function getUrlKey(sessionkey) {
  // console.log(location.href)
  return decodeURIComponent((new RegExp('[?|&]'+sessionkey+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null
}
