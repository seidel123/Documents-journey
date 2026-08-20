'use client';

import { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Upload, Share, Save, Check, FileText, ChevronLeft, Users, Trash2 } from 'lucide-react';
import { User } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type DocType = {
  id: string;
  title: string;
  content: string | null;
  ownerId: string;
  owner: User;
  shares: { user: User }[];
};

export default function DocumentEditor({
  document: initialDoc,
  isOwner,
}: {
  document: DocType;
  isOwner: boolean;
  currentUser: User;
}) {
  const [doc] = useState(initialDoc);
  const [title, setTitle] = useState(initialDoc.title);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
    ],
    content: initialDoc.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[800px] bg-white p-12 sm:p-16 shadow-xl ring-1 ring-gray-200/50 mx-auto my-8 rounded-xl',
      },
    },
    onUpdate: () => {
      // Auto-save logic could go here
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/documents/${doc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: editor?.getHTML(),
        }),
      });
    } catch {
      console.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setShareMessage('');
    try {
      const res = await fetch(`/api/documents/${doc.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: shareEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setShareMessage(`Error: ${data.error}`);
      } else {
        setShareMessage('Shared successfully!');
        setShareEmail('');
      }
    } catch {
      setShareMessage('Failed to share');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const html = text.split('\n').map(line => `<p>${line}</p>`).join('');
      editor?.commands.setContent(html);
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    };
    reader.readAsText(file);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await fetch(`/api/documents/${doc.id}`, {
        method: 'DELETE',
      });
      router.push('/');
      router.refresh();
    } catch {
      console.error('Failed to delete document');
      setIsDeleting(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50/50">
      {/* Editor Header */}
      <div className="sticky top-[64px] z-40 bg-white border-b border-gray-200 shadow-sm px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 flex-1">
            <Link href="/" className="p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 hidden sm:block">
              <FileText size={20} />
            </div>
            <div className="flex flex-col flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-bold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1 -ml-1 text-gray-900 placeholder-gray-400 w-full max-w-[200px] sm:max-w-md"
                placeholder="Untitled Document"
              />
              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  {isOwner ? 'Owner' : 'Shared'}
                </span>
                <span>•</span>
                <span>{doc.shares.length} collaborator{doc.shares.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-end">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Upload size={16} />
              <span className="hidden sm:inline">Import</span>
            </button>
            <input 
              type="file" 
              accept=".txt,.md" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />

            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            {isOwner && (
              <>
                <button 
                  onClick={() => setShowShareDialog(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Share size={16} />
                  Share
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete Document"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </>
            )}
            
            <button 
              onClick={handleSave} 
              disabled={isSaving} 
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-70 disabled:hover:shadow-none"
            >
              {isSaving ? <Check size={16} /> : <Save size={16} />}
              {isSaving ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-6 p-4 md:p-6">
        
        {/* Floating Toolbar */}
        <div className="md:w-16 flex-shrink-0">
          <div className="sticky top-[160px] bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex flex-row md:flex-col items-center gap-1 z-30 overflow-x-auto">
            <ToolbarButton 
              active={editor.isActive('bold')} 
              onClick={() => editor.chain().focus().toggleBold().run()} 
              icon={<Bold size={18} />} 
              label="Bold" 
            />
            <ToolbarButton 
              active={editor.isActive('italic')} 
              onClick={() => editor.chain().focus().toggleItalic().run()} 
              icon={<Italic size={18} />} 
              label="Italic" 
            />
            <div className="w-px h-6 md:w-8 md:h-px bg-gray-200 my-1 flex-shrink-0"></div>
            <ToolbarButton 
              active={editor.isActive('heading', { level: 1 })} 
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
              icon={<Heading1 size={18} />} 
              label="Heading 1" 
            />
            <ToolbarButton 
              active={editor.isActive('heading', { level: 2 })} 
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
              icon={<Heading2 size={18} />} 
              label="Heading 2" 
            />
            <div className="w-px h-6 md:w-8 md:h-px bg-gray-200 my-1 flex-shrink-0"></div>
            <ToolbarButton 
              active={editor.isActive('bulletList')} 
              onClick={() => editor.chain().focus().toggleBulletList().run()} 
              icon={<List size={18} />} 
              label="Bullet List" 
            />
            <ToolbarButton 
              active={editor.isActive('orderedList')} 
              onClick={() => editor.chain().focus().toggleOrderedList().run()} 
              icon={<ListOrdered size={18} />} 
              label="Numbered List" 
            />
          </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 w-full max-w-3xl cursor-text" onClick={() => editor.chain().focus().run()}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Share Dialog Modal */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Share Document</h2>
              <button onClick={() => setShowShareDialog(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors">
                <ChevronLeft className="rotate-180" size={16} />
              </button>
            </div>
            
            <form onSubmit={handleShare} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Invite via Email</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    placeholder="colleague@example.com"
                    required
                  />
                  <button 
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md rounded-xl transition-all"
                  >
                    Invite
                  </button>
                </div>
              </div>
              
              {shareMessage && (
                <div className={`p-3 rounded-lg text-sm font-medium ${shareMessage.includes('Error') || shareMessage.includes('Failed') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                  {shareMessage}
                </div>
              )}
            </form>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                People with access
              </h3>
              
              <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                <li className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                      {doc.owner.name?.[0] || 'O'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.owner.name || doc.owner.email}</p>
                      <p className="text-xs text-gray-500">{doc.owner.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-400">Owner</span>
                </li>
                
                {doc.shares.map((s: { user: User }) => (
                  <li key={s.user.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                        {s.user.name?.[0] || s.user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{s.user.name || s.user.email}</p>
                        <p className="text-xs text-gray-500">{s.user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-400">Editor</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-xl transition-all flex items-center justify-center w-full md:w-auto
        ${active 
          ? 'bg-blue-100 text-blue-700 shadow-sm' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      title={label}
    >
      {icon}
    </button>
  );
}
