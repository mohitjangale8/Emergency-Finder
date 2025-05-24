import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useHeartRate } from '../../contexts/HeartRateContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const HeartRateChart: React.FC = () => {
  const { heartRateHistory, user } = useHeartRate();

  // Transform data for the chart
  const chartData = heartRateHistory.map(reading => ({
    time: format(new Date(reading.timestamp), 'HH:mm:ss'),
    value: reading.value,
    status: reading.status,
    timestamp: reading.timestamp,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      let statusColor = '#4CAF50'; // green for normal
      if (data.status === 'tachycardia') {
        statusColor = '#F44336'; // red
      } else if (data.status === 'bradycardia') {
        statusColor = '#2196F3'; // blue
      }
      
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p style={{ color: statusColor }} className="font-semibold">{`${data.value} BPM`}</p>
          <p className="text-xs text-gray-500 capitalize">{data.status}</p>
        </div>
      );
    }
    
    return null;
  };

  // Get min and max for Y-axis
  const minRate = Math.min(...chartData.map(d => d.value), 40);
  const maxRate = Math.max(...chartData.map(d => d.value), 160);
  
  // Padding for Y-axis
  const yAxisMin = Math.max(0, minRate - 10);
  const yAxisMax = maxRate + 10;

  // Colors for different heart rate statuses
  const getLineColor = (dataPoint: any) => {
    if (dataPoint.status === 'tachycardia') return '#F44336';
    if (dataPoint.status === 'bradycardia') return '#2196F3';
    return '#4CAF50';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Heart Rate Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(time) => time.split(':')[0] + ':' + time.split(':')[1]}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[yAxisMin, yAxisMax]} 
              tick={{ fontSize: 12 }}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={2}
              dot={{ r: 1 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
              strokeDasharray={(data) => {
                const dataPoint = chartData.find(
                  (d) => d.timestamp === data.payload.timestamp
                );
                return dataPoint?.status === 'normal' ? '' : '5 5';
              }}
              stroke={(data) => {
                const dataPoint = chartData.find(
                  (d) => d.timestamp === data.payload.timestamp
                );
                return getLineColor(dataPoint);
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};