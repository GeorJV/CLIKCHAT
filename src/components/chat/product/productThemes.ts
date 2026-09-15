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
  buyNowIconColor?: string;
  buyNowTextColor?: string;
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
    botBubble: 'bg-[#2c2a2a] border border-[#423e3e] text-zinc-100 rounded-2xl rounded-tl-xs',
    userBubble: 'bg-emerald-600 text-white rounded-2xl rounded-tr-xs font-medium shadow-emerald-600/20',
    inputFooterBg: 'bg-[#1c1a1a] border-[#363333]',
    inputBoxBg: 'bg-[#282626]',
    inputBoxBorder: 'border-[#423e3e] focus-within:border-emerald-500',
    inputTextColor: 'text-white',
    inputPlaceholder: 'placeholder:text-zinc-500',
    sendBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    sendIconColor: 'text-white',
    benefitsBtn: 'border border-[#423e3e] bg-[#2c2a2a] hover:bg-[#FFD043]/15 hover:border-[#FFD043]/80 text-zinc-100 hover:text-[#FFD043] rounded-xl hover:shadow-[0_0_14px_rgba(255,208,67,0.25)] transition-all duration-200',
    specsBtn: 'border border-[#423e3e] bg-[#2c2a2a] hover:bg-[#FFD043]/15 hover:border-[#FFD043]/80 text-zinc-100 hover:text-[#FFD043] rounded-xl hover:shadow-[0_0_14px_rgba(255,208,67,0.25)] transition-all duration-200',
    buyNowBtn: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-xl shadow-amber-500/10 rounded-xl',
    buyNowIconColor: 'text-amber-400',
    buyNowTextColor: 'text-amber-400',
    tagDiscount: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-400',
    photoBorder: 'border-[#363333]',
    photoBg: 'bg-[#1c1a1a]'
  },
  linear_dark: {
    containerBg: 'bg-[#1E2224]',
    showcaseBg: 'bg-[#1E2224]',
    headerBg: 'bg-[#181B1D]',
    headerBorder: 'border-white/[0.08]',
    chatColumnBorder: 'border-white/[0.08]',
    messagesAreaBg: 'bg-[#1E2224] bg-dot-linear',
    botBubble: 'bg-[#2A2E31]/90 backdrop-blur-md border border-white/[0.08] text-[#F1F5F9] rounded-2xl rounded-tl-xs shadow-sm',
    userBubble: 'bg-emerald-600 text-white rounded-2xl rounded-tr-xs font-medium shadow-emerald-600/20',
    inputFooterBg: 'bg-[#181A1D] border-t border-white/[0.08]',
    inputBoxBg: 'bg-[#131517]',
    inputBoxBorder: 'border-white/[0.08] focus-within:border-[#D79F4C]/60',
    inputTextColor: 'text-[#F1F5F9]',
    inputPlaceholder: 'placeholder:text-[#64748B]',
    sendBtn: 'bg-[#D79F4C] hover:bg-[#E5A83B] text-[#2A1E14] font-bold shadow-sm',
    sendIconColor: 'text-[#2A1E14]',
    benefitsBtn: 'border border-white/[0.08] bg-[#181B1D] hover:bg-[#FFD043]/15 hover:border-[#FFD043]/80 text-zinc-300 hover:text-[#FFD043] rounded-xl hover:shadow-[0_0_14px_rgba(255,208,67,0.25)] transition-all duration-200',
    specsBtn: 'border border-white/[0.08] bg-[#181B1D] hover:bg-[#FFD043]/15 hover:border-[#FFD043]/80 text-zinc-300 hover:text-[#FFD043] rounded-xl hover:shadow-[0_0_14px_rgba(255,208,67,0.25)] transition-all duration-200',
    buyNowBtn: 'bg-gradient-to-r from-[#1D5647] via-[#2A6854] to-[#38785E] hover:brightness-110 border border-[#94A37E] shadow-lg font-bold rounded-xl',
    buyNowIconColor: 'text-[#D4AF37]',
    buyNowTextColor: 'text-[#D4AF37]',
    tagDiscount: 'bg-[#7A571F]/90 text-[#FDE68A] border border-[#A16D28]/40 font-bold rounded-lg',
    textPrimary: 'text-[#F1F5F9]',
    textSecondary: 'text-[#94A3B8]',
    photoBorder: 'border-white/[0.08]',
    photoBg: 'bg-[#16191B]'
  }
};
