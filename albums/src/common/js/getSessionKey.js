// 获取sessionkey
export function getUrlKey(sessionkey) {
	// console.log(location.href)
 return decodeURIComponent((new RegExp('[?|&]'+sessionkey+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null
}

