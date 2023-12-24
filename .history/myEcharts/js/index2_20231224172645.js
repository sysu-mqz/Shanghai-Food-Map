// import * as XLSX from "js/xlsx.full.min.js";

// 尝试利用矩形树图展示不同美食的基本情况
(function () {
  // 1实例化对象
  var myChart = echarts.init(document.querySelector(".bar .chart"), null, {
    width: 'auto',
    height: '400px'
  });

  // 2. 指定配置项和数据
  // 随机获取一个指定长度的数组
  function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0),
      i = arr.length,
      temp, index;
    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  }

  // 统计各个类别的名称和数量
  function countCategories(data) {
    let categories = new Set();
    let categoryCounts = {};

    if (Array.isArray(data)) {
      data.forEach((item) => {
        const category = item.category;
        categories.add(category);
        if (category in categoryCounts) {
          categoryCounts[category]++;
        } else {
          categoryCounts[category] = 1;
        }
      });
    } else {
      console.error('Invalid data format');
    }

    console.log('Total categories:', categories.size);

    let categoryData = []; // 创建一个空数组
    for (const category in categoryCounts) {
      let obj = {};
      obj.name = category;
      obj.value = categoryCounts[category];
      categoryData.push(obj);
      // console.log(category + ': ' + categoryCounts[category]);
    }
    return categoryData;
  };

  // 统计各个类别的类别、数量和占比（考虑与上一个函数合并）
  function getTooltipFormatter(info) {
    // console.log('运行了getTooltipFormatter函数');
    let sum = info.length;
    return function (info) {
      // console.log('info:', info.name);
      let category = info.name;
      let amount = info.value;
      let ratio = Math.round(info.value / sum * 100, 2);
      return [
        '名称: &nbsp;' + category + '<br>' +
        '数量: &nbsp;' + amount + '<br>' +
        '比例: &nbsp;&nbsp;' + ratio + '%' + '<br>'
      ].join('');
    };
  }

  var data_test = getRandomSubarray(json, 1000)
  // var data_test = json
  var selectedData = data_test.map(function (item) {
    return {
      category: item.类别,
    };
  });

  var option = {
    tooltip: {
      formatter: getTooltipFormatter(selectedData)
    },
    series: [{
      type: 'treemap',
      // tooltip: {
      //   formatter: getTooltipFormatter(selectedData),
      // },
      label: {
        position: 'insideTopLeft',
        fontSize: 16,
      },
      data: countCategories(selectedData),
    }]
  };

  // 3. 把配置项给实例对象
  myChart.setOption(option);

  // 4. 让图表跟随屏幕自动的去适应
  window.addEventListener("resize", function () {
    myChart.resize();
  });
})();

// 尝试利用平行坐标系展示美食的点评数、口味、环境、服务和人均消费
(function () {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".bar2 .chart"), null, {
    width: 'auto',
    height: '430px'
  });
  // 2. 指定配置和数据
  // 随机获取一个指定长度的数组
  function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0),
      i = arr.length,
      temp, index;
    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  }

  // 生成不同美食类别的parallel数据结构，希望实现类似的效果：https://echarts.apache.org/examples/zh/editor.html?c=parallel-aqi
  function generateData(data) {
    let finalData = [];
    let categories = new Set();
    let selectedCategories = [];
    let categoryCounts = {};

    if (Array.isArray(data)) {
      data.forEach((item) => {
        const category = item.category;
        categories.add(category);
        if (category in categoryCounts) {
          categoryCounts[category]++;
        } else {
          categoryCounts[category] = 1;
        }
      });
    } else {
      console.error('Invalid data format');
    }

    categories.forEach((item) => {
      if (categoryCounts[item] / data.length >= 0.1) {
        let newData = data.filter(item2 => item2.category === item);
        let obj = {};
        obj.name = item;
        obj.type = 'parallel';
        obj.lineStyle = {
          width: 2,
          opacity: 0.5
        };
        obj.data = generateParallelData(newData);
        finalData.push(obj);
        selectedCategories.push(item);
      }
    })

    return {
      finalData,
      selectedCategories
    };
  }

  // 生成符合parallel的数据结构
  function generateParallelData(data) {
    let parallelData = [];

    if (Array.isArray(data)) {
      data.forEach((item) => {
        // 这里限制了评论数小于1000
        if (item.comments <= 1000) {
          let data = [item.comments, item.flavour, item.environment, item.service, item.averageExpanse];
          parallelData.push(data);
        }
      });
    } else {
      console.error('Invalid data format');
    }

    return parallelData;
  };

  var data_test = getRandomSubarray(json, 100)
  // var data_test = json
  var selectedData = data_test.map(function (item) {
    return {
      category: item.类别,
      comments: item.点评数,
      flavour: item.口味,
      environment: item.环境,
      service: item.服务,
      averageExpanse: item.人均消费,
    };
  });
  // 生成占比不小于10%的美食类别对应的数据集
  var result = generateData(selectedData);

  var option = {
    parallelAxis: [{
        dim: 0,
        name: '点评数',
        max: 1000
      },
      {
        dim: 1,
        name: '口味',
        max: 10
      },
      {
        dim: 2,
        name: '环境',
        max: 10
      },
      {
        dim: 3,
        name: '服务',
        max: 10
      },
      {
        dim: 4,
        name: '人均消费'
      },
    ],
    legend: {
      bottom: 30,
      data: result.selectedCategories,
      itemGap: 20,
      // textStyle: {
      //   color: '#fff',
      //   fontSize: 14
      // }
    },
    // series: {
    //   type: 'parallel',
    //   lineStyle: {
    //     width: 2,
    //     opacity: 0.5
    //   },
    //   data: generateParallelData(selectedData),
    // },
    series: result.finalData,
  };

  // 3. 把配置给实例对象
  myChart.setOption(option);

  // 4. 让图表跟随屏幕自动的去适应
  window.addEventListener("resize", function () {
    myChart.resize();
  });
})();

