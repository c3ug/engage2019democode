import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';

class SecondBarChart extends React.Component {
    

    render() {
        const data = this.props.data;
        return (
          <BarChart
            width={800}
            height={300}
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="calls" fill="#8884d8" />
            
          </BarChart>
        );
      }
}
export default SecondBarChart;
