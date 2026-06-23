import React from 'react';
import { Building2, AlertCircle, LockKeyhole } from 'lucide-react';

export default function LoginView({ handleLogin, loginError, loginUser, setLoginUser, loginPass, setLoginPass }) {
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-[#e2e8f0]">
        
        {/* Cabeçalho do Login */}
        <div className="text-center mb-8">
          <div className="bg-[#13335a] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#66b6e3] shadow-lg shadow-[#13335a]/20">
            <Building2 size={40} />
          </div>
          <h1 className="text-2xl font-black text-[#13335a] tracking-tight uppercase">Acessar a Plataforma</h1>
          <p className="text-slate-500 mt-2 font-medium">Acesso Central e Setores</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Mensagem de Erro (Vermelho) */}
          {loginError && (
            <div className="p-3 bg-[#ff6666]/10 text-[#ff6666] border border-[#ff6666]/20 rounded-xl text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle size={18} /> 
              <span className="font-bold">{loginError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#13335a] mb-2 uppercase tracking-wider">Usuário</label>
            <input 
              type="text" 
              required
              value={loginUser}
              onChange={e => setLoginUser(e.target.value)}
              className="w-full px-4 py-3 bg-[#f0f4f8]/50 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#66b6e3] focus:border-[#66b6e3] outline-none transition-all text-[#13335a] font-medium"
              placeholder="Ex: admin ou setor1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#13335a] mb-2 uppercase tracking-wider">Senha</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                className="w-full px-4 py-3 bg-[#f0f4f8]/50 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#66b6e3] focus:border-[#66b6e3] outline-none transition-all text-[#13335a] font-medium"
                placeholder="••••••••"
              />
              <LockKeyhole size={18} className="absolute right-4 top-3.5 text-slate-400" />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#13335a] text-white font-bold py-4 rounded-xl hover:bg-[#13335a]/90 hover:shadow-lg transition-all mt-4 uppercase tracking-widest text-sm shadow-md"
          >
            Entrar no Sistema
          </button>

          {/* Dicas de Acesso */}
          <div className="pt-6 border-t border-[#e2e8f0] mt-6">
            <div className="bg-[#f0f4f8] p-4 rounded-2xl space-y-2 border border-[#e2e8f0]">
              <p className="text-[10px] text-slate-400 font-bold uppercase text-center mb-1">Perfis de Demonstração</p>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium text-transform: lowercase">admin / 123</span>
                <span className="text-[#13335a] font-bold uppercase tracking-tighter">Acesso Total</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium text-transform: lowercase">setor1 / 123</span>
                <span className="text-[#66b6e3] font-bold uppercase tracking-tighter">Acesso Setor 1</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}