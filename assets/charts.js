/* laseta 双渠道方案 · 图表与服务费试算器 */
(function () {
  'use strict';

  var C = {
    accent: '#A8452F',
    accent2: '#2C4A5A',
    ink: '#171514',
    muted: '#6E6862',
    rule: '#E3DDD4',
    grid: '#EFEAE3',
    soft: '#9FB0BA',
    faint: '#C9C2B8',
    bg: '#FBF9F6'
  };
  var FONT = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",-apple-system,sans-serif';

  var axisX = {
    axisLine: { lineStyle: { color: C.rule } },
    axisTick: { show: false },
    axisLabel: { color: C.muted, fontSize: 12, fontFamily: FONT },
    splitLine: { show: false }
  };
  var axisY = {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: C.muted, fontSize: 12, fontFamily: FONT },
    splitLine: { lineStyle: { color: C.grid } }
  };
  var tip = {
    backgroundColor: '#fff',
    borderColor: C.rule,
    borderWidth: 1,
    padding: [9, 12],
    textStyle: { color: C.ink, fontSize: 12, fontFamily: FONT },
    extraCssText: 'box-shadow:0 6px 22px rgba(0,0,0,.08);border-radius:6px;'
  };
  var legend = {
    top: 0,
    right: 0,
    itemWidth: 10,
    itemHeight: 10,
    textStyle: { color: C.muted, fontSize: 12, fontFamily: FONT }
  };

  var charts = [];
  function mount(id, option) {
    var el = document.getElementById(id);
    if (!el) return;
    var chart = echarts.init(el);
    chart.setOption(option);
    charts.push(chart);
  }

  if (typeof echarts === 'undefined') {
    // 图表库缺失时不阻断页面其余功能
  } else {

    /* 01 · 49 SKU 价格带分布 */
    mount('chart-dumbbell', {
      animationDuration: 700,
      grid: { left: 102, right: 58, top: 18, bottom: 26 },
      tooltip: Object.assign({}, tip, {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (p) {
          return p[0].name.replace('\n', ' ') + '<br><b>' + p[0].value + ' 条</b> · 占比 ' +
            (p[0].value / 49 * 100).toFixed(1) + '%';
        }
      }),
      xAxis: Object.assign({}, axisY, {
        type: 'value',
        max: 28,
        interval: 5,
        axisLabel: { color: C.muted, fontSize: 12, formatter: '{value} 条' }
      }),
      yAxis: Object.assign({}, axisX, {
        type: 'category',
        inverse: true,
        data: ['10–30 元 · 引流', '30–50 元 · 过渡', '50–80 元 · 利润', '80 元以上 · 高价'],
        axisLabel: { color: C.ink, fontSize: 12.5, fontFamily: FONT }
      }),
      series: [{
        type: 'bar',
        barWidth: 24,
        label: { show: true, position: 'right', formatter: '{c} 条', color: C.muted, fontSize: 12 },
        itemStyle: { borderRadius: [0, 3, 3, 0] },
        data: [
          { value: 24, itemStyle: { color: C.accent } },
          { value: 4, itemStyle: { color: C.faint } },
          { value: 18, itemStyle: { color: C.accent } },
          { value: 3, itemStyle: { color: C.accent2 } }
        ]
      }]
    });

    /* 02 · 内衣大盘品类构成与同比增速 */
    mount('chart-category', {
      animationDuration: 800,
      grid: { left: 46, right: 58, top: 54, bottom: 46 },
      legend: legend,
      tooltip: Object.assign({}, tip, {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (p) {
          var out = p[0].name;
          p.forEach(function (item) {
            out += '<br>' + item.marker + item.seriesName + '：<b>' +
              (item.seriesName === '同比增速' ? item.value + '%' : item.value + ' 亿元') + '</b>';
          });
          return out;
        }
      }),
      xAxis: Object.assign({}, axisX, {
        type: 'category',
        data: ['文胸', '内裤', '袜子', '连裤袜', '其他内衣'],
        axisLabel: { color: C.ink, fontSize: 12.5, fontFamily: FONT }
      }),
      yAxis: [
        Object.assign({}, axisY, { type: 'value', name: 'GMV（亿元）', nameGap: 14, nameTextStyle: { color: C.muted, fontSize: 11 } }),
        Object.assign({}, axisY, { type: 'value', name: '同比', nameGap: 14, nameTextStyle: { color: C.muted, fontSize: 11 }, splitLine: { show: false }, axisLabel: { color: C.muted, fontSize: 11, formatter: '{value}%' } })
      ],
      series: [
        {
          name: '2026 YTD GMV',
          type: 'bar',
          barWidth: 42,
          yAxisIndex: 0,
          itemStyle: { borderRadius: [3, 3, 0, 0] },
          label: { show: true, position: 'top', formatter: '{c}', color: C.muted, fontSize: 11 },
          data: [
            { value: 160.2, itemStyle: { color: C.soft } },
            { value: 133.8, itemStyle: { color: C.soft } },
            { value: 57.7, itemStyle: { color: C.soft } },
            { value: 14.2, itemStyle: { color: C.accent } },
            { value: 57.0, itemStyle: { color: C.faint } }
          ]
        },
        {
          name: '同比增速',
          type: 'line',
          yAxisIndex: 1,
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: { width: 1.6, color: C.accent2 },
          itemStyle: { color: C.accent2 },
          label: { show: true, position: 'top', distance: 6, formatter: '{c}%', color: C.accent2, fontSize: 11 },
          data: [
            { value: -10.7, label: { position: 'bottom' } },
            { value: 0.3, label: { position: 'top' } },
            { value: -4.7, label: { position: 'bottom' } },
            { value: 17.4, label: { position: 'top' } },
            { value: -14.5, label: { position: 'right' } }
          ]
        }
      ]
    });

    /* 03 · 价格带销量 vs 销售额 */
    mount('chart-price', {
      animationDuration: 800,
      grid: { left: 46, right: 24, top: 44, bottom: 34 },
      legend: legend,
      tooltip: Object.assign({}, tip, { trigger: 'axis', axisPointer: { type: 'shadow' } }),
      xAxis: Object.assign({}, axisX, {
        type: 'category',
        data: ['25 元以下', '25–40 元', '40–69 元', '69 元以上'],
        axisLabel: { color: C.ink, fontSize: 12.5, fontFamily: FONT }
      }),
      yAxis: Object.assign({}, axisY, {
        type: 'value',
        max: 70,
        axisLabel: { color: C.muted, fontSize: 12, formatter: '{value}%' }
      }),
      series: [
        {
          name: '销量占比',
          type: 'bar',
          barWidth: 26,
          itemStyle: { color: C.accent2, borderRadius: [3, 3, 0, 0] },
          label: { show: true, position: 'top', formatter: '{c}%', color: C.muted, fontSize: 11 },
          data: [60.8, 27, 9, 2]
        },
        {
          name: '销售额占比',
          type: 'bar',
          barWidth: 26,
          itemStyle: { color: C.accent, borderRadius: [3, 3, 0, 0] },
          label: { show: true, position: 'top', formatter: '{c}%', color: C.muted, fontSize: 11 },
          data: [33.1, 36.9, 20.1, 9.9]
        }
      ]
    });

    /* 04 · 热词：溢价率 × 热度 × 体量 */
    mount('chart-heat', {
      animationDuration: 900,
      grid: { left: 54, right: 42, top: 30, bottom: 52 },
      tooltip: Object.assign({}, tip, {
        formatter: function (p) {
          var v = p.data.value;
          return '<b>' + p.data.name + '</b><br>溢价率：' + v[0] + '%<br>热度指数：' + v[1] +
            '<br>体量：' + v[2] + ' 亿元';
        }
      }),
      xAxis: Object.assign({}, axisY, {
        type: 'value',
        min: 0,
        max: 120,
        interval: 30,
        name: '溢价率（%）',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { color: C.muted, fontSize: 12 },
        axisLabel: { color: C.muted, fontSize: 12, formatter: '{value}%' }
      }),
      yAxis: Object.assign({}, axisY, {
        type: 'value',
        min: 0,
        max: 100,
        name: '热度指数',
        nameGap: 18,
        nameTextStyle: { color: C.muted, fontSize: 12 }
      }),
      series: [{
        type: 'scatter',
        symbol: 'circle',
        data: [
          { name: '防臭', value: [4, 95, 13.4] },
          { name: '纯棉', value: [17, 81, 11.3] },
          { name: '抗菌', value: [26, 70, 8.3] },
          { name: '灰色连裤袜', value: [39.2, 44, 5.0] },
          { name: '羊毛连裤袜', value: [107.3, 58, 3.0] },
          { name: '民族风袜子', value: [18, 30, 2.0] }
        ],
        symbolSize: function (val) { return Math.sqrt(val[2]) * 6 + 10; },
        itemStyle: { color: 'rgba(168,69,47,.72)', borderColor: C.accent, borderWidth: 1 },
        emphasis: { itemStyle: { color: C.accent } },
        label: {
          show: true,
          position: 'right',
          distance: 6,
          formatter: function (p) { return p.data.name; },
          color: C.ink,
          fontSize: 11.5,
          fontFamily: FONT
        }
      }]
    });

    /* 05 · 袜子品类市占率 TOP5 */
    mount('chart-competitor', {
      animationDuration: 700,
      grid: { left: 74, right: 56, top: 34, bottom: 26 },
      title: {
        text: 'CR5 合计 19.5%',
        right: 4,
        top: 0,
        textStyle: { color: C.muted, fontSize: 12, fontWeight: 500, fontFamily: FONT }
      },
      tooltip: Object.assign({}, tip, {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (p) { return p[0].name + '<br>市占率：<b>' + p[0].value + '%</b>'; }
      }),
      xAxis: Object.assign({}, axisY, {
        type: 'value',
        max: 6,
        axisLabel: { color: C.muted, fontSize: 12, formatter: '{value}%' }
      }),
      yAxis: Object.assign({}, axisX, {
        type: 'category',
        inverse: true,
        data: ['猫人', '一只鱼', '棉竹屋', '浪莎', '蕉内'],
        axisLabel: { color: C.ink, fontSize: 12.5, fontFamily: FONT }
      }),
      series: [{
        type: 'bar',
        barWidth: 18,
        itemStyle: { color: C.accent2, borderRadius: [0, 3, 3, 0] },
        label: { show: true, position: 'right', formatter: '{c}%', color: C.muted, fontSize: 12 },
        data: [5.0, 4.6, 3.4, 3.3, 3.2]
      }]
    });

    /* 06 · 京东货盘四层结构 */
    mount('chart-jd-mix', {
      animationDuration: 800,
      tooltip: Object.assign({}, tip, {
        trigger: 'item',
        formatter: '{b}<br>销售额贡献：<b>{c}%</b>'
      }),
      legend: Object.assign({}, legend, {
        orient: 'horizontal',
        bottom: 0,
        top: 'auto',
        right: 'auto',
        left: 'center'
      }),
      color: [C.accent2, C.accent, C.soft, C.faint],
      series: [{
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '46%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: C.bg, borderWidth: 2 },
        label: { formatter: '{b}\n{d}%', color: C.ink, fontSize: 11.5, fontFamily: FONT, lineHeight: 16 },
        labelLine: { length: 10, length2: 8, lineStyle: { color: C.rule } },
        data: [
          { name: '引流款 25–30%', value: 26 },
          { name: '利润款 40–45%', value: 41 },
          { name: '高客单款 15–20%', value: 17 },
          { name: '季节款 15–20%', value: 16 }
        ]
      }]
    });

    /* 07 · 30% 档实付服务费曲线 */
    mount('chart-fee', {
      animationDuration: 800,
      grid: { left: 52, right: 30, top: 46, bottom: 40 },
      legend: legend,
      tooltip: Object.assign({}, tip, {
        trigger: 'axis',
        formatter: function (p) {
          var out = '垫付推广费 ' + p[0].axisValue + ' 万元';
          p.forEach(function (item) {
            out += '<br>' + item.marker + item.seriesName + '：<b>' + item.value + ' 万元</b>';
          });
          return out;
        }
      }),
      xAxis: Object.assign({}, axisX, {
        type: 'category',
        boundaryGap: false,
        data: ['0', '0.5', '1', '1.5', '2', '2.5', '3', '4', '5'],
        axisLabel: { color: C.ink, fontSize: 12, formatter: '{value} 万' }
      }),
      yAxis: Object.assign({}, axisY, {
        type: 'value',
        max: 3.6,
        axisLabel: { color: C.muted, fontSize: 12, formatter: '{value} 万' }
      }),
      series: [
        {
          name: '服务费上限',
          type: 'line',
          symbol: 'none',
          lineStyle: { width: 1.4, type: 'dashed', color: C.faint },
          data: [3, 3, 3, 3, 3, 3, 3, 3, 3]
        },
        {
          name: '实付服务费',
          type: 'line',
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, color: C.accent },
          itemStyle: { color: C.accent },
          areaStyle: { color: 'rgba(168,69,47,.10)' },
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: C.accent2, type: 'dotted', width: 1.2 },
            label: { formatter: '兜底 5000 元', color: C.accent2, fontSize: 11, position: 'insideEndTop' },
            data: [{ yAxis: 0.5 }]
          },
          data: [3, 2.5, 2, 1.5, 1, 0.5, 0.5, 0.5, 0.5]
        }
      ]
    });
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      charts.forEach(function (c) { c.resize(); });
    }, 160);
  });

  /* ---------- 服务费试算器 ---------- */
  (function () {
    var tier = 0.3;
    var promoRatio = { 0.3: 0.15, 0.4: 0.22, 0.5: 0.30 };
    var gmv = document.getElementById('gmvRange');
    var promo = document.getElementById('promoRange');
    var pick = document.getElementById('tierPick');
    if (!gmv || !promo || !pick) return;

    function money(n) { return Math.round(n).toLocaleString('zh-CN'); }
    function calc() {
      var g = Number(gmv.value);
      var p = Number(promo.value);
      var fee = g * tier;
      var floor = g * 0.05;
      var pay = fee - p;
      var floored = false;
      if (p >= fee) { pay = floor; floored = true; }
      if (pay < 0) { pay = 0; }

      document.getElementById('gmvVal').textContent = money(g);
      document.getElementById('promoVal').textContent = money(p);
      document.getElementById('outFee').textContent = money(fee);
      document.getElementById('outPay').textContent = money(pay);
      document.getElementById('outRate').textContent = (pay / g * 100).toFixed(1) + '%';

      var ratio = (p / g * 100).toFixed(1);
      var hint;
      if (floored) {
        hint = '推广费 ' + money(p) + ' 元已达 / 超过服务费 ' + money(fee) +
          ' 元 → 触发兜底，按 GMV×5% 实付 ' + money(pay) + ' 元。付费占比 ' + ratio + '%';
      } else {
        hint = '服务费 ' + money(fee) + ' 元 − 客户垫付推广费 ' + money(p) +
          ' 元 = 实付 ' + money(pay) + ' 元。付费占比 ' + ratio + '%';
      }
      document.getElementById('calcHint').textContent = hint;
    }

    Array.prototype.forEach.call(pick.querySelectorAll('button'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(pick.querySelectorAll('button'), function (b) {
          b.classList.remove('on');
        });
        btn.classList.add('on');
        tier = Number(btn.getAttribute('data-tier'));
        /* 换档时同步调整建议推广费：30% → 15%、40% → 22%、50% → 30% */
        var g = Number(gmv.value);
        promo.value = Math.round(g * promoRatio[tier] / 1000) * 1000;
        calc();
      });
    });

    gmv.addEventListener('input', calc);
    promo.addEventListener('input', calc);
    calc();
  })();
})();
