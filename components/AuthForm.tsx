import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { RetroCard, RetroInput, RetroButton } from './ui/RetroComponents';
import { KeyRound, Mail, UserPlus, LogIn, AlertTriangle } from 'lucide-react';

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email ou senha inválidos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Erro de autenticação. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="font-['Press_Start_2P'] text-2xl md:text-3xl text-nes-red dark:text-red-500 mb-4 drop-shadow-md">
                INSERT COIN
            </h1>
            <p className="font-['VT323'] text-xl text-gray-600 dark:text-gray-400 uppercase">
                {isLogin ? 'Faça login para continuar' : 'Crie seu perfil de jogador'}
            </p>
        </div>

        <RetroCard className="border-4">
          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-6 flex items-center gap-3 font-['VT323'] text-xl">
              <AlertTriangle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
                <RetroInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="player1@exemplo.com"
                />
            </div>
            
            <div className="mb-6">
                <RetroInput
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="******"
                />
            </div>

            <RetroButton 
                type="submit" 
                disabled={loading} 
                className="w-full flex justify-center items-center gap-2 mb-4"
            >
                {loading ? 'PROCESSANDO...' : (isLogin ? <><LogIn size={20} /> START GAME</> : <><UserPlus size={20} /> NEW GAME</>)}
            </RetroButton>

            <div className="text-center border-t-2 border-dashed border-gray-300 pt-4 mt-4">
                <button
                    type="button"
                    onClick={() => { setError(''); setIsLogin(!isLogin); }}
                    className="font-['VT323'] text-xl text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800"
                >
                    {isLogin ? 'Não tem conta? Crie uma agora' : 'Já tem conta? Fazer Login'}
                </button>
            </div>
          </form>
        </RetroCard>
      </div>
    </div>
  );
};