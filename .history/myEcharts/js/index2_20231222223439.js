// import * as XLSX from "js/xlsx.full.min.js";

// 尝试利用矩形树图展示不同美食的基本情况
(function() {
  // 1实例化对象
  var myChart = echarts.init(document.querySelector(".bar .chart"),null, { width: 'auto', height: '300px' });
  
  // 2. 指定配置项和数据
  // 随机获取一个指定长度的数组
  function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  }

  // 统计各个类别的名称和数量 
  function countCategories (data) {  
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
    
    let categoryData = [];  // 创建一个空数组
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
  var selectedData = data_test.map(function(item) {
      return {
          category: item.类别,
      };
  });

  var option = {
    tooltip: {
      formatter: getTooltipFormatter(selectedData)
    },
    series: [
      {
        type: 'treemap',
        // tooltip: {
        //   formatter: getTooltipFormatter(selectedData),
        // },
        label: {
          position: 'insideTopLeft',
        },
        data: countCategories(selectedData),
      }
    ]
  };
  // var option = {
  //   color: ["#2f89cf"],
  //   tooltip: {
  //     trigger: "axis",
  //     axisPointer: {
  //       // 坐标轴指示器，坐标轴触发有效
  //       type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
  //     }
  //   },
  //   // 修改图表的大小
  //   grid: {
  //     left: "0%",
  //     top: "10px",
  //     right: "0%",
  //     bottom: "4%",
  //     containLabel: true
  //   },
  //   xAxis: [
  //     {
  //       type: "category",
  //       data: [
  //         "旅游行业",
  //         "教育培训",
  //         "游戏行业",
  //         "医疗行业",
  //         "电商行业",
  //         "社交行业",
  //         "金融行业"
  //       ],
  //       axisTick: {
  //         alignWithLabel: true
  //       },
  //       // 修改刻度标签 相关样式
  //       axisLabel: {
  //         color: "rgba(255,255,255,.6) ",
  //         fontSize: "12"
  //       },
  //       // 不显示x坐标轴的样式
  //       axisLine: {
  //         show: false
  //       }
  //     }
  //   ],
  //   yAxis: [
  //     {
  //       type: "value",
  //       // 修改刻度标签 相关样式
  //       axisLabel: {
  //         color: "rgba(255,255,255,.6) ",
  //         fontSize: 12
  //       },
  //       // y轴的线条改为了 2像素
  //       axisLine: {
  //         lineStyle: {
  //           color: "rgba(255,255,255,.1)",
  //           width: 2
  //         }
  //       },
  //       // y轴分割线的颜色
  //       splitLine: {
  //         lineStyle: {
  //           color: "rgba(255,255,255,.1)"
  //         }
  //       }
  //     }
  //   ],
  //   series: [
  //     {
  //       name: "直接访问",
  //       type: "bar",
  //       barWidth: "35%",
  //       data: [200, 300, 300, 900, 1500, 1200, 600],
  //       itemStyle: {
  //         // 修改柱子圆角
  //         barBorderRadius: 5
  //       }
  //     }
  //   ]
  // };
  // 3. 把配置项给实例对象
  myChart.setOption(option);
  // 4. 让图表跟随屏幕自动的去适应
  window.addEventListener("resize", function() {
    myChart.resize();
  });
})();

