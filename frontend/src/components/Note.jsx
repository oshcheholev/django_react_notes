import React, { useState, useEffect } from "react";
import "../styles/Note.css"
import Modal from "./Modal"
import EditNote from "./EditNote"
import CommentsSection from "./CommentsSection"
import api from "../api";



function Note({ note, onDelete, onNoteUpdated }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [username, setUsername] = useState("");

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

    return (
        <div className="note-container">
            <p className="note-title">{note.title}</p>
            <p className="note-content">{note.content}</p>
            <p className="note-date">{formattedDate}</p>
			<div className="note-author">Author: {note.author_username}</div>
			{note.author_username === username && (
			<div className="note-actions">
				<button className="edit-button" onClick={openEditModal}>
					Edit
				</button>
				<button className="delete-button" onClick={() => onDelete(note.id)}>
					Delete
				</button>

			</div>
			)}
            {/* Comments Section */}
            <CommentsSection 
                noteId={note.id}
                comments={note.comments || []}
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