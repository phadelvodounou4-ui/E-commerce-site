'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, Send, MapPin, User } from 'lucide-react';

const API = 'https://ecommerce-backend-b0po.onrender.com/api/v1';

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get(`${API}/products/${id}`).then(res => {
      setProduct(res.data.data.product);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && id) {
      axios.get(`${API}/messages/${id}`, { headers: { Authorization: 'Bearer ' + token } })
        .then(res => setMessages(res.data.data.messages))
        .catch(() => {});
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) return alert('Connectez-vous pour envoyer un message');
    try {
      const res = await axios.post(`${API}/messages`, {
        product_id: parseInt(id),
        receiver_id: product.seller_id,
        content: newMsg.trim()
      }, { headers: { Authorization: 'Bearer ' + token } });
      setMessages([...messages, res.data.data.message]);
      setNewMsg('');
    } catch (err) {}
  };

  if (loading) return <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center"><p>Chargement...</p></div>;
  if (!product) return <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center"><p>Produit non trouvé</p></div>;

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav className="sticky top-0 z-30 bg-white border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/products" className="p-2 hover:bg-[#f0f2f5] rounded-lg"><ArrowLeft size={20} /></Link>
          <h1 className="text-lg font-extrabold truncate">{product.name}</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Infos produit */}
        <div className="bg-white rounded-2xl border border-black/[0.08] overflow-hidden">
          {product.image ? <img src={product.image} alt={product.name} className="w-full h-64 object-cover" /> : <div className="w-full h-64 bg-[#f0f2f5] flex items-center justify-center text-8xl">📦</div>}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-extrabold mb-1">{product.name}</h2>
                <p className="text-[#606770] text-sm flex items-center gap-1"><MapPin size={14} /> {product.location || 'Non défini'}</p>
              </div>
              <span className="text-2xl font-extrabold text-[#1c1e21]">{product.price} FCFA</span>
            </div>
            <p className="text-[#606770] mb-4">{product.description}</p>
            <div className="flex items-center gap-3 text-sm text-[#606770]">
              <div className="flex items-center gap-1"><User size={14} /> {product.seller_name || 'Anonyme'}</div>
              <span className="bg-[#e7f0ff] text-[#1877F2] px-2 py-0.5 rounded-full text-xs font-semibold">{product.category || 'Autres'}</span>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="bg-white rounded-2xl border border-black/[0.08] overflow-hidden">
          <div className="p-4 border-b border-black/[0.08]">
            <h3 className="font-extrabold flex items-center gap-2">💬 Discussion</h3>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-[#f8f9fa]">
            {messages.length === 0 && (
              <p className="text-center text-[#606770] text-sm py-10">Aucun message. Posez une question au vendeur !</p>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender_id === product.seller_id ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.sender_id === product.seller_id ? 'bg-white border border-black/[0.08] rounded-tl-none' : 'bg-[#1877F2] text-white rounded-tr-none'}`}>
                  <p className="text-xs font-semibold mb-0.5 opacity-70">{msg.sender_name || 'Moi'}</p>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-black/[0.08] flex gap-2">
            <input
              type="text"
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Votre message..."
              className="flex-1 px-4 py-2.5 border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#1877F2]"
            />
            <button onClick={sendMessage} className="px-4 py-2.5 rounded-xl bg-[#1877F2] text-white hover:bg-[#166fe0] transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
