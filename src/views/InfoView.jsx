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
        <h2 className="text-3xl font-bold mb-2">Modernização Tecnológica SME</h2>
        <p className="text-white/80 text-lg max-w-2xl">
          Explorando o React como alternativa de alto desempenho ao PowerApps para a criação de ecossistemas digitais robustos e escaláveis.
        </p>
      </div>

      {/* Objetivo Estratégico */}
      <section className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-3 mb-4 text-[#13335a]">
          <Target size={24} />
          <h3 className="text-xl font-bold text-[#13335a]">Objetivo Estratégico</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Validar uma arquitetura de <strong className="text-[#13335a]">alta performance com custos controlados</strong>, testando a viabilidade de Web Apps dedicados (React) em substituição aos fluxos do PowerApps, garantindo maior fluidez e praticidade.
        </p>
      </section>

      {/* Pilotos Ativos na Secretaria */}
      <section className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-3 mb-6 text-[#13335a]">
          <Rocket size={24} />
          <h3 className="text-xl font-bold text-[#13335a]">Pilotos Ativos na Secretaria</h3>
        </div>
        
        {/* Cartões lado a lado em ecrãs grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Caso Subex */}
          <div className="border-l-4 border-[#66b6e3] pl-4 py-3 bg-[#f0f4f8] rounded-r-lg">
            <h4 className="font-bold text-[#13335a] text-lg">Subex — Gestão de Notas Fiscais</h4>
            <p className="text-sm text-slate-500 mb-2 font-medium">Ferramentas: React + Servidores Internos + IA</p>
            <p className="text-slate-600 text-sm">
              <strong className="text-[#13335a]">O Problema:</strong> Conferência manual massiva de notas. <br/>
              <strong className="text-[#13335a]">A Solução:</strong> Extração automática via IA, reduzindo o tempo de processamento de minutos para segundos.
            </p>
          </div>

          {/* Caso CTRH */}
          <div className="border-l-4 border-[#66b6e3] pl-4 py-3 bg-[#f0f4f8] rounded-r-lg">
            <h4 className="font-bold text-[#13335a] text-lg">CTRH — Avaliação de Lideranças</h4>
            <p className="text-sm text-slate-500 mb-2 font-medium">Ferramentas: React + Firebase</p>
            <p className="text-slate-600 text-sm">
              <strong className="text-[#13335a]">O Problema:</strong> Lentidão e barreiras de login no PowerApps. <br/>
              <strong className="text-[#13335a]">A Solução:</strong> App leve com persistência offline e interface customizada para alta adesão.
            </p>
          </div>
        </div>
      </section>

      {/* Seção de Custos */}
      <section className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-3 mb-6 text-[#13335a]">
          <TrendingDown size={24} />
          <h3 className="text-xl font-bold text-[#13335a]">Estrutura de Custos (Estimativa)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-[#13335a] text-[#13335a] uppercase text-xs">
                <th className="py-3 px-2 font-bold">Recurso</th>
                <th className="py-3 px-2 font-bold">Plano Gratuito</th>
                <th className="py-3 px-2 font-bold">Escala (Blaze)</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-[#e2e8f0] hover:bg-[#f0f4f8] transition-colors">
                <td className="py-3 px-2 font-medium">Banco de Dados</td>
                <td className="py-3 px-2">Até 1 GB</td>
                <td className="py-3 px-2">~$0.18 / GB adicional</td>
              </tr>
              <tr className="border-b border-[#e2e8f0] hover:bg-[#f0f4f8] transition-colors">
                <td className="py-3 px-2 font-medium">IA (Gemini API)</td>
                <td className="py-3 px-2">--</td>
                <td className="py-3 px-2">~$0.075 / 1M tokens</td>
              </tr>
              <tr className="hover:bg-[#f0f4f8] transition-colors">
                <td className="py-3 px-2 font-medium">Hospedagem</td>
                <td className="py-3 px-2">10 GB incluído</td>
                <td className="py-3 px-2">~$0.026 / GB transferido</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-[#f0f4f8] rounded-xl text-xs text-[#13335a] font-medium border border-[#66b6e3]/30">
          Resumo Financeiro: Custo estimado de R$ 15,00 a R$ 50,00 mensais para operações departamentais.
        </div>
      </section>

      {/* Links e Acesso */}
      <section className="bg-[#f0f4f8] p-6 rounded-2xl border border-[#e2e8f0]">
        <h3 className="text-[#13335a] font-bold mb-4 flex items-center gap-2">
          <Globe size={20} className="text-[#66b6e3]" /> Recursos do Piloto
        </h3>
        {/* Botões lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="https://modelodeuso.web.app/" target="_blank" rel="noreferrer" className="flex items-center justify-center p-3 bg-[#13335a] rounded-xl text-sm font-medium text-white hover:bg-[#13335a]/90 transition-all shadow-md">
            Acessar Site do Modelo
          </a>
          <a href="https://github.com/micheleguims/modelodeuso" target="_blank" rel="noreferrer" className="flex items-center justify-center p-3 bg-white border-2 border-[#13335a] rounded-xl text-sm font-medium text-[#13335a] hover:bg-[#f0f4f8] transition-all shadow-sm">
            Repositório no GitHub
          </a>
        </div>
      </section>

      {/* Rodapé */}
      <div className="mt-12 pt-6 border-t border-[#e2e8f0] flex flex-col items-center text-center gap-4 text-slate-500">
        <div className="text-xs font-medium">
          © 2026 Secretaria Municipal de Educação — SME | Piloto desenvolvido com auxílio de IA (Gemini). E/CIT/GSD.
        </div>
      </div>

    </div>
  );
}