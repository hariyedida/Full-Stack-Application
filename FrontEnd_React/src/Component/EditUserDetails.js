import React, { Component } from "react";
import { VscSaveAs } from "react-icons/vsc";
import { FcCancel } from "react-icons/fc";

// editing user details
class EditUserDetails extends Component {
	state = {
		fetchUserDetails: {},
		updateUserData: {},
		specList: [],
	};

	getUserDetails = async () => {
		const { editedUserDetails } = this.props;

		const url = `http://localhost:9000/user-details/${editedUserDetails.associateId}`;
		const response = await fetch(url);
		if (response.ok) {
			const fetchedData = await response.json();
			const { userData } = fetchedData;
			const updatedData = {
				specializationName: userData[0].specialization,
				associateName: userData[0].associate_name,
				phone: userData[0].phone,
				address: userData[0].address,
				checked: editedUserDetails.checked,
			};

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
		const editFieldValue = event.target.value;
		const newUserDetails = { ...updateUserData };
		const editFieldName = event.target.getAttribute("name");
		if (editFieldName === "specializationName") {
			const id = event.target.id;
			let { specList } = this.state;
			if (event.target.checked) {
				if (!specList.includes(id)) {
					specList.push(parseInt(id));
				}
			} else {
				let result = specList.filter((eachId) => eachId !== parseInt(id));
				specList = [...result];
			}
			this.setState({ specList: [...specList] }, () => {
				newUserDetails[editFieldName] = specList;
			});
		} else {
			newUserDetails[editFieldName] = editFieldValue;
		}
		this.setState({ updateUserData: newUserDetails });
	};

	saveDetails = async () => {
		const { getAllUserDetails } = this.props;
		const { updateUserData } = this.state;
		const { setEditUserId, editedUserDetails } = this.props;
		const dbData = {
			specialization_name: updateUserData.specializationName,
			associate_name: updateUserData.associateName,
			phone: updateUserData.phone,
			address: updateUserData.address,
		};
		const options = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userData: dbData }),
		};
		const url = `http://localhost:9000/update-user/${editedUserDetails.associateId}`;
		console.log(url);

		const response = await fetch(url, options);
		if (response.ok) {
			setEditUserId();
			getAllUserDetails();
		} else {
			const { fetchUserDetails } = this.state;
			this.setState({ updateUserData: fetchUserDetails });
			setEditUserId();
		}
	};

	cancelEditUserDetails = () => {
		const { setEditUserId } = this.props;
		const { fetchUserDetails } = this.state;
		this.setState({ updateUserData: fetchUserDetails }, setEditUserId());
	};

	render() {
		const { specializationsList } = this.props;
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
					<div className='specialization-container'>
						{specializationsList.map((eachSpec) => (
							<div className='specialization-input-container'>
								<input
									key={eachSpec.specializationId}
									type='checkbox'
									name='specializationName'
									id={eachSpec.specializationId}
									value={eachSpec.specializationName}
									onChange={this.onChangeUserFormDetails}
								/>
								<label htmlFor={eachSpec.specializationId}>
									{eachSpec.specializationName}
								</label>
							</div>
						))}
					</div>
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
