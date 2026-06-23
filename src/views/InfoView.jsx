import React from 'react';
import { 
  Target, Rocket, TrendingDown, Globe 
} from 'lucide-react';

export default function InfoView() {
  return (
    // max-w-4xl mx-auto centraliza e limita a largura da página
    <div className="space-y-8 animate-in fade-in duration-700 pb-12 max-w-4xl mx-auto">
      {/* Cabeçalho em Destaque */}
      <div className="bg-[#13335a] rounded-3xl p-8 text-white shadow-lg border-b-4 border-[#66b6e3]">
        <h2 className="text-3xl font-bold mb-2">Plataforma de Gestão de Registros</h2>
        <p className="text-white/80 text-lg max-w-2xl">
          Aplicação web desenvolvida para centralizar documentos, acompanhar indicadores e simplificar rotinas operacionais em uma interface moderna e responsiva.
        </p>
      </div>

      {/* Objetivo do Projeto */}
      <section className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-3 mb-4 text-[#13335a]">
          <Target size={24} />
          <h3 className="text-xl font-bold text-[#13335a]">Objetivo do Projeto</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Este projeto foi criado para demonstrar a construção de um painel administrativo com
          <strong className="text-[#13335a]"> autenticação por perfil, gerenciamento de registros, upload de arquivos, filtros dinâmicos e visualização de métricas</strong>,
          com foco em usabilidade, organização da informação e escalabilidade da interface.
        </p>
      </section>

      {/* Principais Funcionalidades */}
      <section className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-3 mb-6 text-[#13335a]">
          <Rocket size={24} />
          <h3 className="text-xl font-bold text-[#13335a]">Principais Funcionalidades</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-[#66b6e3] pl-4 py-3 bg-[#f0f4f8] rounded-r-lg">
            <h4 className="font-bold text-[#13335a] text-lg">Gerenciamento de Registros</h4>
            <p className="text-sm text-slate-500 mb-2 font-medium">CRUD + Upload de arquivos</p>
            <p className="text-slate-600 text-sm">
              <strong className="text-[#13335a]">Destaque:</strong> Permite criar, editar e excluir registros, anexar arquivos e acompanhar o status de cada item em uma estrutura simples e organizada.
            </p>
          </div>

          <div className="border-l-4 border-[#66b6e3] pl-4 py-3 bg-[#f0f4f8] rounded-r-lg">
            <h4 className="font-bold text-[#13335a] text-lg">Dashboard Operacional</h4>
            <p className="text-sm text-slate-500 mb-2 font-medium">Indicadores + filtros por unidade</p>
            <p className="text-slate-600 text-sm">
              <strong className="text-[#13335a]">Destaque:</strong> Exibe métricas resumidas, segmentação por área e visualizações que ajudam no acompanhamento rápido do volume e do status dos registros.
            </p>
          </div>
        </div>
      </section>

      {/* Stack / Arquitetura */}
      <section className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-3 mb-6 text-[#13335a]">
          <TrendingDown size={24} />
          <h3 className="text-xl font-bold text-[#13335a]">Tecnologias e Estrutura</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-[#13335a] text-[#13335a] uppercase text-xs">
                <th className="py-3 px-2 font-bold">Camada</th>
                <th className="py-3 px-2 font-bold">Tecnologia</th>
                <th className="py-3 px-2 font-bold">Função no projeto</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-[#e2e8f0] hover:bg-[#f0f4f8] transition-colors">
                <td className="py-3 px-2 font-medium">Interface</td>
                <td className="py-3 px-2">React + Tailwind CSS</td>
                <td className="py-3 px-2">Construção de componentes e layout responsivo</td>
              </tr>
              <tr className="border-b border-[#e2e8f0] hover:bg-[#f0f4f8] transition-colors">
                <td className="py-3 px-2 font-medium">Dados</td>
                <td className="py-3 px-2">Firebase / Firestore</td>
                <td className="py-3 px-2">Persistência e atualização em tempo real</td>
              </tr>
              <tr className="hover:bg-[#f0f4f8] transition-colors">
                <td className="py-3 px-2 font-medium">Visualização</td>
                <td className="py-3 px-2">Recharts + Lucide</td>
                <td className="py-3 px-2">Gráficos, ícones e apoio visual à navegação</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-[#f0f4f8] rounded-xl text-xs text-[#13335a] font-medium border border-[#66b6e3]/30">
          O foco deste projeto é demonstrar organização de interface, componentização, controle por perfis e integração com banco de dados em uma aplicação de uso administrativo.
        </div>
      </section>

      {/* Links */}
      <section className="bg-[#f0f4f8] p-6 rounded-2xl border border-[#e2e8f0]">
        <h3 className="text-[#13335a] font-bold mb-4 flex items-center gap-2">
          <Globe size={20} className="text-[#66b6e3]" /> Acesso ao Projeto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://modelodegerenciamento.web.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center p-3 bg-[#13335a] rounded-xl text-sm font-medium text-white hover:bg-[#13335a]/90 transition-all shadow-md"
          >
            Acessar Site do Modelo
          </a>
          <a
            href="https://github.com/micheleguims/modelodegerenciamento"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center p-3 bg-white border-2 border-[#13335a] rounded-xl text-sm font-medium text-[#13335a] hover:bg-[#f0f4f8] transition-all shadow-sm"
          >
            Repositório no GitHub
          </a>
        </div>
      </section>

      {/* Rodapé */}
      <div className="mt-12 pt-6 border-t border-[#e2e8f0] flex flex-col items-center text-center gap-4 text-slate-500">
        <div className="text-xs font-medium">
          © 2026 Michele Guarany Guimarães Massari | Projeto demonstrativo desenvolvido em React.
        </div>
      </div>
    </div>
  );
}