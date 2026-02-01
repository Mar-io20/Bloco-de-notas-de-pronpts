import React, { useState, useEffect } from 'react';
import { PromptData } from '../types';
import { RetroButton, RetroInput, RetroTextarea, RetroCard } from './ui/RetroComponents';
import { db, auth } from '../services/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Save, X } from 'lucide-react';

interface PromptFormProps {
  initialData?: PromptData | null;
  onSave: () => void;
  onCancel: () => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({ initialData, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setTags(initialData.tags.join(', '));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const user = auth.currentUser;
    if (!user) {
        setError('Você precisa estar logado para salvar.');
        setLoading(false);
        return;
    }

    try {
      const promptData = {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        imageUrl: initialData?.imageUrl || '',
        userId: user.uid, // Associa a nota ao usuário atual
        createdAt: initialData ? initialData.createdAt : Date.now(),
      };

      if (initialData && initialData.id) {
        // Update
        const promptRef = doc(db, 'prompts', initialData.id);
        await updateDoc(promptRef, promptData);
      } else {
        // Create
        await addDoc(collection(db, 'prompts'), promptData);
      }

      onSave();
    } catch (err: any) {
      console.error("Error saving document:", err);
      if (err.code === 'permission-denied') {
        setError('Permissão negada. Verifique as regras do Firestore no Console.');
      } else {
        setError('Erro ao salvar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <RetroCard className="bg-gray-50">
        <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2">
          <h2 className="font-['Press_Start_2P'] text-lg md:text-xl text-nes-blue dark:text-blue-400">
            {initialData ? 'EDITAR PROMPT' : 'NOVO PROMPT'}
          </h2>
          <button onClick={onCancel} className="text-red-500 hover:text-red-700">
            <X size={24} />
          </button>
        </div>

        {error && <div className="bg-red-100 border-2 border-red-500 text-red-700 p-2 mb-4 font-['VT323'] text-xl">{error}</div>}

        <form onSubmit={handleSubmit}>
          <RetroInput 
            label="Título da Nota" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            placeholder="Ex: Gerador de Imagens Cyberpunk"
          />

          <RetroTextarea 
            label="Conteúdo do Prompt" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
            placeholder="Digite o prompt aqui..."
          />

          <RetroInput 
            label="Tags (separadas por vírgula)" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="Ex: midjourney, code, react"
          />

          <div className="flex justify-end gap-4 mt-8 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
            <RetroButton type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </RetroButton>
            <RetroButton type="submit" disabled={loading} className="flex items-center gap-2">
              <Save size={18} />
              {loading ? 'Salvando...' : 'Salvar Nota'}
            </RetroButton>
          </div>
        </form>
      </RetroCard>
    </div>
  );
};