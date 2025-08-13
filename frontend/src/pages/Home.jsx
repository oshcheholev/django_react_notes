import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note"
import Modal from "../components/Modal"
import CreateNote from "./CreateNote"
import "../styles/Home.css"
import Header from "../components/Header";

function Home() {
    const [notes, setNotes] = useState([]);
    const [username, setUsername] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        getNotes();
        getCurrentUser();
    }, []);

	

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => {
                console.log("Notes response:", res.data);
                setNotes(res.data);
            })
            .catch((err) => {
                console.error("Error fetching notes:", err);
                alert("Failed to fetch notes");
            });
    };

    const getCurrentUser = () => {
        api
            .get("/api/user/me/")
            .then((res) => res.data)
            .then((data) => {
                setUsername(data.username);
                console.log("User:", data);
            })
            .catch((err) => console.error("Error fetching user:", err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
					// alert("Note deleted!");
                } else {
                    alert("Failed to delete note.");
                }
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const editNote = (id, updatedContent, updatedTitle) => {
        api
            .put(`/api/notes/edit/${id}/`, { content: updatedContent, title: updatedTitle })
            .then((res) => {
                if (res.status === 200) {
					// alert("Note updated!");
                } else {
                    alert("Failed to update note.");
                }
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleNoteCreated = () => {
        getNotes(); // Refresh the notes list
    };

    return (
        <div>
            <Header onNoteCreated={handleNoteCreated} />
			<div className="notes-section">
                {notes.map((note) => (
                    <Note 
                        note={note} 
                        onDelete={deleteNote} 
                        onNoteUpdated={handleNoteCreated}
                        key={note.id} 
                    />
                ))}
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

export default Home;