import React, { Component } from "react";
import apiStatusConstants from "../API_Status_Constants";
import Loader from "react-loader-spinner";
import UserDetails from "./UserDetails";

class FetchApi extends Component {
	state = {
		apiStaus: apiStatusConstants.initial,
		userList: [],
		specializations: [],
	};

	componentDidMount = () => {
		this.getAllUserDetails();
	};

	getSpecializations = async () => {
		this.setState({ apiStatus: apiStatusConstants.inProgress });

		const apiUrl = `http://localhost:9000/specializations`;
		const response = await fetch(apiUrl);

		if (response.ok === true) {
			const fetchedData1 = await response.json();
			const { specialization } = fetchedData1;
			const updatedSpeciList = specialization.map((eachSpec) => ({
				specializationId: eachSpec.specialization_id,
				specializationName: eachSpec.specialization_name,
			}));
			this.setState({
				specializations: updatedSpeciList,
				apiStatus: apiStatusConstants.success,
			});
		} else {
			this.setState({ apiStatus: apiStatusConstants.failure });
		}
	};

	getAllUserDetails = async (searchInput) => {
		this.setState({ apiStatus: apiStatusConstants.inProgress });
		let searchInputQuery = searchInput === undefined ? "" : searchInput;
		const apiUrl = `http://localhost:9000/users?search=${searchInputQuery}`;
		const response = await fetch(apiUrl);
		if (response.ok === true) {
			const fetchedData = await response.json();
			const { userData } = fetchedData;
			const updatedData = userData.map((eachUser) => ({
				associateId: eachUser.associate_id,
				specializationName: eachUser.specialization,
				associateName: eachUser.associate_name,
				phone: eachUser.phone,
				address: eachUser.address,
				checked: false,
			}));

			this.setState(
				{
					apiStatus: apiStatusConstants.success,
					userList: [...updatedData],
				},
				this.getSpecializations
			);
		} else {
			this.setState({ apiStatus: apiStatusConstants.failure });
		}
	};

	renderSuccesView = () => {
		const { userList, specializations } = this.state;
		return (
			<UserDetails
				userList={userList}
				specializationsList={specializations}
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
