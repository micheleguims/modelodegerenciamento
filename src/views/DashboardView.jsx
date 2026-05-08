import React, { useMemo } from 'react';
import { Filter, Download, Files, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CRES } from '../utils/constants';

export default function DashboardView({ role, creFilter, setCreFilter, filteredRecords, records, addLog }) {
  const dashboardStats = useMemo(() => {
    return {
      total: filteredRecords.length,
      pendentes: filteredRecords.filter(r => r.status === 'Pendente').length,
      aprovados: filteredRecords.filter(r => r.status === 'Aprovado').length,
    };
  }, [filteredRecords]);

  const chartData = useMemo(() => {
    if (role !== 'admin') return [];
    const counts = {};
    CRES.forEach(cre => counts[cre] = 0);
    const recordsToCount = creFilter === 'Todas' ? records : records.filter(r => r.cre === creFilter);
    recordsToCount.forEach(r => { if (counts[r.cre] !== undefined) counts[r.cre]++; });
    return Object.entries(counts).map(([name, Registros]) => ({ name, Registros }));
  }, [records, role, creFilter]);

  const downloadMockModel = (type) => {
    const content = type === 'excel' ? 'id,nome,valor\n1,Teste,100' : 'Conteudo do PDF modelo...';
    const blob = new Blob([content], { type: type === 'excel' ? 'text/csv' : 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modelo_${type}.${type === 'excel' ? 'csv' : 'pdf'}`;
    a.click();
    URL.revokeObjectURL(url);
    addLog(`Baixou modelo: ${type}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          <p className="text-slate-500">
            {role === 'admin' 
              ? (creFilter === 'Todas' ? 'Métricas de monitoramento consolidadas.' : `Métricas de monitoramento para ${creFilter}.`)
              : `Métricas de monitoramento da ${role}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {role === 'admin' && (
             <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
               <Filter size={16} className="text-slate-400" />
               <select 
                 value={creFilter}
                 onChange={(e) => setCreFilter(e.target.value)}
                 className="text-sm font-medium text-slate-600 bg-transparent outline-none cursor-pointer pr-2 py-0.5"
               >
                 <option value="Todas">Todas as CREs</option>
                 {CRES.map(cre => (
                   <option key={cre} value={cre}>{cre}</option>
                 ))}
               </select>
             </div>
           )}
           <div className="flex gap-2">
             <button onClick={() => downloadMockModel('pdf')} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium shadow-sm transition-all">
               <Download size={16} /> Modelo PDF
             </button>
             <button onClick={() => downloadMockModel('excel')} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium shadow-sm transition-all">
               <Download size={16} /> Modelo Excel
             </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-lg"><Files size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Registros</p>
            <p className="text-3xl font-bold text-slate-800">{dashboardStats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-lg"><AlertCircle size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pendentes</p>
            <p className="text-3xl font-bold text-slate-800">{dashboardStats.pendentes}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Aprovados</p>
            <p className="text-3xl font-bold text-slate-800">{dashboardStats.aprovados}</p>
          </div>
        </div>
      </div>

      {role === 'admin' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            {creFilter === 'Todas' ? 'Volume de Registros por CRE' : `Volume de Registros - ${creFilter}`}
          </h3>
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="Registros" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}