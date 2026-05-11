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
    // Backdrop com o seu Azul Escuro e opacidade
    <div className="fixed inset-0 bg-[#13335a]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-[#e2e8f0]">
        
        {/* Cabeçalho com Cinza Claro e borda Azul Claro */}
        <div className="p-6 border-b-2 border-[#66b6e3] flex justify-between items-center bg-[#f0f4f8]">
          <div>
            <h3 className="text-xl font-bold text-[#13335a]">{editingId ? 'Editar Registro' : 'Novo Registro'}</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
              {role === 'admin' ? (editingId ? 'Nível Central (Admin)' : 'Cadastro Global') : `Unidade: ${role}`}
            </p>
          </div>
          <button onClick={() => setIsModalOpen(false)} className="text-[#13335a] hover:bg-white p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSaveRecord} className="p-6 space-y-6 overflow-y-auto">
          
          <div>
            <label className="block text-sm font-bold text-[#13335a] mb-2 text-transform: uppercase">Título do Documento</label>
            <input 
              type="text" 
              required
              value={newRecord.title}
              onChange={e => setNewRecord({...newRecord, title: e.target.value})}
              className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#66b6e3] focus:border-[#66b6e3] outline-none transition-all bg-[#f0f4f8]/50"
              placeholder="Ex: Ofício 123/2026"
            />
          </div>

          {role === 'admin' && (
            <div>
              <label className="block text-sm font-bold text-[#13335a] mb-2 text-transform: uppercase">Coordenadoria Regional</label>
              <select
                required
                value={newRecord.cre || ''}
                onChange={e => setNewRecord({...newRecord, cre: e.target.value})}
                className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#66b6e3] focus:border-[#66b6e3] outline-none transition-all bg-white"
              >
                <option value="" disabled>Selecione uma CRE...</option>
                {cres.map(cre => (
                  <option key={cre} value={cre}>{cre}</option>
                ))}
              </select>
            </div>
          )}

          <div>
             <label className="block text-sm font-bold text-[#13335a] mb-2 text-transform: uppercase">Upload de Arquivo</label>
             <input 
               type="file" 
               ref={fileInputRef}
               onChange={handleFileChange}
               className="hidden"
               accept=".pdf,.xls,.xlsx,.csv"
             />
             <div 
               onClick={() => fileInputRef.current.click()}
               className="w-full border-2 border-dashed border-[#e2e8f0] rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-[#f0f4f8] hover:border-[#66b6e3] hover:text-[#66b6e3] transition-all cursor-pointer group"
             >
               <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
               {newRecord.fileName ? (
                 <div className="text-center">
                   <p className="font-bold text-[#13335a]">{newRecord.fileName}</p>
                   <p className="text-[10px] text-slate-500 mt-1 uppercase">Clique para substituir</p>
                 </div>
               ) : (
                 <div className="text-center">
                   <p className="font-medium">Selecionar arquivo local</p>
                   <p className="text-[10px] mt-1 uppercase">PDF ou Planilhas</p>
                 </div>
               )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-bold text-[#13335a] mb-2 text-transform: uppercase">Formato</label>
              <div className="flex bg-[#f0f4f8] p-1 rounded-xl gap-1 border border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setNewRecord({...newRecord, type: 'pdf'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-all ${
                    newRecord.type === 'pdf' 
                      ? 'bg-[#66b6e3] text-white font-bold shadow-md' 
                      : 'text-slate-500 hover:bg-white'
                  }`}
                >
                  <FileText size={18} /> PDF
                </button>
                <button
                  type="button"
                  onClick={() => setNewRecord({...newRecord, type: 'excel'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-all ${
                    newRecord.type === 'excel' 
                      ? 'bg-[#13335a] text-white font-bold shadow-md' 
                      : 'text-slate-500 hover:bg-white'
                  }`}
                >
                  <FileSpreadsheet size={18} /> Planilha
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#13335a] mb-2 text-transform: uppercase">Status</label>
              <div className="flex bg-[#f0f4f8] p-1 rounded-xl gap-1 border border-[#e2e8f0]">
                <button
                  type="button"
                  disabled={role !== 'admin'}
                  onClick={() => role === 'admin' && setNewRecord({...newRecord, status: 'Pendente'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-all ${
                    newRecord.status === 'Pendente' 
                      ? 'bg-[#ff6666] text-white font-bold shadow-md' 
                      : 'text-slate-500 hover:bg-white'
                  } ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <AlertCircle size={18} /> Pendente
                </button>
                <button
                  type="button"
                  disabled={role !== 'admin'}
                  onClick={() => role === 'admin' && setNewRecord({...newRecord, status: 'Aprovado'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm transition-all ${
                    newRecord.status === 'Aprovado' 
                      ? 'bg-green-600 text-white font-bold shadow-md' 
                      : 'text-slate-500 hover:bg-white'
                  } ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <CheckCircle2 size={18} /> Aprovado
                </button>
              </div>
            </div>

          </div>
          
          <div className="pt-4 border-t border-[#e2e8f0] flex gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 px-4 border border-[#e2e8f0] text-[#13335a] rounded-xl hover:bg-[#f0f4f8] font-bold transition-all text-sm uppercase"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 px-4 bg-[#13335a] text-white rounded-xl hover:bg-[#13335a]/90 font-bold transition-all shadow-md flex justify-center items-center gap-2 text-sm uppercase"
            >
              {editingId ? <CheckCircle2 size={18}/> : <Plus size={18}/>}
              {editingId ? 'Salvar Alterações' : 'Confirmar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}