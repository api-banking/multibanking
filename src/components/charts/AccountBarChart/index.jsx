import Bar from 'recharts/lib/cartesian/Bar'
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid'
import XAxis from 'recharts/lib/cartesian/XAxis'
import YAxis from 'recharts/lib/cartesian/YAxis'
import BarChart from 'recharts/lib/chart/BarChart'
import Legend from 'recharts/lib/component/Legend'
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer'
import Tooltip from 'recharts/lib/component/Tooltip'
import Colors from '../../../constants/colors'

const AccountBarChart = ({ data }) => (
  <ResponsiveContainer width="99%" height={320}>
    <BarChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Bar type="monotone" dataKey="positive" fill={Colors.greenPositive} />
      <Bar type="monotone" dataKey="negative" fill={Colors.redNegative} />
    </BarChart>
  </ResponsiveContainer>
)

export default AccountBarChart
