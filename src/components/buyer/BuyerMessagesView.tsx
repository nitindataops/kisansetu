import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  CheckCheck, 
  CheckCircle2, 
  MapPin,
  Clock
} from 'lucide-react';
import { BuyerMessageThread } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';

interface BuyerMessagesViewProps {
  threads: BuyerMessageThread[];
  currentLanguage: LanguageCode;
  onSendMessage: (threadId: string, text: string) => void;
  activeThreadId?: string;
  onSelectThread?: (threadId: string) => void;
}

export const BuyerMessagesView: React.FC<BuyerMessagesViewProps> = ({
  threads,
  currentLanguage,
  onSendMessage,
  activeThreadId,
  onSelectThread,
}) => {
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;

  const [selectedId, setSelectedId] = useState<string>(activeThreadId || threads[0]?.id || '');
  const [inputText, setInputText] = useState('');

  const currentThread = threads.find((t) => t.id === selectedId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentThread) return;
    onSendMessage(currentThread.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E3DCB] shadow-2xs overflow-hidden h-[75vh] flex flex-col md:flex-row">
      
      {/* Left Sidebar: Conversations List */}
      <div className="w-full md:w-80 border-r border-[#E3DCB] flex flex-col bg-[#FAF7F0]">
        <div className="p-4 border-b border-[#E3DCB] bg-[#FAF7F0]">
          <h3 className="text-sm font-black text-[#26332B] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#245C3A]" />
            <span>{t.messages.title}</span>
          </h3>
          <span className="text-[11px] text-[#68736B]">{threads.length} Farmer Conversations</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#F0EBE1]">
          {threads.map((thread) => {
            const isSelected = thread.id === currentThread?.id;
            return (
              <button
                key={thread.id}
                onClick={() => {
                  setSelectedId(thread.id);
                  onSelectThread?.(thread.id);
                }}
                className={`w-full p-3.5 text-left transition-colors cursor-pointer flex items-start gap-3 ${
                  isSelected ? 'bg-white border-l-4 border-[#245C3A]' : 'hover:bg-white/60'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#245C3A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {thread.farmerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#26332B] truncate">{thread.farmerName}</span>
                    <span className="text-[10px] text-[#8D9B91]">
                      {thread.messages[thread.messages.length - 1]?.timestamp || 'Today'}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-semibold text-[#5F8F45] block truncate">
                    {thread.cropName}
                  </span>
                  <p className="text-[11px] text-[#68736B] truncate mt-0.5">
                    {thread.messages[thread.messages.length - 1]?.text || 'No messages yet'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Pane */}
      <div className="flex-1 flex flex-col bg-white">
        {currentThread ? (
          <>
            {/* Chat Top Header */}
            <div className="p-4 border-b border-[#E3DCB] bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#245C3A] text-white flex items-center justify-center text-xs font-bold">
                  {currentThread.farmerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-black text-[#26332B]">{currentThread.farmerName}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245C3A]" />
                  </div>
                  <span className="text-[11px] text-[#68736B]">
                    Discussing lot: <strong className="text-[#245C3A]">{currentThread.cropName}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Thread Scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBFAF4]">
              {currentThread.messages.map((msg) => {
                const isBuyer = msg.sender === 'buyer';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isBuyer
                          ? 'bg-[#245C3A] text-white rounded-br-none'
                          : 'bg-white text-[#26332B] border border-[#E3DCB] rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[9.5px] text-[#8D9B91] mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#E3DCB] bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.messages.typePlaceholder}
                className="flex-1 px-4 py-2.5 bg-[#FBFAF4] border border-[#D5DDD2] rounded-xl text-xs text-[#26332B] focus:border-[#245C3A] focus:ring-1 focus:ring-[#245C3A]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#245C3A] hover:bg-[#1C4B2E] text-white transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-[#8D9B91] p-6">
            <p className="text-xs">{t.messages.selectThread}</p>
          </div>
        )}
      </div>

    </div>
  );
};
