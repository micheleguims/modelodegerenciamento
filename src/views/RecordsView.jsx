import React from 'react';
import { Filter, Plus, FileSpreadsheet, FileText, CheckCircle2, AlertCircle, Download, Pencil, Trash2 } from 'lucide-react';
import { CRES } from '../utils/constants';

export default function RecordsView({ role, creFilter, setCreFilter, filteredRecords, handleOpenModal, handleDelete }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#13335a]">Gerenciamento de Registros</h2>
          <p className="text-slate-500">
            {role === 'admin' ? 'Visualização consolidada de todos os setores.' : `Visualização restrita ao setor atual.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          
          {/* Filtro */}
          {role === 'admin' && (
             <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#66b6e3]">
               <Filter size={18} className="text-[#66b6e3]" />
               <select 
                 value={creFilter}
                 onChange={(e) => setCreFilter(e.target.value)}
                 className="text-sm font-bold text-[#13335a] bg-transparent outline-none cursor-pointer pr-2 uppercase"
               >
                 <option value="Todas">Todos os Setores</option>
                 {CRES.map(cre => (
                   <option key={cre} value={cre}>{cre}</option>
                 ))}
               </select>
             </div>
          )}

          {/* Botão Principal */}
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#13335a] hover:bg-[#13335a]/90 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md uppercase text-sm"
          >
            <Plus size={18} /> Novo Registro
          </button>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            {/* Cabeçalho da Tabela - Azul Escuro */}
            <thead className="bg-[#f0f4f8] border-b-2 border-[#13335a] text-[#13335a] uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">ID / Setor</th>
                <th className="px-6 py-4">Título do Documento</th>
                <th className="px-6 py-4">Formato</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Anexo</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-[#f0f4f8] transition-colors">
                  
                  {/* ID e CRE */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-[#13335a]">{record.id}</div>
                    <div className="text-[10px] font-semibold uppercase text-slate-500">{record.cre}</div>
                  </td>
                  
                  {/* Título */}
                  <td className="px-6 py-4 font-semibold text-[#13335a]">{record.title}</td>
                  
                  {/* Etiquetas de Formato */}
                  <td className="px-6 py-4">
                    {record.type === 'excel' ? 
                      <span className="flex items-center gap-1 text-[#13335a] bg-[#f0f4f8] border border-[#13335a]/20 px-2.5 py-1 rounded-md w-fit text-xs font-bold uppercase">
                        <FileSpreadsheet size={14}/> Planilha
                      </span> : 
                      <span className="flex items-center gap-1 text-white bg-[#66b6e3] border border-[#66b6e3] px-2.5 py-1 rounded-md w-fit text-xs font-bold uppercase">
                        <FileText size={14}/> PDF
                      </span>
                    }
                  </td>
                  
                  {/* Etiquetas de Status */}
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      record.status === 'Aprovado' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-[#ff6666]/10 text-[#ff6666] border border-[#ff6666]/20'
                    }`}>
                      {record.status === 'Aprovado' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                      {record.status}
                    </span>
                  </td>
                  
                  {/* Download de Anexo */}
                  <td className="px-6 py-4">
                     {record.fileUrl ? (
                       <a 
                         href={record.fileUrl} 
                         download={record.fileName}
                         className="flex items-center gap-1.5 text-[#66b6e3] hover:text-white font-bold text-xs bg-[#f0f4f8] hover:bg-[#66b6e3] border border-[#e2e8f0] hover:border-[#66b6e3] px-2.5 py-1.5 rounded-lg transition-all w-fit"
                       >
                         <Download size={14} /> {record.fileName.slice(0, 15)}{record.fileName.length > 15 ? '...' : ''}
                       </a>
                     ) : (
                       <span className="text-slate-400 text-xs italic font-medium">Sem anexo</span>
                     )}
                  </td>
                  
                  {/* Data */}
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500">
                    {new Date(record.date).toLocaleDateString('pt-BR')}
                  </td>
                  
                  {/* Botões de Ação */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => handleOpenModal(record)} className="text-[#66b6e3] hover:text-[#13335a] p-2 rounded-lg hover:bg-[#e2e8f0] transition-colors" title="Editar">
                         <Pencil size={18} />
                       </button>
                       <button onClick={() => handleDelete(record.id)} className="text-slate-400 hover:text-[#ff6666] p-2 rounded-lg hover:bg-[#ff6666]/10 transition-colors" title="Excluir">
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Caso a tabela esteja vazia */}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Filter size={32} className="mb-3 opacity-50" />
                      <p className="font-medium text-[#13335a]">Nenhum registro encontrado.</p>
                      <p className="text-xs mt-1">Ajuste os filtros ou crie um novo registro.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}