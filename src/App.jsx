import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Files, ShieldAlert, UserCircle, Plus, Trash2, 
  FileSpreadsheet, FileText, Search, Building2, AlertCircle, 
  CheckCircle2, X, Download, Upload, Pencil, Filter 
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
      <header className="bg-blue-900 text-white h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg"><Building2 size={24} /></div>
          <span className="font-bold text-xl tracking-tight">SME Admin Portal</span>
          <span className="px-2 py-0.5 bg-blue-800 text-blue-200 text-xs rounded-full font-medium ml-2 border border-blue-700 hidden md:inline-block">Modo de Produção</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-950 px-4 py-2 rounded-lg border border-blue-800">
            <UserCircle size={20} className="text-blue-300" />
            <span className="text-sm font-medium text-white">{role === 'admin' ? 'Administrador SME' : role}</span>
          </div>
          <button onClick={handleLogout} className="text-blue-300 hover:text-white text-sm font-medium transition-colors">
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] hidden md:flex">
          <nav className="p-4 space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <LayoutDashboard size={20} /> Painel de Controle
            </button>
            <button onClick={() => setActiveTab('records')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'records' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Files size={20} /> Base de Registros
            </button>
            {role === 'admin' && (
              <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'audit' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
                <ShieldAlert size={20} /> Logs de Auditoria
              </button>
            )}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView role={role} creFilter={creFilter} setCreFilter={setCreFilter} filteredRecords={filteredRecords} records={records} addLog={addLog} />}
            {activeTab === 'records' && <RecordsView role={role} creFilter={creFilter} setCreFilter={setCreFilter} filteredRecords={filteredRecords} handleOpenModal={handleOpenModal} handleDelete={handleDelete} />}
            {activeTab === 'audit' && <AuditView logs={logs} />}
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