'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function NotesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // For now, just use local storage for notes
      const savedNotes = localStorage.getItem('habit-notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
      setIsLoading(false);
    }
  }, [user]);

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note = {
      id: Date.now(),
      content: newNote,
      createdAt: new Date().toISOString(),
    };
    
    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('habit-notes', JSON.stringify(updatedNotes));
    setNewNote('');
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('habit-notes', JSON.stringify(updatedNotes));
  };

  if (loading || isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Notes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Capture thoughts, reflections, and insights about your habits
            </p>
          </div>

          {/* Add Note */}
          <div className="card mb-8">
            <div className="card-content">
              <div className="space-y-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a note..."
                  className="input min-h-[120px] resize-none"
                  rows={4}
                />
                <div className="flex justify-end">
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="btn btn-primary"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notes List */}
          {notes.length === 0 ? (
            <div className="card">
              <div className="card-content text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No notes yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start writing your first note to track thoughts and reflections
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="card animate-slide-up">
                  <div className="card-content">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(note.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="btn btn-ghost text-red-600 dark:text-red-400 p-1"
                        aria-label="Delete note"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {note.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}