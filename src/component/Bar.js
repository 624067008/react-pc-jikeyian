import { useEffect, useRef } from "react"
import * as echarts from 'echarts'
function Bar({ title, xData, yData, style }) {
  const domRef = useRef()

  useEffect(() => {
    echartInit()
  }, [])
  const echartInit = () => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(domRef.current);
    // 绘制图表
    myChart.setOption({
      title: {
        text: title
      },
      tooltip: {},
      xAxis: {
        data: xData
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: yData
        }
      ]
    });
  }


  return (
    <div>
      <div ref={domRef} style={style}></div>
    </div>
  )
}

export { Bar }