// 如果改成四个图，需要隐藏以下代码，否则之后的图像无法显示
// // 折线图1模块制作
// (function() {
//   var yearData = [
//     {
//       year: "2020", // 年份
//       data: [
//         // 两个数组是因为有两条线
//         [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
//         [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79]
//       ]
//     },
//     {
//       year: "2021", // 年份
//       data: [
//         // 两个数组是因为有两条线
//         [123, 175, 112, 197, 121, 67, 98, 21, 43, 64, 76, 38],
//         [143, 131, 165, 123, 178, 21, 82, 64, 43, 60, 19, 34]
//       ]
//     }
//   ];
//   // 1. 实例化对象
//   var myChart = echarts.init(document.querySelector(".line .chart"));
//   // 2.指定配置
//   var option = {
//     // 通过这个color修改两条线的颜色
//     color: ["#00f2f1", "#ed3f35"],
//     tooltip: {
//       trigger: "axis"
//     },
//     legend: {
//       // 如果series 对象有name 值，则 legend可以不用写data
//       // 修改图例组件 文字颜色
//       textStyle: {
//         color: "#4c9bfd"
//       },
//       // 这个10% 必须加引号
//       right: "10%"
//     },
//     grid: {
//       top: "20%",
//       left: "3%",
//       right: "4%",
//       bottom: "3%",
//       show: true, // 显示边框
//       borderColor: "#012f4a", // 边框颜色
//       containLabel: true // 包含刻度文字在内
//     },

//     xAxis: {
//       type: "category",
//       boundaryGap: false,
//       data: [
//         "1月",
//         "2月",
//         "3月",
//         "4月",
//         "5月",
//         "6月",
//         "7月",
//         "8月",
//         "9月",
//         "10月",
//         "11月",
//         "12月"
//       ],
//       axisTick: {
//         show: false // 去除刻度线
//       },
//       axisLabel: {
//         color: "#4c9bfd" // 文本颜色
//       },
//       axisLine: {
//         show: false // 去除轴线
//       }
//     },
//     yAxis: {
//       type: "value",
//       axisTick: {
//         show: false // 去除刻度线
//       },
//       axisLabel: {
//         color: "#4c9bfd" // 文本颜色
//       },
//       axisLine: {
//         show: false // 去除轴线
//       },
//       splitLine: {
//         lineStyle: {
//           color: "#012f4a" // 分割线颜色
//         }
//       }
//     },
//     series: [
//       {
//         name: "新增粉丝",
//         type: "line",
//         // true 可以让我们的折线显示带有弧度
//         smooth: true,
//         data: yearData[0].data[0]
//       },
//       {
//         name: "新增游客",
//         type: "line",
//         smooth: true,
//         data: yearData[0].data[1]
//       }
//     ]
//   };

//   // 3. 把配置给实例对象
//   myChart.setOption(option);
//   // 4. 让图表跟随屏幕自动的去适应
//   window.addEventListener("resize", function() {
//     myChart.resize();
//   });

//   // 5.点击切换效果
//   $(".line h2").on("click", "a", function() {
//     // alert(1);
//     // console.log($(this).index());
//     // 点击 a 之后 根据当前a的索引号 找到对应的 yearData的相关对象
//     // console.log(yearData[$(this).index()]);
//     var obj = yearData[$(this).index()];
//     option.series[0].data = obj.data[0];
//     option.series[1].data = obj.data[1];
//     // 需要重新渲染
//     myChart.setOption(option);
//   });
// })();

// // 折线图2 模块制作
// (function() {
//   var myChart = echarts.init(document.querySelector(".line2 .chart"));
//   var option = {
//     tooltip: {
//       trigger: "axis"
//     },
//     legend: {
//       top: "0%",
//       data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"],
//       textStyle: {
//         color: "rgba(255,255,255,.5)",
//         fontSize: "12"
//       }
//     },

