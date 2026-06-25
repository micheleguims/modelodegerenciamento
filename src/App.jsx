import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Files, ShieldAlert, UserCircle, Plus, Trash2, 
  FileSpreadsheet, FileText, Search, Building2, AlertCircle, 
  CheckCircle2, X, Download, Upload, Pencil, Filter, Rocket, Microscope, Menu
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Firebase
import { doc, setDoc, collection, onSnapshot, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; 

// Dados e Constantes
import { CRES } from './utils/constants';

// Views e Componentes
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import RecordsView from './views/RecordsView';
import AuditView from './views/AuditView';
import RecordModal from './components/RecordModal';
import InfoView from './views/InfoView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [role, setRole] = useState('admin'); 
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estado para Mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estados de Dados
  const [records, setRecords] = useState([]);
  const [logs, setLogs] = useState([]);
  const [creFilter, setCreFilter] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newRecord, setNewRecord] = useState({ title: '', type: 'pdf', status: 'Pendente', fileUrl: null, fileName: null, cre: '' });

  // Lê os registros do Firebase em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'registros'), (snapshot) => {
      const dadosConvertidos = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id 
      }));
      dadosConvertidos.sort((a, b) => b.id.localeCompare(a.id));
      setRecords(dadosConvertidos);
    });
    return () => unsubscribe();
  }, []);

  // Lê os logs do Firebase em tempo real
  useEffect(() => {
    const unsubscribeLogs = onSnapshot(collection(db, 'logs'), (snapshot) => {
      const logsConvertidos = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      logsConvertidos.sort((a, b) => new Date(b.date) - new Date(a.date));
      setLogs(logsConvertidos);
    });
    return () => unsubscribeLogs();
  }, []);

  // Função para salvar Logs no Firestore
  const addLog = async (action) => {
    const userDisplay = role === 'admin' ? 'Admin (Nível Central)' : `Operador ${role}`;
    try {
      await addDoc(collection(db, 'logs'), {
        user: userDisplay,
        action: action,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao registrar log de auditoria: ", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const user = loginUser.trim().toLowerCase();

    if (user === 'admin' && loginPass === '123') {
      setRole('admin');
      setIsAuthenticated(true);
      addLog('Admin fez login');
      setLoginError('');
    } else if (user.startsWith('setor') && loginPass === '123') {
      const creNum = user.replace('setor', '').trim();
      const creName = `Setor ${creNum.padStart(2, '0')}`;

      if (CRES.includes(creName)) {
        setRole(creName);
        setIsAuthenticated(true);
        addLog(`${creName} fez login`);
        setLoginError('');
      } else {
        setLoginError('Usuário não encontrado.');
      }
    } else {
      setLoginError('Credenciais inválidas.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false); setLoginUser(''); setLoginPass(''); setRole('admin'); setCreFilter('Todas');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await deleteDoc(doc(db, 'registros', id));
        addLog(`Excluiu o registro ID: ${id}`);
      } catch (error) {
        console.error("Erro ao deletar documento: ", error);
        alert("Erro ao excluir o registro.");
      }
    }
  };

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingId(record.id); 
      setNewRecord({ ...record });
    } else {
      setEditingId(null); 
      // Se for admin, tenta pegar o filtro atual. Se for "Todas", deixa vazio para forçar a escolha.
      const initialCre = role === 'admin' ? (creFilter === 'Todas' ? '' : creFilter) : role;
      
      setNewRecord({ 
        title: '', 
        type: 'pdf', 
        status: 'Pendente', 
        fileUrl: null, 
        fileName: null, 
        cre: initialCre
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    if (!newRecord.title) return;

    if (role === 'admin' && !newRecord.cre) {
      alert("Por favor, selecione um setor para este registro.");
      return;
    }

    try {
      if (editingId) {
        const docRef = doc(db, 'registros', editingId);
        await updateDoc(docRef, {
          ...newRecord,
          author: role === 'admin' ? 'Admin SME' : `Operador ${role}`
        });
        addLog(`Editou registro ID: ${editingId}`);
      } else {
        const recordCre = role === 'admin' ? CRES[0] : role;
        const novoId = `REC-${Date.now().toString().slice(-4)}`;
        
        const record = {
          ...newRecord,
          id: novoId,
          date: new Date().toISOString().split('T')[0],
          author: role === 'admin' ? 'Admin SME' : `Operador ${role}`
        };
        
        await setDoc(doc(db, 'registros', novoId), record);
        addLog(`Criou novo registro: ${record.title} (${record.type.toUpperCase()})`);
      }

      setIsModalOpen(false);
      setNewRecord({ title: '', type: 'pdf', status: 'Pendente', fileUrl: null, fileName: null });

    } catch (error) {
      console.error("Erro ao salvar documento: ", error);
      alert("Erro ao salvar o registro no banco de dados.");
    }
  };

  const filteredRecords = useMemo(() => {
    if (role === 'admin') {
      if (creFilter === 'Todas') return records;
      return records.filter(r => r.cre === creFilter);
    }
    return records.filter(r => r.cre === role);
  }, [records, role, creFilter]);

  if (!isAuthenticated) {
    return <LoginView handleLogin={handleLogin} loginError={loginError} loginUser={loginUser} setLoginUser={setLoginUser} loginPass={loginPass} setLoginPass={setLoginPass} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans overflow-x-hidden">
      <header className="bg-[#13335a] text-white h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 shadow-md border-b-2 border-[#66b6e3]">
        <div className="flex items-center gap-3">
          {/* Botão Hambúrguer (Aparece só no Mobile) */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 text-[#66b6e3] hover:bg-black/20 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          {/* Ícone com fundo Azul Claro e desenho em Azul Escuro */}
          <div className="bg-[#66b6e3] text-[#13335a] p-1.5 md:p-2 rounded-lg shadow-inner hidden sm:block">
            <Building2 size={24} />
          </div>
          <span className="font-bold text-lg md:text-xl tracking-tight">Admin Dashboard</span>
          <span className="px-2 py-0.5 bg-[#66b6e3]/20 text-[#66b6e3] text-xs rounded-full font-bold ml-2 border border-[#66b6e3]/30 hidden lg:inline-block uppercase tracking-wider">
            Demo
          </span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Identificação do utilizador com um fundo escurecido */}
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-[#66b6e3]/30">
            <UserCircle size={20} className="text-[#66b6e3]" />
            <span className="text-xs md:text-sm font-bold text-white uppercase tracking-tight">
              {role === 'admin' ? 'Administrador' : role}
            </span>
          </div>
          <button onClick={handleLogout} className="text-[#66b6e3] hover:text-white text-xs md:text-sm font-bold uppercase transition-colors">
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        
        {/* OVERLAY MOBILE: Fundo escuro quando o menu está aberto */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* SIDEBAR: Desliza no celular, fica fixa no desktop */}
        <aside className={`
          fixed md:relative top-0 bottom-0 left-0 z-50 md:z-10
          w-64 bg-white border-r border-[#e2e8f0] flex flex-col shadow-2xl md:shadow-sm
          transition-transform duration-300 ease-in-out h-full
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          
          {/* Cabeçalho da Sidebar (Só no Mobile) */}
          <div className="h-16 md:hidden flex justify-between items-center px-6 border-b border-[#e2e8f0] bg-slate-50">
            <span className="font-bold text-[#13335a] uppercase tracking-tight">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400 hover:text-[#13335a] bg-white rounded-full shadow-sm">
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-2 overflow-y-auto">
            {/* Botão Painel de Controle */}
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-tight ${
                activeTab === 'dashboard' ? 'bg-[#f0f4f8] text-[#13335a] shadow-inner' : 'text-slate-400 hover:bg-[#f0f4f8] hover:text-[#13335a]'
              }`}
            >
              <LayoutDashboard size={20} /> Painel de Controle
            </button>

            {/* Botão Base de Registros */}
            <button 
              onClick={() => { setActiveTab('records'); setIsMenuOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-tight ${
                activeTab === 'records' ? 'bg-[#f0f4f8] text-[#13335a] shadow-inner' : 'text-slate-400 hover:bg-[#f0f4f8] hover:text-[#13335a]'
              }`}
            >
              <Files size={20} /> Registros
            </button>

            {/* Botão Apresentação do Piloto */}
            <button 
              onClick={() => { setActiveTab('info'); setIsMenuOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-tight ${
                activeTab === 'info' ? 'bg-[#f0f4f8] text-[#13335a] shadow-inner' : 'text-slate-400 hover:bg-[#f0f4f8] hover:text-[#13335a]'
              }`}
            >
              <Rocket size={20} /> Sobre o Projeto
            </button>

            {/* Botão Logs de Auditoria (Apenas Admin) */}
            {role === 'admin' && (
              <div className="pt-4 mt-4 border-t border-[#e2e8f0]">
                <button 
                  onClick={() => { setActiveTab('audit'); setIsMenuOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-tight ${
                    activeTab === 'audit' ? 'bg-[#13335a] text-white shadow-lg' : 'text-slate-400 hover:bg-[#f0f4f8]'
                  }`}
                >
                  <ShieldAlert size={20} /> Logs de Auditoria
                </button>
              </div>
            )}
          </nav>
        </aside>

        {/* main mantem o min-w-0 para evitar quebra de layout mobile */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-8 bg-[#f0f4f8]/50">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView role={role} creFilter={creFilter} setCreFilter={setCreFilter} filteredRecords={filteredRecords} records={records} addLog={addLog} />}
            {activeTab === 'records' && <RecordsView role={role} creFilter={creFilter} setCreFilter={setCreFilter} filteredRecords={filteredRecords} handleOpenModal={handleOpenModal} handleDelete={handleDelete} />}
            {activeTab === 'audit' && <AuditView logs={logs} />}
            {activeTab === 'info' && <InfoView />}
          </div>
        </main>
      </div>

      <RecordModal 
        isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} editingId={editingId} 
        role={role} newRecord={newRecord} setNewRecord={setNewRecord} handleSaveRecord={handleSaveRecord}
        cres={CRES} 
      />
    </div>
  );
}