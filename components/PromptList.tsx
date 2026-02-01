import React, { useEffect, useState } from 'react';
import { PromptData } from '../types';
import { db, auth } from '../services/firebase';
import { collection, onSnapshot, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { RetroCard, RetroButton } from './ui/RetroComponents';
import { Trash2, Edit2, Tag } from 'lucide-react';

interface PromptListProps {
  onEdit: (prompt: PromptData) => void;
}

export const PromptList: React.FC<PromptListProps> = ({ onEdit }) => {
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
        setLoading(false);
        return;
    }

    // Filtra para pegar apenas as notas do usuário logado
    // NOTA: Se o console der erro de "Index", clique no link que aparecer no console do navegador para criar o índice automaticamente.
    const q = query(
        collection(db, 'prompts'), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const promptsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PromptData));
      setPrompts(promptsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching prompts: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este prompt? Essa ação é irreversível.')) {
      try {
        await deleteDoc(doc(db, 'prompts', id));
      } catch (err) {
        console.error("Error deleting doc:", err);
        alert("Erro ao deletar.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse font-['Press_Start_2P'] text-xl text-nes-blue">CARREGANDO...</div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-['VT323'] text-3xl text-gray-500 dark:text-gray-400">Nenhum prompt encontrado.</p>
        <p className="font-['VT323'] text-xl text-gray-400 mt-2">Clique em "Novo Prompt" para começar!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
      {prompts.map((prompt) => (
        <RetroCard key={prompt.id} className="flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-200">
          {prompt.imageUrl && (
            <div className="mb-4 border-2 border-black overflow-hidden bg-gray-100 h-48 flex items-center justify-center relative">
               <img 
                 src={prompt.imageUrl} 
                 alt={prompt.title} 
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 ring-2 ring-black/10 inset-shadow"></div>
            </div>
          )}
          
          <h3 className="font-['Press_Start_2P'] text-sm leading-6 mb-3 text-gray-800 dark:text-white line-clamp-2 min-h-[40px]">
            {prompt.title}
          </h3>

          <div className="bg-yellow-50 dark:bg-gray-900 border-2 border-black/20 p-2 mb-4 flex-grow">
            <p className="font-['VT323'] text-xl text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-4">
              {prompt.content}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {prompt.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center text-xs font-['Press_Start_2P'] bg-blue-100 text-blue-800 px-2 py-1 border border-blue-800">
                <Tag size={10} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-3 mt-auto pt-4 border-t-2 border-dashed border-gray-300">
            <button 
              onClick={() => onEdit(prompt)}
              className="flex-1 font-['VT323'] text-xl bg-gray-200 hover:bg-gray-300 text-black border-2 border-black py-1 flex justify-center items-center gap-2 active:translate-y-1"
            >
              <Edit2 size={16} /> EDITAR
            </button>
            <button 
              onClick={() => prompt.id && handleDelete(prompt.id)}
              className="font-['VT323'] text-xl bg-red-100 hover:bg-red-200 text-red-600 border-2 border-black px-3 py-1 flex justify-center items-center active:translate-y-1"
              title="Deletar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </RetroCard>
      ))}
    </div>
  );
};