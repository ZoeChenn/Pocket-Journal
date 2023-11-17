import React, { useState, useEffect } from "react";
import { UserAuth } from "../lib/AuthContext";
import { FiLogOut, FiPlus, FiPlusCircle, FiFileText, FiX } from 'react-icons/fi';
import Calendar from "../components/Calendar/Calendar";
import Note from "../components/Note/Note";

export default function MyJournalPage() {
  const { user, logOut } = UserAuth();
  const [ displayName, setDisplayName ] = useState("");
  const [ photoURL, setPhotoURL ] = useState("");
  const [ notes, setNotes ] = useState([]);
  const [ projects, setProjects ] = useState([]);
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [ currentProjectId, setCurrentProjectId ] = useState(null);
  const [ currentProjectTitle, setCurrentProjectTitle ] = useState('Untitled Project');
  const [ isFirstVisit, setIsFirstVisit ] = useState(true);
  const noteDates = notes.map(note => new Date(note.date));

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setPhotoURL(user.photoURL);
      
      const savedProjects = localStorage.getItem('projects');
      if (!savedProjects) {
        setIsFirstVisit(true);
      } else {
        setProjects(JSON.parse(savedProjects));
        setCurrentProjectId(JSON.parse(savedProjects)[0]?.id);
        setIsFirstVisit(false);
      }
    }
  }, [user]);

  const handleSignOut = () => {
    try {
      logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      title: "Untitled",
      projectId: currentProjectId,
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((note, i) => i !== index);
    setNotes(updatedNotes);
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      title: "Untitled Project",
      isEditing: false,
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));

    if (localStorage.getItem('firstVisit') === 'true') {
      setCurrentProjectId(newProject.id);
      localStorage.removeItem('firstVisit');
    }
  };

  const handleDeleteProject = (projectId) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  
    if (currentProjectId === projectId) {
      setCurrentProjectId(null);
      setCurrentProjectTitle('Untitled Project');
    }
  };
  
  const handleClickProject = (projectId) => {
    setCurrentProjectId(projectId);
  };

  const toggleProjectEditing = (id) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, isEditing: !project.isEditing } : project
    ));
  };

  const updateProjectTitle = (id, title) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, title } : project
    ));
  };

  const handleProjectTitleClick = (id) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProjectId(id);
      setCurrentProjectTitle(project.title);
      toggleProjectEditing(id);
    }
  };

  const handleProjectTitleChange = (id, title) => {
    setCurrentProjectTitle(title);
    updateProjectTitle(id, title);
  };

  return (
    <main className="flex h-screen bg-white ">
      <aside className="w-60 p-4 bg-stone-50 hover:bg-stone-100">
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
            <p className="text-sm text-gray-600">我的專案</p>
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
                      onBlur={() => toggleProjectEditing(project.id)}
                      className="w-[160px] outline-dashed outline-orange-400 border-none p-0 m-0 bg-stone-50"
                    />
                  ) : (
                    <p
                      className="cursor-pointer"
                      onDoubleClick={() => toggleProjectEditing(project.id)}
                      onClick={() => handleProjectTitleClick(project.id)}
                    >
                      { project.title }
                    </p>
                  )}
                </div>
                <FiX
                  className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                  onClick={() => handleDeleteProject(project.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </aside>
      <section className="projectNoteSection flex-grow p-8 overflow-y-auto">
        { projects.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-2xl font-extralight">Welcome!</p>
              <p className="text-2xl font-extralight">Click + to create a new project.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between mb-2 items-center">
              <div className="flex">
                <p className="text-2xl font-light mr-2">我的專案</p>
                <p className="text-2xl font-medium">{ currentProjectTitle }</p>
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
                  <Note
                    key={ note.id }
                    index={ index }
                    onDelete={ handleDeleteNote }
                    title={ note.title }
                    content={ note.content }
                  />
              ))}
            </div>
          </div>
        )}
      </section>
      <section className="flex flex-col w-1/7 p-4 border-l border-gray">
        <Calendar
          selectedDate={ selectedDate }
          setSelectedDate={ setSelectedDate }
          defaultDate={ new Date() }
          noteDates={ noteDates }
          onDateSelect={(date) => {
            setSelectedDate(date);
          }}
        />
        <div className="flex-grow overflow-y-auto">
          <h2 className="text-lg font-bold my-4">Tasks</h2>
        </div>
      </section>
    </main>
  );
}