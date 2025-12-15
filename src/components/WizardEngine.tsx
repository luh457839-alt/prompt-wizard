import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Copy, RefreshCw, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { useWizardStore } from '../store/wizardStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 工具函数
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface WizardEngineProps {
  className?: string;
  isMobile?: boolean;
}

export const WizardEngine: FC<WizardEngineProps> = ({ className, isMobile = false }) => {
  const { 
    activeWizard, 
    history, 
    currentStepIndex, 
    isCompleted, 
    submitAnswer, 
    finalResult,
    reset 
  } = useWizardStore();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // 自动滚动
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isCompleted]);

  if (!activeWizard) return null;

  const currentStep = activeWizard.steps[currentStepIndex];

  const handleSend = () => {
    if (!inputValue.trim()) return;
    submitAnswer(inputValue);
    setInputValue('');
  };

  const handleOptionSelect = (value: string, label: string) => {
    submitAnswer(value, label);
  };

  const copyToClipboard = () => {
    if (finalResult) {
      navigator.clipboard.writeText(finalResult);
      // 实际项目中建议使用 Toast 组件提示
      alert('Prompt Copied!');
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-gray-50 relative", className)}>
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          {isMobile && (
            <button onClick={reset} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}
          <div className="flex items-center gap-3">
             <span className="text-2xl">{activeWizard.icon}</span>
             <div>
                <h1 className="font-bold text-gray-800 text-lg">{activeWizard.title}</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> 
                  Online Engine
                </p>
             </div>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <MoreHorizontal size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        {/* 核心改动：max-w-3xl 居中容器 */}
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {history.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                msg.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div
                  className={cn(
                    "max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm",
                    msg.sender === 'user'
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  )}
                >
                  {msg.text}
                </div>
              </motion.div>
            </div>
          ))}
          
          {/* Result Card */}
          {isCompleted && finalResult && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="mt-8 bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="text-xs flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
                  >
                    <Copy size={14} /> Copy Prompt
                  </button>
                </div>

                <div className="p-6 overflow-x-auto">
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                    {finalResult}
                  </pre>
                </div>

                <div className="bg-gray-800 p-4 text-center border-t border-gray-700">
                  <button
                    onClick={reset}
                    className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 w-full transition"
                  >
                    <RefreshCw size={14} /> Restart Wizard
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* Input Area (Dynamic) */}
      {!isCompleted && (
        <div className="flex-shrink-0 bg-white border-t p-4 md:p-6 z-20">
          {/* 核心改动：确保输入框容器宽度与上方气泡宽度一致 (max-w-3xl) 并居中 */}
          <div className="max-w-3xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {/* Option Mode (Buttons) */}
              {currentStep.type === 'select' || currentStep.type === 'radio' ? (
                <div className="flex flex-wrap gap-3">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {currentStep.options?.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleOptionSelect(opt.value, opt.label)}
                        className="px-6 py-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 text-gray-700 hover:text-blue-600 rounded-xl text-sm font-medium border border-gray-200 transition-all duration-200 shadow-sm"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                </div>
              ) : (
                /* Text Input Mode */
                <div className="flex items-end gap-3 w-full">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex-1 relative">
                    {currentStep.type === 'textarea' ? (
                      <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={currentStep.placeholder || "Type your answer..."}
                        // 样式优化：更好的圆角，隐藏滚动条，更好的 Focus 状态
                        className="w-full bg-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all resize-none h-24 block shadow-inner"
                        onKeyDown={(e) => {
                          if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={currentStep.placeholder || "Type your answer..."}
                        className="w-full bg-gray-100 rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-inner"
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      />
                    )}
                  </div>
                  
                  {/* 发送按钮：固定在右侧，底部对齐 */}
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className={cn(
                      "flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full transition-all shadow-md active:scale-95",
                      inputValue.trim() 
                        ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg" 
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Send size={20} className={inputValue.trim() ? "ml-0.5" : ""} />
                  </button>
                </motion.div>
              </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};