//     grid: {
//       left: "10",
//       top: "30",
//       right: "10",
//       bottom: "10",
//       containLabel: true
//     },
//     xAxis: [
//       {
//         type: "category",
//         boundaryGap: false,
//         // x轴更换数据
//         data: [
//           "01",
//           "02",
//           "03",
//           "04",
//           "05",
//           "06",
//           "07",
//           "08",
//           "09",
//           "10",
//           "11",
//           "12",
//           "13",
//           "14",
//           "15",
//           "16",
//           "17",
//           "18",
//           "19",
//           "20",
//           "21",
//           "22",
//           "23",
//           "24",
//           "25",
//           "26",
//           "26",
//           "28",
//           "29",
//           "30"
//         ],
//         // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
//         axisLabel: {
//           textStyle: {
//             color: "rgba(255,255,255,.6)",
//             fontSize: 12
//           }
//         },
//         // x轴线的颜色为   rgba(255,255,255,.2)
//         axisLine: {
//           lineStyle: {
//             color: "rgba(255,255,255,.2)"
//           }
//         }
//       }
//     ],
//     yAxis: [
//       {
//         type: "value",
//         axisTick: { show: false },
//         axisLine: {
//           lineStyle: {
//             color: "rgba(255,255,255,.1)"
//           }
//         },
//         axisLabel: {
//           textStyle: {
//             color: "rgba(255,255,255,.6)",
//             fontSize: 12
//           }
//         },
//         // 修改分割线的颜色
//         splitLine: {
//           lineStyle: {
//             color: "rgba(255,255,255,.1)"
//           }
//         }
//       }
//     ],
//     series: [
//       {
//         name: "邮件营销",
//         type: "line",
//         smooth: true,
//         // 单独修改当前线条的样式
//         lineStyle: {
//           color: "#0184d5",
//           width: "2"
//         },
//         // 填充颜色设置
//         areaStyle: {
//           color: new echarts.graphic.LinearGradient(
//             0,
//             0,
//             0,
//             1,
//             [
//               {
//                 offset: 0,
//                 color: "rgba(1, 132, 213, 0.4)" // 渐变色的起始颜色
//               },
//               {
//                 offset: 0.8,
//                 color: "rgba(1, 132, 213, 0.1)" // 渐变线的结束颜色
//               }
//             ],
//             false
//           ),
//           shadowColor: "rgba(0, 0, 0, 0.1)"
//         },
//         // 设置拐点
//         symbol: "circle",
//         // 拐点大小
//         symbolSize: 8,
//         // 开始不显示拐点， 鼠标经过显示
//         showSymbol: false,
//         // 设置拐点颜色以及边框
//         itemStyle: {
//           color: "#0184d5",
//           borderColor: "rgba(221, 220, 107, .1)",
//           borderWidth: 12
//         },
//         data: [
//           30,
//           40,
//           30,
//           40,
//           30,
//           40,
//           30,
//           60,
//           20,
//           40,
//           30,
//           40,
//           30,
//           40,
//           30,
//           40,
//           30,
//           60,
//           20,
//           40,
//           30,
//           40,
//           30,
//           40,
//           30,
//           40,
//           20,
//           60,
//           50,
//           40
//         ]
//       },
//       {
//         name: "联盟广告",
//         type: "line",
//         smooth: true,
//         lineStyle: {
//           normal: {
//             color: "#00d887",
//             width: 2
//           }
//         },
//         areaStyle: {
//           normal: {
//             color: new echarts.graphic.LinearGradient(
//               0,
//               0,
//               0,
//               1,
//               [
//                 {
//                   offset: 0,
//                   color: "rgba(0, 216, 135, 0.4)"
//                 },
//                 {
//                   offset: 0.8,
//                   color: "rgba(0, 216, 135, 0.1)"
//                 }
//               ],
//               false
//             ),
//             shadowColor: "rgba(0, 0, 0, 0.1)"
//           }
//         },
//         // 设置拐点 小圆点
//         symbol: "circle",
//         // 拐点大小
//         symbolSize: 5,
//         // 设置拐点颜色以及边框
//         itemStyle: {
//           color: "#00d887",
//           borderColor: "rgba(221, 220, 107, .1)",
//           borderWidth: 12
//         },
//         // 开始不显示拐点， 鼠标经过显示
//         showSymbol: false,
//         data: [
//           130,
//           10,
//           20,
//           40,
//           30,
//           40,
//           80,
//           60,
//           20,
//           40,
//           90,
//           40,
//           20,
//           140,
//           30,
//           40,
//           130,
//           20,
//           20,
//           40,
//           80,
//           70,
//           30,
//           40,
//           30,
//           120,
//           20,
//           99,
//           50,
//           20
//         ]
//       }
//     ]
//   };
//   myChart.setOption(option);
//   // 4. 让图表跟随屏幕自动的去适应
//   window.addEventListener("resize", function() {
//     myChart.resize();
//   });
// })();

