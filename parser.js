function scheduleHtmlParser(html) {

  var $ = cheerio.load(html, { decodeEntities: false });
  var tb = $('#timetable');

  // 检查是否找到 #timetable 元素
  //没有找到就返回默认的数据
  if (tb.length === 0) {
    return [[
      {
        name: "error", // 课程名称
        position: "error", // 上课地点
        teacher: "导入失败", // 教师名称
        weeks: [1, 2, 3, 4], // 周数
        day: 3, // 星期
        sections: [1, 2, 3], // 节次
      }
    ]];
  }

  var rows = tb.find('tr');
  var kbContentHtmlArray = [];

  // 遍历表格中的每一行
  rows.each(function (index, element) {
    let kbContents = $(element).find('.kbcontent');

    // 检查是否找到 .kbcontent 元素
    if (kbContents.length === 0) {
      console.warn(`在第 ${index + 1} 行没有找到 'kbcontent' 类的元素。`);
    }

    kbContents.each(function (i, el) {
      kbContentHtmlArray.push($(el).html());
    });
  });
  //对数据很长的进行遍历

  //得到的伪数组里面单数是空的，去掉空信息
  var courseTrue = []
  for (let i = 0; i < kbContentHtmlArray.length; i++) {
      if (i % 2 == 0) {
          courseTrue.push(kbContentHtmlArray[i]);
      }

  }
  //获取课程名字
  function getCourseName(str) {
      let stop = '<br>';
      let textindex = str.indexOf(stop)
      if (textindex != -1) {
          let temp = str.substring(0, textindex);
          return temp
      }
  }
  //老师名字
  function getTeacherName(str) {
      // 正则表达式，用于匹配 title 属性为 "教师" 的 <font> 标签的内容
      const regex = /<font title="教师">(.*?)<\/font>/;
      const match = str.match(regex);
      if (match) {
          return match[1];
      } else {
          return "";
      }
  }

  //教学楼
  function getPosition(str) {
      // 正则表达式，用于匹配 title 属性为 "教室" 的 <font> 标签的内容
      const regex = /<font title="教室">(.*?)<\/font>/;
      const match = str.match(regex);
      if (match) {
          let name = match[1];
          let positionName = name.substring(0, 5);
          return positionName;
      } else {
          return "";
      }
  }

  //获取周次和节次
  function getWeeksOrsections(str) {
      // 正则表达式，用于匹配 title 属性为 "周次(节次)" 的 <font> 标签的内容
      const regex = /<font title="周次\(节次\)">(.*?)<\/font>/;
      const match = str.match(regex);
      if (match) {
          // match[1] 包含的是 <font> 标签之间的内容
          return match[1];
      } else {
          return "";
      }
  }
  //获取节次
  //1-9(周)[03-04节]
  function getSections(str) {
      const start = str.indexOf("[")
      const stop = str.indexOf("节")
      const temp = str.substring(start + 1, stop);
      switch (temp) {
          case "01-02": return [1, 2]
          case "03-04": return [3, 4]
          case "05-06": return [5, 6]
          case "07-08": return [7, 8]
          case "09-10": return [9, 10]
      }
  }
  //获取周次
  function getWeeks(str) {
      //1,3,5,7,9,11,13,15,17(周)[03-04节]
      //10-18(周)[03-04节]
      //1-13,15-18(周)[01-02节]
      const i = str.indexOf('(周)');
      const temp = str.substring(0, i);
      const check = temp.indexOf('-')
      let arraysWeeks;
      //先判断有没有-号
      if (check == -1) {
          //如果没有,就直接返回
          arraysWeeks = temp.split(',')
          return arraysWeeks;
      } else {
          //如果有的话
          arraysWeeks = changeNum(temp)
          return arraysWeeks;
      }
  }

  //对数据//1-13  15-18改造成数组
  //[03-04节]
  function changeNum(str) {
      const ranges = str.split(",");
      const returnArrays = []
      for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          const parts = range.split("-");
          const start = parseInt(parts[0], 10);
          const end = parseInt(parts[1], 10);
          for (let j = start; j <= end; j++) {
              returnArrays.push(j);
          }
      }
      return returnArrays;
  }

  //获取星期
  function getDays(str) {
      const i = str + 1;
      if (i > 7) {
          return i % 7;
      } else {
          return i;
      }
  }

  //记录其他课程的下标
  var daysIndex = [];
  for (let i = 0; i < courseTrue.length; i++) {
      const six = countBrOccurrences(courseTrue[i]);
      console.log(six);
      for (let j = 0; j < six; j++) {
          daysIndex.push(getDays(i))
      }
  }
  console.log(daysIndex);

   //判断"-<br>"并且记录下标
   function countBrOccurrences(str) {
          const searchStr = "-<br>";
          let count = 0;
          let index = 0;

          while ((index = str.indexOf(searchStr, index)) !== -1) {
              count++;
              index += searchStr.length;
          }
          return count;
      }

  //将有其他课程的课记录下来
  var surplus = [];
  for (let i = 0; i < kbContentHtmlArray.length; i++) {
      const str1 = kbContentHtmlArray[i];
      ss(str1);
  }
  function ss(str) {
      if (str.indexOf("-<br>") != -1) {
          spCourse(str)
      }
  }


  function spCourse(str) {
      const seach = '-<br>';
      const seachLenth = seach.length;
      const idnex = str.indexOf(seach);

      if (idnex != -1) {
          const stringL = str.substring(idnex + seachLenth);
          surplus.push(stringL)
          spCourse(stringL)
      } else {
          return;
      }
  }
  for (let i = 0; i < surplus.length; i++) {
      console.log(surplus[i]);
  }


  //终点
  //返回的字符串数组
  var result = [];

  for (let i = 0; i < surplus.length; i++) {
      const weeksAndSection = getWeeksOrsections(surplus[i])
      let surplusCourse = {
          name: getCourseName(surplus[i]),//课程名字
              position: getPosition(surplus[i]),
              teacher: getTeacherName(surplus[i]),
              weeks: getWeeks(weeksAndSection),
              day: daysIndex[i],
              sections: getSections(weeksAndSection)
      }
      result.push(surplusCourse);
  }

  for (let index = 0; index < courseTrue.length; index++) {
      if (getCourseName(courseTrue[index]) !== undefined) {

          const weeksAndSection = getWeeksOrsections(courseTrue[index])
          let course = {
              name: getCourseName(courseTrue[index]),//课程名字
              position: getPosition(courseTrue[index]),
              teacher: getTeacherName(courseTrue[index]),
              weeks: getWeeks(weeksAndSection),
              day: getDays(index),
              sections: getSections(weeksAndSection)
              /**
               * name: "数学", // 课程名称
                 position: "教学楼1", // 上课地点
                 teacher: "张三", // 教师名称
                 weeks: [1, 2, 3, 4], // 周数
                 day: 3, // 星期
                 sections: [1, 2, 3], // 节次
               */
          }
          result.push(course)
      }

  }
  //console.log(result);
   return result
}
