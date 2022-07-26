import { Bar } from "@/component/Bar"


export default function Home() {


  return (
    <div>
      <Bar
        title='三大框架满意度'
        xData={['vue', 'angular', 'react']}
        yData={[50, 60, 70]}
        style={{ width: '500px', height: '400px' }}
      />

      <Bar
        title='三大框架使用度'
        style={{ width: '300px', height: '250px' }}
        xData={['vue', 'angular', 'react']}
        yData={[50, 60, 70]}
      />
    </div>
  )
}