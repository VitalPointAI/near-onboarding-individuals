import React from 'react' 
import 'chart.js/auto'
import {Bar} from 'react-chartjs-2' 
import Box from '@mui/material/Box' 


export default function SuitabilityMetrics(props){
	
	const {
		specific, 
		values, 
		general,
		work
	} = props 
	
	const chartData={
		labels: ['Specific SKills', 'Values', 'General Skills', 'Work Type'],
		datasets: [ {
			label: 'Suitability', 
			data: [10, 40, 0, 35],
			backgroundColor: "#c05b05", 
			color: '#FFFFFF' 
			//data: [specific, values, general, work]
		}]

	}
	
	const options = {
			title: {
					display: true,
					text: 'Suitability',
					color: "#CFCFCF"
			},
			indexAxis: 'y',
			plugins:{ 
				legend: 
					{
					labels: {
					color: "#929090"
				}}
			},
			maintainAspectRatio: false,
			scales: {
				y: {
						ticks: 
						{
							color: "#929090"
						} 
				},
				x: {
					ticks: {
						color: "#929090"
					},
					max: 100
				}
			}
	}
	

	return(
			<Bar options={options} data={chartData} />
	)
}
