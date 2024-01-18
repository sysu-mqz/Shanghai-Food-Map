// import * as XLSX from "js/xlsx.full.min.js";

// 左上角图像：使用矩形树图展示不同美食的基本情况
(function () {
  // 1实例化对象
  var myChart = echarts.init(document.querySelector(".bar .chart"), 'vintage', {
    width: 'auto',
    height: '380px'
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

  // var data_test = getRandomSubarray(json, 1000)
  var data_test = json
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

  var regionData = selectedData;
  console.log('106 regionData', regionData);
  window.onload = function () {
    document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('region-select').addEventListener('change', function (event) {
        var region = event.target.value;
        console.log('第1个function用户选择的新政区', regionData);

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

        var option = {
          tooltip: {
            formatter: getTooltipFormatter(selectedData)
          },
          series: [{
            type: 'treemap',
            label: {
              position: 'insideTopLeft',
              fontSize: 16,
            },
            data: countCategories(regionData),
          }]
        };

        // 3. 把配置项给实例对象
        myChart.setOption(option);
    
        // 重新渲染图表
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      });
    }
  };
})();

// 右上角图像：使用平行坐标系展示美食的点评数、口味、环境、服务和人均消费
(function () {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".bar2 .chart"), 'vintage', {
    width: 'auto',
    height: '380px'
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

  // 生成符合parallel的数据结构
  function generateParallelData(data, maxComment, maxAverageExpanse) {
    let parallelData = [];

    if (Array.isArray(data)) {
      data.forEach((item) => {
        // 这里限制了最大点评数和最大人均消费
        if (item.comments <= maxComment && item.averageExpanse <= maxAverageExpanse) {
          let data = [item.comments, item.flavour, item.environment, item.service, item.averageExpanse];
          parallelData.push(data);
        }
      });
    } else {
      console.error('Invalid data format');
    }

    return parallelData;
  };

  // 获取某一种美食类别中人均消费和点评数的最大值
  function getMaxValue(data) {
    let maxValue1 = 0;  // 人均消费的最大值
    let maxValue2 = 0;  // 点评数的最大值

    data.forEach((item) => {
      let currentValue1 = parseFloat(item.averageExpanse);
      if (currentValue1 > maxValue1) {
        maxValue1 = currentValue1;
      }
      let currentValue2 = parseFloat(item.comments);
      if (currentValue2 > maxValue2) {
        maxValue2 = currentValue2;
      }
    })

    return [maxValue1, maxValue2];
  };

  // 生成不同美食类别的parallel数据结构，希望实现类似的效果：https://echarts.apache.org/examples/zh/editor.html?c=parallel-aqi
  function generateData(allData, data) {
    let finalData = [];
    let categories = new Set();
    let selectedCategories = [];
    let categoryCounts = {};
    let maxComments = [];
    let maxAverageExpanses = [];

    if (Array.isArray(allData)) {
      allData.forEach((item) => {
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
      if (categoryCounts[item] / allData.length >= 0.1) {
        let newData = data.filter(item2 => item2.category === item);
        let result = getMaxValue(newData);
        maxAverageExpanses.push(result[0]);
        maxComments.push(result[1]);
      }
    })

    let maxAverageExpanse = Math.max(...maxAverageExpanses);
    let maxComment = Math.max(...maxComments);
    if (maxAverageExpanse > 200) {
      maxAverageExpanse = 200;
    }
    if (maxComment > 1000) {
      maxComment = 1000;
    }

    categories.forEach((item) => {
      if (categoryCounts[item] / allData.length >= 0.1) {
        let newData = data.filter(item2 => item2.category === item);
        let obj = {};
        obj.name = item;
        obj.type = 'parallel';
        obj.lineStyle = {
          width: 2,
          opacity: 0.5
        };
        obj.data = generateParallelData(newData, maxComment, maxAverageExpanse);
        finalData.push(obj);
        selectedCategories.push(item);
      }
    })

    return {
      finalData,
      selectedCategories,
      maxComment,
      maxAverageExpanse
    };
  }

  var data_test1 = json  // 用于判断美食类别占比大于10%
  var data_test2 = getRandomSubarray(json, 500)  // 用于展示图像
  var selectedData1 = data_test1.map(function (item) {
    return {
      category: item.类别,
    };
  });
  var selectedData2 = data_test2.map(function (item) {
    return {
      category: item.类别,
      region: item.行政区,
      comments: item.点评数,
      flavour: item.口味,
      environment: item.环境,
      service: item.服务,
      averageExpanse: item.人均消费,
    };
  });

  // 生成占比不小于10%的美食类别对应的数据集
  var result = generateData(selectedData1, selectedData2);

  var tooltip = {
    trigger: 'item',
    formatter: function (params) {
      return [
        '点评数: &nbsp;' + params.value[0] + '<br>' +
        '人均消费: &nbsp;' + params.value[4] + '<br>'
      ].join('')
    }
  };

  var option = {
    tooltip: tooltip,
    parallelAxis: [{
        dim: 0,
        name: '点评数',
        max: result.maxComment
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
        name: '人均消费',
        max: result.maxAverageExpanse
      },
    ],
    legend: {
      bottom: 25,
      data: result.selectedCategories,
      itemGap: 20,
      textStyle: {
        // color: '#fff',
        fontSize: 16
      }
    },
    series: result.finalData,
    parallel: {
      parallelAxisDefault: {
        nameTextStyle: {
          fontSize: 16
        },
        axisLabel: {
          fontSize: 14
        }
      }
    },
    emphasis: {
      itemStyle: {
        color: 'red'
      }
    }
  };

  // 3. 把配置给实例对象
  myChart.setOption(option);

  // 4. 让图表跟随屏幕自动的去适应
  window.addEventListener("resize", function () {
    myChart.resize();
  });
})();

// 左下角图像：展示了数量前4的美食类别在各个行政区的分布情况
(function () {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".pie .chart"), 'vintage', {
    width: 'auto',
    height: '380px'
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

  // var data_test = getRandomSubarray(json, 1000)
  var data_test = json
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
    title: [
      {
        subtext: selectedCategories[0],  // 左上角
        left: '24%',
        top: '52%',
        textAlign: 'center',
        subtextStyle: {  
          fontSize: 16 // 设置字体大小为16  
        }
      },
      {
        subtext: selectedCategories[1],  // 右上角
        left: '74%',
        top: '52%',
        textAlign: 'center',
        subtextStyle: {  
          fontSize: 16 // 设置字体大小为16  
        }
      },
      {
        subtext: selectedCategories[2],  // 左下角
        left: '24%',
        bottom: '5%',
        textAlign: 'center',
        subtextStyle: {  
          fontSize: 16 // 设置字体大小为16  
        }
      },
      {
        subtext: selectedCategories[3],  // 右下角
        left: '74%',
        bottom: '5%',
        textAlign: 'center',
        subtextStyle: {  
          fontSize: 16 // 设置字体大小为16  
        }
      }
    ],
    series: [
      {
        type: 'pie',  // 左上角
        radius: ['25%', '45%'],
        center: ['50%', '50%'],
        data: data1,
        label: label,
        emphasis: emphasis,
        left: 0,
        right: '50%',
        top: '18%', // 与top的距离
        bottom: '32%' // 与bottom的距离
      },
      {
        type: 'pie',  // 右上角
        radius: ['25%', '45%'],
        center: ['50%', '50%'],
        data: data2,
        label: label,
        emphasis: emphasis,
        left: '50%',
        right: 0,
        top: '18%',
        bottom: '32%'
      },
      {
        type: 'pie',  // 左下角
        radius: ['25%', '45%'],
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
        type: 'pie',  // 右下角
        radius: ['25%', '45%'],
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

// 右下角图像：展示了服务、口味和环境的关系，颜色编码为点评数
(function () {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".pie2 .chart"), 'vintage', {
    width: 'auto',
    height: '380px'
  });

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

  // 实现三维散点图（四个变量可同时展示）
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
        // color: [
        //   '#1710c0',
        //   '#0b9df0',
        //   '#00fea8',
        //   '#00ff0d',
        //   '#f5f811',
        //   '#f09a09',
        //   '#fe0300'
        // ],
        colorHue: [260, 0],
      },
      textStyle: {
        color: 'grey'
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
          // color: '#fff',
          color: 'grey'
        }
      },
      axisPointer: {
        lineStyle: {
          // color: '#ffbd67',
          color: 'grey'
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
      // itemStyle: {
      //   borderWidth: 0.1,
      //   borderColor: 'rgba(255,255,255,0.8)'
      // },
      emphasis: {
        itemStyle: {
          color: 'grey',
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
  myChart = echarts.init(document.querySelector(".map .chart"), null);

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
        color: ['#1f075b','#7A942E', '#d7ab82','#d87c7c','#96281B']
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
            color: ['#1f075b','#7A942E', '#d7ab82','#d87c7c','#96281B']
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
            color: ['#1f075b','#7A942E', '#d7ab82','#d87c7c','#96281B']
          }
        }, ];
      }
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
            color: ['#1f075b','#7A942E', '#d7ab82','#d87c7c','#96281B']
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
            color: ['#1f075b','#7A942E', '#d7ab82','#d87c7c','#96281B']
          }
        }, ];
      }

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

