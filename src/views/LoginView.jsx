import React from 'react';
import { Building2, AlertCircle } from 'lucide-react';

export default function LoginView({ handleLogin, loginError, loginUser, setLoginUser, loginPass, setLoginPass }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
            <Building2 size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">SME Portal Login</h1>
          <p className="text-slate-500 mt-2">Acesso Nível Central e Coordenadorias</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {loginError && (
            <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {loginError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
            <input 
              type="text" 
              value={loginUser}
              onChange={e => setLoginUser(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin ou usercre1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <input 
              type="password" 
              value={loginPass}
              onChange={e => setLoginPass(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="123"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4">
            Entrar no Sistema
          </button>
          <div className="text-xs text-slate-400 text-center mt-4 space-y-1">
            <p>Dica: <b>admin / 123</b> para acesso total</p>
            <p><b>usercre1 / 123</b> para acesso CRE 01</p>
          </div>
        </form>
      </div>
    </div>
  );
}