import React, { Component } from "react";
import apiStatusConstants from "../API_Status_Constants";
import Loader from "react-loader-spinner";
import UserDetails from "./UserDetails";

class FetchApi extends Component {
	state = {
		apiStaus: apiStatusConstants.initial,
		userList: [],
	};

	componentDidMount = () => {
		this.getAllUserDetails();
	};

	getAllUserDetails = async (searchInput) => {
		this.setState({ apiStatus: apiStatusConstants.inProgress });
		searchInput = searchInput === undefined && "";
		const apiUrl = `http://localhost:9000/users?search=${searchInput}`;
		const response = await fetch(apiUrl);
		if (response.ok === true) {
			const fetchedData = await response.json();
			const { userData } = fetchedData;
			const updatedData = userData.map((eachUser) => ({
				associateId: eachUser.associate_id,
				specializationName: eachUser.specialization_name,
				associateName: eachUser.associate_name,
				phone: eachUser.phone,
				address: eachUser.address,
				specializationId: eachUser.specialization_id,
				checked: false,
			}));

			this.setState({
				apiStatus: apiStatusConstants.success,
				userList: [...updatedData],
			});
		} else {
			this.setState({ apiStatus: apiStatusConstants.failure });
		}
	};

	renderSuccesView = () => {
		const { userList, totalPages } = this.state;
		return (
			<UserDetails
				userList={userList}
				totalPages={totalPages}
				getAllUserDetails={this.getAllUserDetails}
			/>
		);
	};

	renderFailureView = () => (
		<div>
			<p>failure</p>
			<button type='button' onClick={this.getAllUserDetails}>
				Retry
			</button>
		</div>
	);

	renderLoadingView = () => (
		<div className='loader-container'>
			<Loader type='Oval' color='#475569' height='50' width='50' />
		</div>
	);

	renderUI = () => {
		const { apiStatus } = this.state;
		switch (apiStatus) {
			case apiStatusConstants.success:
				return this.renderSuccesView();
			case apiStatusConstants.failure:
				return this.renderFailureView();
			case apiStatusConstants.inProgress:
				return this.renderLoadingView();
			default:
				return null;
		}
	};
	render() {
		return this.renderUI();
	}
}

export default FetchApi;