// 实现数量前4的美食类别的饼图，展示不同的行政区占比
(function () {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".pie .chart"), null, {
    width: 'auto',
    height: '430px'
  });

  // 2.指定配置
  // 随机获取一个指定长度的数组
  function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0),
      i = arr.length,
      temp, index;
    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  }

  // 统计类别数量占比前4的美食类别
  function countCategories(data) {
    let categories = new Set();
    let categoryCounts = {};

    if (Array.isArray(data)) {
      data.forEach((item) => {
        const category = item.category;
        categories.add(category);
        if (category in categoryCounts) {
          categoryCounts[category]++;
        } else {
          categoryCounts[category] = 1;
        }
      });
    } else {
      console.error('Invalid data format');
    }

    // 对categoryCounts按照value值从大到小排序
    // 使用Object.entries()获取键值对数组  
    let entries = Object.entries(categoryCounts);

    // 使用sort()函数对数组进行排序
    entries.sort((a, b) => b[1] - a[1]);

    // 转换回对象  
    let sortedCategoryCounts = {};
    for (let [key, value] of entries) {
      sortedCategoryCounts[key] = value;
    }

    // 取占比前4的美食类别进行展示
    let seletedCategories = []; // 创建一个空数组
    let entries2 = Object.entries(sortedCategoryCounts);
    for (let i = 0; i < 4; i++) {
      let obj = entries2[i][0];
      seletedCategories.push(obj);
      // console.log(category + ': ' + categoryCounts[category]);
    }

    console.log(seletedCategories);

    return seletedCategories;
  };

  function countRegions(data) {
    let regions = data.reduce((accumulator, currentItem) => {
      if (!accumulator[currentItem.region]) {
        accumulator[currentItem.region] = 0;
      }
      accumulator[currentItem.region]++;
      return accumulator;
    }, {});

    let result = Object.keys(regions).map(region => ({
      name: region,
      value: regions[region]
    }));
    return result
  };

  var data_test = getRandomSubarray(json, 1000)
  // var data_test = json
  var selectedData = data_test.map(function (item) {
    return {
      category: item.类别,
      region: item.行政区,
    };
  });
  selectedCategories = countCategories(selectedData);

  // 筛选出符合selectedCategories的数据
  var selectedCategoryData = {};
  selectedCategories.forEach(function (category) {
    selectedCategoryData[category] = selectedData.filter(function (item) {
      return item.category === category;
    });
  });

  let entries = Object.entries(selectedCategoryData);
  let data1 = countRegions(entries[0][1]);
  let data2 = countRegions(entries[1][1]);
  let data3 = countRegions(entries[2][1]);
  let data4 = countRegions(entries[3][1]);

  var label = {
    show: false,
    position: 'center',
    alignTo: 'none',
    bleedMargin: 5
  };

  var emphasis = {
    label: {
      show: true,
      fontSize: 14,
      fontWeight: 'bold'
    }
  };

  var option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    title: [{
        subtext: selectedCategories[0],
        left: '25%',
        top: '52%',
        textAlign: 'center'
      },
      {
        subtext: selectedCategories[1],
        left: '75%',
        top: '52%',
        textAlign: 'center'
      },
      {
        subtext: selectedCategories[2],
        left: '25%',
        bottom: '6%',
        textAlign: 'center'
      },
      {
        subtext: selectedCategories[3],
        left: '75%',
        bottom: '6%',
        textAlign: 'center'
      }
    ],
    series: [{
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '50%'],
        data: data1,
        label: label,
        emphasis: emphasis,
        left: 0,
        right: '50%',
        top: '15%', // 与top的距离
        bottom: '35%' // 与bottom的距离
      },
      {
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '50%'],
        data: data2,
        label: label,
        emphasis: emphasis,
        left: '50%',
        right: 0,
        top: '15%',
        bottom: '35%'
      },
      {
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '50%'],
        data: data3,
        label: label,
        emphasis: emphasis,
        left: 0,
        right: '50%',
        top: '50%',
        bottom: 0
      },
      {
        type: 'pie',
        radius: ['30%', '50%'],
        center: ['50%', '50%'],
        data: data4,
        label: label,
        emphasis: emphasis,
        left: '50%',
        right: 0,
        top: '50%',
        bottom: 0
      },
    ]
  };

  // 3. 把配置给实例对象
  myChart.setOption(option);
  // 4. 让图表跟随屏幕自动的去适应
  window.addEventListener("resize", function () {
    myChart.resize();
  });
})();

