<script>

	import { Chart } from 'flowbite-svelte';

	const options = {
		colors: ['#1A56DB', '#FDBA8C'],
		series: [
			{
				name: 'Inventory',
				color: '#1A56DB',
				data: [
					{ x: 'Mon', y: 231 },
					{ x: 'Tue', y: 122 },
					{ x: 'Wed', y: 63 },
					{ x: 'Thu', y: 421 },
					{ x: 'Fri', y: 122 },
					{ x: 'Sat', y: 323 },
					{ x: 'Sun', y: 111 }
				]
			},
			{
				name: 'Sells',
				color: '#FDBA8C',
				data: [
					{ x: 'Mon', y: 232 },
					{ x: 'Tue', y: 113 },
					{ x: 'Wed', y: 341 },
					{ x: 'Thu', y: 224 },
					{ x: 'Fri', y: 522 },
					{ x: 'Sat', y: 411 },
					{ x: 'Sun', y: 243 }
				]
			}
		],
		chart: {
			type: 'bar',
			height: '320px',
			fontFamily: 'Inter, sans-serif',
			toolbar: {
				show: true
			}
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '70%',
				borderRadiusApplication: 'end',
				borderRadius: 8
			}
		},
		tooltip: {
			shared: true,
			intersect: false,
			style: {
				fontFamily: 'Inter, sans-serif'
			}
		},
		states: {
			hover: {
				filter: {
					type: 'darken',
					value: 1
				}
			}
		},
		stroke: {
			show: true,
			width: 0,
			colors: ['transparent']
		},
		grid: {
			show: false,
			strokeDashArray: 4,
			padding: {
				left: 2,
				right: 2,
				top: -14
			}
		},
		dataLabels: {
			enabled: false
		},
		legend: {
			show: true
		},
		xaxis: {
			floating: false,
			labels: {
				show: true,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			},
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			}
		},
		yaxis: {
			show: false
		},
		fill: {
			opacity: 1
		}
	};
</script>

<div class="justify-centerborder flex h-screen w-screen flex-col items-center p-4">
	<fieldset class="fieldset flex w-full justify-center self-center">
		<select class="select">
			<option disabled selected>Last 7 days</option>
			<option>Yesterday</option>
			<option>Today</option>
			<option>Last 7 days</option>
			<option>Last 30 days</option>
			<option>Last 90 days</option>
		</select>
	</fieldset>
	<div class="grid grid-cols-2 gap-4 p-5">
		<dl class="flex items-center">
			<dt class="me-1 text-sm font-normal">Inventory value:</dt>
			<dd class="text-sm font-semibold">$3,232</dd>
		</dl>
		<dl class="flex items-center justify-end">
			<dt class="me-1 text-sm font-normal">Avg monthly sells:</dt>
			<dd class="text-sm font-semibold">$3,232</dd>
		</dl>
	</div>

	<Chart {options} />
</div>