// 柱状图2
(function() {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".bar2 .chart"), null, { width: 'auto', height: '350px' });
  // 2. 指定配置和数据
  // 随机获取一个指定长度的数组
  function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
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
    console.log(data);
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
        console.log('我进来了 category: ' + item);
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

    return {finalData, selectedCategories};
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
  var selectedData = data_test.map(function(item) {
      return {
          category: item.类别,
          comments: item.点评数,
          flavour: item.口味,
          environment: item.环境,
          service: item.服务,
          averageExpanse: item.人均消费,
      };
  });
  var result = generateData(selectedData);
  console.log(result.finalData);
  console.log(result.selectedCategories);

  var option = {
    parallelAxis: [
      { dim: 0, name: '点评数', max: 1000 },
      { dim: 1, name: '口味', max: 10 },
      { dim: 2, name: '环境', max: 10 },
      { dim: 3, name: '服务', max: 10 },
      { dim: 4, name: '人均消费' },
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
    // visualMap: {
    //   show: true,
    //   min: 0,
    //   max: 150,
    //   dimension: 4,
    //   inRange: {
    //     color: ['#d94e5d', '#eac736', '#50a3ba'].reverse()
    //     // colorAlpha: [0, 1]
    //   }
    // },
  };

  // var option = {
  //   grid: {
  //     top: "10%",
  //     left: "22%",
  //     bottom: "10%"
  //     // containLabel: true
  //   },
  //   // 不显示x轴的相关信息
  //   xAxis: {
  //     show: false
  //   },
  //   yAxis: [
  //     {
  //       type: "category",
  //       inverse: true,
  //       data: ["HTML5", "CSS3", "javascript", "VUE", "NODE"],
  //       // 不显示y轴的线
  //       axisLine: {
  //         show: false
  //       },
  //       // 不显示刻度
  //       axisTick: {
  //         show: false
  //       },
  //       // 把刻度标签里面的文字颜色设置为白色
  //       axisLabel: {
  //         color: "#fff"
  //       }
  //     },
  //     {
  //       data: [702, 350, 610, 793, 664],
  //       inverse: true,
  //       // 不显示y轴的线
  //       axisLine: {
  //         show: false
  //       },
  //       // 不显示刻度
  //       axisTick: {
  //         show: false
  //       },
  //       // 把刻度标签里面的文字颜色设置为白色
  //       axisLabel: {
  //         color: "#fff"
  //       }
  //     }
  //   ],
  //   series: [
  //     {
  //       name: "条",
  //       type: "bar",
  //       data: [70, 34, 60, 78, 69],
  //       yAxisIndex: 0,
  //       // 修改第一组柱子的圆角
  //       itemStyle: {
  //         barBorderRadius: 20,
  //         // 此时的color 可以修改柱子的颜色
  //         color: function(params) {
  //           // params 传进来的是柱子对象
  //           // console.log(params);
  //           // dataIndex 是当前柱子的索引号
  //           return myColor[params.dataIndex];
  //         }
  //       },
  //       // 柱子之间的距离
  //       barCategoryGap: 50,
  //       //柱子的宽度
  //       barWidth: 10,
  //       // 显示柱子内的文字
  //       label: {
  //         show: true,
  //         position: "inside",
  //         // {c} 会自动的解析为 数据  data里面的数据
  //         formatter: "{c}%"
  //       }
  //     },
  //     {
  //       name: "框",
  //       type: "bar",
  //       barCategoryGap: 50,
  //       barWidth: 15,
  //       yAxisIndex: 1,
  //       data: [100, 100, 100, 100, 100],
  //       itemStyle: {
  //         color: "none",
  //         borderColor: "#00c1de",
  //         borderWidth: 3,
  //         barBorderRadius: 15
  //       }
  //     }
  //   ]
  // };

  // 3. 把配置给实例对象
  myChart.setOption(option);
  // 4. 让图表跟随屏幕自动的去适应
  window.addEventListener("resize", function() {
    myChart.resize();
  });
})();

// 如果改成四个图，需要隐藏以下代码，否则之后的图像无法显示
// 折线图1模块制作
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

// 折线图2 模块制作
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

// 饼形图1
(function() {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".pie .chart"));
  // 2.指定配置
  var option = {
    color: ["#065aab", "#066eab", "#0682ab", "#0696ab", "#06a0ab"],
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },

    legend: {
      bottom: "0%",
      // 修改小图标的大小
      itemWidth: 10,
      itemHeight: 10,
      // 修改图例组件的文字为 12px
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: "12"
      }
    },
    series: [
      {
        name: "年龄分布",
        type: "pie",
        // 这个radius可以修改饼形图的大小
        // radius 第一个值是内圆的半径 第二个值是外圆的半径
        radius: ["40%", "60%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        // 图形上的文字
        label: {
          show: false,
          position: "center"
        },
        // 链接文字和图形的线是否显示
        labelLine: {
          show: false
        },
        data: [
          { value: 1, name: "0岁以下" },
          { value: 4, name: "20-29岁" },
          { value: 2, name: "30-39岁" },
          { value: 2, name: "40-49岁" },
          { value: 1, name: "50岁以上" }
        ]
      }
    ]
  };

  // 3. 把配置给实例对象
  myChart.setOption(option);
  // 4. 让图表跟随屏幕自动的去适应
  window.addEventListener("resize", function() {
    myChart.resize();
  });
})();

