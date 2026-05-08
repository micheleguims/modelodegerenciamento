import React from 'react';
import { Filter, Plus, FileSpreadsheet, FileText, CheckCircle2, AlertCircle, Download, Pencil, Trash2 } from 'lucide-react';
import { CRES } from '../utils/constants';

export default function RecordsView({ role, creFilter, setCreFilter, filteredRecords, handleOpenModal, handleDelete }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Base de Dados Corporativa</h2>
          <p className="text-slate-500">
            {role === 'admin' ? 'Visualização global de todas as coordenadorias.' : `Visualização restrita aos dados da ${role}.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {role === 'admin' && (
             <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
               <Filter size={18} className="text-slate-400" />
               <select 
                 value={creFilter}
                 onChange={(e) => setCreFilter(e.target.value)}
                 className="text-sm font-medium text-slate-600 bg-transparent outline-none cursor-pointer pr-2"
               >
                 <option value="Todas">Todas as CREs</option>
                 {CRES.map(cre => (
                   <option key={cre} value={cre}>{cre}</option>
                 ))}
               </select>
             </div>
          )}
          <button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} /> Novo Registro
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">ID / Origem</th>
                <th className="px-6 py-4">Título do Documento</th>
                <th className="px-6 py-4">Formato</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Anexo</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{record.id}</div>
                    <div className="text-xs text-slate-500">{record.cre}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{record.title}</td>
                  <td className="px-6 py-4">
                    {record.type === 'excel' ? 
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md w-fit"><FileSpreadsheet size={14}/> Planilha</span> : 
                      <span className="flex items-center gap-1 text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded-md w-fit"><FileText size={14}/> PDF</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold ${
                      record.status === 'Aprovado' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {record.status === 'Aprovado' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     {record.fileUrl ? (
                       <a 
                         href={record.fileUrl} 
                         download={record.fileName}
                         className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors w-fit"
                       >
                         <Download size={14} /> {record.fileName.slice(0, 15)}{record.fileName.length > 15 ? '...' : ''}
                       </a>
                     ) : (
                       <span className="text-slate-400 text-xs italic">Sem anexo</span>
                     )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(record.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => handleOpenModal(record)} className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Editar">
                         <Pencil size={18} />
                       </button>
                       <button onClick={() => handleDelete(record.id)} className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors" title="Excluir">
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr><td colSpan="7" className="text-center py-10 text-slate-500">Nenhum registro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}