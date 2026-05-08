import React, { useRef } from 'react';
import { X, Upload, FileText, FileSpreadsheet, AlertCircle, CheckCircle2, Plus } from 'lucide-react';

export default function RecordModal({ 
  isModalOpen, 
  setIsModalOpen, 
  editingId, 
  role, 
  newRecord, 
  setNewRecord, 
  handleSaveRecord,
  cres 
}) {
  const fileInputRef = useRef(null);

  if (!isModalOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setNewRecord(prev => ({
        ...prev,
        fileUrl,
        fileName: file.name
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Editar Registro' : 'Novo Registro'}</h3>
            <p className="text-sm text-slate-500 mt-1">{role === 'admin' ? (editingId ? 'Modo Administrador' : 'Atrelando à CRE 01 (Demo)') : `Autor: ${role}`}</p>
          </div>
          <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSaveRecord} className="p-6 space-y-6 overflow-y-auto">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Título do Documento</label>
            <input 
              type="text" 
              required
              value={newRecord.title}
              onChange={e => setNewRecord({...newRecord, title: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
              placeholder="Ex: Ofício 123/2026"
            />
          </div>

          {role === 'admin' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Coordenadoria Regional de Educação</label>
              <select
                required
                value={newRecord.cre || ''}
                onChange={e => setNewRecord({...newRecord, cre: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm bg-white"
              >
                <option value="" disabled>Selecione uma CRE...</option>
                {cres.map(cre => (
                  <option key={cre} value={cre}>{cre}</option>
                ))}
              </select>
            </div>
          )}

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Anexar Arquivo (Upload Local)</label>
             <input 
               type="file" 
               ref={fileInputRef}
               onChange={handleFileChange}
               className="hidden"
               accept=".pdf,.xls,.xlsx,.csv"
             />
             <div 
               onClick={() => fileInputRef.current.click()}
               className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
             >
               <Upload size={32} className="mb-2" />
               {newRecord.fileName ? (
                 <div className="text-center">
                   <p className="font-medium text-slate-800">{newRecord.fileName}</p>
                   <p className="text-xs text-slate-500 mt-1">Clique para substituir</p>
                 </div>
               ) : (
                 <div className="text-center">
                   <p className="font-medium">Clique para escolher um arquivo</p>
                   <p className="text-xs mt-1">PDF ou Planilhas (Ficará salvo na memória)</p>
                 </div>
               )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Formato Físico</label>
              <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner gap-1">
                <button
                  type="button"
                  onClick={() => setNewRecord({...newRecord, type: 'pdf'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                    newRecord.type === 'pdf' 
                      ? 'bg-amber-500 text-white font-bold shadow-md' 
                      : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  <FileText size={18} /> PDF
                </button>
                <button
                  type="button"
                  onClick={() => setNewRecord({...newRecord, type: 'excel'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                    newRecord.type === 'excel' 
                      ? 'bg-blue-600 text-white font-bold shadow-md' 
                      : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  <FileSpreadsheet size={18} /> Planilha
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status de Análise</label>
              <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner gap-1">
                <button
                  type="button"
                  disabled={role !== 'admin'}
                  onClick={() => role === 'admin' && setNewRecord({...newRecord, status: 'Pendente'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                    newRecord.status === 'Pendente' 
                      ? 'bg-red-600 text-white font-bold shadow-md' 
                      : 'text-slate-600 hover:bg-slate-200/50'
                  } ${role !== 'admin' ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <AlertCircle size={18} /> Pendente
                </button>
                <button
                  type="button"
                  disabled={role !== 'admin'}
                  onClick={() => role === 'admin' && setNewRecord({...newRecord, status: 'Aprovado'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                    newRecord.status === 'Aprovado' 
                      ? 'bg-green-600 text-white font-bold shadow-md' 
                      : 'text-slate-600 hover:bg-slate-200/50'
                  } ${role !== 'admin' ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <CheckCircle2 size={18} /> Aprovado
                </button>
              </div>
              {role !== 'admin' && <p className="text-[10px] text-slate-500 mt-2 text-center">Somente o Nível Central (Admin) pode aprovar.</p>}
            </div>

          </div>
          
          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-md flex justify-center items-center gap-2"
            >
              {editingId ? <><CheckCircle2 size={18}/> Salvar Alterações</> : <><Plus size={18}/> Cadastrar Registro</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}