import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid'
import Line from 'recharts/lib/cartesian/Line'
import XAxis from 'recharts/lib/cartesian/XAxis'
import YAxis from 'recharts/lib/cartesian/YAxis'
import LineChart from 'recharts/lib/chart/LineChart'
import Legend from 'recharts/lib/component/Legend'
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer'
import Tooltip from 'recharts/lib/component/Tooltip'
import Colors from '../../../constants/colors'

const AccountLineChart = ({ data }) => (
  <ResponsiveContainer width="99%" height={320}>
    <LineChart data={data} baseValue={0}>
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line dataKey="positive" stroke={Colors.greenPositive} strokeWidth={3} />
      <Line dataKey="negative" stroke={Colors.redNegative} strokeWidth={3} />
      {/* <Line
        type="monotone"
        dataKey="total"
        stroke="#2679ff"
        activeDot={{ r: 8 }}
      /> */}
    </LineChart>
  </ResponsiveContainer>
)

export default AccountLineChart