// 饼形图2 地区分布模块
(function() {
  var myChart = echarts.init(document.querySelector(".pie2 .chart"));
  var option = {
    color: [
      "#006cff",
      "#60cda0",
      "#ed8884",
      "#ff9f7f",
      "#0096ff",
      "#9fe6b8",
      "#32c5e9",
      "#1d9dff"
    ],
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      bottom: "0%",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: "12"
      }
    },
    series: [
      {
        name: "地区分布",
        type: "pie",
        radius: ["10%", "70%"],
        center: ["50%", "50%"],
        roseType: "radius",
        // 图形的文字标签
        label: {
          fontSize: 10
        },
        // 链接图形和文字的线条
        labelLine: {
          // length 链接图形的线条
          length: 6,
          // length2 链接文字的线条
          length2: 8
        },
        data: [
          { value: 20, name: "云南" },
          { value: 26, name: "北京" },
          { value: 24, name: "山东" },
          { value: 25, name: "河北" },
          { value: 20, name: "江苏" },
          { value: 25, name: "浙江" },
          { value: 30, name: "四川" },
          { value: 42, name: "湖北" }
        ]
      }
    ]
  };
  myChart.setOption(option);
  // 监听浏览器缩放，图表对象调用缩放resize函数
  window.addEventListener("resize", function() {
    myChart.resize();
  });
})();

(function () {
    var regionSelect = document.getElementById('region-select');
    myChart = echarts.init(document.querySelector(".map .chart"));
    function getRandomSubarray(arr, size) {
      var shuffled = arr.slice(0), i = arr.length, temp, index;
      while (i--) {
          index = Math.floor((i + 1) * Math.random());
          temp = shuffled[index];
          shuffled[index] = shuffled[i];
          shuffled[i] = temp;
      }
      return shuffled.slice(0, size);
    }
    var data_test = getRandomSubarray(json, 100)
    // var data_test = json
    var selectedData = data_test.map(function(item) {
        return {
            Lng: item.Lng,
            Lat: item.Lat,
            口味: item.口味,
            行政区: item.行政区
        };
    });
    function filterByRegion(region) {
      return selectedData.filter(function (item) {
        return item.行政区 === region;
      });
    }
    var regions = [" 宝山区", " 奉贤区", " 虹口区", " 黄浦区", " 嘉定区", " 金山区", " 静安区", " 卢湾区", " 闵行区", " 浦东新区", " 普陀区", " 青浦区", " 松江区", " 徐汇区", " 杨浦区", " 闸北区", " 长宁区"];

    var regionData = {};

    regions.forEach(function (region) {
      regionData[region] = filterByRegion(region);
    });

    // 设置地图为上海地图
    echarts.registerMap('shanghai', mapdata);

  // 设置散点图配置项
    var tooltip = {
      trigger: 'item',
      formatter: function (params) { return '口味: ' + params.value[2]; }
    };
    var legend ={
      orient: "vertical",
      top: "bottom",
      left: "right",
      textStyle: {color: "#fff"},
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
          areaColor: "rgba(20, 41, 87,0.6)",
          borderColor: "#195BB9",
          borderWidth: 1
        },
        emphasis: {
          areaColor: "#2B91B7"
        }
      }
    };
    var option = {
        // backgroundColor: '#000',
      tooltip:tooltip,
      legend: legend,
      geo
        
   
      visualMap: [
        { type: 'piecewise',
          min: 0,
          max: 10,
          calculable: true,
          left: 'left',
          inRange: {
            color: ['blue', 'purple', 'yellow', 'red']
          }
          // inRange: {
          //     color: ['#bdb76b07', '#beb430'] // 可根据口味范围设置颜色
          // }
        },
        ],
        series: [{
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: selectedData.map(function(item) {
                return [item.Lng, item.Lat, item.口味];
            }),
            symbolSize: 3,
      
        }]
    };

    // 渲染图表
    myChart.setOption(option);
    window.addEventListener("resize", function() {
    myChart.resize();
    });
    window.onload = function ()  {
      // 在这里注册 change 事件处理函数
      document.getElementById('att-select').addEventListener('change', function (event) {
        // 获取用户选择的行政区
        var att = event.target.value;

        // 打印用户选择的行政区
        console.log('用户选择的行政区：', att);

        // 更新地图的选项
        myChart.setOption({tooltip,
          series: [
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: selectedData.map(function (item) {
                return [item.Lng, item.Lat, item.口味, item.att];
              }),
              symbolSize: 3,
            }
          ]
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