// 饼形图2 地区分布模块
(function () {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".pie2 .chart"), null, {
    width: 'auto',
    height: '420px'
  }, 'dark');

  // 2. 指定配置
  // 随机获取一个指定长度的数组
  function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0),
      i = arr.length,
      temp, index;
    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  };

  // 实现了平面散点图
  // function generateData(data, type1, type2) {
  //   var data_set = [];

  //   let selectedType1 = 0;
  //   if (type1 === 'comments') {
  //     selectedType1 = 0;
  //   } else if (type1 === 'flavour') {
  //     selectedType1 = 1;
  //   } else if (type1 === 'environment') {
  //     selectedType1 = 2;
  //   } else if (type1 === 'service') {
  //     selectedType1 = 3;
  //   } else if (type1 === 'averageExpanse') {
  //     selectedType1 = 4;
  //   }

  //   let selectedType2 = 0;
  //   if (type2 === 'comments') {
  //     selectedType2 = 0;
  //   } else if (type2 === 'flavour') {
  //     selectedType2 = 1;
  //   } else if (type2 === 'environment') {
  //     selectedType2 = 2;
  //   } else if (type2 === 'service') {
  //     selectedType2 = 3;
  //   } else if (type2 === 'averageExpanse') {
  //     selectedType2 = 4;
  //   }

  //   if (Array.isArray(data)) {  
  //     data.forEach((item) => {
  //       let entries = Object.entries(item);
  //       const item1 = entries[selectedType1][1];  
  //       const item2 = entries[selectedType2][1];
  //       data_set.push([parseFloat(item1), parseFloat(item2)])
  //     });
  //   } else {  
  //     console.error('Invalid data format');  
  //   }

  //   return data_set
  // };

  // var data_test = getRandomSubarray(json, 1000)
  // // var data_test = json
  // var selectedData = data_test.map(function(item) {
  //     return {
  //       comments: item.点评数,
  //       flavour: item.口味,
  //       environment: item.环境,
  //       service: item.服务,
  //       averageExpanse: item.人均消费,
  //     };
  // });
  // var data = generateData(selectedData, 'comments', 'flavour');

  // var option = {
  //   visualMap: {
  //     min: 0,
  //     max: 10,
  //     dimension: 1,
  //     orient: 'vertical',
  //     right: 10,
  //     top: 'center',
  //     text: ['HIGH', 'LOW'],
  //     calculable: true,
  //     inRange: {
  //       color: ['red', 'blue']
  //     }
  //   },
  //   tooltip: {
  //     trigger: 'item',
  //     axisPointer: {
  //       type: 'cross'
  //     }
  //   },
  //   xAxis: [
  //     {
  //       type: 'value',
  //       name: '点评数',
  //       nameGap: 25,
  //       nameLocation: 'middle',
  //       nameTextStyle: {
  //         fontSize: 16
  //       },
  //     }
  //   ],
  //   yAxis: [
  //     {
  //       type: 'value',
  //       name: '口味',
  //       nameGap: 25,
  //       nameLocation: 'middle',
  //       nameTextStyle: {
  //         fontSize: 16
  //       },
  //     }
  //   ],
  //   series: [
  //     {
  //       name: 'price-area',
  //       type: 'scatter',
  //       symbolSize: 5,
  //       data: data
  //     }
  //   ]
  // };

  // // 尝试绘制三维散点图（五个变量可同时展示）
  // var app = {};
  // var data_test = getRandomSubarray(json, 1000)
  // var selectedData = data_test.map(function(item) {
  //   return [
  //     parseInt(item.点评数), parseFloat(item.口味), parseFloat(item.环境), parseFloat(item.服务), parseFloat(item.人均消费)
  //   ];
  // });
  // var data = selectedData;

  // var schema = [
  //   { name: '点评数', index: 0 },
  //   { name: '口味', index: 1 },
  //   { name: '环境', index: 2 },
  //   { name: '服务', index: 3 },
  //   { name: '人均消费', index: 4 }
  // ];

  // var fieldIndices = schema.reduce(function (obj, item) {
  //   obj[item.name] = item.index;
  //   return obj;
  // }, {});

  // var fieldNames = schema.map(function (item) {
  //   return item.name;
  // });
  // fieldNames = fieldNames.slice(2, fieldNames.length - 2);

  // // 获取颜色和符号大小的极大值
  // function getMaxOnExtent(data) {
  //   var colorMax = -Infinity;
  //   var symbolSizeMax = -Infinity;
  //   for (var i = 0; i < data.length; i++) {
  //     var item = data[i];
  //     var colorVal = item[fieldIndices[config.color]];
  //     var symbolSizeVal = item[fieldIndices[config.symbolSize]];
  //     colorMax = Math.max(colorVal, colorMax);
  //     symbolSizeMax = Math.max(symbolSizeVal, symbolSizeMax);
  //   }
  //   return {
  //     color: colorMax,
  //     symbolSize: symbolSizeMax
  //   };
  // }

  // var config = (app.config = {
  //   xAxis3D: '服务',
  //   yAxis3D: '口味',
  //   zAxis3D: '环境',
  //   color: '点评数',
  //   symbolSize: '人均消费',
  //   onChange: function () {
  //     var max = getMaxOnExtent(data);
  //     if (data) {
  //       myChart.setOption({
  //         visualMap: [
  //           {
  //             max: max.color / 2
  //           },
  //           {
  //             max: max.symbolSize / 2
  //           }
  //         ],
  //         xAxis3D: {
  //           name: config.xAxis3D
  //         },
  //         yAxis3D: {
  //           name: config.yAxis3D
  //         },
  //         zAxis3D: {
  //           name: config.zAxis3D
  //         },
  //         series: {
  //           dimensions: [
  //             config.xAxis3D,
  //             config.yAxis3D,
  //             config.yAxis3D,
  //             config.color,
  //             config.symbolSize,
  //           ],
  //           data: data.map(function (item, idx) {
  //             return [
  //               item[fieldIndices[config.xAxis3D]],
  //               item[fieldIndices[config.yAxis3D]],
  //               item[fieldIndices[config.zAxis3D]],
  //               item[fieldIndices[config.color]],
  //               item[fieldIndices[config.symbolSize]],
  //               idx
  //             ];
  //           })
  //         }
  //       });
  //     }
  //   }
  // });

  // app.configParameters = {};
  // ['xAxis3D', 'yAxis3D', 'zAxis3D', 'color', 'symbolSize'].forEach(function (
  //   fieldName
  // ) {
  //   app.configParameters[fieldName] = {
  //     options: fieldNames
  //   };
  // });

  // var max = getMaxOnExtent(data);

  // var option = ({
  //   tooltip: {},
  //   visualMap: [
  //     {
  //       top: 10,
  //       calculable: true,
  //       dimension: 3,
  //       max: max.color / 2,
  //       inRange: {
  //         color: [
  //           '#1710c0',
  //           '#0b9df0',
  //           '#00fea8',
  //           '#00ff0d',
  //           '#f5f811',
  //           '#f09a09',
  //           '#fe0300'
  //         ]
  //       },
  //       textStyle: {
  //         color: '#fff'
  //       }
  //     },
  //     {
  //       bottom: 10,
  //       calculable: true,
  //       dimension: 4,
  //       max: max.symbolSize / 2,
  //       inRange: {
  //         symbolSize: [10, 40]
  //       },
  //       textStyle: {
  //         color: '#fff'
  //       }
  //     }
  //   ],
  //   xAxis3D: {
  //     name: config.xAxis3D,
  //     type: 'value'
  //   },
  //   yAxis3D: {
  //     name: config.yAxis3D,
  //     type: 'value'
  //   },
  //   zAxis3D: {
  //     name: config.zAxis3D,
  //     type: 'value'
  //   },
  //   grid3D: {
  //     axisLine: {
  //       lineStyle: {
  //         color: '#fff'
  //       }
  //     },
  //     axisPointer: {
  //       lineStyle: {
  //         color: '#ffbd67'
  //       }
  //     },
  //     viewControl: {
  //       // autoRotate: true
  //       // projection: 'orthographic'
  //     }
  //   },
  //   series: [
  //     {
  //       type: 'scatter3D',
  //       dimensions: [
  //         config.xAxis3D,
  //         config.yAxis3D,
  //         config.yAxis3D,
  //         config.color,
  //         config.symbolSize
  //       ],
  //       data: data.map(function (item, idx) {
  //         return [
  //           item[fieldIndices[config.xAxis3D]],
  //           item[fieldIndices[config.yAxis3D]],
  //           item[fieldIndices[config.zAxis3D]],
  //           item[fieldIndices[config.color]],
  //           item[fieldIndices[config.symbolSize]],
  //           idx
  //         ];
  //       }),
  //       symbolSize: 12,
  //       // symbol: 'triangle',
  //       itemStyle: {
  //         borderWidth: 1,
  //         borderColor: 'rgba(255,255,255,0.8)'
  //       },
  //       emphasis: {
  //         itemStyle: {
  //           color: '#fff'
  //         }
  //       }
  //     }
  //   ]
  // });


  // 尝试绘制三维散点图（四个变量可同时展示）
  var app = {};
  var data_test = getRandomSubarray(json, 1000)
  var selectedData = data_test.map(function (item) {
    return [
      parseInt(item.点评数), parseFloat(item.口味), parseFloat(item.环境), parseFloat(item.服务), parseFloat(item.人均消费)
    ];
  });
  var data = selectedData;

  var schema = [{
      name: '点评数',
      index: 0
    },
    {
      name: '口味',
      index: 1
    },
    {
      name: '环境',
      index: 2
    },
    {
      name: '服务',
      index: 3
    },
    {
      name: '人均消费',
      index: 4
    }
  ];

  var fieldIndices = schema.reduce(function (obj, item) {
    obj[item.name] = item.index;
    return obj;
  }, {});

  var fieldNames = schema.map(function (item) {
    return item.name;
  });
  fieldNames = fieldNames.slice(2, fieldNames.length - 2);

  // 获取颜色的极大值
  function getMaxOnExtent(data) {
    var colorMax = -Infinity;
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var colorVal = item[fieldIndices[config.color]];
      colorMax = Math.max(colorVal, colorMax);
    }
    return {
      color: colorMax,
    };
  }

  var config = (app.config = {
    xAxis3D: '服务',
    yAxis3D: '口味',
    zAxis3D: '环境',
    color: '点评数',
    onChange: function () {
      var max = getMaxOnExtent(data);
      if (data) {
        myChart.setOption({
          visualMap: [{
            max: max.color / 2
          }, ],
          xAxis3D: {
            name: config.xAxis3D
          },
          yAxis3D: {
            name: config.yAxis3D
          },
          zAxis3D: {
            name: config.zAxis3D
          },
          series: {
            dimensions: [
              config.xAxis3D,
              config.yAxis3D,
              config.yAxis3D,
              config.color,
            ],
            data: data.map(function (item, idx) {
              return [
                item[fieldIndices[config.xAxis3D]],
                item[fieldIndices[config.yAxis3D]],
                item[fieldIndices[config.zAxis3D]],
                item[fieldIndices[config.color]],
                idx
              ];
            })
          }
        });
      }
    }
  });

  app.configParameters = {};
  ['xAxis3D', 'yAxis3D', 'zAxis3D', 'color'].forEach(function (
    fieldName
  ) {
    app.configParameters[fieldName] = {
      options: fieldNames
    };
  });

  var max = getMaxOnExtent(data);

  var tooltip = {
    trigger: 'item',
    formatter: function (params) {
      return [
        '点评数: &nbsp;' + params.value[3] + '<br>' +
        '服务: &nbsp;' + params.value[0] + '<br>' +
        '口味: &nbsp;' + params.value[1] + '<br>' +
        '环境: &nbsp;' + params.value[2] + '<br>'
      ].join('')
    }
  };

  var option = ({
    tooltip: tooltip,
    visualMap: [{
      top: 10,
      // text: '点评数',
      // type: 'piecewise',
      calculable: true,
      dimension: 3,
      min: 0,
      // max: Math.log10(max.color / 2),  // 可以取对数，但效果不一定好
      max: max.color / 2,
      inRange: {
        color: [
          '#1710c0',
          '#0b9df0',
          '#00fea8',
          '#00ff0d',
          '#f5f811',
          '#f09a09',
          '#fe0300'
        ]
      },
      textStyle: {
        color: '#fff'
      }
    }, ],
    xAxis3D: {
      name: config.xAxis3D,
      type: 'value'
    },
    yAxis3D: {
      name: config.yAxis3D,
      type: 'value'
    },
    zAxis3D: {
      name: config.zAxis3D,
      type: 'value'
    },
    grid3D: {
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      axisPointer: {
        lineStyle: {
          color: '#ffbd67'
        }
      },
      viewControl: {
        // autoRotate: true
        // projection: 'orthographic'
      }
    },
    series: [{
      type: 'scatter3D',
      dimensions: [
        config.xAxis3D,
        config.yAxis3D,
        config.yAxis3D,
        config.color,
      ],
      data: data.map(function (item, idx) {
        return [
          item[fieldIndices[config.xAxis3D]],
          item[fieldIndices[config.yAxis3D]],
          item[fieldIndices[config.zAxis3D]],
          item[fieldIndices[config.color]],
          idx
        ];
      }),
      symbolSize: 8,
      // symbol: 'triangle',
      itemStyle: {
        borderWidth: 0.1,
        borderColor: 'rgba(255,255,255,0.8)'
      },
      emphasis: {
        itemStyle: {
          color: '#fff'
        }
      }
    }]
  });

  // 3. 把配置给实例对象
  myChart.setOption(option);

  // 4. 让图表跟随屏幕自动的去适应
  window.addEventListener("resize", function () {
    myChart.resize();
  });
})();

