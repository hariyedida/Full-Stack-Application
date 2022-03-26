import React, { Component } from "react";
import "./index.css";

class Pagination extends Component {
	state = { pages: [], activePage: 1 };

	componentWillReceiveProps = () => {
		this.setPages();
	};

	setPages = () => {
		let { totalPages, activePage } = this.props;
		[totalPages, activePage] = [totalPages, activePage].map(Number);
		let updatePages = [];

		if (totalPages > 5) {
			switch (true) {
				case activePage >= 1 && activePage < 3:
					for (var j = 1; j < 6; j++) {
						updatePages.push(j);
					}
					break;
				case activePage - 2 > 0 && activePage < totalPages - 3:
					for (var i = activePage - 2; i < activePage + 3; i++) {
						if (i <= totalPages) {
							updatePages.push(i);
						}
					}
					break;
				default:
					for (var k = totalPages - 4; k <= totalPages; k++) {
						if (k <= totalPages) {
							updatePages.push(k);
						}
					}
					break;
			}
		} else {
			updatePages = [...Array(totalPages).keys()];
			updatePages = updatePages.map((eachPage) => eachPage + 1);
		}
		this.setState({ pages: [...updatePages], activePage });
	};

	updatePageChange = (event) => {
		this.setPages();
		const { handlePageChange } = this.props;
		handlePageChange(event);
	};

	PaginationItems = () => {
		const { pages, activePage } = this.state;
		let { totalPages } = this.props;

		const renderPagesList = pages.map((eachPage) => {
			const activePageClass =
				eachPage === parseInt(activePage, 10) ? "active" : " ";
			return (
				<li className={activePageClass} key={eachPage}>
					<button
						type='button'
						onClick={this.updatePageChange}
						className='pagination-button'
						value={eachPage}
					>
						{eachPage}
					</button>
				</li>
			);
		});

		let displayPages = <></>;
		switch (true) {
			case totalPages > 5 && activePage < totalPages - 3 && activePage > 3:
				displayPages = (
					<>
						<li>...</li>
						{renderPagesList}
						<li>...</li>
					</>
				);
				break;
			case totalPages > 5 && activePage > 3:
				displayPages = (
					<>
						<li>...</li>
						{renderPagesList}
					</>
				);
				break;
			case totalPages > 5 && activePage < totalPages - 3:
				displayPages = (
					<>
						{renderPagesList}
						<li>...</li>
					</>
				);
				break;
			default:
				displayPages = renderPagesList;
				break;
		}

		return (
			<ul>
				<li>
					<button
						type='button'
						onClick={this.updatePageChange}
						value={"<<"}
						className='pagination-button'
					>{`<<`}</button>
				</li>
				<li>
					<button
						type='button'
						onClick={this.updatePageChange}
						className='pagination-button'
						value={"<"}
					>{`<`}</button>
				</li>
				{displayPages}
				<li>
					<button
						type='button'
						onClick={this.updatePageChange}
						className='pagination-button'
						value={">"}
					>{`>`}</button>
				</li>
				<li>
					<button
						type='button'
						onClick={this.updatePageChange}
						className='pagination-button'
						value={">>"}
					>{`>>`}</button>
				</li>
			</ul>
		);
	};

	render() {
		return this.PaginationItems();
	}
}

export default Pagination;
