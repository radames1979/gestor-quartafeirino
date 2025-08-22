import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { User, Calendar as CalendarIcon, Users, Swords, ScrollText, DollarSign, BarChart, Settings, Plus, Edit, Trash2, Check, X, Info, AlertTriangle, ChevronLeft, ChevronRight, Goal, Award, Briefcase, Mail, Phone, Heart, Hash, CalendarDays, Wallet, Banknote, Receipt, MessageSquare, Clock, ArrowDownToLine, ArrowUpFromLine, Cloud, CloudDownload, CloudUpload, FileText, Share2, Save, Trophy, Shirt, Minus, PlusCircle, MinusCircle, Scale, Utensils, Ban, History, Archive, MapPin, Target, Star, RefreshCw, ArrowRight, ArrowDown, Circle, Palette, Sun, Moon, Flame, Megaphone, Image as ImageIcon, BriefcaseBusiness, TrendingUp, TrendingDown } from 'lucide-react';

// JS libraries for image and PDF generation are expected to be loaded in the environment via CDN:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>

// --- Helper Components ---

/**
 * Componente Toast para exibir mensagens de feedback ao usuário.
 * Aparece no canto superior direito e desaparece automaticamente.
 */
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? <Check className="w-5 h-5" /> : type === 'error' ? <X className="w-5 h-5" /> : <Info className="w-5 h-5" />;

  return (
    <div className={`fixed top-4 right-4 p-3 rounded-lg text-white shadow-lg flex items-center gap-2 z-[100] animate-fade-in-down ${bgColor}`}>
      {icon}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white opacity-75 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * A reusable, responsive football field created with CSS.
 * This component is self-contained and does not rely on external images.
 */
const FootballField = () => (
  <div className="relative w-full aspect-[3/2] bg-green-600 border-4 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-xl">
    {/* Outer lines */}
    <div className="absolute inset-2 border-2 border-white/70"></div>
    {/* Center line */}
    <div className="absolute top-2 bottom-2 left-1/2 w-1 bg-white/70 transform -translate-x-1/2"></div>
    {/* Center circle */}
    <div className="absolute top-1/2 left-1/2 w-[20%] aspect-square border-2 border-white/70 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
    {/* Center spot */}
    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/70 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
    {/* Left Penalty Area */}
    <div className="absolute top-1/2 left-2 w-[18%] h-[45%] border-2 border-white/70 transform -translate-y-1/2"></div>
    {/* Left Goal Area */}
    <div className="absolute top-1/2 left-2 w-[8%] h-[25%] border-2 border-white/70 transform -translate-y-1/2"></div>
    {/* Left Penalty Spot */}
    <div className="absolute top-1/2 left-[12%] w-1.5 h-1.5 bg-white/70 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
    {/* Right Penalty Area */}
    <div className="absolute top-1/2 right-2 w-[18%] h-[45%] border-2 border-white/70 transform -translate-y-1/2"></div>
    {/* Right Goal Area */}
    <div className="absolute top-1/2 right-2 w-[8%] h-[25%] border-2 border-white/70 transform -translate-y-1/2"></div>
    {/* Right Penalty Spot */}
    <div className="absolute top-1/2 right-[12%] w-1.5 h-1.5 bg-white/70 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
  </div>
);

const FinancialChart = ({ data, theme }) => {
    const maxValue = useMemo(() => {
        const allValues = data.flatMap(d => [d.receita, d.despesa]);
        const max = Math.max(...allValues);
        return max === 0 ? 100 : max; // Avoid division by zero
    }, [data]);

    return (
        <div className="w-full h-80 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg flex flex-col">
            <div className="flex-grow flex items-end justify-around gap-2 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                {data.map((monthData, index) => {
                    const receitaHeight = (monthData.receita / maxValue) * 100;
                    const despesaHeight = (monthData.despesa / maxValue) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                            <div className="flex items-end h-full w-full justify-center gap-1">
                                <div 
                                    className="w-1/2 bg-green-500 rounded-t-md hover:opacity-80 transition-opacity" 
                                    style={{ height: `${receitaHeight}%` }}
                                    title={`Receita: R$ ${monthData.receita.toFixed(2)}`}
                                ></div>
                                <div 
                                    className="w-1/2 bg-red-500 rounded-t-md hover:opacity-80 transition-opacity" 
                                    style={{ height: `${despesaHeight}%` }}
                                    title={`Despesa: R$ ${monthData.despesa.toFixed(2)}`}
                                ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{monthData.month}</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-center items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span className="text-gray-700 dark:text-gray-300">Receitas</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                    <span className="text-gray-700 dark:text-gray-300">Despesas</span>
                </div>
            </div>
        </div>
    );
};


const Calendar = ({ viewDate, setViewDate, events, onDateClick, onEventClick, players, onGeneratePdf }) => {
    const monthName = viewDate.toLocaleString('pt-BR', { month: 'long' });
    const year = viewDate.getFullYear();

    const changeMonth = (offset) => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const daysInMonth = new Date(year, viewDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, viewDate.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Calendário de Eventos</h2>
                <button onClick={onGeneratePdf} className="bg-rose-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-rose-700 text-sm flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" /> Gerar PDF do Ano
                </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="px-3 py-1 bg-gray-300 dark:bg-gray-600 dark:text-gray-200 rounded-lg font-bold flex items-center justify-center"><ChevronLeft className="w-5 h-5" /></button>
                    <h3 className="text-xl font-bold capitalize text-gray-800 dark:text-gray-200">{monthName} de {year}</h3>
                    <button onClick={() => changeMonth(1)} className="px-3 py-1 bg-gray-300 dark:bg-gray-600 dark:text-gray-200 rounded-lg font-bold flex items-center justify-center"><ChevronRight className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {blanks.map(b => <div key={`b-${b}`} className="h-24"></div>)}
                    {days.map(day => {
                        const date = new Date(year, viewDate.getMonth(), day);
                        const dateString = date.toISOString().split('T')[0];
                        const event = events[dateString];
                        const isWednesday = date.getDay() === 3;
                        
                        return (
                            <div 
                                key={day} 
                                className={`h-24 p-2 border rounded-lg flex flex-col cursor-pointer transition-colors dark:border-gray-700 ${isWednesday ? 'bg-blue-50 dark:bg-blue-900/50' : 'bg-white dark:bg-gray-800/50'} hover:bg-yellow-100 dark:hover:bg-yellow-800/50`}
                                onClick={() => event ? onEventClick(event) : onDateClick(dateString)}
                            >
                                <span className="font-bold text-gray-800 dark:text-gray-200">{day}</span>
                                {event && (
                                    <div className="text-xs mt-1 overflow-hidden text-gray-700 dark:text-gray-300">
                                        {event.hostId && <p className="truncate flex items-center"><User className="w-3 h-3 mr-1" /> {players.find(p=>p.id === event.hostId)?.name}</p>}
                                        {event.title && <p className="font-bold truncate text-purple-600 dark:text-purple-400 flex items-center"><Award className="w-3 h-3 mr-1" /> {event.title}</p>}
                                        {event.birthdays && event.birthdays.map(bday => (
                                            <p key={bday.id} className="truncate text-pink-600 dark:text-pink-400 flex items-center"><CalendarDays className="w-3 h-3 mr-1" /> {bday.name}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const EventModal = ({ event, players, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState('');
    const [hostId, setHostId] = useState('');
    const [location, setLocation] = useState('');
    const isEditing = useMemo(() => event && (event.title || event.hostId || event.location), [event]);

    useEffect(() => {
        if (event) {
            setTitle(event.title || '');
            setHostId(event.hostId || '');
            setLocation(event.location || '');
        }
    }, [event]);

    if (!event) return null;

    const handleSave = () => {
        onSave({
            date: event.date,
            title: title.trim(),
            hostId,
            location: location.trim()
        });
    };

    const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{isEditing ? 'Editar Evento' : 'Adicionar Evento'}</h3>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-400">{formattedDate}</p>

                {event.birthdays && event.birthdays.length > 0 && (
                    <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-900/50 rounded-lg">
                        <h4 className="font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1"><CalendarDays className="w-4 h-4" /> Aniversariantes:</h4>
                        <ul className="list-disc list-inside">
                            {event.birthdays.map(bday => (
                                <li key={bday.id} className="text-sm text-pink-600 dark:text-pink-400">🎂 {bday.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><User className="w-4 h-4" /> Anfitrião da Quarta:</label>
                    <select value={hostId} onChange={e => setHostId(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <option value="">Ninguém</option>
                        {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                
                <div className="mb-4">
                    <label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><MapPin className="w-4 h-4" /> Local:</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Local do jogo/jantar" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                </div>

                <div className="text-center my-4 font-bold text-gray-500 dark:text-gray-400">OU</div>

                <div className="mb-4">
                    <label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><Award className="w-4 h-4" /> Evento Especial:</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Churrasco de Fim de Ano" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                </div>

                <div className="flex justify-between gap-2 mt-6">
                    <div>
                        {isEditing && <button onClick={() => onDelete(event.date)} className="bg-red-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-700 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Apagar Evento</button>}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="bg-gray-400 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-500 flex items-center gap-1"><X className="w-4 h-4" /> Cancelar</button>
                        <button onClick={handleSave} className="bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 flex items-center gap-1"><Check className="w-4 h-4" /> Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Modal for selecting PDF report columns.
 */
const PdfOptionsModal = ({ isOpen, onClose, onGenerate, selectedColumns, onColumnToggle }) => {
    if (!isOpen) return null;

    const columnOptions = [
        { key: 'rank', label: '#' },
        { key: 'name', label: 'Nome' },
        { key: 'fullName', label: 'Nome Completo' },
        { key: 'memberNumber', label: 'Nº de Sócio' },
        { key: 'birthDate', label: 'Data de Nascimento' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Telefone' },
        { key: 'favoriteTeam', label: 'Time do Coração' },
        { key: 'position', label: 'Posição' },
        { key: 'role', label: 'Cargo' },
        { key: 'skillRating', label: 'Nota' },
        { key: 'pointsLast4Wednesdays', label: 'Pts (4Q)' },
        { key: 'totalPointsYear', label: 'Pts Total' },
    ];

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Gerar PDF do Ranking - Opções</h3>
                
                <div className="mb-4">
                    <p className="mb-2 text-gray-700 dark:text-gray-300 font-semibold">Incluir no Relatório:</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="pdf-col-includeGoalkeepers"
                                checked={selectedColumns.includeGoalkeepers}
                                onChange={() => onColumnToggle('includeGoalkeepers')}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="pdf-col-includeGoalkeepers" className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
                                Incluir Goleiros
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="pdf-col-includeSocials"
                                checked={selectedColumns.includeSocials}
                                onChange={() => onColumnToggle('includeSocials')}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="pdf-col-includeSocials" className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
                                Incluir Sociais
                            </label>
                        </div>
                    </div>
                </div>

                <hr className="my-4 dark:border-gray-600"/>

                <p className="mb-4 text-gray-700 dark:text-gray-300 font-semibold">Selecione as Colunas:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {columnOptions.map(option => (
                        <div key={option.key} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`pdf-col-${option.key}`}
                                checked={selectedColumns[option.key]}
                                onChange={() => onColumnToggle(option.key)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`pdf-col-${option.key}`} className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="bg-gray-400 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-500 flex items-center gap-1"><X className="w-4 h-4" /> Cancelar</button>
                    <button onClick={onGenerate} className="bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 flex items-center gap-1"><Check className="w-4 h-4" /> Gerar PDF</button>
                </div>
            </div>
        </div>
    );
};


/**
 * A generic confirmation modal.
 */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex justify-around space-x-4">
                    <button onClick={onConfirm} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 flex items-center justify-center gap-1"><Check className="w-4 h-4" /> Sim, Continuar</button>
                    <button onClick={onClose} className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-500 flex items-center justify-center gap-1"><X className="w-4 h-4" /> Cancelar</button>
                </div>
            </div>
        </div>
    );
};

/**
 * Modal for selecting which dashboard cards to share.
 */
const ShareDashboardModal = ({ isOpen, onClose, onGenerate, selectedCards, onCardToggle }) => {
    if (!isOpen) return null;

    const cardOptions = [
        { id: 'next-event', label: 'Próximo Evento' },
        { id: 'balance', label: 'Saldo do Caixa' },
        { id: 'prediction', label: 'Previsão Mensal' },
        { id: 'annual-prediction', label: 'Previsão Anual' },
        { id: 'birthdays', label: 'Aniversariantes da Semana' },
        { id: 'top-scorers', label: 'Artilheiros do Ano' },
        { id: 'financial-summary', label: 'Resumo Financeiro' },
        { id: 'ranking', label: 'Top 3 Ranking' },
        { id: 'financial-chart', label: 'Gráfico Financeiro' },
    ];

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Compartilhar Dashboard</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Selecione os cards que deseja incluir na imagem compartilhada.</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {cardOptions.map(option => (
                        <div key={option.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`share-card-${option.id}`}
                                checked={!!selectedCards[option.id]}
                                onChange={() => onCardToggle(option.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`share-card-${option.id}`} className="ml-2 text-gray-700 dark:text-gray-300">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="bg-gray-400 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-500 flex items-center gap-1"><X className="w-4 h-4" /> Cancelar</button>
                    <button onClick={onGenerate} className="bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 flex items-center gap-1"><ImageIcon className="w-4 h-4" /> Gerar Imagem</button>
                </div>
            </div>
        </div>
    );
};


function App() {
  // --- Firebase State ---
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [appId, setAppId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const isInitialLoad = useRef(true);
  const dataSyncTimer = useRef(null);
  
  // --- Cloud (jsonbin.io) State ---
  const [cloudBinId] = useState('68950b6aae596e708fc4745a'); // Example Bin ID
  const [cloudApiKey] = useState('$2a$10$vUWQfHGQDPt7ePocY9SWtO9o4bmRhWP8FogKJkGfW4v7/AYtk4MbC'); // Example API Key

  // --- Application State ---
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [savedMatches, setSavedMatches] = useState([]);
  const [monthlyPayments, setMonthlyPayments] = useState({});
  const [managementYear, setManagementYear] = useState(new Date().getFullYear());
  const [historicalData, setHistoricalData] = useState([]);
  const [defaultFee, setDefaultFee] = useState('50');
  const [financialTransactions, setFinancialTransactions] = useState([]);
  const [initialBalance, setInitialBalance] = useState(0);
  const [calendarEvents, setCalendarEvents] = useState({});
  const [pixKeyType, setPixKeyType] = useState('CPF');
  const [pixKey, setPixKey] = useState('');
  const [pixKeyName, setPixKeyName] = useState('');
  const [presenceList, setPresenceList] = useState({}); // Detailed presence status
  
  // --- UI & Interaction State ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [theme, setTheme] = useState('light');
  const initialPlayerFormData = {
    name: '',
    fullName: '',
    memberNumber: '',
    email: '',
    phone: '',
    favoriteTeam: '',
    role: 'Jogador',
    position: 'Meia',
    skillRating: 5,
    basePoints: 0,
    isFeeExempt: false,
    birthDate: '',
    photoUrl: '',
  };
  const [playerFormData, setPlayerFormData] = useState(initialPlayerFormData);
  const [currentRoundDate, setCurrentRoundDate] = useState('');
  const [playerStatuses, setPlayerStatuses] = useState({});
  const [selectedStarters, setSelectedStarters] = useState([]);
  const [reserves, setReserves] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [selectedGameSize, setSelectedGameSize] = useState(8);
  const [editingRoundId, setEditingRoundId] = useState(null);
  const [teamAColor, setTeamAColor] = useState('blue-600');
  const [teamBColor, setTeamBColor] = useState('red-600');
  const [swapMode, setSwapMode] = useState(false);
  const [playerToSwap, setPlayerToSwap] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({ playerId: null, months: [], isEditing: false, paymentId: null });
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionType, setTransactionType] = useState('receita');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionCostCenter, setTransactionCostCenter] = useState('Outros');
  const [editingCostCenterId, setEditingCostCenterId] = useState(null);
  const [showDeleteRoundModal, setShowDeleteRoundModal] = useState(null);
  const [showDeletePlayerModal, setShowDeletePlayerModal] = useState(null);
  const [showDeleteMatchModal, setShowDeleteMatchModal] = useState(null);
  const [showEndYearModal, setShowEndYearModal] = useState(false);
  const [showDeletePaymentModal, setShowDeletePaymentModal] = useState(null);
  const [showDeleteTransactionModal, setShowDeleteTransactionModal] = useState(null);
  const [draggingPlayer, setDraggingPlayer] = useState(null);
  const fieldRef = useRef(null);
  const [html2canvasLoaded, setHtml2canvasLoaded] = useState(false);
  const [jspdfLoaded, setJspdfLoaded] = useState(false);
  const [jspdfAutoTableLoaded, setJspdfAutoTableLoaded] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState({});
  const [lateReservePlayer, setLateReservePlayer] = useState('');
  const [isPdfOptionsModalOpen, setIsPdfOptionsModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedPdfColumns, setSelectedPdfColumns] = useState({
    rank: true, name: true, position: true, skillRating: true, 
    pointsLast4Wednesdays: true, totalPointsYear: true, fullName: false,
    phone: false, email: false, favoriteTeam: false, memberNumber: false, birthDate: false,
    role: false, includeGoalkeepers: false, includeSocials: false,
  });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const fileToLoad = useRef(null);

  // --- New "Free Play" State ---
  const [gameMode, setGameMode] = useState('quarta'); // 'quarta' or 'livre'
  const [freeTeams, setFreeTeams] = useState({ available: [], teamA: [], teamB: [], reserves: [] });
  const [draggedItem, setDraggedItem] = useState(null); // For drag and drop in free play
  
  // --- Calendar State ---
  const [viewDate, setViewDate] = useState(new Date());
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(null);

  // --- Match Details State ---
  const [scoreTeamA, setScoreTeamA] = useState('');
  const [scoreTeamB, setScoreTeamB] = useState('');
  const [currentGoals, setCurrentGoals] = useState([]);
  const [newGoalPlayer, setNewGoalPlayer] = useState('');
  const [newGoalTeam, setNewGoalTeam] = useState('');
  
  // --- Dashboard Sharing State ---
  const [isShareDashboardModalOpen, setIsShareDashboardModalOpen] = useState(false);
  const [selectedDashboardCards, setSelectedDashboardCards] = useState({
      'next-event': true,
      'balance': true,
      'prediction': true,
      'annual-prediction': true,
      'birthdays': true,
      'top-scorers': true,
      'financial-summary': true,
      'ranking': true,
      'financial-chart': true,
  });

  // --- Constants ---
  const meses = useMemo(() => ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], []);
  const costCenters = useMemo(() => ['Mensalidades', 'Barracas', 'Arbitragem', 'Eventos Extras', 'Dia das Mães', 'Dia dos Pais', 'Encerramento', 'Utensílios', 'Outros'], []);


  // --- Firebase Initialization and Auth Effect ---
 useEffect(() => {
    try {
      let firebaseConfig;

      // Verifica se está no ambiente de desenvolvimento (Canvas) que provê a variável global
      if (typeof __firebase_config !== 'undefined' && __firebase_config) {
        firebaseConfig = JSON.parse(__firebase_config);
        setAppId(typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
      } else {
        // Se não, constrói a configuração a partir das variáveis de ambiente (para o site real)
        firebaseConfig = {
           apiKey: "AIzaSyDAXOKkJkcQWA19Hgfm_CusmZrcJDBTQoI",
           authDomain: "quartafeirinoc-manager.firebaseapp.com",
           projectId: "quartafeirinoc-manager",
           storageBucket: "quartafeirinoc-manager.firebasestorage.app",
           messagingSenderId: "34864885941",
           appId: "1:34864885941:web:ff01b9f724e57f41a7cefc"
        };
        setAppId(firebaseConfig.projectId); // Usa o ID do projeto como App ID no site real
      }

      // Verifica se a configuração foi carregada com sucesso
      if (!firebaseConfig || !firebaseConfig.apiKey) {
        showMessage("Configuração do Firebase não encontrada. Verifique as variáveis de ambiente.", "error");
        return;
      }

      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);
      setDb(firestoreDb);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
          setIsAuthReady(true);
        } else {
          try {
            const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
            if (token) {
              await signInWithCustomToken(firebaseAuth, token);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          } catch (error) {
            console.error("Erro de autenticação do Firebase:", error);
            showMessage("Erro de autenticação com o servidor.", "error");
          }
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Falha na inicialização do Firebase:", error);
      showMessage("Falha ao iniciar a conexão com o servidor.", "error");
    }
  }, []);

  // --- Firestore Data Loading Effect ---
  useEffect(() => {
    if (isAuthReady && db && userId) {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const docRef = doc(db, `artifacts/${appId}/public/dadosCompartilhados`);
      
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPlayers(data.players || []);
          setRounds(data.rounds || []);
          setSavedMatches(data.savedMatches || []);
          setMonthlyPayments(data.monthlyPayments || {});
          setManagementYear(data.managementYear || new Date().getFullYear());
          setHistoricalData(data.historicalData || []);
          setDefaultFee(data.defaultFee || '50');
          setFinancialTransactions(data.financialTransactions || []);
          setInitialBalance(data.initialBalance || 0);
          setCalendarEvents(data.calendarEvents || {});
          setPresenceList(data.presenceList || {});
          setPixKeyType(data.pixKeyType || 'CPF');
          setPixKey(data.pixKey || '');
          setPixKeyName(data.pixKeyName || '');
        }
        isInitialLoad.current = false; 
      }, (error) => {
        console.error("Firestore snapshot error:", error);
        showMessage("Erro ao sincronizar dados com a nuvem.", "error");
      });

      return () => unsubscribe();
    }
  }, [isAuthReady, db, userId]);

  // --- Firestore Data Saving Effect ---
  useEffect(() => {
    if (isInitialLoad.current || !isAuthReady || !db || !userId) {
      return;
    }
    
    setHasUnsavedChanges(true);

    if (dataSyncTimer.current) {
        clearTimeout(dataSyncTimer.current);
    }

    dataSyncTimer.current = setTimeout(async () => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const docRef = doc(db, `artifacts/${appId}/public/dadosCompartilhados`);

        const removeUndefined = (obj) => {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }
            if (Array.isArray(obj)) {
                return obj.map(item => removeUndefined(item));
            }
            const newObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];
                    if (value !== undefined) {
                        newObj[key] = removeUndefined(value);
                    }
                }
            }
            return newObj;
        };

        const dataToSave = {
            players,
            rounds,
            savedMatches,
            monthlyPayments: removeUndefined(monthlyPayments),
            managementYear,
            historicalData,
            defaultFee,
            financialTransactions,
            initialBalance,
            calendarEvents,
            presenceList,
            pixKeyType,
            pixKey,
            pixKeyName,
        };
        try {
            await setDoc(docRef, dataToSave);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Error saving data to Firestore:", error);
            showMessage("Falha ao salvar dados na nuvem.", "error");
        }
    }, 1500);

    return () => {
        if (dataSyncTimer.current) {
            clearTimeout(dataSyncTimer.current);
        }
    };
  }, [players, rounds, savedMatches, monthlyPayments, managementYear, historicalData, defaultFee, financialTransactions, initialBalance, calendarEvents, presenceList, pixKeyType, pixKey, pixKeyName, isAuthReady, db, userId]);


  // --- Library Loading & Util Effects ---
  useEffect(() => {
    const today = new Date();
    setCurrentRoundDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (typeof window.html2canvas !== 'undefined') {
      setHtml2canvasLoaded(true);
    } else {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.onload = () => setHtml2canvasLoaded(true);
      script.onerror = () => showMessage("Erro ao carregar a biblioteca de imagem.", 'error');
      document.body.appendChild(script);
    }

    if (typeof window.jspdf !== 'undefined') {
      setJspdfLoaded(true);
    } else {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = () => setJspdfLoaded(true);
      script.onerror = () => showMessage("Erro ao carregar a biblioteca de PDF.", 'error');
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!jspdfLoaded) return;
    
    if (typeof window.jspdf.autoTable !== 'undefined') {
        setJspdfAutoTableLoaded(true);
    } else {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
        script.onload = () => setJspdfAutoTableLoaded(true);
        script.onerror = () => showMessage("Erro ao carregar o plugin da tabela PDF.", 'error');
        document.body.appendChild(script);
    }
  }, [jspdfLoaded]);
  
  useEffect(() => {
    setPresenceList(prev => {
        const newPresence = { ...prev };
        players.forEach(p => {
            if (!newPresence[p.id]) {
                newPresence[p.id] = 'ausente';
            }
        });
        return newPresence;
    });
  }, [players]);

  // Effect to initialize free play mode when switched
  useEffect(() => {
    if (gameMode === 'livre') {
      setFreeTeams({
        available: [...players].sort((a,b) => a.name.localeCompare(b.name)),
        teamA: [],
        teamB: [],
        reserves: [],
      });
    }
  }, [gameMode, players]);

  // --- Functions ---
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 4000);
  };
  
  const getPlayerStats = useCallback(() => {
    const stats = {};
    const currentYearRounds = rounds.filter(r => new Date(r.date).getFullYear() === managementYear);
    
    const gameWednesdays = currentYearRounds.map(r => new Date(r.date)).filter(d => d.getUTCDay() === 3).sort((a, b) => b - a);
    const uniqueWednesdayDates = [...new Set(gameWednesdays.map(d => d.toISOString().split('T')[0]))];
    const last4GameWednesdays = uniqueWednesdayDates.slice(0, 4);
    const mostRecentGameWednesday = last4GameWednesdays.length > 0 ? last4GameWednesdays[0] : null;

    players.forEach(player => {
      stats[player.id] = {
        totalPointsYear: player.basePoints || 0,
        pointsLast4Wednesdays: 0,
        playedOnMostRecentWednesday: false,
        gamesPlayed: 0,
        dinnersAttended: 0,
        absences: 0,
      };
    });

    currentYearRounds.forEach(round => {
      const roundDate = new Date(round.date);
      const roundDateString = roundDate.toISOString().split('T')[0];
      for (const playerId in round.playerStatuses) {
        if (stats[playerId]) {
          const statuses = Array.isArray(round.playerStatuses[playerId]) ? round.playerStatuses[playerId] : [round.playerStatuses[playerId]];
          let roundPoints = 0;
          let attended = false;
          if (statuses.includes('jogou')) { roundPoints += 2; attended = true; stats[playerId].gamesPlayed++; }
          if (statuses.includes('jantou')) { roundPoints += 1; attended = true; stats[playerId].dinnersAttended++; }
          if (statuses.includes('naoCompareceu')) { stats[playerId].absences++; }

          stats[playerId].totalPointsYear += roundPoints;
          if (last4GameWednesdays.includes(roundDateString)) {
            stats[playerId].pointsLast4Wednesdays += roundPoints;
          }
          if (attended && roundDateString === mostRecentGameWednesday) {
            stats[playerId].playedOnMostRecentWednesday = true;
          }
        }
      }
    });
    return stats;
  }, [players, rounds, managementYear]);

  const sortedPlayersByRank = useMemo(() => {
    const stats = getPlayerStats();
    return [...players].sort((a, b) => {
      const statsA = stats[a.id] || { totalPointsYear: 0, pointsLast4Wednesdays: 0, playedOnMostRecentWednesday: false };
      const statsB = stats[b.id] || { totalPointsYear: 0, pointsLast4Wednesdays: 0, playedOnMostRecentWednesday: false };
      if (statsB.pointsLast4Wednesdays !== statsA.pointsLast4Wednesdays) return statsB.pointsLast4Wednesdays - statsA.pointsLast4Wednesdays;
      if (statsB.totalPointsYear !== statsA.totalPointsYear) return statsB.totalPointsYear - statsA.totalPointsYear;
      return Number(statsB.playedOnMostRecentWednesday) - Number(statsA.playedOnMostRecentWednesday);
    });
  }, [players, rounds, getPlayerStats, managementYear]);

  const sortedPlayersByName = useMemo(() => {
    return [...players].sort((a, b) => a.name.localeCompare(b.name));
  }, [players]);
  
  const playerRankMap = useMemo(() => {
    const map = new Map();
    const fieldPlayers = sortedPlayersByRank.filter(p => p.position !== 'Goleiro' && p.position !== 'Social');
    fieldPlayers.forEach((player, index) => {
        map.set(player.id, index + 1);
    });
    return map;
  }, [sortedPlayersByRank]);

  const sortedRounds = useMemo(() => {
    return [...rounds].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [rounds]);

  const handleOpenPlayerModal = (player = null) => {
    if (player) {
      setEditingPlayer(player);
      let birthDateToEdit = player.birthDate || '';
      if (birthDateToEdit.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const parts = birthDateToEdit.split('-');
          birthDateToEdit = `${parts[2]}-${parts[1]}`;
      }
      setPlayerFormData({ ...initialPlayerFormData, ...player, birthDate: birthDateToEdit });
    } else {
      setEditingPlayer(null);
      setPlayerFormData(initialPlayerFormData);
    }
    setIsPlayerModalOpen(true);
  };

  const handleClosePlayerModal = () => {
    setIsPlayerModalOpen(false);
    setEditingPlayer(null);
  };
  
  const handlePlayerFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlayerFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSavePlayer = () => {
    if (!playerFormData.name.trim() || !playerFormData.position) {
      showMessage("Nome e Posição são obrigatórios.", 'error');
      return;
    }

    const playerToSave = {
        ...playerFormData,
        skillRating: Number(playerFormData.skillRating),
        basePoints: Number(playerFormData.basePoints),
    };

    if (editingPlayer) {
      setPlayers(prev => prev.map(p => 
        p.id === editingPlayer.id 
          ? { ...p, ...playerToSave }
          : p
      ));
      showMessage("Jogador atualizado com sucesso!");
    } else {
      const newPlayer = {
        ...playerToSave,
        id: crypto.randomUUID(),
      };
      setPlayers(prev => [...prev, newPlayer]);
      showMessage("Jogador adicionado com sucesso!");
    }
    handleClosePlayerModal();
  };

  const handleDeletePlayer = (playerId) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    setRounds(prev => prev.map(r => {
      const newStatuses = { ...r.playerStatuses };
      delete newStatuses[playerId];
      return { ...r, playerStatuses: newStatuses };
    }));
    setShowDeletePlayerModal(null);
    showMessage("Jogador removido com sucesso!");
  };

  const handlePlayerStatusChange = (playerId, statusToToggle) => {
    setPlayerStatuses(prev => {
      const current = prev[playerId] || [];
      let newStatuses;
      if (statusToToggle === 'naoCompareceu') {
        newStatuses = current.includes('naoCompareceu') ? [] : ['naoCompareceu'];
      } else {
        newStatuses = current.includes(statusToToggle)
          ? current.filter(s => s !== statusToToggle)
          : [...current.filter(s => s !== 'naoCompareceu'), statusToToggle];
      }
      return { ...prev, [playerId]: newStatuses };
    });
  };
  
  const handleSaveRound = () => {
    if (!currentRoundDate) return;
    const finalPlayerStatuses = {};
    players.filter(p => p.position !== 'Social').forEach(p => {
      finalPlayerStatuses[p.id] = playerStatuses[p.id] && playerStatuses[p.id].length > 0 ? playerStatuses[p.id] : ['naoCompareceu'];
    });

    if (editingRoundId) {
      setRounds(prev => prev.map(r => 
        r.id === editingRoundId ? { ...r, date: currentRoundDate, playerStatuses: finalPlayerStatuses } : r
      ));
      showMessage("Rodada atualizada!");
    } else {
      const newRound = {
        id: crypto.randomUUID(),
        date: currentRoundDate,
        playerStatuses: finalPlayerStatuses
      };
      setRounds(prev => [...prev, newRound]);
      showMessage("Rodada salva!");
    }
    handleCancelEditRound();
  };

  const handleEditRound = (round) => {
    setCurrentRoundDate(round.date);
    setPlayerStatuses(round.playerStatuses);
    setEditingRoundId(round.id);
    setActiveTab('rodadas');
    window.scrollTo(0, 0);
  };

  const handleCancelEditRound = () => {
    setEditingRoundId(null);
    setPlayerStatuses({});
    setCurrentRoundDate(new Date().toISOString().split('T')[0]);
  };

  const handleDeleteRound = (roundId) => {
    setRounds(prev => prev.filter(r => r.id !== roundId));
    setShowDeleteRoundModal(null);
    showMessage("Rodada removida!");
  };

  const handlePresenceChange = (playerId, status) => {
    setPresenceList(prev => ({...prev, [playerId]: status}));
  };
  
  const handleConfirmStartersSelection = () => {
    const playersForGame = players.filter(p => ['jogo', '1º tempo'].includes(presenceList[p.id]));
    const goaliesForGame = playersForGame.filter(p => p.position === 'Goleiro');
    const fieldPlayersForGame = playersForGame.filter(p => p.position !== 'Goleiro' && p.position !== 'Social');
    
    const secondHalfPlayers = players.filter(p => presenceList[p.id] === '2º tempo');

    if (goaliesForGame.length !== 2) {
      showMessage("Selecione exatamente 2 goleiros com status 'Jogo' ou '1º tempo'.", 'error');
      return;
    }

    const fieldPlayersNeeded = selectedGameSize * 2;
    if (fieldPlayersForGame.length < fieldPlayersNeeded) {
      showMessage(`São necessários ${fieldPlayersNeeded} jogadores de linha (status 'Jogo' ou '1º tempo'), mas apenas ${fieldPlayersForGame.length} foram selecionados.`, 'error');
      return;
    }
    
    const sortedFieldPlayersForGame = sortedPlayersByRank.filter(p => fieldPlayersForGame.some(fp => fp.id === p.id));

    const overdueSelectedPlayers = sortedFieldPlayersForGame.filter(p => overduePlayerIds.has(p.id));
    const paidSelectedPlayers = sortedFieldPlayersForGame.filter(p => !overduePlayerIds.has(p.id));

    const fieldStarters = paidSelectedPlayers.slice(0, fieldPlayersNeeded);
    
    const remainingPaidPlayers = paidSelectedPlayers.slice(fieldPlayersNeeded);
    const reservePlayers = [...secondHalfPlayers, ...remainingPaidPlayers, ...overdueSelectedPlayers].sort((a,b) => (playerRankMap.get(a.id) || 999) - (playerRankMap.get(b.id) || 999));
    
    const starters = [...goaliesForGame, ...fieldStarters];
    
    setTeamA([]);
    setTeamB([]);
    setSelectedStarters(starters);
    setReserves(reservePlayers);
    setGameMode('quarta');
    setActiveTab('times');
    showMessage(`Titulares e ${reservePlayers.length} reserva(s) confirmados! Gere os times na aba 'Times'.`);
  };

  const handleConfirmFreePlayTeams = () => {
    setTeamA(freeTeams.teamA);
    setTeamB(freeTeams.teamB);
    setReserves(freeTeams.reserves);
    setSelectedStarters([...freeTeams.teamA, ...freeTeams.teamB, ...freeTeams.reserves]);
    setGameMode('livre');
    setActiveTab('times');
    showMessage("Times do Jogo Livre definidos! Visualize no campo.");
  };

  const getInitialPlayerPosition = (player, teamIndex) => {
    const positionsConfig = { 'Goleiro': 5, 'Zagueiro': 20, 'Lateral': 30, 'Volante': 40, 'Meia': 45, 'Atacante': 70 };
    let xPos = positionsConfig[player.position] || 50;
    if (teamIndex === 1) xPos = 100 - xPos;
    const jitter = (Math.random() - 0.5) * 4;
    return { xPos: xPos + jitter, yPos: 50 + jitter };
  };

  const generateBalancedTeams = () => {
    if (selectedStarters.length === 0) {
      showMessage("Primeiro confirme a escalação ou carregue uma partida.", 'error');
      return;
    }
    let tempTeamA = [], tempTeamB = [];
    const goalies = selectedStarters.filter(p => p.position === 'Goleiro');
    const fieldPlayers = selectedStarters.filter(p => p.position !== 'Goleiro').sort((a, b) => b.skillRating - a.skillRating);
    
    tempTeamA.push({ ...goalies[0], ...getInitialPlayerPosition(goalies[0], 0) });
    tempTeamB.push({ ...goalies[1], ...getInitialPlayerPosition(goalies[1], 1) });
    
    let sumA = goalies[0].skillRating, sumB = goalies[1].skillRating;
    
    fieldPlayers.forEach(p => {
      if (sumA <= sumB) {
        tempTeamA.push({ ...p, ...getInitialPlayerPosition(p, 0) });
        sumA += p.skillRating;
      } else {
        tempTeamB.push({ ...p, ...getInitialPlayerPosition(p, 1) });
        sumB += p.skillRating;
      }
    });
    
    setTeamA(tempTeamA);
    setTeamB(tempTeamB);
    showMessage("Times gerados com sucesso!");
  };

  const handlePlayerSwap = (targetPlayer, targetTeamName) => {
    if (!playerToSwap) {
      setPlayerToSwap({ player: targetPlayer, from: targetTeamName });
      showMessage(`Trocando ${targetPlayer.name}. Selecione o segundo jogador.`, 'info');
      return;
    }

    const sourcePlayer = playerToSwap.player;
    const sourceTeamName = playerToSwap.from;

    if (sourcePlayer.id === targetPlayer.id) {
      setPlayerToSwap(null);
      return;
    }

    const lists = {
      A: [...teamA],
      B: [...teamB],
      Reserves: [...reserves],
    };

    if (sourceTeamName === targetTeamName) {
      const list = lists[sourceTeamName];
      const sourceIndex = list.findIndex(p => p.id === sourcePlayer.id);
      const targetIndex = list.findIndex(p => p.id === targetPlayer.id);
      if (sourceIndex > -1 && targetIndex > -1) {
        [list[sourceIndex], list[targetIndex]] = [list[targetIndex], list[sourceIndex]];
      }
    } else {
      lists[sourceTeamName] = lists[sourceTeamName].filter(p => p.id !== sourcePlayer.id);
      lists[targetTeamName] = lists[targetTeamName].filter(p => p.id !== targetPlayer.id);
      lists[sourceTeamName].push(targetPlayer);
      lists[targetTeamName].push(sourcePlayer);
    }

    setTeamA(lists.A);
    setTeamB(lists.B);
    setReserves(lists.Reserves);

    setPlayerToSwap(null);
    showMessage(`${sourcePlayer.name} e ${targetPlayer.name} trocados com sucesso!`);
  };

  const handleRemovePlayerFromMatch = (playerIdToRemove) => {
    setTeamA(prev => prev.filter(p => p.id !== playerIdToRemove));
    setTeamB(prev => prev.filter(p => p.id !== playerIdToRemove));
    setReserves(prev => prev.filter(p => p.id !== playerIdToRemove));
    setSelectedStarters(prev => prev.filter(p => p.id !== playerIdToRemove));
    const removedPlayer = players.find(p => p.id === playerIdToRemove);
    if (removedPlayer) {
      showMessage(`${removedPlayer.name} foi removido da partida.`, 'info');
    }
  };

  const handleDragStart = (e, player, teamSide) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setDraggingPlayer({ id: player.id, teamSide, offsetX: clientX - rect.left, offsetY: clientY - rect.top });
  };

  const handleDragMove = useCallback((e) => {
    if (!draggingPlayer || !fieldRef.current) return;
    e.preventDefault();
    const fieldRect = fieldRef.current.getBoundingClientRect();
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    let x = (clientX - fieldRect.left) / fieldRect.width * 100;
    let y = (clientY - fieldRect.top) / fieldRect.height * 100;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    const teamSetter = draggingPlayer.teamSide === 'A' ? setTeamA : setTeamB;
    teamSetter(prev => prev.map(p => p.id === draggingPlayer.id ? { ...p, xPos: x, yPos: y } : p));
  }, [draggingPlayer]);

  const handleDragEnd = useCallback(() => setDraggingPlayer(null), []);

  useEffect(() => {
    if (draggingPlayer) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [draggingPlayer, handleDragMove, handleDragEnd]);

  const performExport = async (exportFunction) => {
    setIsSharing(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
      await exportFunction();
    } catch (error) {
      console.error("Export error:", error);
      showMessage("Ocorreu um erro durante a exportação.", 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareFieldImage = () => performExport(async () => {
    const element = document.getElementById('football-field-visualization');
    if (!element || !html2canvasLoaded) return;
    const canvas = await window.html2canvas(element, { scale: 2 });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'formacao_tatic.png';
    link.click();
  });

  const handleGeneratePdf = () => performExport(async () => {
    const mainElement = document.getElementById('capture-area');
    const fieldElement = document.getElementById('football-field-visualization');
    if (!mainElement || !fieldElement || !html2canvasLoaded || !jspdfLoaded) return;
    
    fieldElement.style.display = 'none';

    try {
        const { jsPDF } = window.jspdf;
        const canvas = await window.html2canvas(mainElement, { 
            scale: 2,
            onclone: (document) => {
                const clonedField = document.getElementById('football-field-visualization');
                if (clonedField) {
                    clonedField.style.display = 'none';
                }
            }
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('times.pdf');
    } catch (error) {
        console.error("PDF Generation Error:", error);
        showMessage("Erro ao gerar o PDF.", "error");
    } finally {
        fieldElement.style.display = 'block';
    }
  });
  
  const handlePrintPlayerList = (columnsToInclude) => {
    if (!jspdfLoaded || !jspdfAutoTableLoaded) {
      showMessage("Erro: Biblioteca de PDF não carregada.", "error");
      return;
    }
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    pdf.setFontSize(10);
    pdf.text('Quarta Feirino "C"', 40, 25);
    pdf.setFontSize(18);
    pdf.text(`Relatório de Jogadores - ${managementYear}`, pageWidth / 2, 40, { align: 'center' });

    const tableColumn = [];
    const tableRows = [];
    const playerStats = getPlayerStats();

    if (columnsToInclude.rank) tableColumn.push("#");
    if (columnsToInclude.name) tableColumn.push("Nome");
    if (columnsToInclude.fullName) tableColumn.push("Nome Completo");
    if (columnsToInclude.memberNumber) tableColumn.push("Nº Sócio");
    if (columnsToInclude.birthDate) tableColumn.push("Nascimento");
    if (columnsToInclude.email) tableColumn.push("Email");
    if (columnsToInclude.phone) tableColumn.push("Telefone");
    if (columnsToInclude.favoriteTeam) tableColumn.push("Time Fav.");
    if (columnsToInclude.position) tableColumn.push("Posição");
    if (columnsToInclude.role) tableColumn.push("Cargo");
    if (columnsToInclude.skillRating) tableColumn.push("Nota");
    if (columnsToInclude.pointsLast4Wednesdays) tableColumn.push("Pts (4Q)");
    if (columnsToInclude.totalPointsYear) tableColumn.push("Pts Total");
    
    let playersToPrint = sortedPlayersByRank;
    if (!columnsToInclude.includeGoalkeepers) {
        playersToPrint = playersToPrint.filter(p => p.position !== 'Goleiro');
    }
    if (!columnsToInclude.includeSocials) {
        playersToPrint = playersToPrint.filter(p => p.position !== 'Social');
    }

    playersToPrint.forEach((player, index) => {
        const stats = playerStats[player.id] || { pointsLast4Wednesdays: 0, totalPointsYear: 0 };
        const rank = playerRankMap.get(player.id);
        const rowData = [];
        const isRanked = player.position !== 'Goleiro' && player.position !== 'Social';

        if (columnsToInclude.rank) rowData.push(isRanked ? rank : '-');
        if (columnsToInclude.name) rowData.push(player.name);
        if (columnsToInclude.fullName) rowData.push(player.fullName || '-');
        if (columnsToInclude.memberNumber) rowData.push(player.memberNumber || '-');
        if (columnsToInclude.birthDate) rowData.push(player.birthDate || '-');
        if (columnsToInclude.email) rowData.push(player.email || '-');
        if (columnsToInclude.phone) rowData.push(player.phone || '-');
        if (columnsToInclude.favoriteTeam) rowData.push(player.favoriteTeam || '-');
        if (columnsToInclude.position) rowData.push(player.position);
        if (columnsToInclude.role) rowData.push(player.role || 'Jogador');
        if (columnsToInclude.skillRating) rowData.push(isRanked ? player.skillRating : '-');
        if (columnsToInclude.pointsLast4Wednesdays) rowData.push(isRanked ? stats.pointsLast4Wednesdays : '-');
        if (columnsToInclude.totalPointsYear) rowData.push(isRanked ? stats.totalPointsYear : '-');
        tableRows.push(rowData);
    });

    const columnStyles = {};
    let colIndex = 0;

    if (columnsToInclude.rank) columnStyles[colIndex++] = { halign: 'center', cellWidth: 25 };
    if (columnsToInclude.name) columnStyles[colIndex++] = { halign: 'left', cellWidth: 70 };
    if (columnsToInclude.fullName) columnStyles[colIndex++] = { halign: 'left', cellWidth: 90 };
    if (columnsToInclude.memberNumber) columnStyles[colIndex++] = { halign: 'center', cellWidth: 50 };
    if (columnsToInclude.birthDate) columnStyles[colIndex++] = { halign: 'center', cellWidth: 60 };
    if (columnsToInclude.email) columnStyles[colIndex++] = { halign: 'left', cellWidth: 90 };
    if (columnsToInclude.phone) columnStyles[colIndex++] = { halign: 'center', cellWidth: 70 };
    if (columnsToInclude.favoriteTeam) columnStyles[colIndex++] = { halign: 'left', cellWidth: 70 };
    if (columnsToInclude.position) columnStyles[colIndex++] = { halign: 'left', cellWidth: 50 };
    if (columnsToInclude.role) columnStyles[colIndex++] = { halign: 'left', cellWidth: 70 };
    if (columnsToInclude.skillRating) columnStyles[colIndex++] = { halign: 'center', cellWidth: 30 };
    if (columnsToInclude.pointsLast4Wednesdays) columnStyles[colIndex++] = { halign: 'center', cellWidth: 40 };
    if (columnsToInclude.totalPointsYear) columnStyles[colIndex++] = { halign: 'center', cellWidth: 40 };


    pdf.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133], fontSize: 8, cellPadding: 2 },
        styles: { fontSize: 7, cellPadding: 1.5 },
        columnStyles: columnStyles,
        alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    pdf.save(`relatorio_jogadores_${managementYear}.pdf`);
  };

  const handleGeneratePlayerHistoryPdf = () => {
    if (!jspdfLoaded || !jspdfAutoTableLoaded) {
      showMessage("Erro: Biblioteca de PDF não carregada.", "error");
      return;
    }
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt' });
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(10);
    pdf.text('Quarta Feirino "C"', 40, 25);
    pdf.setFontSize(18);
    pdf.text('Histórico de Pontos por Jogador', pageWidth / 2, 40, { align: 'center' });
    
    pdf.setFontSize(8);
    pdf.text('Legenda: Jogou = +2 pontos, Jantou = +1 ponto, Faltou = 0 pontos', pageWidth / 2, 55, { align: 'center' });

    const tableColumn = ["Jogador", ...sortedRounds.map(r => new Date(r.date).toLocaleDateString('pt-BR', { month: '2-digit', day: '2-digit' }))];
    const tableRows = [];

    sortedPlayersByName
      .filter(player => player.position !== 'Social' && player.position !== 'Goleiro')
      .forEach(player => {
        const rowData = [player.name];
        sortedRounds.forEach(round => {
            const statusArray = round.playerStatuses[player.id] || [];
            let points = 0;
            if (statusArray.includes('jogou')) points += 2;
            if (statusArray.includes('jantou')) points += 1;
            rowData.push(points.toString());
        });
        tableRows.push(rowData);
    });

    const numDateColumns = sortedRounds.length;
    const margin = 40;
    const usableWidth = pageWidth - (margin * 2);
    const playerNameColWidth = 100;
    const dateColsTotalWidth = usableWidth - playerNameColWidth;
    let dateColWidth = numDateColumns > 0 ? dateColsTotalWidth / numDateColumns : 0;
    
    let fontSize = 7;
    if (dateColWidth < 20) {
        fontSize = 5;
    } else if (dateColWidth < 30) {
        fontSize = 6;
    }
    
    if (numDateColumns > 0 && dateColWidth > 40) {
        dateColWidth = 40;
    }

    const columnStyles = {
        0: { fontStyle: 'bold', halign: 'left', cellWidth: playerNameColWidth }
    };
    for (let i = 1; i < tableColumn.length; i++) {
        columnStyles[i] = { cellWidth: dateColWidth };
    }

    pdf.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 65,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133], fontSize: fontSize, cellPadding: 1, halign: 'center' },
        styles: { fontSize: fontSize, cellPadding: 1, halign: 'center' },
        columnStyles: columnStyles,
        alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    pdf.save('historico_pontos_por_jogador.pdf');
  };

  const handleGenerateMonthlyFeePdf = () => {
    if (!jspdfLoaded || !jspdfAutoTableLoaded) {
      showMessage("Erro: Biblioteca de PDF não carregada.", "error");
      return;
    }
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt' });
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(10);
    pdf.text('Quarta Feirino "C"', 40, 25);
    pdf.setFontSize(18);
    pdf.text(`Relatório de Mensalidades - ${managementYear}`, pageWidth / 2, 40, { align: 'center' });

    let startY = 60;

    if (pixKey) {
        pdf.setFontSize(12);
        pdf.text('Informações para Pagamento via Pix:', 40, startY);
        startY += 15;
        pdf.setFontSize(10);
        pdf.text(`- Tipo: ${pixKeyType} / Chave: ${pixKey} / Nome: ${pixKeyName}`, 40, startY);
        startY += 25;
    }

    const monthsForPdf = ["Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const tableColumn = ["Jogador", ...monthsForPdf];
    const tableRows = [];

    const payingPlayers = sortedPlayersByName.filter(p => !p.isFeeExempt);

    payingPlayers.forEach(player => {
        const rowData = [player.name];
        monthsForPdf.forEach(month => {
            const payment = monthlyPayments[player.id]?.[month];
            if (payment) {
                rowData.push(`Pago - R$ ${payment.amount.toFixed(2)}`);
            } else {
                rowData.push("Aberto");
            }
        });
        tableRows.push(rowData);
    });

    const monthlyFeeColumnStyles = {
        0: { fontStyle: 'bold', cellWidth: 70, halign: 'left' },
    };
    const remainingWidth = pageWidth - (40 + 40 + monthlyFeeColumnStyles[0].cellWidth);
    const monthColumnWidth = remainingWidth / monthsForPdf.length; 

    for (let i = 1; i < tableColumn.length; i++) {
        monthlyFeeColumnStyles[i] = { cellWidth: monthColumnWidth, fontSize: 6, halign: 'center', cellPadding: 0.5 };
    }

    pdf.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: startY,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133], fontSize: 6, cellPadding: 1, halign: 'center' },
        styles: { fontSize: 6, cellPadding: 0.5, halign: 'center' },
        columnStyles: monthlyFeeColumnStyles,
        alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    pdf.save(`mensalidades_${managementYear}.pdf`);
  };

  const handleGenerateCaixaPdf = () => {
    if (!jspdfLoaded || !jspdfAutoTableLoaded) {
      showMessage("Erro: Biblioteca de PDF não carregada.", "error");
      return;
    }
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt' });
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(10);
    pdf.text('Quarta Feirino "C"', 40, 25);
    pdf.setFontSize(18);
    pdf.text(`Relatório de Caixa - ${managementYear}`, pageWidth / 2, 40, { align: 'center' });

    const tableColumn = ["Data", "Descrição", "Centro de Custo", "Valor (R$)"];
    const tableRows = [];

    const sortedTransactions = [...financialTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedTransactions.forEach(t => {
        const value = t.type === 'despesa' ? `- R$ ${t.amount.toFixed(2)}` : `R$ ${t.amount.toFixed(2)}`;
        tableRows.push([
            new Date(t.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}),
            t.description,
            t.costCenter || 'N/A',
            value
        ]);
    });

    const finalBalanceRow = [
        '',
        '',
        { content: 'Saldo Final', styles: { fontStyle: 'bold', halign: 'right' } },
        { content: `R$ ${totalBalance.toFixed(2)}`, styles: { fontStyle: 'bold', textColor: totalBalance >= 0 ? [34, 139, 34] : [255, 0, 0] } }
    ];
    tableRows.push(finalBalanceRow);


    pdf.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133], fontSize: 8, cellPadding: 2, halign: 'center' },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 70, halign: 'center' },
            1: { cellWidth: 'auto', minCellWidth: 100, halign: 'left' },
            2: { cellWidth: 80, halign: 'center' },
            3: { cellWidth: 70, halign: 'right' }
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    pdf.save(`relatorio_caixa_${managementYear}.pdf`);
  };

  const handleGenerateReceipt = (playerId, month) => {
    if (!jspdfLoaded) {
      showMessage("Erro: Biblioteca de PDF não carregada.", "error");
      return;
    }
    const player = players.find(p => p.id === playerId);
    const payment = monthlyPayments[playerId]?.[month];
    if (!player || !payment) {
      showMessage("Erro: Pagamento ou jogador não encontrado para gerar o recibo.", "error");
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt' });
    
    let monthsPaid = [month];
    let totalAmount = payment.amount;

    if (payment.multiPaymentId) {
        const playerPayments = monthlyPayments[playerId];
        monthsPaid = Object.keys(playerPayments).filter(m => playerPayments[m].multiPaymentId === payment.multiPaymentId);
        totalAmount = monthsPaid.length * payment.amount; 
    }

    const pageWidth = pdf.internal.pageSize.getWidth();
    pdf.setFontSize(10);
    pdf.text('Quarta Feirino "C"', 40, 25);
    pdf.setFontSize(22);
    pdf.text('Recibo de Mensalidade', pageWidth / 2, 60, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Recebemos de: ${player.name}`, 40, 120);
    pdf.text(`Referente ao(s) mês(es) de: ${monthsPaid.join(', ')}`, 40, 140);
    pdf.text(`Valor Total Pago: R$ ${totalAmount.toFixed(2)}`, 40, 160);
    pdf.text(`Método de Pagamento: ${payment.method}`, 40, 180);
    pdf.text(`Data do Pagamento: ${new Date(payment.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}`, 40, 200);

    pdf.text('Quarta Feirino "C"', 40, 260);
    pdf.save(`recibo_${player.name}_${monthsPaid.join('_')}.pdf`);
  };

  const handleSaveToFile = () => {
    try {
      const dataToSave = JSON.stringify({ players, rounds, savedMatches, monthlyPayments, managementYear, historicalData, defaultFee, financialTransactions, initialBalance, calendarEvents, presenceList, pixKeyType, pixKey, pixKeyName }, null, 2);
      const blob = new Blob([dataToSave], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dados_quarta_feirino.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showMessage("Arquivo de dados salvo com sucesso!", "success");
      setHasUnsavedChanges(false);
    } catch (error) {
      showMessage("Ocorreu um erro ao salvar o arquivo.", "error");
    }
  };

  const triggerLoadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    fileToLoad.current = file;
    setConfirmationModal({
        isOpen: true,
        title: 'Carregar de Arquivo',
        message: 'Tem certeza? Esta ação irá sobrescrever todos os dados atuais com os dados do arquivo. Esta ação não pode ser desfeita.',
        onConfirm: () => {
            handleLoadFromFile();
            if (event.target) event.target.value = null;
        }
    });
  };

  const handleLoadFromFile = () => {
    const file = fileToLoad.current;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.players && data.rounds) {
          setPlayers(data.players);
          setRounds(data.rounds);
          setSavedMatches(data.savedMatches || []);
          setMonthlyPayments(data.monthlyPayments || {});
          setManagementYear(data.managementYear || new Date().getFullYear());
          setHistoricalData(data.historicalData || []);
          setDefaultFee(data.defaultFee || '50');
          setFinancialTransactions(data.financialTransactions || []);
          setInitialBalance(data.initialBalance || 0);
          setCalendarEvents(data.calendarEvents || {});
          setPresenceList(data.presenceList || {});
          setPixKeyType(data.pixKeyType || 'CPF');
          setPixKey(data.pixKey || '');
          setPixKeyName(data.pixKeyName || '');
          showMessage("Dados carregados com sucesso do arquivo! Os dados serão sincronizados com a nuvem.", "success");
          setHasUnsavedChanges(false);
        } else {
          showMessage("Arquivo inválido.", "error");
        }
      } catch (error) {
        showMessage("Não foi possível ler o arquivo.", "error");
      } finally {
        setConfirmationModal({ isOpen: false });
        fileToLoad.current = null;
      }
    };
    reader.readAsText(file);
  };
  
  const handleSaveToCloud = async () => {
    if (!cloudBinId || !cloudApiKey) {
      showMessage("As credenciais do backup em nuvem não estão configuradas.", "error");
      return;
    }
    showMessage("A salvar backup na nuvem (jsonbin.io)...", "info");
    try {
      const dataToSave = { players, rounds, savedMatches, monthlyPayments, managementYear, historicalData, defaultFee, financialTransactions, initialBalance, calendarEvents, presenceList, pixKeyType, pixKey, pixKeyName };
      const response = await fetch(`https://api.jsonbin.io/v3/b/${cloudBinId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': cloudApiKey,
        },
        body: JSON.stringify(dataToSave),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      showMessage("Backup salvo na nuvem com sucesso!");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Erro ao salvar na nuvem:", error);
      showMessage("Erro ao salvar backup na nuvem. Verifique a consola.", "error");
    }
  };

  const triggerLoadFromCloud = () => {
    setConfirmationModal({
        isOpen: true,
        title: 'Carregar da Nuvem',
        message: 'Tem certeza? Esta ação irá buscar o último backup salvo na nuvem e sobrescrever todos os dados atuais. Esta ação não pode ser desfeita.',
        onConfirm: () => handleLoadFromCloud()
    });
  };

  const handleLoadFromCloud = async () => {
    setConfirmationModal({ isOpen: false });
    if (!cloudBinId || !cloudApiKey) {
      showMessage("As credenciais do backup em nuvem não estão configuradas.", "error");
      return;
    }
    showMessage("A carregar backup da nuvem (jsonbin.io)...", "info");
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${cloudBinId}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': cloudApiKey,
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.record && data.record.players && data.record.rounds) {
        const cloudData = data.record;
        setPlayers(cloudData.players);
        setRounds(cloudData.rounds);
        setSavedMatches(cloudData.savedMatches || []);
        setMonthlyPayments(cloudData.monthlyPayments || {});
        setManagementYear(cloudData.managementYear || new Date().getFullYear());
        setHistoricalData(cloudData.historicalData || []);
        setDefaultFee(cloudData.defaultFee || '50');
        setFinancialTransactions(cloudData.financialTransactions || []);
        setInitialBalance(cloudData.initialBalance || 0);
        setCalendarEvents(cloudData.calendarEvents || {});
        setPresenceList(cloudData.presenceList || {});
        setPixKeyType(cloudData.pixKeyType || 'CPF');
        setPixKey(cloudData.pixKey || '');
        setPixKeyName(cloudData.pixKeyName || '');
        showMessage("Backup carregado da nuvem! Os dados serão sincronizados com o Firestore.");
        setHasUnsavedChanges(false);
      } else {
        showMessage("Dados na nuvem parecem estar vazios ou em formato inválido.", "error");
      }
    } catch (error) {
      console.error("Erro ao carregar da nuvem:", error);
      showMessage("Erro ao carregar backup da nuvem. Verifique a configuração e a consola.", "error");
    }
  };

  const handleSaveMatch = () => {
    const newMatch = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      teamA,
      teamB,
      reserves,
      scoreTeamA: scoreTeamA,
      scoreTeamB: scoreTeamB,
      goals: currentGoals,
      mode: gameMode, // Save the mode for context
    };
    setSavedMatches(prev => [newMatch, ...prev]);
    showMessage("Partida salva com sucesso!");
    setScoreTeamA('');
    setScoreTeamB('');
    setCurrentGoals([]);
  };

  const handleLoadMatch = (match) => {
    setTeamA(match.teamA);
    setTeamB(match.teamB);
    setReserves(match.reserves);
    setSelectedStarters([...match.teamA, ...match.teamB, ...match.reserves]);
    setScoreTeamA(match.scoreTeamA || '');
    setScoreTeamB(match.scoreTeamB || '');
    setCurrentGoals(match.goals || []);
    setGameMode(match.mode || 'quarta'); // Load game mode
    setActiveTab('times');
    showMessage(`Partida de ${new Date(match.date).toLocaleDateString('pt-BR')} carregada.`);
  };

  const handleDeleteMatch = (matchId) => {
    setSavedMatches(prev => prev.filter(m => m.id !== matchId));
    setShowDeleteMatchModal(null);
    showMessage("Partida apagada com sucesso.");
  };

  const handleOpenPaymentModal = (playerId, months, paymentToEdit = null) => {
    const monthsArray = Array.isArray(months) ? months : [months];
    if (paymentToEdit) {
        // Editing a single, existing payment
        setCurrentPayment({ 
            playerId, 
            months: monthsArray, 
            isEditing: true, 
            paymentId: paymentToEdit.id 
        });
        setPaymentMethod(paymentToEdit.method);
        setPaymentAmount(paymentToEdit.amount.toFixed(2));
        setPaymentDate(paymentToEdit.date);
    } else {
        // Creating a new payment for one or more months
        const totalAmount = monthsArray.length * parseFloat(defaultFee);
        setCurrentPayment({ 
            playerId, 
            months: monthsArray, 
            isEditing: false, 
            paymentId: null 
        });
        setPaymentMethod('Dinheiro');
        setPaymentAmount(totalAmount.toFixed(2));
        setPaymentDate(new Date().toISOString().split('T')[0]);
    }
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    const { playerId, months, isEditing, paymentId } = currentPayment;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount < 0) {
      showMessage("Por favor, insira um valor válido.", 'error');
      return;
    }

    if (isEditing) {
        // --- EDIT LOGIC ---
        const month = months[0]; // Editing only happens for a single month
        
        // Update the payment record
        setMonthlyPayments(prev => {
            const newPlayerPayments = { ...prev[playerId] };
            newPlayerPayments[month] = {
                ...newPlayerPayments[month],
                method: paymentMethod,
                date: paymentDate,
                amount: amount,
            };
            return { ...prev, [playerId]: newPlayerPayments };
        });

        // Update the corresponding financial transaction
        setFinancialTransactions(prev => prev.map(t => {
            if (t.paymentId === paymentId) {
                return {
                    ...t,
                    date: paymentDate,
                    amount: amount,
                    description: `Mensalidade - ${month} - ${players.find(p => p.id === playerId)?.name}`
                };
            }
            return t;
        }));
        showMessage("Pagamento atualizado com sucesso!");

    } else {
        // --- CREATE NEW LOGIC (unchanged) ---
        const newPaymentId = crypto.randomUUID();
        
        setMonthlyPayments(prev => {
            const newPlayerPayments = { ...prev[playerId] };
            months.forEach(month => {
                const paymentEntry = {
                    method: paymentMethod,
                    date: paymentDate,
                    amount: amount / months.length,
                    id: newPaymentId,
                };
                paymentEntry.multiPaymentId = months.length > 1 ? newPaymentId : null; 
                newPlayerPayments[month] = paymentEntry;
            });
            return { ...prev, [playerId]: newPlayerPayments };
        });

        if (amount > 0) {
            const player = players.find(p => p.id === playerId);
            const description = months.length > 1 
                ? `Mensalidades - ${months.join(', ')} - ${player.name}`
                : `Mensalidade - ${months[0]} - ${player.name}`;

            const newTransaction = {
              id: crypto.randomUUID(),
              paymentId: newPaymentId,
              date: paymentDate,
              description: description,
              amount: amount,
              type: 'receita',
              source: 'automatic',
              costCenter: 'Mensalidades'
            };
            setFinancialTransactions(prev => [...prev, newTransaction]);
        }
        setSelectedPayments(prev => ({...prev, [playerId]: []}));
        showMessage("Pagamento registado com sucesso!");
    }

    setPaymentModalOpen(false);
  };

  const handleCancelPayment = (paymentInfo) => {
    const { playerId, month } = paymentInfo;
    const payment = monthlyPayments[playerId]?.[month];
    if (!payment) return;

    const paymentId = payment.id;
    const multiPaymentId = payment.multiPaymentId;

    setMonthlyPayments(prev => {
        const newPayments = { ...prev };
        const playerPayments = { ...newPayments[playerId] };

        if (multiPaymentId) {
            Object.keys(playerPayments).forEach(m => {
                if (playerPayments[m].multiPaymentId === multiPaymentId) {
                    delete playerPayments[m];
                }
            });
        } else {
            delete playerPayments[month];
        }

        newPayments[playerId] = playerPayments;
        return newPayments;
    });

    if (paymentId) {
      setFinancialTransactions(prev => prev.filter(t => t.paymentId !== paymentId));
    }

    setShowDeletePaymentModal(null);
    showMessage("Pagamento cancelado com sucesso.");
  };

  const handleEndYear = () => {
    const archiveData = {
      year: managementYear,
      rounds,
      savedMatches,
      monthlyPayments,
      financialTransactions,
      initialBalance,
      calendarEvents
    };
    setHistoricalData(prev => [...prev, archiveData]);
    setRounds([]);
    setSavedMatches([]);
    setMonthlyPayments({});
    setInitialBalance(totalBalance);
    setFinancialTransactions([]);
    setCalendarEvents({});
    setManagementYear(prev => prev + 1);
    setShowEndYearModal(false);
    showMessage(`Gestão ${managementYear} encerrando. Iniciando gestão ${managementYear + 1}!`);
  };

  const handleOpenTransactionModal = (type, transaction = null) => {
    setTransactionType(type);
    if (transaction) {
      setCurrentTransaction(transaction);
      setTransactionDate(transaction.date);
      setTransactionDescription(transaction.description);
      setTransactionAmount(transaction.amount);
      setTransactionCostCenter(transaction.costCenter || 'Outros');
    } else {
      setCurrentTransaction(null);
      setTransactionDate(new Date().toISOString().split('T')[0]);
      setTransactionDescription('');
      setTransactionAmount('');
      setTransactionCostCenter('Outros');
    }
    setTransactionModalOpen(true);
  };

  const handleSaveTransaction = () => {
    const amount = parseFloat(transactionAmount);
    if (!transactionDescription.trim() || isNaN(amount) || amount <= 0) {
      showMessage("Preencha todos os campos corretamente.", 'error');
      return;
    }

    if (currentTransaction) {
      setFinancialTransactions(prev => prev.map(t => 
        t.id === currentTransaction.id 
        ? { ...t, date: transactionDate, description: transactionDescription, amount: amount, costCenter: transactionCostCenter }
        : t
      ));
      showMessage("Lançamento atualizado!");
    } else {
      const newTransaction = {
        id: crypto.randomUUID(),
        date: transactionDate,
        description: transactionDescription.trim(),
        amount: amount,
        type: transactionType,
        source: 'manual',
        costCenter: transactionCostCenter
      };
      setFinancialTransactions(prev => [...prev, newTransaction]);
      showMessage("Lançamento adicionado!");
    }
    setTransactionModalOpen(false);
  };
  
  const handleCostCenterChange = (transactionId, newCostCenter) => {
    setFinancialTransactions(prev =>
        prev.map(t =>
            t.id === transactionId ? { ...t, costCenter: newCostCenter } : t
        )
    );
  };

  const handleDeleteTransaction = (transactionId) => {
    setFinancialTransactions(prev => prev.filter(t => t.id !== transactionId));
    setShowDeleteTransactionModal(null);
    showMessage("Lançamento apagado.");
  };

  // --- Calendar Functions ---
  const handleSaveCalendarEvent = (eventData) => {
    const { date } = eventData;
    if (!date) return;

    setCalendarEvents(prev => {
        const newEvents = { ...prev };
        const existingEvent = newEvents[date] || {};
        newEvents[date] = { ...existingEvent, ...eventData, date: date };
        if (existingEvent.birthdays) {
            newEvents[date].birthdays = existingEvent.birthdays;
        }
        return newEvents;
    });
    setEventModalOpen(false);
    setCurrentEvent(null);
    showMessage("Evento salvo no calendário!");
  };
  
  const handleDeleteCalendarEvent = (date) => {
    setCalendarEvents(prev => {
        const newEvents = { ...prev };
        if (newEvents[date]) {
            delete newEvents[date].title;
            delete newEvents[date].hostId;
            delete newEvents[date].location;
            if (!newEvents[date].birthdays || newEvents[date].birthdays.length === 0) {
                delete newEvents[date];
            }
        }
        return newEvents;
    });
    setShowDeleteEventModal(null);
    showMessage("Evento removido do calendário.");
  };

  const handleGenerateCalendarPdf = () => {
    if (!jspdfLoaded || !jspdfAutoTableLoaded) {
        showMessage("Erro: Biblioteca de PDF não carregada.", "error");
        return;
    }
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    pdf.setFontSize(10);
    pdf.text('Quarta Feirino "C"', 40, 25);
    pdf.setFontSize(18);
    pdf.text(`Calendário de Eventos Futuros - ${managementYear}`, pageWidth / 2, 40, { align: 'center' });

    const tableColumn = ["Data", "Anfitrião", "Local", "Evento Especial"];
    const tableRows = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yearEvents = Object.values(allCalendarEvents)
        .filter(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            return eventDate.getFullYear() === managementYear && eventDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    yearEvents.forEach(event => {
        const date = new Date(event.date + 'T00:00:00');
        const formattedDate = date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
        const anfitriao = players.find(p => p.id === event.hostId)?.name || '---';
        const local = event.location || '---';
        let specialEvent = event.title || '';
        if (event.birthdays) {
            const birthdayNames = event.birthdays.map(b => b.name).join(', ');
            specialEvent += `${specialEvent ? ' / ' : ''}Aniversário: ${birthdayNames}`;
        }
        if (!specialEvent) specialEvent = '---';
        
        tableRows.push([formattedDate, anfitriao, local, specialEvent]);
    });
    
    if (tableRows.length === 0) {
        const body = [[{content: `Nenhum evento futuro agendado para ${managementYear}.`, colSpan: 4, styles: { halign: 'center' }}]];
        pdf.autoTable({ head: [tableColumn], body, startY: 60, theme: 'grid' });
    } else {
         pdf.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
            columnStyles: {
                0: { cellWidth: 120 },
                1: { cellWidth: 120 },
                2: { cellWidth: 'auto' },
                3: { cellWidth: 'auto' },
            },
        });
    }

    pdf.save(`calendario_futuro_${managementYear}.pdf`);
  };

  const handleGeneratePresenceListPdf = () => {
    if (!jspdfLoaded || !jspdfAutoTableLoaded) {
        showMessage("Erro: Biblioteca de PDF não carregada.", "error");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 40;
    
    pdf.setFontSize(10);
    pdf.text('Quarta Feirino "C"', margin, 25);
    pdf.setFontSize(18);
    pdf.text('Lista de Presença', pageWidth / 2, 40, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' }), pageWidth / 2, 60, { align: 'center' });

    const playersByStatus = {
        jogo: players.filter(p => presenceList[p.id] === 'jogo').sort((a,b) => (playerRankMap.get(a.id) || 999) - (playerRankMap.get(b.id) || 999)),
        '1º tempo': players.filter(p => presenceList[p.id] === '1º tempo').sort((a,b) => (playerRankMap.get(a.id) || 999) - (playerRankMap.get(b.id) || 999)),
        '2º tempo': players.filter(p => presenceList[p.id] === '2º tempo').sort((a,b) => (playerRankMap.get(a.id) || 999) - (playerRankMap.get(b.id) || 999)),
        janta: players.filter(p => presenceList[p.id] === 'janta').sort((a,b) => a.name.localeCompare(b.name)),
        ausente: players.filter(p => !presenceList[p.id] || presenceList[p.id] === 'ausente').sort((a,b) => a.name.localeCompare(b.name)),
    };

    let leftColumnY = 80;
    let rightColumnY = 80;
    const columnWidth = (pageWidth - margin * 3) / 2;

    const drawTable = (title, players, color, startY, tableMargin, width) => {
        if (players.length === 0) return startY;
        const body = players.map(p => [`#${playerRankMap.get(p.id) || '-'}`, p.name]);
        pdf.autoTable({
            head: [[{ content: `${title} (${body.length})`, colSpan: 2, styles: { fillColor: color, textColor: 255 } }]],
            body: body,
            startY: startY,
            theme: 'grid',
            tableWidth: width,
            margin: { left: tableMargin },
            columnStyles: { 0: { cellWidth: 30, halign: 'center' }, 1: { cellWidth: 'auto' } }
        });
        return pdf.autoTable.previous.finalY + 15;
    };
    
    const drawSimpleTable = (title, players, color, startY, tableMargin, width) => {
        if (players.length === 0) return startY;
        const body = players.map(p => [p.name]);
        pdf.autoTable({
            head: [[`${title} (${body.length})`]],
            body: body,
            startY: startY,
            theme: 'grid',
            tableWidth: width,
            margin: { left: tableMargin },
            headStyles: { fillColor: color, textColor: 255 },
        });
        return pdf.autoTable.previous.finalY + 15;
    };

    leftColumnY = drawTable('Confirmados para o Jogo', playersByStatus.jogo, [34, 139, 34], leftColumnY, margin, columnWidth);
    leftColumnY = drawTable('Confirmados para o 1º Tempo', playersByStatus['1º tempo'], [0, 139, 139], leftColumnY, margin, columnWidth);
    leftColumnY = drawTable('Confirmados para o 2º Tempo', playersByStatus['2º tempo'], [255, 165, 0], leftColumnY, margin, columnWidth);

    rightColumnY = drawSimpleTable('Apenas Janta', playersByStatus.janta, [65, 105, 225], rightColumnY, margin + columnWidth + margin, columnWidth);
    rightColumnY = drawSimpleTable('Ausentes', playersByStatus.ausente, [220, 20, 60], rightColumnY, margin + columnWidth + margin, columnWidth);
    
    pdf.save(`lista_presenca.pdf`);
  };


  const handleAddLateReserve = () => {
    if (!lateReservePlayer) {
        showMessage("Selecione um jogador para adicionar.", "error");
        return;
    }
    const playerToAdd = players.find(p => p.id === lateReservePlayer);
    if (playerToAdd) {
        setReserves(prev => [...prev, playerToAdd]);
        setSelectedStarters(prev => [...prev, playerToAdd]);
        setLateReservePlayer('');
        showMessage(`${playerToAdd.name} foi adicionado como reserva.`, 'success');
    }
  };

  const handleAddGoal = () => {
    if (!newGoalPlayer || !newGoalTeam) {
      showMessage("Preencha o jogador e o time do gol.", "error");
      return;
    }
    const player = players.find(p => p.id === newGoalPlayer);
    if (!player) {
      showMessage("Jogador do gol não encontrado.", "error");
      return;
    }
    const newGoal = {
      playerId: newGoalPlayer,
      playerName: player.name,
      teamId: newGoalTeam,
    };
    setCurrentGoals(prev => [...prev, newGoal]);
    setNewGoalPlayer('');
    setNewGoalTeam('');
    showMessage("Gol adicionado!");
  };

  const handleDeleteGoal = (index) => {
    setCurrentGoals(prev => prev.filter((_, i) => i !== index));
    showMessage("Gol removido.");
  };

  // --- Free Play Drag and Drop Handlers ---
  const handleFreePlayDragStart = (e, player, sourceColumn) => {
    setDraggedItem({ player, sourceColumn });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFreePlayDragOver = (e) => {
    e.preventDefault();
  };

  const handleFreePlayDrop = (e, targetColumn) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { player, sourceColumn } = draggedItem;

    // Prevent dropping in the same column
    if (sourceColumn === targetColumn) {
      setDraggedItem(null);
      return;
    }

    setFreeTeams(prev => {
      const newTeams = { ...prev };
      // Remove from source
      newTeams[sourceColumn] = newTeams[sourceColumn].filter(p => p.id !== player.id);
      // Add to target
      newTeams[targetColumn] = [...newTeams[targetColumn], player].sort((a,b) => a.name.localeCompare(b.name));
      return newTeams;
    });

    setDraggedItem(null);
  };
    
  const handleShareDashboardImage = async () => {
    setIsShareDashboardModalOpen(false); // Close modal first
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for modal to disappear

    const dashboardArea = document.getElementById('dashboard-capture-area');
    if (!dashboardArea || !html2canvasLoaded) {
        showMessage("Não foi possível gerar a imagem.", "error");
        return;
    }
    
    const allCards = dashboardArea.querySelectorAll('[data-card-id]');
    const originalDisplays = new Map();

    // Hide non-selected cards
    allCards.forEach(card => {
        originalDisplays.set(card, card.style.display);
        if (!selectedDashboardCards[card.dataset.cardId]) {
            card.style.display = 'none';
        }
    });
    
    // Add a temporary title for the capture
    const tempTitle = document.createElement('div');
    tempTitle.className = 'text-center mb-6 px-4';
    tempTitle.innerHTML = `<h2 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Dashboard Quarta Feirino "C"</h2><p class="text-lg text-gray-600 dark:text-gray-400">${new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' })}</p>`;
    dashboardArea.prepend(tempTitle);

    try {
        const canvas = await window.html2canvas(dashboardArea, {
            scale: 2,
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' // Match theme background
        });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'dashboard_quarta_feirino.png';
        link.click();
        showMessage("Imagem do dashboard gerada com sucesso!", "success");
    } catch (error) {
        console.error("Erro ao gerar imagem do dashboard:", error);
        showMessage("Ocorreu um erro ao gerar a imagem.", "error");
    } finally {
        // Restore card visibility and remove title
        allCards.forEach(card => {
            card.style.display = originalDisplays.get(card) || '';
        });
        dashboardArea.removeChild(tempTitle);
    }
  };


  // --- Derived State & Memos ---
  const allCalendarEvents = useMemo(() => {
    const combinedEvents = JSON.parse(JSON.stringify(calendarEvents));

    players.forEach(player => {
        if (player.birthDate && player.birthDate.includes('-')) {
            const [day, month] = player.birthDate.split('-');
            if (day && month) {
                const dateString = `${managementYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                if (!combinedEvents[dateString]) {
                    combinedEvents[dateString] = { date: dateString, birthdays: [] };
                }
                
                if (!combinedEvents[dateString].birthdays) {
                    combinedEvents[dateString].birthdays = [];
                }

                if (!combinedEvents[dateString].birthdays.some(b => b.id === player.id)) {
                  combinedEvents[dateString].birthdays.push({ id: player.id, name: player.name });
                }
            }
        }
    });

    return combinedEvents;
  }, [players, calendarEvents, managementYear]);

  const paymentMonths = useMemo(() => ["Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], []);

  const overduePlayers = useMemo(() => {
    const overdue = [];
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (managementYear !== currentYear) {
        return [];
    }

    const lastMonthJsIndexToCheck = currentMonthIndex - 1;
    
    const lastPaymentMonthIndexToCheck = lastMonthJsIndexToCheck - 2;

    if (lastPaymentMonthIndexToCheck < 0) {
        return [];
    }

    const pastMonths = paymentMonths.slice(0, lastPaymentMonthIndexToCheck + 1);

    players.filter(p => !p.isFeeExempt).forEach(player => {
        const unpaidMonths = [];
        pastMonths.forEach(month => {
            if (!monthlyPayments[player.id]?.[month]) {
                unpaidMonths.push(month);
            }
        });

        if (unpaidMonths.length > 0) {
            overdue.push({ ...player, overdueMonths: unpaidMonths });
        }
    });

    return overdue;
  }, [players, monthlyPayments, paymentMonths, managementYear]);

  const overduePlayerIds = useMemo(() => new Set(overduePlayers.map(p => p.id)), [overduePlayers]);

  const playerStats = getPlayerStats();
  const teamColors = [
    { value: 'blue-600', label: 'Azul Escuro' },
    { value: 'sky-500', label: 'Azul Claro' },
    { value: 'red-600', label: 'Vermelho' },
    { value: 'green-600', label: 'Verde' },
    { value: 'gray-800', label: 'Preto' },
    { value: 'yellow-500', label: 'Amarelo' },
    { value: 'purple-600', label: 'Roxo' },
  ];

  const substitutionMap = useMemo(() => {
    if (gameMode === 'livre' || (reserves.length === 0 && !selectedStarters.some(p => presenceList[p.id] === '1º tempo'))) {
        return {};
    }

    const reservesEntering = [...reserves].sort((a, b) => (playerRankMap.get(a.id) || 999) - (playerRankMap.get(b.id) || 999));
    const playersLeavingFirstHalf = selectedStarters.filter(p => presenceList[p.id] === '1º tempo');
    const startersEligibleForSub = selectedStarters
        .filter(p => p.position !== 'Goleiro' && presenceList[p.id] !== '1º tempo')
        .sort((a, b) => (playerRankMap.get(b.id) || 999) - (playerRankMap.get(a.id) || 999));

    const numRegularSubsNeeded = Math.max(0, reserves.length - playersLeavingFirstHalf.length);
    const playersSubbedRegularly = startersEligibleForSub.slice(0, numRegularSubsNeeded);
    const allPlayersLeaving = [...playersLeavingFirstHalf, ...playersSubbedRegularly];

    if (allPlayersLeaving.length === 0 || reservesEntering.length === 0) {
        return {};
    }

    const teamAIds = new Set(teamA.map(p => p.id));
    let leavingFromA = allPlayersLeaving.filter(p => teamAIds.has(p.id));
    let leavingFromB = allPlayersLeaving.filter(p => !teamAIds.has(p.id));

    let sumA = teamA.reduce((acc, p) => acc + p.skillRating, 0);
    let sumB = teamB.reduce((acc, p) => acc + p.skillRating, 0);

    const newSubMap = {};
    const availableReserves = [...reservesEntering];

    while (availableReserves.length > 0) {
        const reserve = availableReserves.shift();
        let playerToReplace = null;
        let teamToJoin = null;

        const canJoinA = leavingFromA.length > 0;
        const canJoinB = leavingFromB.length > 0;

        if (canJoinA && !canJoinB) {
            teamToJoin = 'A';
        } else if (!canJoinA && canJoinB) {
            teamToJoin = 'B';
        } else if (canJoinA && canJoinB) {
            const playerOutA = leavingFromA[0];
            const playerOutB = leavingFromB[0];
            const hypotheticalSumA = sumA - playerOutA.skillRating + reserve.skillRating;
            const hypotheticalSumB = sumB - playerOutB.skillRating + reserve.skillRating;
            
            const diffIfJoinsA = Math.abs(hypotheticalSumA - (sumB - playerOutB.skillRating));
            const diffIfJoinsB = Math.abs((sumA - playerOutA.skillRating) - hypotheticalSumB);

            if (diffIfJoinsA <= diffIfJoinsB) {
                teamToJoin = 'A';
            } else {
                teamToJoin = 'B';
            }
        }

        if (teamToJoin === 'A') {
            playerToReplace = leavingFromA.shift();
            sumA = sumA - playerToReplace.skillRating + reserve.skillRating;
        } else if (teamToJoin === 'B') {
            playerToReplace = leavingFromB.shift();
            sumB = sumB - playerToReplace.skillRating + reserve.skillRating;
        }
        
        if (playerToReplace) {
            newSubMap[reserve.id] = playerToReplace;
        }
    }

    return newSubMap;
  }, [reserves, selectedStarters, presenceList, playerRankMap, teamA, teamB, gameMode]);

  const substitutedPlayerIds = useMemo(() => {
    return new Set(Object.values(substitutionMap).map(player => player.id));
  }, [substitutionMap]);

  const nextGame = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const sortedEvents = Object.values(allCalendarEvents)
      .filter(event => new Date(event.date + 'T00:00:00') >= today && (event.hostId || event.title))
      .sort((a,b) => new Date(a.date) - new Date(b.date));
    return sortedEvents[0];
  }, [allCalendarEvents]);

  const birthdaysThisWeek = useMemo(() => {
    const today = new Date();
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return players.filter(player => {
      if (!player.birthDate || !player.birthDate.includes('-')) return false;
      const [day, month] = player.birthDate.split('-');
      if (!day || !month) return false;

      const birthdayThisYear = new Date(`${managementYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T12:00:00Z`);
      
      if (isNaN(birthdayThisYear.getTime())) return false;

      return birthdayThisYear >= startOfWeek && birthdayThisYear <= endOfWeek;
    });
  }, [players, managementYear]);

  const presenceCounts = useMemo(() => {
    return Object.values(presenceList).reduce((acc, status) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, { jogo: 0, janta: 0, '1º tempo': 0, '2º tempo': 0, ausente: 0 });
  }, [presenceList]);
  
  const totalDinnerCount = useMemo(() => {
    return (presenceCounts.jogo || 0) + 
           (presenceCounts['1º tempo'] || 0) + 
           (presenceCounts['2º tempo'] || 0) + 
           (presenceCounts.janta || 0);
  }, [presenceCounts]);

  const topScorers = useMemo(() => {
    const goalCounts = {};
    const currentYearMatches = savedMatches.filter(match => new Date(match.date).getFullYear() === managementYear);

    currentYearMatches.forEach(match => {
        if (match.goals) {
            match.goals.forEach(goal => {
                goalCounts[goal.playerId] = (goalCounts[goal.playerId] || 0) + 1;
            });
        }
    });

    return Object.entries(goalCounts)
        .map(([playerId, goals]) => ({
            player: players.find(p => p.id === playerId),
            goals,
        }))
        .filter(item => item.player)
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 3);
  }, [savedMatches, players, managementYear]);
  
  const handleGenerateAnnouncement = () => {
    if (!nextGame) {
      showMessage("Nenhum próximo evento encontrado para gerar um anúncio.", "error");
      return;
    }
    
    const anfitriao = nextGame.hostId ? players.find(p => p.id === nextGame.hostId)?.name : 'A definir';
    const local = nextGame.location || 'A definir';
    const data = new Date(nextGame.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

    let announcementText = `📢 *CONVOCAÇÃO QUARTA-FEIRINO "C"* 📢\n\n`;
    announcementText += `🗓️ *Data:* ${data}\n`;
    announcementText += `👤 *Anfitrião:* ${anfitriao}\n`;
    announcementText += `📍 *Local:* ${local}\n\n`;
    
    if (nextGame.title) {
        announcementText += `🎉 *Evento Especial:* ${nextGame.title}\n\n`;
    }
    
    const birthdaysForAnnouncement = birthdaysThisWeek;
    if (birthdaysForAnnouncement.length > 0) {
        const birthdayNames = birthdaysForAnnouncement.map(p => p.name).join(', ');
        announcementText += `🎂 *Aniversariantes da Semana:* Parabéns, ${birthdayNames}!\n\n`;
    }

    const top16Players = sortedPlayersByRank
        .filter(p => p.position !== 'Goleiro' && p.position !== 'Social')
        .slice(0, 16);

    if (top16Players.length > 0) {
        announcementText += `🏆 *TOP 16 RANKING DA SEMANA* 🏆\n`;
        top16Players.forEach((player, index) => {
            announcementText += `${index + 1}. ${player.name}\n`;
        });
        announcementText += `\n`;
    }

    announcementText += `Por favor, confirme sua presença`;
    announcementText += `*#4FC #QUARTA_FEIRINO_C*`;

    const textArea = document.createElement("textarea");
    textArea.value = announcementText;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showMessage("Anúncio copiado para a área de transferência!", "success");
      } else {
        showMessage("Não foi possível copiar o anúncio.", "error");
      }
    } catch (err) {
      showMessage("Erro ao copiar o anúncio.", "error");
      console.error('Falha ao copiar:', err);
    }
    document.body.removeChild(textArea);
  };

  const renderPlayerListItem = (p, teamName) => {
    const rank = playerRankMap.get(p.id);
    const isSubstituted = teamName !== 'Reserves' && substitutedPlayerIds.has(p.id);
    const isFirstHalfOnly = presenceList[p.id] === '1º tempo';
    const isOverdue = overduePlayerIds.has(p.id);

    let bgColor = 'bg-white dark:bg-gray-700';
    if (playerToSwap?.player.id === p.id) {
        bgColor = 'bg-yellow-300 dark:bg-yellow-600';
    } else if (isOverdue && teamName === 'Reserves' && !isSharing) {
        bgColor = 'bg-red-200 dark:bg-red-800/50';
    } else if (isSubstituted) {
        bgColor = 'bg-orange-200 dark:bg-orange-800/50';
    }

    return (
      <li key={p.id} className={`${bgColor} p-3 rounded-lg shadow-sm flex justify-between items-center transition-colors`}>
        <div className="flex flex-col">
          <span className="flex items-center text-gray-800 dark:text-gray-200">
            {isOverdue && !isSharing && <span className="mr-2" title="Mensalidade em atraso">⚠️</span>}
            {p.position !== 'Goleiro' && rank && <span className="font-bold text-gray-500 dark:text-gray-400 mr-2">#{rank}</span>}
            {p.name}
          </span>
          {teamName === 'Reserves' && substitutionMap[p.id] && (
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Entra no lugar de: {substitutionMap[p.id].name}</span>
          )}
          {isSubstituted && (
            <span className="text-xs text-orange-700 dark:text-orange-400 font-semibold flex items-center gap-1">
                <ArrowDown className="w-3 h-3" /> 
                {isFirstHalfOnly ? 'Sai no intervalo (1º tempo)' : 'Sai para reserva'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isSharing 
            ? <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pos: {p.position}</span>
            : <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"><Star className="w-3 h-3" /> N: {p.skillRating}</span>
          }
          {swapMode && (
            <button onClick={() => handlePlayerSwap(p, teamName)} className="text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" title="Trocar jogador">
              <RefreshCw className="h-5 w-5" />
            </button>
          )}
           <button onClick={() => handleRemovePlayerFromMatch(p.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-gray-600" title="Remover da Partida">
              <X className="h-5 w-5" />
            </button>
        </div>
      </li>
    );
  };

  const totalBalance = useMemo(() => {
    const transactionTotal = financialTransactions.reduce((acc, t) => {
      return t.type === 'receita' ? acc + t.amount : acc - t.amount;
    }, 0);
    return parseFloat(initialBalance) + transactionTotal;
  }, [financialTransactions, initialBalance]);

  const financialSummary = useMemo(() => {
    const summary = {
        receitas: {},
        despesas: {}
    };
    let totalReceitas = 0;
    let totalDespesas = 0;

    financialTransactions
        .filter(t => new Date(t.date).getFullYear() === managementYear)
        .forEach(t => {
            const category = t.costCenter || 'Outros';
            if (t.type === 'receita') {
                summary.receitas[category] = (summary.receitas[category] || 0) + t.amount;
                totalReceitas += t.amount;
            } else {
                summary.despesas[category] = (summary.despesas[category] || 0) + t.amount;
                totalDespesas += t.amount;
            }
        });

    const sortedReceitas = Object.entries(summary.receitas).sort(([, a], [, b]) => b - a);
    const sortedDespesas = Object.entries(summary.despesas).sort(([, a], [, b]) => b - a);
    
    return { receitas: sortedReceitas, despesas: sortedDespesas, totalReceitas, totalDespesas };
  }, [financialTransactions, managementYear]);

  const monthlyChartData = useMemo(() => {
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const data = monthNames.map(m => ({ month: m, receita: 0, despesa: 0 }));

    financialTransactions
        .filter(t => new Date(t.date).getFullYear() === managementYear)
        .forEach(t => {
            const monthIndex = new Date(t.date).getUTCMonth();
            if (t.type === 'receita') {
                data[monthIndex].receita += t.amount;
            } else {
                data[monthIndex].despesa += t.amount;
            }
        });
    
    return data;
  }, [financialTransactions, managementYear]);

  const financialPrediction = useMemo(() => {
    const currentMonthName = meses[new Date().getMonth()];
    const fee = parseFloat(defaultFee) || 0;

    const payingPlayers = players.filter(p => !p.isFeeExempt);
    
    const unpaidPlayers = payingPlayers.filter(p => !monthlyPayments[p.id]?.[currentMonthName]);
    
    const expectedTotal = payingPlayers.length * fee;
    const pendingAmount = unpaidPlayers.length * fee;
    const receivedAmount = expectedTotal - pendingAmount;
    
    return {
      monthName: currentMonthName,
      pendingAmount,
      receivedAmount,
      expectedTotal,
      unpaidCount: unpaidPlayers.length,
      totalCount: payingPlayers.length,
    };
  }, [players, monthlyPayments, defaultFee, meses]);

  const annualFinancialPrediction = useMemo(() => {
    const fee = parseFloat(defaultFee) || 0;
    const payingPlayers = players.filter(p => !p.isFeeExempt);
    
    const expectedTotal = payingPlayers.length * paymentMonths.length * fee;
    
    let receivedTotal = 0;
    payingPlayers.forEach(player => {
        paymentMonths.forEach(month => {
            if (monthlyPayments[player.id]?.[month]) {
                receivedTotal += monthlyPayments[player.id][month].amount;
            }
        });
    });

    const pendingAmount = expectedTotal - receivedTotal;
    
    return {
      receivedAmount: receivedTotal,
      pendingAmount: pendingAmount,
      expectedTotal: expectedTotal,
    };
  }, [players, monthlyPayments, defaultFee, paymentMonths]);


  const handleSelectPayment = (playerId, month) => {
    setSelectedPayments(prev => {
        const currentSelected = prev[playerId] || [];
        const newSelected = currentSelected.includes(month)
            ? currentSelected.filter(m => m !== month)
            : [...currentSelected, month];
        return { ...prev, [playerId]: newSelected };
    });
  };

  const availableForLateReserve = useMemo(() => {
    const starterIds = new Set(selectedStarters.map(p => p.id));
    return players.filter(p => !starterIds.has(p.id) && p.position !== 'Social');
  }, [players, selectedStarters]);

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans p-4 sm:p-6">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes flash-warning {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.03); }
          }
          .animate-flash-warning {
            animation: flash-warning 1.2s infinite ease-in-out;
          }
           .dragging-over {
            background-color: #e0f2fe; /* light blue */
            border-style: dashed;
           }
           .dark .dragging-over {
            background-color: #0c4a6e; /* dark blue */
           }
        `}</style>
        {/* Preload dynamic Tailwind classes */}
        <div className="hidden">
          <span className="bg-blue-600 border-blue-300 bg-blue-100 text-blue-800"></span>
          <span className="bg-sky-500 border-sky-300 bg-sky-100 text-sky-800"></span>
          <span className="bg-red-600 border-red-300 bg-red-100 text-red-800 bg-red-200"></span>
          <span className="bg-green-600 border-green-300 bg-green-100 text-green-800"></span>
          <span className="bg-gray-800 border-gray-500 bg-gray-200 text-gray-900"></span>
          <span className="bg-yellow-500 border-yellow-300 bg-yellow-100 text-yellow-800"></span>
          <span className="bg-purple-600 border-purple-300 bg-purple-100 text-purple-800 bg-purple-500"></span>
          <span className="bg-orange-200 text-orange-700"></span>
          <span className="bg-cyan-100 dark:bg-cyan-900/50"></span>
        </div>

        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <header className="bg-gray-800 dark:bg-gray-900 text-white p-4 text-center rounded-t-xl flex items-center justify-between relative">
            <div className="flex items-center">
              <img src="https://placehold.co/50x25/FFFFFF/000000?text=LOGO" alt="Quarta Feirino C Logo" className="h-10 w-auto mr-3" onError={(e) => e.target.style.display='none'} />
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">⚽ Quarta Feirino "C"</h1>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
              {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>
          </header>

          {message && <Toast message={message} type={messageType} onClose={() => setMessage('')} />}
          
          {showDeleteRoundModal && (
              <ConfirmationModal 
                isOpen={!!showDeleteRoundModal}
                title="Confirmar Exclusão"
                message="Tem certeza que deseja apagar esta rodada?"
                onConfirm={() => handleDeleteRound(showDeleteRoundModal)}
                onClose={() => setShowDeleteRoundModal(null)}
              />
          )}
          
          {showDeletePlayerModal && (
              <ConfirmationModal 
                isOpen={!!showDeletePlayerModal}
                title="Confirmar Exclusão"
                message="Tem certeza que deseja apagar este jogador? Isso o removerá de todas as rodadas também."
                onConfirm={() => handleDeletePlayer(showDeletePlayerModal)}
                onClose={() => setShowDeletePlayerModal(null)}
              />
          )}

          {showDeleteMatchModal && (
              <ConfirmationModal 
                isOpen={!!showDeleteMatchModal}
                title="Confirmar Exclusão"
                message="Tem certeza que deseja apagar esta partida salva?"
                onConfirm={() => handleDeleteMatch(showDeleteMatchModal)}
                onClose={() => setShowDeleteMatchModal(null)}
              />
          )}

          {paymentModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{currentPayment.isEditing ? 'Editar Pagamento' : 'Registar Pagamento'}</h3>
                <p className="mb-4 text-gray-800 dark:text-gray-200">Jogador: <span className="font-semibold">{players.find(p => p.id === currentPayment.playerId)?.name}</span></p>
                <p className="mb-4 text-gray-800 dark:text-gray-200">Mês(es): <span className="font-semibold">{currentPayment.months.join(', ')}</span></p>
                <div className="mb-4">
                  <label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><CalendarDays className="w-4 h-4" /> Data do Pagamento:</label>
                  <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><DollarSign className="w-4 h-4" /> Valor {currentPayment.isEditing ? 'do Mês' : 'Total'} (R$):</label>
                  <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} placeholder="0.00" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" disabled={!currentPayment.isEditing && currentPayment.months.length > 1}/>
                </div>
                <div className="mb-4">
                  <label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><Wallet className="w-4 h-4" /> Método de Pagamento:</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                    <option>Dinheiro</option>
                    <option>Pix</option>
                    <option>Permuta</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setPaymentModalOpen(false)} className="bg-gray-400 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-500 flex items-center gap-1"><X className="w-4 h-4" /> Cancelar</button>
                  <button onClick={handleConfirmPayment} className="bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 flex items-center gap-1"><Check className="w-4 h-4" /> Confirmar</button>
                </div>
              </div>
            </div>
          )}

          {showEndYearModal && (
              <ConfirmationModal 
                isOpen={showEndYearModal}
                title="Confirmar Encerramento"
                message={`Isto irá arquivar todos os dados de ${managementYear} e iniciar uma nova temporada. A lista de jogadores será mantida, mas as rodadas, partidas e mensalidades serão zeradas. Deseja continuar?`}
                onConfirm={handleEndYear}
                onClose={() => setShowEndYearModal(false)}
              />
          )}

          {showDeletePaymentModal && (
              <ConfirmationModal 
                isOpen={!!showDeletePaymentModal}
                title="Confirmar Cancelamento"
                message="Tem certeza que deseja cancelar este pagamento?"
                onConfirm={() => handleCancelPayment(showDeletePaymentModal)}
                onClose={() => setShowDeletePaymentModal(null)}
              />
          )}

          {transactionModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{currentTransaction ? 'Editar Lançamento' : 'Adicionar Lançamento'}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><CalendarDays className="w-4 h-4" /> Data:</label>
                    <input type="date" value={transactionDate} onChange={e => setTransactionDate(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                  </div>
                  <div>
                    <label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><MessageSquare className="w-4 h-4" /> Descrição:</label>
                    <input type="text" value={transactionDescription} onChange={e => setTransactionDescription(e.target.value)} placeholder="Descrição da transação" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                  </div>
                  <div>
                    <label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><BriefcaseBusiness className="w-4 h-4" /> Centro de Custo:</label>
                    <select value={transactionCostCenter} onChange={e => setTransactionCostCenter(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                      {costCenters.map(cc => <option key={cc} value={cc}>{cc}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><DollarSign className="w-4 h-4" /> Valor (R$):</label>
                    <input type="number" value={transactionAmount} onChange={e => setTransactionAmount(e.target.value)} placeholder="0.00" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setTransactionModalOpen(false)} className="bg-gray-400 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-500 flex items-center gap-1"><X className="w-4 h-4" /> Cancelar</button>
                  <button onClick={handleSaveTransaction} className="bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 flex items-center gap-1"><Check className="w-4 h-4" /> Confirmar</button>
                </div>
              </div>
            </div>
          )}

          {showDeleteTransactionModal && (
              <ConfirmationModal 
                isOpen={!!showDeleteTransactionModal}
                title="Confirmar Exclusão"
                message="Tem certeza que deseja apagar este lançamento?"
                onConfirm={() => handleDeleteTransaction(showDeleteTransactionModal)}
                onClose={() => setShowDeleteTransactionModal(null)}
              />
          )}
          
          {eventModalOpen && (
              <EventModal
                  event={currentEvent}
                  players={players}
                  onClose={() => { setEventModalOpen(false); setCurrentEvent(null); }}
                  onSave={handleSaveCalendarEvent}
                  onDelete={(date) => { setEventModalOpen(false); setShowDeleteEventModal(date); }}
              />
          )}
          
          {showDeleteEventModal && (
              <ConfirmationModal 
                isOpen={!!showDeleteEventModal}
                title="Confirmar Exclusão"
                message="Tem certeza que deseja apagar este evento?"
                onConfirm={() => handleDeleteCalendarEvent(showDeleteEventModal)}
                onClose={() => setShowDeleteEventModal(null)}
              />
          )}

          {isPdfOptionsModalOpen && (
              <PdfOptionsModal
                  isOpen={isPdfOptionsModalOpen}
                  onClose={() => setIsPdfOptionsModalOpen(false)}
                  onGenerate={() => {
                      handlePrintPlayerList(selectedPdfColumns);
                      setIsPdfOptionsModalOpen(false);
                  }}
                  selectedColumns={selectedPdfColumns}
                  onColumnToggle={(key) => {
                      setSelectedPdfColumns(prev => ({ ...prev, [key]: !prev[key] }));
                  }}
              />
          )}

          <ConfirmationModal 
            isOpen={confirmationModal.isOpen}
            title={confirmationModal.title}
            message={confirmationModal.message}
            onConfirm={confirmationModal.onConfirm}
            onClose={() => setConfirmationModal({ isOpen: false })}
          />
          
          <ShareDashboardModal
            isOpen={isShareDashboardModalOpen}
            onClose={() => setIsShareDashboardModalOpen(false)}
            selectedCards={selectedDashboardCards}
            onCardToggle={(cardId) => setSelectedDashboardCards(prev => ({...prev, [cardId]: !prev[cardId]}))}
            onGenerate={handleShareDashboardImage}
          />


          {/* Desktop Navigation */}
          <nav className="hidden sm:flex justify-around bg-gray-700 dark:bg-gray-900/50 text-white p-2 border-y border-gray-600 dark:border-gray-700">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'jogadores', label: 'Jogadores' },
              { id: 'calendario', label: 'Calendário' },
              { id: 'montarJogo', label: 'Montar Jogo' },
              { id: 'times', label: 'Times' },
              { id: 'partidas', label: 'Partidas' },
              { id: 'rodadas', label: 'Rodadas' },
              { id: 'mensalidades', label: 'Mensalidades' },
              { id: 'caixa', label: 'Caixa' },
              { id: 'gestão', label: 'Gestão' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2 px-3 text-center font-semibold rounded-md transition-all capitalize m-1 ${activeTab === tab.id ? 'bg-blue-500 shadow-lg' : 'hover:bg-gray-600 dark:hover:bg-gray-700'}`}>
                {tab.label}
              </button>
            ))}
          </nav>

          <main className="p-4 sm:p-6 pb-20 sm:pb-6">
            {activeTab === 'dashboard' && (
              <section>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h2>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setIsShareDashboardModalOpen(true)} className="bg-teal-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-700 flex items-center gap-2">
                            <Share2 className="w-5 h-5" /> Compartilhar Dashboard
                        </button>
                        <button onClick={handleGenerateAnnouncement} className="bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 flex items-center gap-2">
                            <Megaphone className="w-5 h-5" /> Gerar Anúncio
                        </button>
                    </div>
                </div>
                <div id="dashboard-capture-area" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div data-card-id="next-event" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-blue-500" /> Próximo Evento</h3>
                    {nextGame ? (
                      <div>
                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{new Date(nextGame.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
                        {nextGame.title && <p className="text-gray-700 dark:text-gray-300 mt-1"><Award className="inline w-4 h-4 mr-1" /> {nextGame.title}</p>}
                        {nextGame.hostId && <p className="text-gray-700 dark:text-gray-300 mt-1"><User className="inline w-4 h-4 mr-1" /> Anfitrião: {players.find(p => p.id === nextGame.hostId)?.name}</p>}
                        {nextGame.location && <p className="text-gray-700 dark:text-gray-300 mt-1"><MapPin className="inline w-4 h-4 mr-1" /> Local: {nextGame.location}</p>}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Nenhum evento futuro agendado.</p>
                    )}
                  </div>

                  <div data-card-id="balance" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><Wallet className="w-5 h-5 text-green-500" /> Saldo do Caixa</h3>
                     <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                       R$ {totalBalance.toFixed(2)}
                     </p>
                  </div>

                  <div data-card-id="prediction" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-500" /> Previsão Mensal ({financialPrediction.monthName})
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-gray-700 dark:text-gray-300 mb-1 text-sm">
                          <span>Recebido</span>
                          <span>{((financialPrediction.receivedAmount / (financialPrediction.expectedTotal || 1)) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner">
                          <div 
                            className="bg-cyan-500 h-4 rounded-full transition-all duration-500" 
                            style={{ width: `${(financialPrediction.receivedAmount / (financialPrediction.expectedTotal || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-lg pt-2">
                        <span className="font-semibold text-red-500 dark:text-red-400">Pendente: R$ {financialPrediction.pendingAmount.toFixed(2)}</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Total: R$ {financialPrediction.expectedTotal.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        {financialPrediction.totalCount - financialPrediction.unpaidCount} de {financialPrediction.totalCount} jogadores pagaram.
                      </p>
                    </div>
                  </div>
                  
                  <div data-card-id="annual-prediction" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                      <BriefcaseBusiness className="w-5 h-5 text-purple-500" /> Previsão Anual ({managementYear})
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-gray-700 dark:text-gray-300 mb-1 text-sm">
                          <span>Arrecadado</span>
                          <span>{((annualFinancialPrediction.receivedAmount / (annualFinancialPrediction.expectedTotal || 1)) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner">
                          <div 
                            className="bg-purple-500 h-4 rounded-full transition-all duration-500" 
                            style={{ width: `${(annualFinancialPrediction.receivedAmount / (annualFinancialPrediction.expectedTotal || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-lg pt-2">
                        <span className="font-semibold text-red-500 dark:text-red-400">Pendente: R$ {annualFinancialPrediction.pendingAmount.toFixed(2)}</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Total: R$ {annualFinancialPrediction.expectedTotal.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        R$ {annualFinancialPrediction.receivedAmount.toFixed(2)} de R$ {annualFinancialPrediction.expectedTotal.toFixed(2)} recebidos.
                      </p>
                    </div>
                  </div>

                  <div data-card-id="birthdays" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-pink-500" /> Aniversariantes da Semana</h3>
                    {birthdaysThisWeek.length > 0 ? (
                      <ul className="space-y-2">
                        {birthdaysThisWeek.map(p => (
                          <li key={p.id} className="text-gray-700 dark:text-gray-300">🎂 {p.name} ({p.birthDate})</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Nenhum aniversário esta semana.</p>
                    )}
                  </div>
                  
                  <div data-card-id="top-scorers" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><Goal className="w-5 h-5 text-orange-500" /> Artilheiros do Ano</h3>
                    {topScorers.length > 0 ? (
                      <ol className="space-y-3">
                        {topScorers.map(({ player, goals }, index) => (
                          <li key={player.id} className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className={`text-2xl font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-500' : 'text-yellow-700'}`}>#{index + 1}</span>
                            <img src={player.photoUrl || `https://placehold.co/40x40/EFEFEF/AAAAAA?text=${player.name.charAt(0)}`} alt={player.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/40x40/EFEFEF/AAAAAA?text=${player.name.charAt(0)}`}} />
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{player.name}</span>
                            <span className="ml-auto font-bold text-gray-700 dark:text-gray-300">{goals} Gols</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Nenhum gol registrado em partidas salvas este ano.</p>
                    )}
                  </div>

                  <div data-card-id="financial-summary" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><BarChart className="w-5 h-5 text-indigo-500" /> Resumo Financeiro por Categoria ({managementYear})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-1"><TrendingUp className="w-5 h-5"/> Receitas</h4>
                            <ul className="space-y-2 text-sm">
                                {financialSummary.receitas.length > 0 ? financialSummary.receitas.map(([category, amount]) => (
                                    <li key={category} className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/30 rounded-md">
                                        <span className="text-gray-700 dark:text-gray-300">{category}</span>
                                        <span className="font-bold text-green-700 dark:text-green-300">R$ {amount.toFixed(2)}</span>
                                    </li>
                                )) : <p className="text-gray-500 dark:text-gray-400 text-xs">Nenhuma receita registrada.</p>}
                            </ul>
                            <div className="border-t-2 border-gray-200 dark:border-gray-700 mt-2 pt-2 flex justify-between items-center font-bold text-gray-800 dark:text-gray-200">
                                <span>Total Receitas:</span>
                                <span className="text-green-600 dark:text-green-400">R$ {financialSummary.totalReceitas.toFixed(2)}</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1"><TrendingDown className="w-5 h-5"/> Despesas</h4>
                             <ul className="space-y-2 text-sm">
                                {financialSummary.despesas.length > 0 ? financialSummary.despesas.map(([category, amount]) => (
                                    <li key={category} className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
                                        <span className="text-gray-700 dark:text-gray-300">{category}</span>
                                        <span className="font-bold text-red-700 dark:text-red-300">R$ {amount.toFixed(2)}</span>
                                    </li>
                                )) : <p className="text-gray-500 dark:text-gray-400 text-xs">Nenhuma despesa registrada.</p>}
                            </ul>
                            <div className="border-t-2 border-gray-200 dark:border-gray-700 mt-2 pt-2 flex justify-between items-center font-bold text-gray-800 dark:text-gray-200">
                                <span>Total Despesas:</span>
                                <span className="text-red-600 dark:text-red-400">R$ {financialSummary.totalDespesas.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                  </div>
                  
                  <div data-card-id="financial-chart" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><BarChart className="w-5 h-5 text-purple-500" /> Gráfico Financeiro Mensal ({managementYear})</h3>
                    <FinancialChart data={monthlyChartData} theme={theme} />
                  </div>

                  <div data-card-id="ranking" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Top 3 Ranking</h3>
                    <ol className="space-y-3">
                      {sortedPlayersByRank.slice(0, 3).map((player, index) => {
                        const stats = playerStats[player.id] || { totalPointsYear: 0 };
                        return (
                          <li key={player.id} className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className={`text-2xl font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-500' : 'text-yellow-700'}`}>#{index + 1}</span>
                            <img src={player.photoUrl || `https://placehold.co/40x40/EFEFEF/AAAAAA?text=${player.name.charAt(0)}`} alt={player.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/40x40/EFEFEF/AAAAAA?text=${player.name.charAt(0)}`}} />
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{player.name}</span>
                            <span className="ml-auto font-bold text-gray-700 dark:text-gray-300">{stats.totalPointsYear} Pts</span>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                </div>
              </section>
            )}
            {activeTab === 'jogadores' && (
              <section>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gerenciar Jogadores</h2>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                    <button onClick={() => handleOpenPlayerModal()} className="bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Adicionar Jogador
                    </button>
                    <button onClick={() => setIsPdfOptionsModalOpen(true)} className="bg-rose-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-rose-700 text-sm flex items-center gap-1" disabled={!jspdfLoaded || !jspdfAutoTableLoaded}>
                      <FileText className="w-4 h-4" /> Gerar PDF Ranking
                    </button>
                  </div>
                </div>

                {isPlayerModalOpen && (
                  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">{editingPlayer ? 'Editar Jogador' : 'Adicionar Novo Jogador'}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <input name="name" type="text" placeholder="Nome (Apelido)" value={playerFormData.name} onChange={handlePlayerFormChange} className="p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                              <input name="fullName" type="text" placeholder="Nome Completo" value={playerFormData.fullName} onChange={handlePlayerFormChange} className="p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                              <input name="memberNumber" type="text" placeholder="Nº de Sócio" value={playerFormData.memberNumber} onChange={handlePlayerFormChange} className="p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                              <input name="email" type="email" placeholder="Email" value={playerFormData.email} onChange={handlePlayerFormChange} className="p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                              <input name="phone" type="tel" placeholder="Telefone" value={playerFormData.phone} onChange={handlePlayerFormChange} className="p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                              <input name="favoriteTeam" type="text" placeholder="Time do Coração" value={playerFormData.favoriteTeam} onChange={handlePlayerFormChange} className="p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                          </div>
                          <div className="mb-4">
                            <input name="photoUrl" type="text" placeholder="URL da Foto" value={playerFormData.photoUrl} onChange={handlePlayerFormChange} className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <select name="position" value={playerFormData.position} onChange={handlePlayerFormChange} className="p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                                  <option value="Goleiro">Goleiro</option>
                                  <option value="Zagueiro">Zagueiro</option>
                                  <option value="Lateral">Lateral</option>
                                  <option value="Volante">Volante</option>
                                  <option value="Meia">Meia</option>
                                  <option value="Atacante">Atacante</option>
                                  <option value="Social">Social</option>
                              </select>
                              <select name="role" value={playerFormData.role} onChange={handlePlayerFormChange} className="p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                                  <option value="Jogador">Jogador</option>
                                  <option value="Presidente">Presidente</option>
                                  <option value="Vice-Presidente">Vice-Presidente</option>
                                  <option value="Tesoureiro">Tesoureiro</option>
                                  <option value="Gerente de Esportes">Gerente de Esportes</option>
                                  <option value="Disciplina">Disciplina</option>
                                  <option value="Gerente de Eventos">Gerente de Eventos</option>
                              </select>
                               <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Nascimento</label>
                                    <div className="flex gap-2">
                                        <select
                                            name="birthDay"
                                            value={(playerFormData.birthDate || '').split('-')[0] || ''}
                                            onChange={(e) => {
                                                const month = (playerFormData.birthDate || '').split('-')[1] || '';
                                                setPlayerFormData(prev => ({...prev, birthDate: `${e.target.value}-${month}`}));
                                            }}
                                            className="p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 w-1/2"
                                        >
                                            <option value="">Dia</option>
                                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={String(d).padStart(2, '0')}>{String(d).padStart(2, '0')}</option>)}
                                        </select>
                                        <select
                                            name="birthMonth"
                                            value={(playerFormData.birthDate || '').split('-')[1] || ''}
                                            onChange={(e) => {
                                                const day = (playerFormData.birthDate || '').split('-')[0] || '';
                                                setPlayerFormData(prev => ({...prev, birthDate: `${day}-${e.target.value}`}));
                                            }}
                                            className="p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 w-1/2"
                                        >
                                            <option value="">Mês</option>
                                            {meses.map((mes, index) => <option key={index + 1} value={String(index + 1).padStart(2, '0')}>{mes}</option>)}
                                        </select>
                                    </div>
                                </div>
                          </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                  <input name="skillRating" type="number" placeholder="Nota (1-10)" min="1" max="10" value={playerFormData.skillRating} onChange={handlePlayerFormChange} className="p-3 border rounded-md text-center dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                                  <input name="basePoints" type="number" placeholder="Pts Iniciais" min="0" value={playerFormData.basePoints} onChange={handlePlayerFormChange} className="p-3 border rounded-md text-center dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                                  <div className="flex items-center justify-center text-gray-800 dark:text-gray-200">
                                      <input type="checkbox" id="isFeeExempt" name="isFeeExempt" checked={playerFormData.isFeeExempt} onChange={handlePlayerFormChange} className="h-4 w-4"/>
                                      <label htmlFor="isFeeExempt" className="ml-2">Isento de Mensalidade?</label>
                                  </div>
                              </div>

                          <div className="flex justify-end gap-2">
                              <button onClick={handleClosePlayerModal} className="bg-gray-400 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-500 flex items-center gap-1"><X className="w-4 h-4" /> Cancelar</button>
                              <button onClick={handleSavePlayer} className="bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 flex items-center gap-1"><Check className="w-4 h-4" /> Salvar</button>
                          </div>
                      </div>
                  </div>
                )}

                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow hidden sm:block">
                  <table className="min-w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Posição</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nota</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pts (4Q)</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pts Total</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {sortedPlayersByRank.map((player) => {
                              const rank = playerRankMap.get(player.id);
                              const stats = playerStats[player.id] || { totalPointsYear: 0, pointsLast4Wednesdays: 0 };
                              const initials = player.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                              return (
                                  <tr key={player.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">{player.position !== 'Social' && player.position !== 'Goleiro' ? rank : '-'}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        <div className="flex items-center">
                                          <img src={player.photoUrl || `https://placehold.co/40x40/EFEFEF/AAAAAA?text=${initials}`} alt={player.name} className="w-8 h-8 rounded-full object-cover mr-3" onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/40x40/EFEFEF/AAAAAA?text=${initials}`}} />
                                          {player.name}
                                          {player.role && player.role !== 'Jogador' && <span className="ml-2 text-yellow-500" title={player.role}>⭐</span>}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{player.position}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{player.skillRating}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{stats.pointsLast4Wednesdays}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{stats.totalPointsYear}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                          <button onClick={() => handleOpenPlayerModal(player)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-gray-600"><Edit className="w-5 h-5" /></button>
                                          <button onClick={() => setShowDeletePlayerModal(player.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-gray-600"><Trash2 className="w-5 h-5" /></button>
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-1 sm:hidden gap-3 mt-4">
                  {sortedPlayersByRank.map(player => {
                    const rank = playerRankMap.get(player.id);
                    const stats = playerStats[player.id] || { totalPointsYear: 0, pointsLast4Wednesdays: 0 };
                    const initials = player.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                    return (
                      <div key={player.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <img src={player.photoUrl || `https://placehold.co/48x48/EFEFEF/AAAAAA?text=${initials}`} alt={player.name} className="w-12 h-12 rounded-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/48x48/EFEFEF/AAAAAA?text=${initials}`}} />
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                              {player.position !== 'Social' && player.position !== 'Goleiro' && <span className="text-blue-500 dark:text-blue-400">#{rank}</span>}
                              {player.name}
                              {player.role && player.role !== 'Jogador' && <span className="ml-1 text-yellow-500" title={player.role}>⭐</span>}
                            </h3>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleOpenPlayerModal(player)} className="text-indigo-600 dark:text-indigo-400 p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-gray-700"><Edit className="w-5 h-5" /></button>
                            <button onClick={() => setShowDeletePlayerModal(player.id)} className="text-red-600 dark:text-red-400 p-1 rounded-full hover:bg-red-100 dark:hover:bg-gray-700"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </div>
                        <div className="pl-16">
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"><Briefcase className="w-4 h-4" /> Posição: {player.position}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"><Star className="w-4 h-4" /> Nota: {player.skillRating}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"><Target className="w-4 h-4" /> Pts (4Q): {stats.pointsLast4Wednesdays}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"><Award className="w-4 h-4" /> Pts Total: {stats.totalPointsYear}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            
            {activeTab === 'calendario' && (
              <Calendar
                  viewDate={viewDate}
                  setViewDate={setViewDate}
                  events={allCalendarEvents}
                  onDateClick={(date) => { setCurrentEvent({ ...allCalendarEvents[date], date }); setEventModalOpen(true); }}
                  onEventClick={(event) => { setCurrentEvent(event); setEventModalOpen(true); }}
                  players={players}
                  onGeneratePdf={handleGenerateCalendarPdf}
              />
            )}

            {activeTab === 'montarJogo' && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Montar Jogo</h2>
                <div className="flex justify-center mb-6 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                  <button onClick={() => setGameMode('quarta')} className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all flex items-center justify-center gap-2 ${gameMode === 'quarta' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 dark:text-gray-300'}`}>
                    <Shirt className="w-5 h-5" /> Jogo de Quarta (Regras)
                  </button>
                  <button onClick={() => setGameMode('livre')} className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all flex items-center justify-center gap-2 ${gameMode === 'livre' ? 'bg-purple-600 text-white shadow' : 'text-gray-700 dark:text-gray-300'}`}>
                    <Flame className="w-5 h-5" /> Jogo Livre (Manual)
                  </button>
                </div>

                {gameMode === 'quarta' && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-inner">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Lista de Presença (Quarta)</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <span><Shirt className="w-4 h-4 inline mr-1 text-green-500"/> Jogo: {presenceCounts.jogo || 0}</span>
                        <span><Clock className="w-4 h-4 inline mr-1 text-cyan-500"/> 1º Tempo: {presenceCounts['1º tempo'] || 0}</span>
                        <span><Clock className="w-4 h-4 inline mr-1 text-yellow-500"/> 2º Tempo: {presenceCounts['2º tempo'] || 0}</span>
                        <span><Utensils className="w-4 h-4 inline mr-1 text-blue-500"/> Total Janta: {totalDinnerCount}</span>
                        <span><Ban className="w-4 h-4 inline mr-1 text-red-500"/> Ausente: {presenceCounts.ausente || 0}</span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200"><Settings className="w-5 h-5" /> 1. Configurações do Jogo</h4>
                      <label className="block font-bold mb-2 text-gray-800 dark:text-gray-200">Jogadores de Linha por Time:</label>
                      <select value={selectedGameSize} onChange={(e) => setSelectedGameSize(Number(e.target.value))} className="w-full p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        {[4, 5, 6, 7, 8, 9, 10].map(size => <option key={size} value={size}>{size}x{size}</option>)}
                      </select>
                    </div>
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200"><Users className="w-5 h-5" /> 2. Lista de Presença</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto p-2 border rounded-lg dark:border-gray-700">
                        {sortedPlayersByRank.map(p => {
                          const playerStatus = presenceList[p.id] || 'ausente';
                          const isSocial = p.position === 'Social';
                          const rank = playerRankMap.get(p.id);
                          const isTop16 = rank <= 16 && !isSocial && p.position !== 'Goleiro';
                          const options = isSocial ? [{value: 'ausente', label: 'Ausente'}, {value: 'janta', label: 'Janta'}] : [{value: 'ausente', label: 'Ausente'}, {value: 'jogo', label: 'Jogo'}, {value: '1º tempo', label: '1º Tempo'}, {value: '2º tempo', label: '2º Tempo'}, {value: 'janta', label: 'Janta'}];
                          let bgColor = 'bg-white dark:bg-gray-700';
                          if (playerStatus === 'jogo') bgColor = 'bg-green-100 dark:bg-green-900/50';
                          if (playerStatus === 'janta') bgColor = 'bg-blue-100 dark:bg-blue-900/50';
                          if (playerStatus === '1º tempo') bgColor = 'bg-cyan-100 dark:bg-cyan-900/50';
                          if (playerStatus === '2º tempo') bgColor = 'bg-yellow-100 dark:bg-yellow-800/50';
                          if (playerStatus === 'ausente') bgColor = 'bg-red-100 dark:bg-red-900/50';
                          return (
                            <div key={p.id} className={`p-2 rounded-lg shadow-sm transition-colors ${bgColor}`}>
                              <div className="flex items-center justify-between">
                                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center">{p.name}{isTop16 && <Flame className="w-3 h-3 ml-1 text-orange-500" title="Top 16 do Ranking" />}</span>
                                  {rank && <span className="text-xs font-bold text-gray-500 dark:text-gray-400">#{rank}</span>}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{p.position}</p>
                              <select value={playerStatus} onChange={(e) => handlePresenceChange(p.id, e.target.value)} className="w-full mt-1 p-1 border rounded-md bg-white dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 text-xs">
                                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200"><Check className="w-5 h-5" /> 3. Ações</h4>
                      <div className="space-y-2">
                          <button onClick={handleGeneratePresenceListPdf} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2" disabled={!jspdfLoaded || !jspdfAutoTableLoaded}><FileText className="w-5 h-5" /> Gerar PDF da Lista de Presença</button>
                          <button onClick={handleConfirmStartersSelection} className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"><Check className="w-5 h-5" /> Confirmar Escalação e Ir para Times</button>
                      </div>
                    </div>
                  </div>
                )}
                
                {gameMode === 'livre' && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-inner">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Montagem Manual de Times</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Arraste os jogadores da lista de "Disponíveis" para as colunas dos times ou reservas.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {['available', 'teamA', 'teamB', 'reserves'].map(columnId => {
                        const columnTitles = { available: 'Disponíveis', teamA: 'Time A', teamB: 'Time B', reserves: 'Reservas' };
                        const playersInColumn = freeTeams[columnId];
                        return (
                          <div 
                            key={columnId} 
                            onDragOver={handleFreePlayDragOver} 
                            onDrop={(e) => handleFreePlayDrop(e, columnId)}
                            className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50 min-h-[200px] border-2 border-dashed border-gray-300 dark:border-gray-600 ${draggedItem && 'dragging-over'}`}
                          >
                            <h4 className="font-bold text-center mb-3 text-gray-800 dark:text-gray-200">{columnTitles[columnId]} ({playersInColumn.length})</h4>
                            <div className="space-y-2">
                              {playersInColumn.map(player => (
                                <div 
                                  key={player.id}
                                  draggable 
                                  onDragStart={(e) => handleFreePlayDragStart(e, player, columnId)}
                                  className="p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm cursor-grab flex justify-between items-center"
                                >
                                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{player.name}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{player.position}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={handleConfirmFreePlayTeams} className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" /> Confirmar Times e Ver Campo
                    </button>
                  </div>
                )}
              </section>
            )}
            
            {activeTab === 'times' && (
              <section className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Times Gerados</h2>
                {(selectedStarters.length === 0 && teamA.length === 0) ? <p className="text-center mt-8 text-gray-600 dark:text-gray-400">Gere uma nova escalação na aba 'Montar Jogo' ou carregue uma partida salva na aba 'Partidas'.</p> : (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-inner mb-6 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><Palette className="w-4 h-4" /> Cor Time A:</label><select value={teamAColor} onChange={e => setTeamAColor(e.target.value)} className="w-full p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">{teamColors.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                        <div><label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><Palette className="w-4 h-4" /> Cor Time B:</label><select value={teamBColor} onChange={e => setTeamBColor(e.target.value)} className="w-full p-3 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">{teamColors.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                      </div>
                      {gameMode === 'quarta' && selectedStarters.length > 0 && <button onClick={generateBalancedTeams} className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 mb-2 flex items-center justify-center gap-2"><Swords className="w-5 h-5" /> Gerar Times Equilibrados</button>}
                      {teamA.length > 0 && (
                        <>
                          <button onClick={() => { setSwapMode(!swapMode); setPlayerToSwap(null); }} className={`w-full py-3 rounded-lg font-semibold transition-colors ${swapMode ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white mb-2 flex items-center justify-center gap-2`}>
                            {swapMode ? <Check className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />} {swapMode ? 'Concluir Trocas' : 'Habilitar Trocas Manuais'}
                          </button>
                          <button onClick={handleSaveMatch} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"><Save className="w-5 h-5" /> Salvar Partida Atual</button>
                        </>
                      )}
                    </div>

                    {teamA.length > 0 && gameMode === 'quarta' && (
                      <div className="mt-6 w-full bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-inner">
                          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200"><Plus className="w-5 h-5" /> Adicionar Reserva de Última Hora</h3>
                          <div className="flex flex-col sm:flex-row gap-2">
                              <select value={lateReservePlayer} onChange={e => setLateReservePlayer(e.target.value)} className="flex-grow p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                                  <option value="">Selecione um jogador</option>
                                  {availableForLateReserve.map(p => (
                                      <option key={p.id} value={p.id}>{p.name}</option>
                                  ))}
                              </select>
                              <button onClick={handleAddLateReserve} className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 flex items-center gap-1"><Plus className="w-4 h-4" /> Adicionar</button>
                          </div>
                      </div>
                      )}

                      {teamA.length > 0 && 
                        <>
                          <div id="capture-area" className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg">
                            {isSharing && (
                              <div className="text-center mb-6 flex flex-col sm:flex-row items-center justify-center">
                                <img src="https://placehold.co/50x25/000000/FFFFFF?text=LOGO" alt="Quarta Feirino C Logo" className="h-8 w-auto mr-2" onError={(e) => e.target.style.display='none'} />
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Quarta Feirino "C" - Escalação</h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 ml-2">{new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' })}</p>
                              </div>
                            )}
                            <div className="grid md:grid-cols-2 gap-6 mt-6 w-full">
                              <div className={`p-5 rounded-lg shadow-lg border-2 border-${teamAColor.split('-')[0]}-300 bg-${teamAColor.split('-')[0]}-100 dark:bg-gray-800 dark:border-${teamAColor.split('-')[0]}-500`}><h3 className={`text-2xl font-bold mb-3 text-${teamAColor.split('-')[0]}-800 dark:text-${teamAColor.split('-')[0]}-300`}>Time A (Média: ${(teamA.reduce((s, p) => s + p.skillRating, 0) / (teamA.length || 1)).toFixed(1)})</h3><ul className="space-y-2">{teamA.map(p => renderPlayerListItem(p, 'A'))}</ul></div>
                              <div className={`p-5 rounded-lg shadow-lg border-2 border-${teamBColor.split('-')[0]}-300 bg-${teamBColor.split('-')[0]}-100 dark:bg-gray-800 dark:border-${teamBColor.split('-')[0]}-500`}><h3 className={`text-2xl font-bold mb-3 text-${teamBColor.split('-')[0]}-800 dark:text-${teamBColor.split('-')[0]}-300`}>Time B (Média: ${(teamB.reduce((s, p) => s + p.skillRating, 0) / (teamB.length || 1)).toFixed(1)})</h3><ul className="space-y-2">{teamB.map(p => renderPlayerListItem(p, 'B'))}</ul></div>
                            </div>
                            
                            {reserves.length > 0 && (
                              <div className="mt-8 w-full md:max-w-lg mx-auto">
                                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200 text-center">Reservas</h3>
                                  <div className="p-5 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600">
                                      <ul className="space-y-2">{reserves.map(p => renderPlayerListItem(p, 'Reserves'))}</ul>
                                  </div>
                              </div>
                            )}

                            <div className="mt-8 w-full md:max-w-lg mx-auto bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-inner">
                              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200"><Goal className="w-5 h-5" /> Resultado da Partida</h3>
                              <div className="flex items-center justify-center gap-4 mb-4">
                                <input type="number" value={scoreTeamA} onChange={e => setScoreTeamA(e.target.value)} placeholder="0" className="w-20 p-2 text-center border rounded-md text-2xl font-bold dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                                <span className="text-2xl font-bold dark:text-gray-200">x</span>
                                <input type="number" value={scoreTeamB} onChange={e => setScoreTeamB(e.target.value)} placeholder="0" className="w-20 p-2 text-center border rounded-md text-2xl font-bold dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                              </div>

                              <h4 className="font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><Target className="w-4 h-4" /> Gols:</h4>
                              <div className="space-y-2 mb-4">
                                {currentGoals.map((goal, index) => (
                                  <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-gray-800 dark:text-gray-200">
                                    <span>{goal.playerName} ({goal.teamId === 'A' ? 'Time A' : 'Time B'})</span>
                                    <button onClick={() => handleDeleteGoal(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-gray-600">
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                <select value={newGoalPlayer} onChange={e => setNewGoalPlayer(e.target.value)} className="flex-grow p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                                  <option value="">Jogador</option>
                                  {[...teamA, ...teamB].map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <select value={newGoalTeam} onChange={e => setNewGoalTeam(e.target.value)} className="w-24 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                                  <option value="">Time</option>
                                  <option value="A">Time A</option>
                                  <option value="B">Time B</option>
                                </select>
                                <button onClick={handleAddGoal} className="bg-blue-500 text-white p-2 rounded-md font-semibold hover:bg-blue-600 flex items-center gap-1"><Plus className="w-4 h-4" /> Add Gol</button>
                              </div>
                            </div>


                            <div id="football-field-visualization" ref={fieldRef} className="relative w-full max-w-4xl mt-8 mx-auto">
                              <FootballField />
                              {teamA.map(p => <div key={p.id} className={`absolute w-24 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-grab px-2 overflow-hidden whitespace-nowrap bg-${teamAColor}`} style={{ left: `${p.xPos}%`, top: `${p.yPos}%` }} onMouseDown={e => handleDragStart(e, p, 'A')} onTouchStart={e => handleDragStart(e, p, 'A')}>{p.name}</div>)}
                              {teamB.map(p => <div key={p.id} className={`absolute w-24 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-grab px-2 overflow-hidden whitespace-nowrap bg-${teamBColor}`} style={{ left: `${p.xPos}%`, top: `${p.yPos}%` }} onMouseDown={e => handleDragStart(e, p, 'B')} onTouchStart={e => handleDragStart(e, p, 'B')}>{p.name}</div>)}
                              {reserves.length > 0 && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 p-2 bg-gray-800/60 rounded-lg w-11/12">
                                  {reserves.map(p => (
                                    <div key={p.id} className="bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                                      {p.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap justify-center gap-4 mt-4">
                            <button onClick={handleShareFieldImage} className="w-full max-w-xs bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2" disabled={!html2canvasLoaded}><Share2 className="w-5 h-5" /> Compartilhar Imagem</button>
                            <button onClick={handleGeneratePdf} className="w-full max-w-xs bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 flex items-center justify-center gap-2" disabled={!jspdfLoaded || !html2canvasLoaded}><FileText className="w-5 h-5" /> Gerar PDF</button>
                          </div>
                        </>
                      }
                  </>
                )}
              </section>
            )}

            {activeTab === 'partidas' && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Partidas Salvas</h2>
                {savedMatches.length === 0 ? <p className="text-center mt-8 text-gray-600 dark:text-gray-400">Nenhuma partida salva ainda. Salve uma na aba 'Times'.</p> : (
                  <div className="space-y-3">
                    {savedMatches.map(match => (
                      <div key={match.id} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-2 sm:mb-0 text-gray-800 dark:text-gray-200">
                          <span className="font-semibold flex items-center gap-1"><CalendarDays className="w-4 h-4" /> Partida de {new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          {match.mode === 'livre' && <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full ml-2">JOGO LIVRE</span>}
                          {match.scoreTeamA !== '' && match.scoreTeamB !== '' && (
                            <p className="text-lg font-bold mt-1 flex items-center gap-1"><Goal className="w-4 h-4" /> Placar: {match.scoreTeamA} x {match.scoreTeamB}</p>
                          )}
                          {match.goals && match.goals.length > 0 && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                              <Target className="w-4 h-4" /> Gols: {match.goals.map(g => `${g.playerName}${g.minute ? ` (${g.minute}')` : ''}`).join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleLoadMatch(match)} className="bg-blue-500 text-white p-2 rounded-md text-sm hover:bg-blue-600 flex items-center gap-1"><ArrowDownToLine className="w-4 h-4" /> Carregar</button>
                          <button onClick={() => setShowDeleteMatchModal(match.id)} className="bg-red-500 text-white p-2 rounded-md text-sm hover:bg-red-600 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Apagar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'rodadas' && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Gerenciar Rodadas</h2>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-inner mb-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200"><CalendarIcon className="w-5 h-5" /> {editingRoundId ? 'Editando Rodada' : 'Adicionar Nova Rodada'}</h3>
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input type="date" value={currentRoundDate} onChange={e => setCurrentRoundDate(e.target.value)} className="p-3 border rounded-md flex-grow dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                    <button onClick={handleSaveRound} className="bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2">{editingRoundId ? <Edit className="w-5 h-5" /> : <Save className="w-5 h-5" />} {editingRoundId ? 'Atualizar' : 'Salvar'}</button>
                    {editingRoundId && <button onClick={handleCancelEditRound} className="bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-500 flex items-center justify-center gap-2"><X className="w-5 h-5" /> Cancelar</button>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2 border rounded-lg dark:border-gray-700">
                    {players.filter(p => p.position !== 'Social').map(p => (
                      <div key={p.id} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{p.name}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <button onClick={() => handlePlayerStatusChange(p.id, 'jogou')} className={`text-xs px-3 py-2 rounded-full font-semibold ${playerStatuses[p.id]?.includes('jogou') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/50'}`}>Jogou</button>
                          <button onClick={() => handlePlayerStatusChange(p.id, 'jantou')} className={`text-xs px-3 py-2 rounded-full font-semibold ${playerStatuses[p.id]?.includes('jantou') ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-yellow-800/50'}`}>Jantou</button>
                          <button onClick={() => handlePlayerStatusChange(p.id, 'naoCompareceu')} className={`text-xs px-3 py-2 rounded-full font-semibold ${playerStatuses[p.id]?.includes('naoCompareceu') ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-800/50'}`}>Faltou</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Histórico de Rodadas</h3>
                  <button onClick={handleGeneratePlayerHistoryPdf} className="bg-rose-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-rose-700 text-sm flex items-center gap-1" disabled={!jspdfLoaded || !jspdfAutoTableLoaded}>
                    <FileText className="w-4 h-4" /> Gerar Histórico (PDF)
                  </button>
                </div>
                <div className="space-y-3">
                  {sortedRounds.map(r => (
                    <div key={r.id} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <span className="font-semibold flex items-center gap-1 text-gray-800 dark:text-gray-200"><CalendarDays className="w-4 h-4" /> {new Date(r.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</span>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button onClick={() => handleEditRound(r)} className="bg-yellow-500 text-white p-2 rounded-md text-sm hover:bg-yellow-600 flex items-center gap-1"><Edit className="w-4 h-4" /> Editar</button>
                        <button onClick={() => setShowDeleteRoundModal(r.id)} className="bg-red-500 text-white p-2 rounded-md text-sm hover:bg-red-600 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Apagar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'mensalidades' && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Controlo de Mensalidades</h2>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-inner mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto">
                    <label className="block font-bold mb-2 flex items-center gap-1 text-gray-800 dark:text-gray-200"><DollarSign className="w-4 h-4" /> Valor Padrão da Mensalidade (R$):</label>
                    <input type="number" value={defaultFee} onChange={e => setDefaultFee(e.target.value)} className="p-2 border rounded-md w-full sm:max-w-xs dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" />
                  </div>
                  <button onClick={handleGenerateMonthlyFeePdf} className="bg-rose-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-rose-700 text-sm self-end flex items-center gap-1" disabled={!jspdfLoaded || !jspdfAutoTableLoaded}>
                    <FileText className="w-4 h-4" /> Gerar PDF Mensalidades
                  </button>
                </div>

                {overduePlayers.length > 0 && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-md dark:bg-red-900/50 dark:border-red-600 dark:text-red-200" role="alert">
                    <p className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Atenção: Jogadores com Mensalidades em Atraso</p>
                    <ul className="list-disc list-inside mt-2 text-sm">
                      {overduePlayers.map(player => (
                        <li key={player.id}><span className="font-semibold">{player.name}:</span> {player.overdueMonths.join(', ')}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-inner mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200 flex items-center gap-2"><Banknote className="w-5 h-5" /> Informações para Pagamento via Pix</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold mb-2 text-gray-800 dark:text-gray-200">Tipo da Chave:</label>
                      <select value={pixKeyType} onChange={e => setPixKeyType(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <option>CPF</option>
                        <option>Telefone</option>
                        <option>Email</option>
                        <option>Aleatório</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-2 text-gray-800 dark:text-gray-200">Chave Pix:</label>
                      <input type="text" value={pixKey} onChange={e => setPixKey(e.target.value)} placeholder="Sua chave Pix" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                    </div>
                    <div>
                      <label className="block font-bold mb-2 text-gray-800 dark:text-gray-200">Nome do Titular:</label>
                      <input type="text" value={pixKeyName} onChange={e => setPixKeyName(e.target.value)} placeholder="Nome completo" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"/>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800/50 rounded-lg shadow-md text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="p-3 text-left font-medium uppercase text-gray-800 dark:text-gray-200">Jogador</th>
                        {paymentMonths.map(month => <th key={month} className="p-3 text-center font-medium uppercase text-gray-800 dark:text-gray-200">{month}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPlayersByName.map(player => (
                        <tr key={player.id} className="border-b dark:border-gray-700 last:border-b-0">
                          <td className="p-2 font-semibold text-gray-800 dark:text-gray-200">
                              <div className="flex items-center gap-2">
                                  {overduePlayerIds.has(player.id) && <span className="h-2.5 w-2.5 bg-red-500 rounded-full" title="Mensalidade em atraso"></span>}
                                  <span>{player.name}</span>
                                  {selectedPayments[player.id]?.length > 0 && (
                                      <button onClick={() => handleOpenPaymentModal(player.id, selectedPayments[player.id])} className="bg-green-500 text-white px-2 py-1 text-xs rounded-md hover:bg-green-600 ml-auto flex items-center gap-1">
                                          <DollarSign className="w-3 h-3" /> Pagar Selecionados
                                      </button>
                                  )}
                              </div>
                          </td>
                          {paymentMonths.map(month => {
                            const payment = monthlyPayments[player.id]?.[month];
                            if (player.isFeeExempt) {
                              return <td key={month} className="p-2 text-center border-l dark:border-gray-700 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold">Isento</td>
                            }
                            return (
                              <td key={month} className={`p-2 text-center border-l dark:border-gray-700 ${payment ? 'bg-green-100 dark:bg-green-800/30' : 'bg-red-50 dark:bg-red-800/30'}`}>
                                {payment ? (
                                  <div className="flex flex-col items-center justify-center">
                                    <span className="font-bold text-green-800 dark:text-green-300">Pago - R$ {payment.amount.toFixed(2)}</span>
                                    <div className="flex items-center gap-1 mt-1">
                                      <button onClick={() => handleOpenPaymentModal(player.id, [month], payment)} className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-600" title="Editar Pagamento">
                                        <Edit className="h-4 w-4" />
                                      </button>
                                      <button onClick={() => handleGenerateReceipt(player.id, month)} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600" title="Gerar Recibo"><Receipt className="w-4 h-4" /></button>
                                      <button onClick={() => setShowDeletePaymentModal({playerId: player.id, month})} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-gray-600" title="Cancelar Pagamento">
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center">
                                      <input 
                                          type="checkbox" 
                                          className="h-4 w-4"
                                          checked={selectedPayments[player.id]?.includes(month) || false}
                                          onChange={() => handleSelectPayment(player.id, month)}
                                      />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === 'caixa' && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Caixa do Grupo</h2>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-inner mb-6">
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2"><Wallet className="w-5 h-5" /> Saldo Atual do Caixa</h3>
                  <p className={`text-4xl font-bold ${totalBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    R$ {totalBalance.toFixed(2)}
                  </p>
                  <div className="mt-4">
                    <label htmlFor="initialBalanceInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Editar Saldo Inicial (R$):
                    </label>
                    <input
                      type="number"
                      id="initialBalanceInput"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mb-6">
                  <button onClick={() => handleOpenTransactionModal('receita')} className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Adicionar Receita</button>
                  <button onClick={() => handleOpenTransactionModal('despesa')} className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 flex items-center justify-center gap-2"><Minus className="w-5 h-5" /> Adicionar Despesa</button>
                  <button onClick={handleGenerateCaixaPdf} className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2" disabled={!jspdfLoaded || !jspdfAutoTableLoaded}>
                    <FileText className="w-5 h-5" /> Gerar PDF do Caixa
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800/50 rounded-lg shadow-md">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium uppercase w-28 text-gray-800 dark:text-gray-200">Data</th>
                        <th className="p-3 text-left text-sm font-medium uppercase w-auto text-gray-800 dark:text-gray-200">Descrição</th>
                        <th className="p-3 text-left text-sm font-medium uppercase w-40 text-gray-800 dark:text-gray-200">Centro de Custo</th>
                        <th className="p-3 text-right text-sm font-medium uppercase w-28 text-gray-800 dark:text-gray-200">Valor (R$)</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800 dark:text-gray-200">
                      {financialTransactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map(t => (
                        <tr key={t.id} className="border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="p-3 w-28">{new Date(t.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                          <td className="p-3 w-auto break-words flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span>{t.description}</span>
                            {t.source === 'manual' ? (
                              <div className="flex gap-2">
                                <button onClick={() => handleOpenTransactionModal(t.type, t)} className="text-yellow-600 dark:text-yellow-400 hover:underline text-xs flex items-center gap-1"><Edit className="w-3 h-3" /> Editar</button>
                                <button onClick={() => setShowDeleteTransactionModal(t.id)} className="text-red-600 dark:text-red-400 hover:underline text-xs flex items-center gap-1"><Trash2 className="w-3 h-3" /> Apagar</button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Automático</span>
                            )}
                          </td>
                          <td className="p-3 w-40 text-gray-600 dark:text-gray-400">
                            {editingCostCenterId === t.id ? (
                                <select
                                    value={t.costCenter || 'Outros'}
                                    onChange={(e) => {
                                        handleCostCenterChange(t.id, e.target.value);
                                        setEditingCostCenterId(null);
                                    }}
                                    onBlur={() => setEditingCostCenterId(null)}
                                    autoFocus
                                    className="w-full p-1 border rounded-md bg-white dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 text-xs"
                                >
                                    {costCenters.map(cc => <option key={cc} value={cc}>{cc}</option>)}
                                </select>
                            ) : (
                                <div className="flex items-center justify-between group">
                                    <span>{t.costCenter || 'N/A'}</span>
                                    <button 
                                        onClick={() => setEditingCostCenterId(t.id)} 
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-yellow-600 dark:text-yellow-400 p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-600"
                                        title="Editar Centro de Custo"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                          </td>
                          <td className={`p-3 text-right font-bold w-28 ${t.type === 'receita' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {t.type === 'despesa' && '-'} {t.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === 'gestão' && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Gestão e Backups</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Season Management */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-inner">
                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-200"><Settings className="w-5 h-5" /> Gestão de Temporada: {managementYear}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Use a opção abaixo no final do ano para arquivar os dados da temporada atual e começar uma nova.</p>
                      <button onClick={() => setShowEndYearModal(true)} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center gap-2">
                        <Archive className="w-5 h-5" /> Encerrar Gestão {managementYear}
                      </button>
                    </div>

                    {/* Backup Management */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-inner space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2"><Info className="w-5 h-5" /> Backup Manual em Arquivo</h3>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">Guarde um backup no seu computador ou transfira os dados para outro navegador.</p>
                            <div className="flex flex-wrap items-center gap-2">
                                <label className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors text-sm cursor-pointer flex items-center gap-1">
                                    <ArrowUpFromLine className="w-4 h-4" /> Carregar
                                    <input type="file" accept=".json" onChange={triggerLoadFromFile} className="hidden"/>
                                </label>
                                <button onClick={handleSaveToFile} className={`bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors text-sm flex items-center gap-1 ${hasUnsavedChanges ? 'animate-flash-warning' : ''}`}>
                                    <ArrowDownToLine className="w-4 h-4" /> Salvar
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-cyan-800 dark:text-cyan-200 mb-2 flex items-center gap-2"><Cloud className="w-5 h-5" /> Backup Manual na Nuvem</h3>
                            <p className="text-sm text-cyan-700 dark:text-cyan-300 mb-3">Use os botões abaixo para carregar ou salvar um backup manual na nuvem (jsonbin.io).</p>
                            <div className="flex flex-wrap items-center gap-2">
                                <button onClick={triggerLoadFromCloud} className="bg-cyan-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-cyan-600 text-sm flex items-center gap-1"><CloudDownload className="w-4 h-4" /> Carregar</button>
                                <button onClick={handleSaveToCloud} className={`bg-teal-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-600 text-sm flex items-center gap-1 ${hasUnsavedChanges ? 'animate-flash-warning' : ''}`}><CloudUpload className="w-4 h-4" /> Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200"><History className="w-5 h-5" /> Histórico de Gestões</h3>
                  {historicalData.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma gestão anterior arquivada.</p>
                  ) : (
                    <div className="space-y-2">
                      {historicalData.map(data => (
                        <div key={data.year} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-md">
                          <p className="font-semibold text-gray-800 dark:text-gray-200">Gestão {data.year}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{data.rounds.length} rodadas, {data.savedMatches.length} partidas salvas.</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </main>
          {/* Mobile Navigation */}
          <nav className="fixed bottom-0 left-0 w-full bg-gray-800 dark:bg-gray-900 text-white p-2 flex justify-start sm:hidden z-50 rounded-t-xl shadow-lg overflow-x-auto no-scrollbar">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Trophy className="w-6 h-6" /> },
              { id: 'jogadores', label: 'Jogadores', icon: <Users className="w-6 h-6" /> },
              { id: 'calendario', label: 'Calendário', icon: <CalendarIcon className="w-6 h-6" /> },
              { id: 'montarJogo', label: 'Montar Jogo', icon: <Shirt className="w-6 h-6" /> },
              { id: 'times', label: 'Times', icon: <Swords className="w-6 h-6" /> },
              { id: 'partidas', label: 'Partidas', icon: <ScrollText className="w-6 h-6" /> },
              { id: 'rodadas', label: 'Rodadas', icon: <Clock className="w-6 h-6" /> },
              { id: 'mensalidades', label: 'Mensalidades', icon: <DollarSign className="w-6 h-6" /> },
              { id: 'caixa', label: 'Caixa', icon: <Wallet className="w-6 h-6" /> },
              { id: 'gestão', label: 'Gestão', icon: <Settings className="w-6 h-6" /> },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center text-xs px-3 py-1 rounded-md transition-all flex-shrink-0 ${activeTab === tab.id ? 'bg-blue-500' : 'hover:bg-gray-700'}`}>
                {tab.icon}
                <span className="mt-1">{tab.label}</span>
              </button>
            ))}
          </nav>
          <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-xs bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
            Versão 3.06 - Jogadores sociais agora são incluídos nos cálculos financeiros.
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