// 核心部分，实现美食地图的展示
(function () {
  var regionSelect = document.getElementById('region-select');
  myChart = echarts.init(document.querySelector(".map .chart"));

  function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0),
      i = arr.length,
      temp, index;
    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  }
  var data_test = getRandomSubarray(json, 1000)
  // var data_test = json
  var selectedData = data_test.map(function (item) {
    return {
      Lng: item.Lng,
      Lat: item.Lat,
      口味: item.口味,
      行政区: item.行政区,
      服务: item.服务,
      环境: item.环境,
      人均消费: item.人均消费,

    };
  });
  var regions = [" 宝山区", " 奉贤区", " 虹口区", " 黄浦区", " 嘉定区", " 金山区", " 静安区", " 卢湾区", " 闵行区", " 浦东新区", " 普陀区", " 青浦区", " 松江区", " 徐汇区", " 杨浦区", " 闸北区", " 长宁区"];





  // 设置地图为上海地图
  echarts.registerMap('shanghai', mapdata);

  // 设置散点图配置项
  var att = '口味';
  let tooltipNum = 2;
  if (att === '服务') {
    tooltipNum = 4;
  } else if (att === '环境') {
    tooltipNum = 5;
  } else if (att === '人均消费') {
    tooltipNum = 6;
  }

  var tooltip = {
    trigger: 'item',
    formatter: function (params) {
      return att + ": " + params.value[tooltipNum];
    }
  };

  var legend = {
    orient: "vertical",
    top: "bottom",
    left: "right",
    textStyle: {
      color: "#fff"
    },
    selectedMode: "multiple"
  };
  var geo = {
    map: "shanghai",
    label: {
      emphasis: {
        show: true,
        color: "#fff"
      }
    },
    // 地图放大了1倍
    zoom: 1,
    roam: true,
    itemStyle: {
      normal: {
        // 地图省份的背景颜色
        areaColor: "rgb(168, 190, 190)",
        borderColor: "#195BB9",
        borderWidth: 1.5
      },
      emphasis: {
        areaColor: "#2B91B7"
      }
    }
  };
  var option = {
    // backgroundColor: '#000',
    tooltip: tooltip,
    legend: legend,
    geo: geo,
    visualMap: [{
      type: 'piecewise',
      min: 0,
      max: 10,
      top: '70%',
      calculable: true,
      left: 'right',
      inRange: {
        color: ['61a0a8''#d87c7c', '#7A942E', '#96281B', '#d7ab82']
      }
      // inRange: {
      //     color: ['#bdb76b07', '#beb430'] // 可根据口味范围设置颜色
      // }
    }, ],
    series: [{
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: selectedData.map(function (item) {
        return [item.Lng, item.Lat, item.口味];
      }),
      symbolSize: 3,
    }]
  };

  // 渲染图表
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
  var regionData = selectedData;
  window.onload = function () {
    document.getElementById('region-select').addEventListener('change', function (event) {
      var region = event.target.value;
      console.log('用户选择的新政区', region);

      function filterByRegion(region) {
        return selectedData.filter(function (item) {
          return item.行政区 === region;
        });
      }
      if (region === '全部') {
        regionData = selectedData;
      } else {
        regionData = filterByRegion(region);
      }
      if (att === '人均消费') {
        var visualMap = [{
          type: 'piecewise',
          min: 0,
          max: 500,
          top: '70%',
          calculable: true,
          left: 'right',
          inRange: {
            color: ['#1F3A93', '#7A942E', '#96281B', '#674172', '#3E4A61']
          },
          outOfRange: {
            color: 'yellow'
          }
        }, ];
      } else {
        var visualMap = [{
          type: 'piecewise',
          min: 0,
          max: 10,
          top: '70%',
          calculable: true,
          left: 'right',
          inRange: {
            color: ['#1F3A93', '#7A942E', '#96281B', '#674172']
          }
        }, ];
      }
      console.log('1:', regionData);
      myChart.setOption({
        tooltip: tooltip,
        legend: legend,
        geo: geo,
        visualMap: visualMap,
        series: [{
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: regionData.map(function (item) {
            return [item.Lng, item.Lat, item[att]];
          }),
          symbolSize: 3,
        }]
      });
    });
    document.getElementById('att-select').addEventListener('change', function (event) {

      // 获取用户选择的行政区
      att = event.target.value;
      if (att === '人均消费') {
        var visualMap = [{
          type: 'piecewise',
          min: 0,
          max: 500,
          top: '70%',
          calculable: true,
          left: 'right',
          inRange: {
            color: ['#1F3A93', '#7A942E', '#96281B', '#674172', '#3E4A61']
          },
          outOfRange: {
            color: 'yellow'
          }
        }, ];
      } else {
        var visualMap = [{
          type: 'piecewise',
          min: 0,
          max: 10,
          top: '70%',
          calculable: true,
          left: 'right',
          inRange: {
            color: ['#1F3A93', '#7A942E', '#96281B', '#674172']
          }
        }, ];
      }
      // 打印用户选择的行政区
      console.log('用户选择的属性', att);
      console.log('用户选择的属性值：', selectedData[0][att]);
      console.log('2:', regionData);

      // 更新地图的选项
      myChart.setOption({
        tooltip: tooltip,
        legend: legend,
        geo: geo,
        visualMap: visualMap,
        series: [{
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: regionData.map(function (item) {
            return [item.Lng, item.Lat, item[att]];
          }),
          symbolSize: 3,
        }]
      });

      // 重新渲染图表
      window.addEventListener("resize", function () {
        myChart.resize();
      });

    });
  };
})();


