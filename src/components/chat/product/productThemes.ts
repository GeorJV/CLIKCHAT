export type ProductChatTheme = 'classic' | 'linear_dark';

export interface ThemeStyles {
  containerBg: string;
  showcaseBg: string;
  headerBg: string;
  headerBorder: string;
  chatColumnBorder: string;
  messagesAreaBg: string;
  botBubble: string;
  userBubble: string;
  inputFooterBg: string;
  inputBoxBg: string;
  inputBoxBorder: string;
  inputTextColor: string;
  inputPlaceholder: string;
  sendBtn: string;
  sendIconColor: string;
  benefitsBtn: string;
  specsBtn: string;
  buyNowBtn: string;
  tagDiscount: string;
  textPrimary: string;
  textSecondary: string;
  photoBorder: string;
  photoBg: string;
}

export const PRODUCT_THEMES: Record<ProductChatTheme, ThemeStyles> = {
  classic: {
    containerBg: 'bg-[#222020]',
    showcaseBg: 'bg-[#222020]',
    headerBg: 'bg-[#1c1a1a]',
    headerBorder: 'border-[#363333]',
    chatColumnBorder: 'border-[#363333]',
    messagesAreaBg: 'bg-[#222020]',
    botBubble: 'bg-[#2c2a2a] border border-[#423e3e] text-zinc-100 rounded-tl-xs',
    userBubble: 'bg-emerald-600 text-white rounded-tr-xs font-medium shadow-emerald-600/20',
    inputFooterBg: 'bg-[#1c1a1a] border-[#363333]',
    inputBoxBg: 'bg-[#282626]',
    inputBoxBorder: 'border-[#423e3e]',
    inputTextColor: 'text-white',
    inputPlaceholder: 'placeholder:text-zinc-500',
    sendBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    sendIconColor: 'text-white',
    benefitsBtn: 'border border-[#423e3e] bg-[#2c2a2a] hover:bg-[#383535] text-zinc-100 hover:text-white',
    specsBtn: 'border border-[#423e3e] bg-[#2c2a2a] hover:bg-[#383535] text-zinc-100 hover:text-white',
    buyNowBtn: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-xl shadow-amber-500/10',
    tagDiscount: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-400',
    photoBorder: 'border-[#363333]',
    photoBg: 'bg-[#1c1a1a]'
  },
  linear_dark: {
    containerBg: 'bg-[#1A1D1F] bg-dot-linear',
    showcaseBg: 'bg-[#1A1D1F] bg-dot-linear',
    headerBg: 'bg-[#1A1D1F]/90 backdrop-blur-md',
    headerBorder: 'border-white/[0.08]',
    chatColumnBorder: 'border-white/[0.08]',
    messagesAreaBg: 'bg-[#1A1D1F] bg-dot-linear',
    botBubble: 'bg-[#222020]/90 backdrop-blur-md border border-white/[0.08] text-[#F3F4F6] rounded-xl rounded-tl-xs shadow-sm',
    userBubble: 'bg-gradient-to-r from-[#84CC16] to-[#10B981] text-[#111111] font-semibold rounded-xl rounded-tr-xs shadow-sm shadow-lime-500/20',
    inputFooterBg: 'bg-[#222020] border-white/[0.08]',
    inputBoxBg: 'bg-[#181717]',
    inputBoxBorder: 'border-white/[0.08] focus-within:border-emerald-500',
    inputTextColor: 'text-[#F3F4F6]',
    inputPlaceholder: 'placeholder:text-[#9CA3AF]',
    sendBtn: 'bg-gradient-to-r from-[#84CC16] to-[#10B981] hover:brightness-105 text-[#111111] font-bold shadow-sm',
    sendIconColor: 'text-[#111111]',
    benefitsBtn: 'bg-transparent hover:bg-white/[0.05] border border-white/[0.08] text-[#F3F4F6]',
    specsBtn: 'bg-transparent hover:bg-white/[0.05] border border-white/[0.08] text-[#F3F4F6]',
    buyNowBtn: 'bg-gradient-to-r from-[#84CC16] to-[#10B981] hover:brightness-105 text-[#111111] border-t border-white/25 shadow-lg shadow-emerald-500/20 font-black',
    tagDiscount: 'bg-[#F59E0B] text-[#111111] font-black',
    textPrimary: 'text-[#F3F4F6]',
    textSecondary: 'text-[#9CA3AF]',
    photoBorder: 'border-white/[0.08]',
    photoBg: 'bg-[#161616]'
  }
};
