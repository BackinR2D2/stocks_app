import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Loader from '../../components/Loader';
import Swal from 'sweetalert2';

// https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?serietype=line&apikey=${process.env.REACT_APP_STOCKS_API_KEY}

function StockDetails() {
	const { symbol } = useParams();
	const [companyData, setCompanyData] = useState({});
	const [loading, setLoading] = useState(true);
	const [options, setOptions] = useState({});

	useEffect(() => {
		getChartData();
		getCompanyData();
	}, []);

	const shortenValue = (value) => {
		const suffixes = ['', 'K', 'M', 'B', 'T'];
		const suffixNum = Math.floor(('' + value).length / 3);
		let shortValue = parseFloat(
			(suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
				2
			)
		);
		if (shortValue % 1 !== 0) {
			shortValue = shortValue.toFixed(1);
		}
		return shortValue + suffixes[suffixNum];
	};

	const getCompanyData = async () => {
		try {
			const { data } = await axios.get(
				`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${process.env.REACT_APP_STOCKS_API_KEY}`
			);
			setLoading(false);
			setCompanyData(data[0]);
		} catch (error) {
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: 'Some error occured while trying to fetch the company data. Try again later.',
				position: 'center',
			});
		}
	};

	const getChartData = async () => {
		try {
			const { data } = await axios.get(
				`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${process.env.REACT_APP_STOCKS_API_KEY}`
			);
			let values = [];
			data.historical
				.sort((a, b) => a.date < b.date)
				.reverse()
				.forEach((value) => {
					let timestampDate = value.date;
					timestampDate = timestampDate.split('-');
					timestampDate = new Date(
						timestampDate[0],
						timestampDate[1] - 1,
						timestampDate[2]
					);
					values.push([timestampDate.getTime(), value.close]);
				});
			setOptions({
				title: {
					text: `${symbol} Chart`,
				},
				xAxis: {
					type: 'datetime',
				},
				series: [
					{
						type: 'line',
						name: `${symbol} price`,
						data: values,
					},
				],
			});
		} catch (error) {
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: 'Some error occured while trying to fetch the chart data. Try again later.',
				position: 'center',
			});
		}
	};

	return (
		<div>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className='companyData'>
						<div className='companyLogoWrapper'>
							<img
								src={companyData && companyData.image}
								alt='companyImage'
								width={'250px'}
								height={'250px'}
								style={{ objectFit: 'none' }}
							/>
						</div>
						<h3 className='companyName' style={{ textAlign: 'center' }}>
							{companyData.companyName}{' '}
							<span className='companyExchange'>
								({companyData.exchange} - {companyData.exchangeShortName}
							</span>
							)
						</h3>
						<h5 className='companyCEO' style={{ textAlign: 'center' }}>
							CEO: {companyData.ceo}
						</h5>
						<div className='companyDetails' style={{ marginTop: '4%' }}>
							<p className='companyIndustry'>
								Industry: {companyData.industry}
							</p>
							<p className='companySector'>Sector: {companyData.sector}</p>
						</div>
						<div className='companyDetails'>
							<p className='companyCountry'>Based in {companyData.country}</p>
							<p className='companyEmployees'>
								Number of full-time employees: {companyData.fullTimeEmployees}
							</p>
						</div>
						<div className='companyDetails'>
							<p className='companMarketCap'>
								Market Cap: {shortenValue(companyData.mktCap)} USD
							</p>
							<a
								className='companyWebsite'
								href={companyData.website}
								target='_blank'
								rel='noreferrer'
							>
								{companyData.website}
							</a>
						</div>
						<p className='companyDescription'>{companyData.description}</p>
					</div>
					<HighchartsReact
						highcharts={Highcharts}
						constructorType={'stockChart'}
						options={options}
					/>
				</>
			)}
		</div>
	);
}

export default StockDetails;
