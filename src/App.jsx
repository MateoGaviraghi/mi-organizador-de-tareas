import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import {
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  ListTodo,
  ChevronRight,
  TrendingUp,
  Layers,
  Check,
  ChevronDown,
  Clock,
  Layout,
  Cloud,
  Loader2,
} from "lucide-react";

/**
 * Componente TaskItem optimizado para gestión en la nube.
 */
const TaskItem = ({
  task,
  isCompact,
  toggleTask,
  deleteTask,
  assignDay,
  unassignDay,
  toggleExpand,
  isExpanded,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  newSubtaskValue,
  setNewSubtaskValue,
  daysOfWeek,
  progress,
  activeMenuId,
  setActiveMenuId,
}) => {
  const isMenuOpen = activeMenuId === task.id;

  return (
    <div
      className={`group rounded-2xl border transition-all duration-200 mb-3 ${isCompact ? "bg-white border-slate-100 shadow-sm" : "bg-white border-slate-200 shadow-sm hover:border-indigo-200"}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            <button
              onClick={() => toggleTask(task)}
              className={`${task.completed ? "text-indigo-500" : "text-slate-300"} transition-colors shrink-0`}
            >
              {task.completed ? (
                <CheckCircle2 size={22} />
              ) : (
                <Circle size={22} />
              )}
            </button>
            <div className="flex-1 overflow-hidden text-left">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold truncate ${task.completed ? "line-through text-slate-400 font-normal" : "text-slate-700"}`}
                >
                  {task.text}
                </span>
                {task.assignedDay && !isCompact && (
                  <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    {task.assignedDay.slice(0, 3)}
                  </span>
                )}
              </div>
              {task.subtasks?.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden max-w-[80px]">
                    <div
                      className="h-full bg-indigo-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {progress}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleExpand(task.id)}
              className={`p-1 rounded-md transition-colors ${isExpanded ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-100"}`}
            >
              <Layers size={18} />
            </button>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(isMenuOpen ? null : task.id);
                }}
                className={`p-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${isMenuOpen ? "text-indigo-600" : "text-slate-400 hover:text-indigo-600"}`}
              >
                {task.assignedDay ? "Cambiar" : "Planear"}{" "}
                {isMenuOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-2xl border border-slate-200 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="p-2 bg-slate-50 border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    Asignar a...
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar-mini">
                    {task.assignedDay && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          unassignDay(task.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-amber-600 hover:bg-amber-50 font-bold border-b border-slate-50"
                      >
                        Quitar del calendario
                      </button>
                    )}
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        onClick={(e) => {
                          e.stopPropagation();
                          assignDay(task.id, day);
                          setActiveMenuId(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs hover:bg-indigo-50 hover:text-indigo-600 capitalize transition-colors flex items-center justify-between ${task.assignedDay === day ? "bg-indigo-50 text-indigo-700 font-bold" : ""}`}
                      >
                        {day}
                        {task.assignedDay === day && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 text-slate-300 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 ml-8 space-y-2">
            {task.subtasks?.map((st) => (
              <div
                key={st.id}
                className="flex items-center justify-between group/sub"
              >
                <div className="flex items-center gap-2 text-left">
                  <button
                    onClick={() => toggleSubtask(task, st.id)}
                    className={`${st.completed ? "text-green-500" : "text-slate-300"}`}
                  >
                    {st.completed ? <Check size={16} /> : <Circle size={16} />}
                  </button>
                  <span
                    className={`text-xs ${st.completed ? "line-through text-slate-400" : "text-slate-600"}`}
                  >
                    {st.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteSubtask(task, st.id)}
                  className="opacity-0 group-hover/sub:opacity-100 text-slate-300 hover:text-red-400 p-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}

            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={newSubtaskValue || ""}
                onChange={(e) => setNewSubtaskValue(task.id, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubtask(task.id)}
                placeholder="Nueva subtarea..."
                className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={() => addSubtask(task.id)}
                className="bg-indigo-600 text-white p-1.5 rounded-lg hover:bg-indigo-700"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("backlog");
  const [newTask, setNewTask] = useState("");
  const [newSubtask, setNewSubtask] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString("es-ES", { weekday: "long" }),
  );

  const daysOfWeek = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  // 1. Autenticación anónima
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Error al autenticar:", error);
        setLoading(false);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Datos en Tiempo Real (Firestore)
  useEffect(() => {
    if (!user) return;

    const tasksCollection = collection(db, "users", user.uid, "tasks");

    const unsubscribe = onSnapshot(
      tasksCollection,
      (snapshot) => {
        const tasksList = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTasks(
          tasksList.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          ),
        );
        setLoading(false);
      },
      (error) => {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const closeMenus = () => setActiveMenuId(null);
    window.addEventListener("click", closeMenus);
    return () => window.removeEventListener("click", closeMenus);
  }, []);

  // Operaciones Firestore
  const getTaskRef = (taskId) => doc(db, "users", user.uid, "tasks", taskId);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !user) return;

    const taskId = Date.now().toString();
    const taskData = {
      text: newTask,
      completed: false,
      assignedDay: null,
      subtasks: [],
      createdAt: new Date().toISOString(),
    };

    await setDoc(getTaskRef(taskId), taskData);
    setNewTask("");
  };

  const toggleTask = async (task) => {
    if (!user) return;
    const newState = !task.completed;
    const updatedSubtasks =
      task.subtasks?.map((st) => ({ ...st, completed: newState })) || [];

    await updateDoc(getTaskRef(task.id), {
      completed: newState,
      subtasks: updatedSubtasks,
    });
  };

  const deleteTask = async (id) => {
    if (!user) return;
    await deleteDoc(getTaskRef(id));
  };

  const assignDay = async (id, day) => {
    if (!user) return;
    await updateDoc(getTaskRef(id), { assignedDay: day });
  };

  const unassignDay = async (id) => {
    if (!user) return;
    await updateDoc(getTaskRef(id), { assignedDay: null });
  };

  const addSubtask = async (taskId) => {
    if (!user) return;
    const text = newSubtask[taskId];
    if (!text || !text.trim()) return;

    const currentTask = tasks.find((t) => t.id === taskId);
    const updatedSubtasks = [
      ...(currentTask.subtasks || []),
      { id: Date.now().toString(), text, completed: false },
    ];

    await updateDoc(getTaskRef(taskId), { subtasks: updatedSubtasks });
    setNewSubtask({ ...newSubtask, [taskId]: "" });
  };

  const toggleSubtask = async (task, subtaskId) => {
    if (!user) return;
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st,
    );
    const allDone =
      updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);

    await updateDoc(getTaskRef(task.id), {
      subtasks: updatedSubtasks,
      completed: allDone,
    });
  };

  const deleteSubtask = async (task, subtaskId) => {
    if (!user) return;
    const updatedSubtasks = task.subtasks.filter((st) => st.id !== subtaskId);
    await updateDoc(getTaskRef(task.id), { subtasks: updatedSubtasks });
  };

  const toggleExpand = (taskId) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const setNewSubtaskValue = (taskId, value) => {
    setNewSubtask((prev) => ({ ...prev, [taskId]: value }));
  };

  const getTaskProgress = (task) => {
    if (!task.subtasks || task.subtasks.length === 0)
      return task.completed ? 100 : 0;
    const completed = task.subtasks.filter((st) => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  const unassignedTasks = tasks.filter((t) => !t.assignedDay);
  const assignedTasks = tasks.filter((t) => t.assignedDay);
  const plannedTasks = tasks.filter((t) => t.assignedDay === selectedDay);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    percentage:
      tasks.length > 0
        ? Math.round(
            (tasks.filter((t) => t.completed).length / tasks.length) * 100,
          )
        : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-500 font-medium">Conectando con la nube...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <TrendingUp size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight text-left">
                Objetivo & Acción
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-left flex items-center gap-1">
                <Cloud size={10} /> Sincronizado en la nube
              </p>
            </div>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("backlog")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "backlog" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-800"}`}
            >
              <ListTodo size={16} />
              Buzón General
            </button>
            <button
              onClick={() => setActiveTab("planner")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "planner" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Calendar size={16} />
              Planificador
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8 bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
          <div className="flex-1 text-left">
            <h2 className="text-lg font-bold">Resumen de Progresos</h2>
            <p className="text-slate-400 text-xs">
              Has completado {stats.completed} de {stats.total} tareas en total
            </p>
            <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-1000"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
          </div>
          <div className="text-4xl font-black text-indigo-400">
            {stats.percentage}%
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <section className={`${activeTab !== "backlog" && "hidden"}`}>
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 text-left mb-6">
                  <ListTodo size={20} className="text-indigo-500" />
                  Nuevas Ideas y Pendientes
                </h2>
                <form onSubmit={addTask} className="flex gap-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Ej: Crear mi portafolio web"
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white p-3 rounded-2xl shrink-0 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                  >
                    <Plus size={24} />
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 text-left">
                  <Clock size={14} /> Tareas sin fecha ({unassignedTasks.length}
                  )
                </h3>
                <div className="space-y-1">
                  {unassignedTasks.length === 0 ? (
                    <p className="text-center py-8 text-slate-300 text-sm">
                      El buzón está limpio.
                    </p>
                  ) : (
                    unassignedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        toggleTask={toggleTask}
                        deleteTask={deleteTask}
                        assignDay={assignDay}
                        unassignDay={unassignDay}
                        toggleExpand={toggleExpand}
                        isExpanded={expandedTasks[task.id]}
                        addSubtask={addSubtask}
                        toggleSubtask={toggleSubtask}
                        deleteSubtask={deleteSubtask}
                        newSubtaskValue={newSubtask[task.id]}
                        setNewSubtaskValue={setNewSubtaskValue}
                        daysOfWeek={daysOfWeek}
                        progress={getTaskProgress(task)}
                        activeMenuId={activeMenuId}
                        setActiveMenuId={setActiveMenuId}
                      />
                    ))
                  )}
                </div>
              </div>

              <div className="bg-slate-100 rounded-3xl border border-slate-200 p-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 text-left">
                  <Calendar size={14} /> Tareas agendadas (
                  {assignedTasks.length})
                </h3>
                <div className="space-y-1">
                  {assignedTasks.length === 0 ? (
                    <p className="text-center py-4 text-slate-400 text-xs italic">
                      Agregue fechas para organizar su semana.
                    </p>
                  ) : (
                    assignedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        toggleTask={toggleTask}
                        deleteTask={deleteTask}
                        assignDay={assignDay}
                        unassignDay={unassignDay}
                        toggleExpand={toggleExpand}
                        isExpanded={expandedTasks[task.id]}
                        addSubtask={addSubtask}
                        toggleSubtask={toggleSubtask}
                        deleteSubtask={deleteSubtask}
                        newSubtaskValue={newSubtask[task.id]}
                        setNewSubtaskValue={setNewSubtaskValue}
                        daysOfWeek={daysOfWeek}
                        progress={getTaskProgress(task)}
                        activeMenuId={activeMenuId}
                        setActiveMenuId={setActiveMenuId}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className={`${activeTab !== "planner" && "hidden"}`}>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
              <div className="bg-slate-50 p-4 flex gap-2 overflow-x-auto border-b border-slate-100 scroll-hide">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                      ${
                        selectedDay === day
                          ? "bg-indigo-600 text-white shadow-lg scale-105"
                          : "bg-white text-slate-400 hover:text-slate-600 border border-slate-200"
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="p-8 flex-1">
                <div className="mb-8 text-left">
                  <h2 className="text-3xl font-black text-slate-900 capitalize mb-1">
                    {selectedDay}
                  </h2>
                  <p className="text-slate-400 text-sm font-medium">
                    Tus objetivos para hoy
                  </p>
                </div>
                <div className="space-y-4">
                  {plannedTasks.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-100 rounded-[40px] py-24 flex flex-col items-center justify-center text-slate-300">
                      <Layout size={48} className="opacity-10 mb-4" />
                      <p className="font-bold">Sin objetivos</p>
                      <p className="text-xs mt-2">
                        Asigna tareas para este día.
                      </p>
                    </div>
                  ) : (
                    plannedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        isCompact={true}
                        toggleTask={toggleTask}
                        deleteTask={deleteTask}
                        assignDay={assignDay}
                        unassignDay={unassignDay}
                        toggleExpand={toggleExpand}
                        isExpanded={expandedTasks[task.id]}
                        addSubtask={addSubtask}
                        toggleSubtask={toggleSubtask}
                        deleteSubtask={deleteSubtask}
                        newSubtaskValue={newSubtask[task.id]}
                        setNewSubtaskValue={setNewSubtaskValue}
                        daysOfWeek={daysOfWeek}
                        progress={getTaskProgress(task)}
                        activeMenuId={activeMenuId}
                        setActiveMenuId={setActiveMenuId}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-2 text-center">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
          Almacenamiento activo en la nube
        </p>
      </footer>

      <style>{`
        .scroll-hide::-webkit-scrollbar { display: none; }
        .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar-mini::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-mini::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-mini::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fadeIn 0.15s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
