import React, { useState, useEffect } from "react";
import "../styles/Note.css"
import Modal from "./Modal"
import EditNote from "./EditNote"
import CommentsSection from "./CommentsSection"
import api from "../api";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";



function Note({ note, onDelete, onNoteUpdated }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [username, setUsername] = useState("");
	const [showComments, setShowComments] = useState(false);

	useEffect(() => {
			// getNotes();
			getCurrentUser();
		}, []);
	const openEditModal = () => {
		setIsEditModalOpen(true);
	};

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleNoteUpdated = () => {
        if (onNoteUpdated) {
            onNoteUpdated(); // Refresh the notes list in parent component
        }
    };

	const toggleComments = () => {
		setShowComments(!showComments);
	};
//	const current_user = use("/api/user/me/");

	const getCurrentUser = () => {
        api
            .get("/api/user/me/")
            .then((res) => res.data)
            .then((data) => {
                setUsername(data.username);
                // console.log("User:", data);
            })
            .catch((err) => console.error("Error fetching user:", err));
    };

    const handleLike = async (noteId) => {
        try {
            const response = await api.post(`/api/notes/${noteId}/toggle-like/`);
            console.log("Like response:", response.data);
            // Refresh the notes to get updated like counts
            if (onNoteUpdated) {
                onNoteUpdated();
            }
        } catch (error) {
            console.error("Error liking note:", error);
        }
    };

    return (
        <div className="note-container">
            {/* Note Header */}
            <div className="note-header">
                <div className="note-author">Author: {note.author_username}</div>
                <div className="note-date">{formattedDate}</div>
            </div>
            
            {/* Note Content */}
            <div className="note-title">{note.title}</div>
            <div className="note-content">{note.content}</div>
			
            {/* Action Buttons */}
			<div className="note-actions">
				<button className="comments-toggle" onClick={toggleComments} title="Toggle Comments">
					<FaRegCommentDots /> {note.comments?.length || 0}
				</button>
				<button 
					className={`like-button ${note.is_liked_by_user ? 'liked' : ''}`} 
					onClick={() => handleLike(note.id)} 
					title="Like Note"
				>
					<AiFillLike /> {note.likes_count || 0}
				</button>
				{note.author_username === username && (
					<>
						<button className="edit-button" onClick={openEditModal} title="Edit Note">
							<AiFillEdit /> Edit
						</button>
						<button className="delete-button" onClick={() => onDelete(note.id)} title="Delete Note">
							<AiFillDelete /> Delete
						</button>
					</>
				)}
			</div>
            
            {/* Comments Section */}
            <CommentsSection 
                noteId={note.id}
                comments={note.comments || []}
				showComments={showComments}
                onCommentsUpdate={handleNoteUpdated}
            />
            
            {/* Edit Note Modal */}
            <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
                <EditNote 
                    note={note}
                    onNoteUpdated={handleNoteUpdated} 
                    onClose={closeEditModal} 
                />
            </Modal>
        </div>
    );
}

export default Note