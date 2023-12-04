import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";


export const getProjectsForUser = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  const projectsColRef = collection(userDocRef, "projects");
  const querySnapshot = await getDocs(projectsColRef);
  const projects = [];
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, ...doc.data() });
  });
  return projects;
};

export const getNotesForProject = async (userId, projectId) => {
  const projectDocRef = doc(db, "users", userId, "projects", projectId);
  const notesColRef = collection(projectDocRef, "notes");
  const querySnapshot = await getDocs(notesColRef);
  const notes = [];
  querySnapshot.forEach((doc) => {
    const noteData = doc.data();
    const date = noteData.date instanceof Timestamp ? noteData.date.toDate() : noteData.date;
    notes.push({ id: doc.id, ...noteData, date });
  });
  return notes;
};

export const addProject = async (userId, projectData) => {
  const userDocRef = doc(db, "users", userId);
  const projectsColRef = collection(userDocRef, "projects");
  const docRef = await addDoc(projectsColRef, projectData);
  return docRef.id;
}

export const addNote = async (userId, projectId, noteData) => {
  const projectDocRef = doc(db, "users", userId, "projects", projectId);
  const notesColRef = collection(projectDocRef, "notes");
  const docRef = await addDoc(notesColRef, { ...noteData, order: noteData.order });
  return docRef.id;
}

export const updateProject = async (userId, projectId, updateData) => {
  const projectDocRef = doc(db, "users", userId, "projects", projectId);
  await updateDoc(projectDocRef, updateData);
};

export const updateNote = async (userId, projectId, noteId, updateData) => {
  const noteDocRef = doc(db, "users", userId, "projects", projectId, "notes", noteId);
  await updateDoc(noteDocRef, updateData);
};

export const deleteProject = async (userId, projectId) => {
  const projectDocRef = doc(db, "users", userId, "projects", projectId);
  await deleteDoc(projectDocRef);
};

export const deleteNote = async (userId, projectId, noteId) => {
  const noteDocRef = doc(db, "users", userId, "projects", projectId, "notes", noteId);
  await deleteDoc(noteDocRef);
};

export const updateNoteDate = async (userId, projectId, noteId, newDate) => {
  const noteDocRef = doc(db, "users", userId, "projects", projectId, "notes", noteId);
  await updateDoc(noteDocRef, { date: newDate });
};