// (function () {
//     myChart = echarts.init(document.querySelector(".map .chart"));
//     // var data_test = json.slice(0,100)
//     var data_test = json
//     var selectedData = data_test.map(function(item) {
//         return {
//             口味: item.口味,
//             Lat: item.Lat,
//             Lng: item.Lng
//         };
//     });

//     // 设置地图为上海地图
//     echarts.registerMap('shanghai', mapdata);

//     // 设置散点图配置项
//     var option = {
//         // backgroundColor: '#000',
//         tooltip: {
//             formatter: function(params) {
//                 return '口味: ' + params.value[2];
//             }
//         },
//         legend: {
//             orient: "vertical",
//             top: "bottom",
//             left: "right",
//             data: ["宝山","奉贤","虹口"],
//             textStyle: {
//             color: "#fff"
//             },
//         selectedMode: "multiple"
//         },
//         geo: {
//             map: "shanghai",
//             label: {
//                 emphasis: {
//                     show: true,
//                     color: "#fff"
//                 }
//             },
//             // 地图放大了1倍
//             zoom: 1,
//             roam: true,
//             itemStyle: {
//                 normal: {
//                 // 地图省份的背景颜色
//                 areaColor: "rgba(20, 41, 87,0.6)",
//                 borderColor: "#195BB9",
//                 borderWidth: 1
//                 },
//                 emphasis: {
//                 areaColor: "#2B91B7"
//                 }
//             }
//         },     
//         visualMap: {
//             type: 'piecewise',
//             min: 0,
//             max: 10,
//             calculable: true,
//             inRange: {
//                 color: ['blue', 'green', 'yellow', 'red']
//             }
//             // inRange: {
//             //     color: ['#bdb76b07', '#beb430'] // 可根据口味范围设置颜色
//             // }
//         },
//         series: [{
//             type: 'heatmap',
//             coordinateSystem: 'geo',
//             label: {
//                 show: true
//             },
//             data: selectedData.map(function(item) {
//                 return [item.Lng, item.Lat, item.口味];
//             }),
//             symbolSize: 1,
//             emphasis: {
//                 itemStyle: {
//                 shadowBlur: 10,
//                 shadowColor: 'rgba(0, 0, 0, 0.5)'
//                 }
//             }
//         }]
//     };

//     // 渲染图表
//     myChart.setOption(option);
//     window.addEventListener("resize", function() {
//     myChart.resize();
//   });

//     // console.log(selectedData);
// })();