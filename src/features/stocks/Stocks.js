import { React, useEffect, useRef, useState } from 'react';
import { Form, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
	getStocksList,
	getMoreStocks,
	searchStock,
	addStock,
} from './stocksSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../../components/Loader';

function Stocks() {
	let typingTimer = useRef(null);
	const { loading, tempStocksList, listIndex } = useSelector(
		(state) => state.stocks
	);
	const { userCurrency, prevUserCurrency } = useSelector(
		(state) => state.currency
	);
	const dispatch = useDispatch();
	const [favouriteStocks, setFavouriteStocks] = useState(
		JSON.parse(localStorage.getItem('favouriteStocksList')) || []
	);

	useEffect(() => {
		dispatch(getStocksList());
	}, []);

	useEffect(() => {
		convert(prevUserCurrency, userCurrency);
	}, [userCurrency]);

	const fetchMoreStocks = () => {
		console.log('Fetch more');
		setTimeout(() => {
			dispatch(getMoreStocks({ listIndex: listIndex + 1 }));
		}, 1500);
	};

	const convert = async (from, to) => {
		const values = [];
		for (let stock of favouriteStocks) {
			const obj = {};
			const convertedPrice = await axios.get(
				`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${stock.price}`
			);
			Object.assign(obj, stock);
			obj.price = convertedPrice.data.result.toFixed(2);
			values.push(obj);
		}
		setFavouriteStocks(values);
	};

	const handleStockSearch = (e) => {
		clearTimeout(typingTimer.current);
		const searchQuery = e.target.value;
		typingTimer.current = setTimeout(() => {
			dispatch(searchStock(searchQuery));
		}, 500);
	};

	const addStockToFavourites = (stock) => {
		if (!localStorage.getItem('favouriteStocksList')) {
			localStorage.setItem('favouriteStocksList', JSON.stringify([]));
		}
		const isFound = favouriteStocks.find((s) => s.symbol === stock.symbol);
		if (isFound) {
			Swal.fire({
				title: 'Error',
				icon: 'error',
				toast: true,
				text: `${stock.symbol} is already in the list.`,
				position: 'top-right',
				timer: 2000,
			});
		} else {
			setFavouriteStocks([...favouriteStocks, stock]);
			const currentList = JSON.parse(
				localStorage.getItem('favouriteStocksList')
			);
			currentList.push(stock);
			localStorage.setItem('favouriteStocksList', JSON.stringify(currentList));
			Swal.fire({
				title: 'Success',
				icon: 'success',
				toast: true,
				text: `${stock.symbol} has successfully been added to the list.`,
				position: 'top-right',
				timer: 2000,
			});
		}
	};

	const removeStockFromFavourites = (symbol) => {
		const favouriteStocksList = JSON.parse(
			localStorage.getItem('favouriteStocksList')
		);
		const modifiedFavouriteStocksList = favouriteStocksList.filter(
			(stock, index) => stock.symbol !== symbol
		);
		localStorage.setItem(
			'favouriteStocksList',
			JSON.stringify(modifiedFavouriteStocksList)
		);
		setFavouriteStocks(modifiedFavouriteStocksList);
	};

	const goToTop = () => {
		window.scroll({ top: 0, left: 0, behavior: 'smooth' });
	};

	return (
		<div className='Stocks'>
			{favouriteStocks.length !== 0 ? (
				<div>
					<div className='favouriteStocks'>
						<h3 className='favouriteStocksHeader'>Favourite Stocks</h3>
						<div className='stocks' key='uniqueDiv'>
							{favouriteStocks.map((stock, index) => (
								<Card
									id={`favouriteStock-${stock.symbol}`}
									style={{ margin: '0 auto', textAlign: 'center' }}
									key={stock.symbol}
								>
									<Card.Body>
										<Link to={`/stocks/${stock.symbol}`}>
											<Card.Title className='stockTitle'>
												{stock.symbol}
											</Card.Title>
										</Link>
										<Card.Subtitle className='mb-2 text-muted'>
											{stock.name}
										</Card.Subtitle>
										<hr />
										<Card.Text>
											Share price {stock.price} {userCurrency}
										</Card.Text>
										<Card.Text>
											{stock.exchange} - {stock.exchangeShortName}
										</Card.Text>
										<div>
											<Button
												variant='outline-danger'
												onClick={() => removeStockFromFavourites(stock.symbol)}
											>
												Delete from favourites
											</Button>
										</div>
									</Card.Body>
								</Card>
							))}
						</div>
					</div>
					<hr />
				</div>
			) : (
				<></>
			)}
			<div
				className='stocksInput'
				style={{ padding: favouriteStocks.length === 0 ? '8% 2% 4% 2%' : '4%' }}
			>
				<Form.Control
					type='text'
					id='stocksSearchInput'
					placeholder="Search stock by it's name or company name"
					onKeyUp={handleStockSearch}
					disabled={loading}
				/>
			</div>
			{loading ? (
				<Loader />
			) : (
				<div>
					<InfiniteScroll
						dataLength={tempStocksList.length}
						next={fetchMoreStocks}
						hasMore={true}
						className='stocks'
					>
						{tempStocksList.length === 0 ? (
							<div className='notFound'>No stocks found</div>
						) : (
							tempStocksList.map((stock, index) => (
								<Card
									style={{
										margin: '0 auto',
										textAlign: 'center',
									}}
									key={index}
								>
									<Card.Body>
										<Link to={`/stocks/${stock.symbol}`}>
											<Card.Title className='stockTitle'>
												{stock.symbol}
											</Card.Title>
										</Link>
										<Card.Subtitle className='mb-2 text-muted'>
											{stock.name}
										</Card.Subtitle>
										<hr />
										<Card.Text>Share price {stock.price} USD</Card.Text>
										<Card.Text>
											{stock.exchange} - {stock.exchangeShortName}
										</Card.Text>
										<div>
											<Button
												variant='outline-secondary'
												onClick={() => addStockToFavourites(stock)}
											>
												Add to favourites
											</Button>
										</div>
									</Card.Body>
								</Card>
							))
						)}
					</InfiniteScroll>
					<div className='scrollToTop'>
						<Button variant='primary' onClick={goToTop}>
							Go to top
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Stocks;
