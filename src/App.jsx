import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Files, ShieldAlert, UserCircle, Plus, Trash2, 
  FileSpreadsheet, FileText, Search, Building2, AlertCircle, 
  CheckCircle2, X, Download, Upload, Pencil, Filter, Rocket, Microscope
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [creFilter, setCreFilter] = useState('Todas');
  
  const [records, setRecords] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newRecord, setNewRecord] = useState({ title: '', type: 'pdf', status: 'Pendente', fileUrl: null, fileName: null });

  // Escuta os registros do Firebase em tempo real
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

  // Escuta os logs do Firebase em tempo real
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
    const userDisplay = role === 'admin' ? 'Admin SME (Nível Central)' : `Operador ${role}`;
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
    if (loginUser === 'admin' && loginPass === '123') {
      setRole('admin'); setIsAuthenticated(true); addLog('Admin fez login'); setLoginError('');
    } else if (loginUser.startsWith('usercre') && loginPass === '123') {
      const creNum = loginUser.replace('usercre', '');
      const creName = `CRE ${creNum.padStart(2, '0')}`;
      if (CRES.includes(creName)) {
        setRole(creName); setIsAuthenticated(true); addLog(`${creName} fez login`); setLoginError('');
      } else {
        setLoginError('Usuário CRE não encontrado.');
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
      alert("Por favor, selecione uma CRE para este registro.");
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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-[#13335a] text-white h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-md border-b-2 border-[#66b6e3]">
        <div className="flex items-center gap-3">
          {/* Ícone com fundo Azul Claro e desenho em Azul Escuro */}
          <div className="bg-[#66b6e3] text-[#13335a] p-2 rounded-lg shadow-inner">
            <Building2 size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">SME Admin Portal</span>
          {/* Badge "Modo de Produção" modernizado */}
          <span className="px-2 py-0.5 bg-[#66b6e3]/20 text-[#66b6e3] text-xs rounded-full font-bold ml-2 border border-[#66b6e3]/30 hidden md:inline-block uppercase tracking-wider">
            Modo de Produção
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Identificação do utilizador com um fundo escurecido elegante */}
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border border-[#66b6e3]/30">
            <UserCircle size={20} className="text-[#66b6e3]" />
            <span className="text-sm font-bold text-white uppercase tracking-tight">
              {role === 'admin' ? 'Administrador SME' : role}
            </span>
          </div>
          <button onClick={handleLogout} className="text-[#66b6e3] hover:text-white text-sm font-bold uppercase transition-colors">
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col z-10 shadow-sm hidden md:flex">
          <nav className="p-4 space-y-2">
            {/* Botão Painel de Controle */}
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-tight ${
                activeTab === 'dashboard' ? 'bg-[#f0f4f8] text-[#13335a] shadow-inner' : 'text-slate-400 hover:bg-[#f0f4f8] hover:text-[#13335a]'
              }`}
            >
              <LayoutDashboard size={20} /> Painel de Controle
            </button>

            {/* Botão Base de Registros */}
            <button 
              onClick={() => setActiveTab('records')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-tight ${
                activeTab === 'records' ? 'bg-[#f0f4f8] text-[#13335a] shadow-inner' : 'text-slate-400 hover:bg-[#f0f4f8] hover:text-[#13335a]'
              }`}
            >
              <Files size={20} /> Base de Registros
            </button>

            {/* Botão Apresentação do Piloto */}
            <button 
              onClick={() => setActiveTab('info')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-tight ${
                activeTab === 'info' ? 'bg-[#f0f4f8] text-[#13335a] shadow-inner' : 'text-slate-400 hover:bg-[#f0f4f8] hover:text-[#13335a]'
              }`}
            >
              <Rocket size={20} /> Sobre o Piloto
            </button>

            {/* Botão Logs de Auditoria (Apenas Admin) */}
            {role === 'admin' && (
              <div className="pt-4 mt-4 border-t border-[#e2e8f0]">
                <button 
                  onClick={() => setActiveTab('audit')} 
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

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f0f4f8]/50">
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