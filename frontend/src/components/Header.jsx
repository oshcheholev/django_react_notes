
import React, { useState, useEffect } from "react";
import api from "../api";
import Modal from "./Modal";
import CreateNote from "../pages/CreateNote";
import "../styles/Header.css";

function Header({ onNoteCreated }) {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [user, setUser] = useState(null);
	
	useEffect(() => {
		getUser();
	}, []); // Remove user from dependency array to prevent infinite loop
	const openCreateModal = () => {
		setIsCreateModalOpen(true);
	};
	const closeCreateModal = () => {
		setIsCreateModalOpen(false);
	};
	const handleNoteCreated = () => {
		if (onNoteCreated) {
			onNoteCreated(); // Call the prop function to refresh notes
		}
	};
	
	const getUser = () => {
		api.get("/api/user/me/")
			.then((res) => {
				if (res.status === 200) {
					console.log("User data received:", res.data);
					setUser(res.data);
				} else {
					alert("Failed to fetch user.");
				}
			})
			.catch((error) => {
				console.error("Error fetching user:", error);
				// If user fetch fails, might be logged out
				localStorage.clear();
				window.location.href = "/login";
			});
	};

	const logout = () => {
		localStorage.clear();
		window.location.href = "/login";
	};

	const getUserProfile = () => {
		api.get(`/api/user/${user.id}/profile/`).then((res) => {
			if (res.status === 200) {
				setUser(res.data);
			} else {
				alert("Failed to fetch user profile.");
			}
		});
	};

	// const logout = () => {
	// 	api.post("/api/logout/").then((res) => {
	// 		if (res.status === 200) {
	// 			setUser(null);
	// 			localStorage.removeItem(ACCESS_TOKEN);
	// 			localStorage.removeItem(REFRESH_TOKEN);
	// 		}
	// 	});
	// };

	return (
		<div className="notes-header">
			<h2>Notes {user && `- Welcome, ${user.username}!`}</h2>
			<button className="create-button" onClick={openCreateModal}>Create Note</button>
			<button className="logout-button" onClick={logout}>Logout</button>
			<div className="user-profile">
				{user && (
					<span className="user-name">{user.username}</span>
				)}
				{user && (
					<div className="email">
						{user.email || user.userprofile?.email || "No email provided"}
					</div>
				)}

				<img 
					src={
						user?.userprofile?.profile_picture 
							? user.userprofile.profile_picture
							: 'http://localhost:8000/static/images/default-profile.svg'
					} 
					alt="Profile" 
					className="profile-picture"
					onError={(e) => {
						console.log('Image failed to load:', e.target.src);
						// Fallback to a reliable placeholder service
						e.target.src = 'https://placehold.co/40x40/e5e7eb/9ca3af?text=👤';
					}}
				/>
				{user && (
					<button className="profile-button" onClick={getUserProfile}>
						View Profile
					</button>
				)}
			</div>
			
			{/* Create Note Modal */}
			<Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
				<CreateNote 
					onNoteCreated={handleNoteCreated} 
					onClose={closeCreateModal} 
				/>
			</Modal>
		</div>
    );
}
export default Header;