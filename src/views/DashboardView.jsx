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
          <h2 className="text-2xl font-bold text-[#13335a]">Visão Geral</h2>
          <p className="text-slate-500">
            {role === 'admin' 
              ? (creFilter === 'Todas' ? 'Métricas de monitoramento consolidadas.' : `Métricas para ${creFilter}.`)
              : `Métricas de monitoramento da ${role}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {role === 'admin' && (
             <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-lg px-3 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[#66b6e3]">
               <Filter size={16} className="text-[#66b6e3]" />
               <select 
                 value={creFilter}
                 onChange={(e) => setCreFilter(e.target.value)}
                 className="text-sm font-bold text-[#13335a] bg-transparent outline-none cursor-pointer pr-2 py-0.5 uppercase"
               >
                 <option value="Todas">Todas as CREs</option>
                 {CRES.map(cre => (
                   <option key={cre} value={cre}>{cre}</option>
                 ))}
               </select>
             </div>
           )}
           <div className="flex gap-2">
             <button onClick={() => downloadMockModel('pdf')} className="flex items-center gap-2 px-3 py-1.5 bg-[#f0f4f8] border border-[#e2e8f0] text-[#13335a] rounded-lg hover:bg-[#66b6e3] hover:text-white text-xs font-bold shadow-sm transition-all uppercase">
               <Download size={14} /> Modelo PDF
             </button>
             <button onClick={() => downloadMockModel('excel')} className="flex items-center gap-2 px-3 py-1.5 bg-[#13335a] text-white rounded-lg hover:bg-[#13335a]/90 text-xs font-bold shadow-sm transition-all uppercase">
               <Download size={14} /> Modelo Excel
             </button>
           </div>
        </div>
      </div>

      {/* Cartões de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total - Azul Claro */}
        <div className="bg-white p-6 rounded-xl border-b-4 border-[#66b6e3] shadow-sm flex items-center gap-4">
          <div className="p-4 bg-[#f0f4f8] text-[#66b6e3] rounded-lg"><Files size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registros</p>
            <p className="text-3xl font-black text-[#13335a]">{dashboardStats.total}</p>
          </div>
        </div>
        
        {/* Pendentes - Vermelho */}
        <div className="bg-white p-6 rounded-xl border-b-4 border-[#ff6666] shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-50 text-[#ff6666] rounded-lg"><AlertCircle size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendentes</p>
            <p className="text-3xl font-black text-[#13335a]">{dashboardStats.pendentes}</p>
          </div>
        </div>

        {/* Aprovados - Verde (Mantido para padrão de sucesso) */}
        <div className="bg-white p-6 rounded-xl border-b-4 border-emerald-500 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aprovados</p>
            <p className="text-3xl font-black text-[#13335a]">{dashboardStats.aprovados}</p>
          </div>
        </div>
      </div>

      {role === 'admin' && (
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm h-[400px]">
          <h3 className="text-lg font-bold text-[#13335a] mb-6 uppercase tracking-tight">
            {creFilter === 'Todas' ? 'Volume por Coordenadoria' : `Análise Individual - ${creFilter}`}
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#13335a', fontSize: 10, fontWeight: 'bold'}} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
              />
              <Tooltip 
                cursor={{fill: '#f0f4f8'}} 
                contentStyle={{
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(19, 51, 90, 0.1)',
                  backgroundColor: '#fff',
                  color: '#13335a'
                }} 
              />
              {/* Barra no Azul Claro da Identidade */}
              <Bar dataKey="Registros" fill="#66b6e3" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}