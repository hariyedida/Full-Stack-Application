import React, { Component } from "react";
import { VscSaveAs } from "react-icons/vsc";
import { FcCancel } from "react-icons/fc";

// editing user details
class EditUserDetails extends Component {
	state = {
		fetchUserDetails: {},
		updateUserData: {},
	};

	getUserDetails = async () => {
		const { editedUserDetails } = this.props;

		const url = `http://localhost:9000/user-details/${editedUserDetails.associateId}`;
		const response = await fetch(url);
		if (response.ok) {
			const fetchedData = await response.json();
			const { userData } = fetchedData;
			const updatedData = {
				associateId: userData[0].associate_id,
				specializationName: userData[0].specialization_name,
				associateName: userData[0].associate_name,
				phone: userData[0].phone,
				address: userData[0].address,
				specializationId: userData[0].specialization_id,
				checked: editedUserDetails.checked,
			};
			console.log("sdaf");

			this.setState({
				fetchUserDetails: updatedData,
				updateUserData: updatedData,
			});
		}
	};

	componentDidMount = () => {
		this.getUserDetails();
	};

	onChangeUserFormDetails = (event) => {
		const { updateUserData } = this.state;
		const editFieldName = event.target.getAttribute("name");
		const editFieldValue = event.target.value;
		const newUserDetails = { ...updateUserData };
		newUserDetails[editFieldName] = editFieldValue;
		this.setState({ updateUserData: newUserDetails });
	};

	saveDetails = async () => {
		const { getAllUserDetails } = this.props;

		console.log("save");
		const { updateUserData } = this.state;
		const { setEditUserId } = this.props;
		const dbData = {
			associate_id: updateUserData.associateId,
			specialization_name: updateUserData.specializationName,
			associate_name: updateUserData.associateName,
			phone: updateUserData.phone,
			address: updateUserData.address,
			specialization_id: updateUserData.specializationId,
		};
		const options = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userData: dbData }),
		};
		const url = `http://localhost:9000/update-user/${updateUserData.associateId}`;
		const response = await fetch(url, options);
		if (response.ok) {
			this.getUserDetails();
			setEditUserId();
			getAllUserDetails();
		} else {
			const { fetchUserDetails } = this.state;
			this.setState({ updateUserData: fetchUserDetails });
			setEditUserId();
		}
	};

	cancelEditUserDetails = () => {
		const { fetchUserDetails } = this.state;
		this.setState({ updateUserData: fetchUserDetails }, fetchUserDetails());
	};

	render() {
		const { updateUserData } = this.state;
		return (
			<tr>
				<td>
					<input type='checkbox' />
				</td>
				<td>{updateUserData.associateId}</td>
				<td>
					<input
						type='text'
						required='*required'
						placeholder='Enter an name...'
						name='associateName'
						value={updateUserData.associateName}
						onChange={this.onChangeUserFormDetails}
					/>
				</td>
				<td>
					<input
						type='text'
						required='*required'
						placeholder='Enter a specialization names...'
						name='specializationName'
						value={updateUserData.specializationName}
						onChange={this.onChangeUserFormDetails}
					/>
				</td>
				<td>
					<input
						type='int'
						required='*required'
						placeholder='Enter phone number...'
						name='phone'
						value={updateUserData.phone}
						onChange={this.onChangeUserFormDetails}
					/>
				</td>
				<td>
					<input
						type='int'
						required='*required'
						placeholder='Enter address...'
						name='address'
						value={updateUserData.address}
						onChange={this.onChangeUserFormDetails}
					/>
				</td>
				<td>
					<button type='button' onClick={this.saveDetails}>
						<VscSaveAs />
					</button>
					<button type='button' onClick={this.cancelEditUserDetails}>
						<FcCancel />
					</button>
				</td>
			</tr>
		);
	}
}

export default EditUserDetails;
