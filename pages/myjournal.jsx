import React, { useState, useEffect, useCallback } from "react";
import { UserAuth } from "../lib/AuthContext";
import { FiLogOut, FiPlus, FiPlusCircle, FiFileText, FiX, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import Calendar from "../components/Calendar/Calendar";
import CalendarTaskList from "../components/Calendar/CalendarTaskList";
import Note from "../components/Note/Note";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getProjectsForUser, getNotesForProject, addProject, addNote, updateProject, updateNote, deleteProject, deleteNote, updateNoteDate } from '../lib/firestore';

export default function MyJournalPage() {
  const { user, logOut } = UserAuth();
  const [ displayName, setDisplayName ] = useState("");
  const [ photoURL, setPhotoURL ] = useState("");
  const [ projects, setProjects ] = useState([]);
  const [ notes, setNotes ] = useState([]);
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [ currentProjectId, setCurrentProjectId ] = useState(null);
  const [ currentProjectTitle, setCurrentProjectTitle ] = useState('Untitled Project');
  const [ currentMonth, setCurrentMonth ] = useState(new Date());
  const noteDates = notes.map(note => new Date(note.date));
  const [ activeNoteId, setActiveNoteId ] = useState(null);
  const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);
  const [ isCalendarBarOpen, setIsCalendarBarOpen ] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setPhotoURL(user.photoURL);

      getProjectsForUser(user.uid)
        .then(fetchedProjects => {
          setProjects(fetchedProjects);
          if (fetchedProjects.length > 0) {
            const firstProject = fetchedProjects[0];
            setCurrentProjectId(firstProject.id);
            setCurrentProjectTitle(firstProject.title);

            return getNotesForProject(user.uid, firstProject.id);
          }
        })
        .then(fetchedNotes => {
          if (fetchedNotes) {
            const sortedNotes = fetchedNotes.sort((a, b) => a.order - b.order);
            setNotes(sortedNotes);
          }
        })
        .catch(error => {
          console.error("Error fetching projects or notes:", error);
        });
    }
  }, [user]);
  
  const handleSignOut = () => {
    try {
      logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCalendarBar = () => {
    setIsCalendarBarOpen(!isCalendarBarOpen);
  };

  const handleAddNote = async () => {
    if (user && currentProjectId) {
      const newNote = {
        projectId: currentProjectId,
        title: "Untitled",
        content: "",
        date: null,
        createdAt: new Date(),
        order: notes.length
      };
      const noteId = await addNote(user.uid, currentProjectId, newNote);
      setNotes([{ ...newNote, id: noteId }, ...notes ]);
    }
  };

  const handleNoteChange = async (noteId, updatedNote) => {
    if (!user) return;
    try {
      await updateNote(user.uid, currentProjectId, noteId, updatedNote);
      setNotes(notes.map(note =>
        note.id === noteId ? { ...note, ...updatedNote } : note
      ));
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleNoteDateUpdate = async (noteId, newDate) => {
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        return { ...note, date: newDate };
      }
      return note;
    }));
    try {
      await updateNoteDate(user.uid, currentProjectId, noteId, newDate);
    } catch (error) {
      console.error("Error updating note date:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(user.uid, currentProjectId, noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleAddProject = async () => {
    if (user) {
      const newProject = {
        userId: user.uid,
        title: "Untitled Project",
        createdAt: new Date(),
        isEditing: false,
      };
      const projectId = await addProject(user.uid, newProject);
      setProjects([...projects, { ...newProject, id: projectId }]);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(user.uid, projectId);
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
  
      if (projectId === currentProjectId) {
        const projectIndex = projects.findIndex(project => project.id === projectId);
        let newSelectedProject;

        if (projectIndex > 0) {
          newSelectedProject = updatedProjects[projectIndex - 1];
        } else if (updatedProjects.length > 0) {
          newSelectedProject = updatedProjects[0];
        }
  
        if (newSelectedProject) {
          setCurrentProjectId(newSelectedProject.id);
          setCurrentProjectTitle(newSelectedProject.title);
          const newNotes = await getNotesForProject(user.uid, newSelectedProject.id);
          setNotes(newNotes);
        } else {
          setCurrentProjectId(null);
          setCurrentProjectTitle('Untitled Project');
          setNotes([]);
        }
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  
  const toggleProjectEditing = (id) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, isEditing: !project.isEditing } : project
    ));
  };

  const updateProjectTitle = async (id, title) => {
    try {
      await updateProject(user.uid, id, { title });
      setProjects(projects.map(project =>
        project.id === id ? { ...project, title } : project
      ));
    } catch (error) {
      console.error("Error updating project title:", error);
    }
  };

  const handleProjectSelect = async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProjectId(projectId);
      setCurrentProjectTitle(project.title);
  
      try {
        const fetchedNotes = await getNotesForProject(user.uid, projectId);
        fetchedNotes.sort((a, b) => a.order - b.order);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching notes for project:", error);
      }
    }
  };
  
  const handleProjectEdit = (projectId) => {
    setProjects(projects.map(project =>
      project.id === projectId ? { ...project, isEditing: true } : project
    ));
  };
  
  
  const handleProjectTitleBlur = async (projectId, title) => {
    if (title.trim() === "") {
      return;
    }
    await updateProjectTitle(projectId, title);
    toggleProjectEditing(projectId);
  };

  const handleProjectTitleChange = (id, title) => {
    setProjects(projects.map(project =>
      project.id === id ? { ...project, title } : project
    ));
    if (id === currentProjectId) {
      setCurrentProjectTitle(title);
    }
  };

  const handleNoteDateSelect = (noteIndex, date) => {
    const updatedNotes = notes.map((note, index) => {
      if (index === noteIndex) {
        return { ...note, date };
      }
      return note;
    });

    setNotes(updatedNotes);
  };

  const moveNote = useCallback((dragIndex, hoverIndex) => {
    if (!user) return;
    const newNotes = [...notes];
    const dragNote = newNotes.splice(dragIndex, 1)[0];
    newNotes.splice(hoverIndex, 0, dragNote);
    setNotes(newNotes);
    newNotes.forEach((note, index) => {
      updateNote(user.uid, currentProjectId, note.id, { ...note, order: index });
    });
  }, [notes, user, currentProjectId]);

  const handleNoteClick = (noteId) => {
    setActiveNoteId(noteId);
  };
  
  return (
    <DndProvider backend={ HTML5Backend }>
      <main className="flex h-screen bg-white ">
        <aside className={`w-60 p-4 bg-stone-50 hover:bg-stone-100 ${isSidebarOpen ? '' : 'hidden lg:block'}`}>
          <div className="flex justify-between">
          <div className="flex mb-2 items-center">
            <img
              src={ photoURL }
              alt="Profile Pic"
              className="w-10 h-10 rounded-full mr-2"
            />
            <span className="font-bold">{ displayName }, welcome</span>
          </div>
          <div className="flex mb-2 items-center cursor-pointer">
            <FiLogOut onClick={ handleSignOut } />
          </div>
          </div>
          <div className="mt-5">
            <div className="flex justify-between mb-3 items-center">
              <p className="text-sm text-gray-600">專案列表</p>
              <FiPlus className="cursor-pointer" onClick={ handleAddProject } />
            </div>
            <div className="projectWrapper">
              { projects.map((project) => (
                <div key={ project.id }
                  className="project flex justify-between items-center mb-2 group"
                >
                  <div className="flex items-center">
                    <FiFileText className="w-5 h-5 mr-1 text-orange-400" />
                    { project.isEditing ? (
                      <input
                        type="text"
                        value={ project.title }
                        onChange={(e) => handleProjectTitleChange(project.id, e.target.value)}
                        onBlur={() => handleProjectTitleBlur(project.id, project.title)}
                        className="w-[160px] outline-orange-400 p-0 m-0 bg-stone-50"
                      />
                    ) : (
                      <p
                        className="cursor-pointer"
                        onClick={() => handleProjectSelect(project.id)}
                        onDoubleClick={() => handleProjectEdit(project.id)}
                      >
                        { project.title }
                      </p>
                    )}
                  </div>
                  < FiX
                    className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    onClick={() => handleDeleteProject(project.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </aside>
        { isSidebarOpen ? (
          <FiChevronLeft onClick={ toggleSidebar } className="lg:hidden my-auto cursor-pointer w-5 h-5 text-gray-500" />
        ) : (
          <FiChevronRight onClick={ toggleSidebar } className="lg:hidden my-auto cursor-pointer w-5 h-5 text-gray-500" />
        )}
        <section className="projectNoteSection flex-grow px-8 py-8 overflow-y-auto scrollbar max-md:px-4">
          { projects.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-2xl font-extralight">Welcome!</p>
                <p className="text-2xl font-extralight">Click + to create a new project.</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between mb-5 items-center">
                <div className="flex">
                  <input
                    type="text"
                    value={ currentProjectTitle }
                    onChange={(e) => handleProjectTitleChange(currentProjectId, e.target.value)}
                    onBlur={() => updateProjectTitle(currentProjectId, currentProjectTitle)}
                    className="text-3xl font-medium outline-orange-400"
                  />
                </div>
                <div>
                  { currentProjectId && (
                    <FiPlusCircle className="w-7 h-7 cursor-pointer text-orange-400 hover:text-orange-300" onClick={ handleAddNote } />
                  )}
                </div>
              </div>
              <div className="noteWrapper">
                { notes
                  .filter((note) => note.projectId === currentProjectId)
                  .map (( note, index ) => (
                    < Note
                      key={ note.id }
                      index={ index }
                      note={ note }
                      date={ note.date }
                      onUpdate={ handleNoteChange }
                      onDelete={() => handleDeleteNote(note.id)}
                      onDateUpdate={ handleNoteDateUpdate }
                      title={ note.title }
                      content={ note.content }
                      onDateSelect={ handleNoteDateSelect }
                      moveNote={ moveNote }
                      onClick={() => handleNoteClick(note.id)}
                      isActive={ activeNoteId === note.id }
                      {...note}
                    />
                ))}
              </div>
            </div>
          )}
        </section>
        <section className={`flex flex-col w-1/7 p-4 border-l border-gray max-md:w-5/12 ${isCalendarBarOpen ? '' : 'hidden md:block'}`}>
          < Calendar
            notes={ notes }
            selectedDate={ selectedDate }
            setSelectedDate={ setSelectedDate }
            defaultDate={ currentMonth }
            noteDates={ noteDates }
            onDateSelect={(date) => {
              setSelectedDate(date);
            }}
            onChangeMonth={ setCurrentMonth }
          />
          <hr />
          <div className="flex-grow overflow-y-auto scrollbar">
            <CalendarTaskList currentMonth={ currentMonth } />
          </div>
        </section>
        { isCalendarBarOpen ? (
          <FiChevronRight onClick={ toggleCalendarBar } className="md:hidden my-auto cursor-pointer w-5 h-5 text-gray-500" />
        ) : (
          <FiChevronLeft onClick={ toggleCalendarBar } className="md:hidden my-auto cursor-pointer w-5 h-5 text-gray-500" />
        )}
      </main>
    </DndProvider>
  );
}