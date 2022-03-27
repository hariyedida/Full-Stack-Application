import "./index.css";

import { Component } from "react";
import EditUserDetails from "../EditUserDetails";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { VscSaveAs } from "react-icons/vsc";
import { FcCancel } from "react-icons/fc";

class UserDetails extends Component {
	state = {
		userList: this.props.userList,
		specializationsList: this.props.specializationsList,
		isCheckedAllUsers: false,
		checkedUserIdDict: {},
		editUserDataId: null,
		createNewUserForm: false,
		searchInput: "",
		deletedUserItems: [],
		newUserDetails: {
			specializationName: [],
			associateName: "",
			phone: null,
			address: "",
		},
		specList: [],
	};

	createNewUser = () => {
		this.setState({ createNewUserForm: true });
	};

	onChangeUserFormDetails = (event) => {
		const { newUserDetails } = this.state;
		const editFieldValue = event.target.value;
		const editFieldName = event.target.getAttribute("name");
		const newUserDetailsEdit = { ...newUserDetails };
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
				newUserDetailsEdit[editFieldName] = specList;
			});
		} else {
			newUserDetailsEdit[editFieldName] = editFieldValue;
		}

		this.setState({ newUserDetails: newUserDetailsEdit });
	};

	saveEditedUserDetails = async () => {
		const { getAllUserDetails } = this.props;
		const { newUserDetails } = this.state;
		const dbData = {
			specialization_name: newUserDetails.specializationName,
			associate_name: newUserDetails.associateName,
			phone: newUserDetails.phone,
			address: newUserDetails.address,
		};
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userData: dbData }),
		};
		const url = `http://localhost:9000/add-user`;
		const response = await fetch(url, options);
		if (response.ok) {
			getAllUserDetails();
		} else {
			getAllUserDetails();
		}
	};

	cancelNewUserDetails = () => {
		this.setState({ createNewUserForm: false });
	};

	setEditUserId = () => {
		this.setState({ editUserDataId: null });
	};

	getSearchResults = async () => {
		const { searchInput } = this.state;
		const { getAllUserDetails } = this.props;
		getAllUserDetails(searchInput);
	};

	onChangeSearchInput = (event) => {
		this.setState({ searchInput: event.target.value });
	};

	onClickClearSearch = () => {
		const { getAllUserDetails } = this.props;
		this.setState({ searchInput: "" }, getAllUserDetails());
	};

	selectAllusers = () => {
		const { userList } = this.state;
		this.setState(
			(prevState) => {
				return {
					userList: userList.map((eachUser) => ({
						...eachUser,
						checked: !prevState.isCheckedAllUsers,
					})),
				};
			},
			() => {
				// console.log("asdf");
			}
		);
	};

	handleAllCheckInput = () => {
		this.setState((prevState) => {
			return {
				isCheckedAllUsers: !prevState.isCheckedAllUsers,
			};
		}, this.selectAllusers());
	};

	updateAllSelectCheckBox = () => {
		const { userList } = this.state;
		const allSelected = userList.map((eachUser) => eachUser.checked);
		const allEqual = (arr) => arr.every((val) => val === true);

		if (allEqual(allSelected)) {
			this.setState({ isCheckedAllUsers: true });
		} else {
			this.setState({ isCheckedAllUsers: false });
		}
	};

	handleCheckInput = (event) => {
		const id = event.target.id;
		this.setState((prevState) => {
			return {
				userList: prevState.userList.map((eachUser) => {
					return eachUser.associateId === parseInt(id)
						? { ...eachUser, checked: !eachUser.checked }
						: eachUser;
				}),
			};
		}, this.updateAllSelectCheckBox);
	};

	deleteUserDetailsFromDb = async () => {
		const { getAllUserDetails } = this.props;
		const { deletedUserItems, searchInput } = this.state;
		const deleteIds = deletedUserItems.map(
			(eachUser) => eachUser.associateId
		);
		const options = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ deleteIds: deleteIds }),
		};
		const url = `http://localhost:9000/delete-user`;
		console.log(url);
		const response = await fetch(url, options);
		if (response.ok) {
			getAllUserDetails(searchInput);
		} else {
			getAllUserDetails(searchInput);
		}
	};

	deleteSelectedUsers = () => {
		this.setState((prevState) => {
			return {
				isCheckedAllUsers: false,
				deletedUserItems: [
					...prevState.userList.filter((eachUser) => {
						return eachUser.checked === true;
					}),
				],
			};
		}, this.deleteUserDetailsFromDb);
	};

	onClickDeleteUserDetails = async (id) => {
		const { getAllUserDetails } = this.props;
		const { searchInput } = this.state;
		const options = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ deleteIds: [id] }),
		};
		const url = `http://localhost:9000/delete-user`;
		const response = await fetch(url, options);
		if (response.ok) {
			getAllUserDetails(searchInput);
		} else {
			getAllUserDetails(searchInput);
		}
	};

	onClickEditUserDetails = (userDetails) => {
		console.log(userDetails);
		this.setState({
			editUserDataId: userDetails.associateId,
			updateUserData: { ...userDetails },
		});
	};

	render() {
		const { getAllUserDetails } = this.props;
		const {
			createNewUserForm,
			newUserDetails,
			userList,
			searchInput,
			isCheckedAllUsers,
			editUserDataId,
			specializationsList,
		} = this.state;

		return (
			<div className='admin-ui'>
				<div className='user-field-search-input-container'>
					<input
						type='search'
						value={searchInput}
						onChange={this.onChangeSearchInput}
						placeholder='search by associate name'
						className='user-field-search-input'
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								this.getSearchResults();
							}
						}}
					/>
					<button
						type='button'
						onClick={this.onClickClearSearch}
						className='user-field-clear-search-button'
					>
						clear
					</button>
				</div>
				<table>
					<thead>
						<tr>
							<th>
								<input
									type='checkbox'
									id='all'
									value='all'
									checked={isCheckedAllUsers}
									onChange={this.handleAllCheckInput}
								/>
							</th>
							<th>ID</th>
							<th>Name</th>
							<th>Specializations</th>
							<th>phone</th>
							<th>address</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{userList.length > 0 ? (
							<>
								{userList.map((eachUser) => {
									return editUserDataId === eachUser.associateId ? (
										<EditUserDetails
											key={eachUser.associateId}
											editedUserDetails={eachUser}
											setEditUserId={this.setEditUserId}
											getAllUserDetails={getAllUserDetails}
											specializationsList={specializationsList}
										/>
									) : (
										<tr
											key={eachUser.associateId}
											htmlFor={eachUser.associateId}
										>
											<td className='check-box-input-field'>
												<input
													type='checkbox'
													id={eachUser.associateId}
													value={eachUser.associateId}
													checked={eachUser.checked}
													onChange={(e) => {
														this.handleCheckInput(e);
													}}
													className=''
												/>
											</td>
											<td>{eachUser.associateId}</td>
											<td>{eachUser.associateName}</td>
											<td>{eachUser.specializationName}</td>
											<td>{eachUser.phone}</td>
											<td>{eachUser.address}</td>
											<td>
												<div>
													<button
														type='button'
														onClick={() => {
															this.onClickEditUserDetails(
																eachUser
															);
														}}
													>
														<FiEdit />
													</button>
													<button
														type='button'
														onClick={() => {
															this.onClickDeleteUserDetails(
																eachUser.associateId
															);
														}}
													>
														<AiOutlineDelete
															style={{ color: "red" }}
														/>
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</>
						) : (
							<tr>
								<td>No results</td>
							</tr>
						)}
						{createNewUserForm && (
							<tr>
								<td>
									<input type='checkbox' />
								</td>
								<td> </td>
								<td>
									<input
										type='text'
										required='*required'
										placeholder='Enter an name...'
										name='associateName'
										value={newUserDetails.associateName}
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
										value={newUserDetails.phone}
										onChange={this.onChangeUserFormDetails}
									/>
								</td>
								<td>
									{/* read user edit details */}
									<input
										type='int'
										required='*required'
										placeholder='Enter address...'
										name='address'
										value={newUserDetails.address}
										onChange={this.onChangeUserFormDetails}
									/>
								</td>
								<td>
									{/* button to save the edited details */}
									<button
										type='button'
										onClick={this.saveEditedUserDetails}
									>
										<VscSaveAs />
									</button>

									{/* button to cancel the editing without saving the details */}
									<button
										type='button'
										onClick={this.cancelNewUserDetails}
									>
										<FcCancel />
									</button>
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<div className='delete-use-details-button-container'>
					<button
						type='button'
						onClick={this.deleteSelectedUsers}
						className='delete-user-details-button'
					>
						Delete Selected
					</button>

					<button
						type='button'
						onClick={this.createNewUser}
						className='create-user-details-button'
					>
						Create User
					</button>
				</div>
			</div>
		);
	}
}

export default UserDetails;
