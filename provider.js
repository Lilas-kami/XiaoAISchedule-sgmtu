function request(tag,url,data)
{
    let ss = "";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        console.log(xhr.readyState+" "+xhr.status)
        if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
            ss = xhr.responseText
        }

    };
    xhr.open(tag, url,false);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(data)
    return ss;
}
function s1(dom = document) {
    //除函数名外都可编辑
    //以下为示例，您可以完全重写或在此基础上更改                               
    try{
       return dom.getElementsByClassName("content_box")[0].innerHTML 
    }catch(e){
       let html = request("get","/jsxsd/xskb/xskb_list.do",null)
       dom = new DOMParser().parseFromString(html,"text/html")
        return dom.getElementsByClassName("content_box")[0].innerHTML
    }
}

//这里的代码在别的代码改的，地址：https://github.com/MyLikeGirl/AISchedule-QiangZhi

async function scheduleHtmlProvider() {
  let updatelog =
    "⏰更新时间2024.8.14\n\n"+
    "🚦请点进教务管理系统后再导入\n\n"+
    "✨项目开源地址:github.com/Lilas-kami/XiaoAISchedule-sgmtu\n\n"+
    "🎉有bug或问题请在git上面提交issues或发邮箱\n\n"+
    "🌞邮箱:3555554321@qq.com"
    ;
  await loadTool('AIScheduleTools')
  await AIScheduleAlert({
    titleText: '欢迎使用', // 标题内容，字体比较大，不传默认为提示
    contentText: updatelog, // 提示信息，字体稍小，支持使用``达到换行效果，具体使用效果建议真机测试
    confirmText: '好的', // 确认按钮文字，可不传默认为确认
  })

  return s1(document)
}
