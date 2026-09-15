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
    botBubble: 'bg-[#2c2a2a] border border-[#423e3e] text-zinc-100 rounded-2xl rounded-tl-xs',
    userBubble: 'bg-emerald-600 text-white rounded-2xl rounded-tr-xs font-medium shadow-emerald-600/20',
    inputFooterBg: 'bg-[#1c1a1a] border-[#363333]',
    inputBoxBg: 'bg-[#282626]',
    inputBoxBorder: 'border-[#423e3e] focus-within:border-emerald-500',
    inputTextColor: 'text-white',
    inputPlaceholder: 'placeholder:text-zinc-500',
    sendBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    sendIconColor: 'text-white',
    benefitsBtn: 'border border-[#423e3e] bg-[#2c2a2a] hover:bg-[#383535] text-zinc-100 hover:text-white rounded-xl',
    specsBtn: 'border border-[#423e3e] bg-[#2c2a2a] hover:bg-[#383535] text-zinc-100 hover:text-white rounded-xl',
    buyNowBtn: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-xl shadow-amber-500/10 rounded-xl',
    tagDiscount: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-400',
    photoBorder: 'border-[#363333]',
    photoBg: 'bg-[#1c1a1a]'
  },
  linear_dark: {
    containerBg: 'bg-[#121315]',
    showcaseBg: 'bg-[#121315]',
    headerBg: 'bg-[#161719]/95 backdrop-blur-md',
    headerBorder: 'border-white/[0.08]',
    chatColumnBorder: 'border-white/[0.08]',
    messagesAreaBg: 'bg-[#121315] bg-dot-linear',
    botBubble: 'bg-[#1E1F22]/90 backdrop-blur-md border border-white/[0.08] text-[#F1F5F9] rounded-2xl rounded-tl-xs shadow-sm',
    userBubble: 'bg-emerald-600 text-white rounded-2xl rounded-tr-xs font-medium shadow-emerald-600/20',
    inputFooterBg: 'bg-[#18191B] border-white/[0.08]',
    inputBoxBg: 'bg-[#131416]',
    inputBoxBorder: 'border-white/[0.08] focus-within:border-amber-500/50',
    inputTextColor: 'text-[#F1F5F9]',
    inputPlaceholder: 'placeholder:text-[#64748B]',
    sendBtn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-sm',
    sendIconColor: 'text-zinc-950',
    benefitsBtn: 'border border-white/[0.08] bg-[#18191B] hover:bg-[#202226] text-zinc-300 hover:text-white rounded-xl',
    specsBtn: 'border border-white/[0.08] bg-[#18191B] hover:bg-[#202226] text-zinc-300 hover:text-white rounded-xl',
    buyNowBtn: 'bg-[#226850] hover:bg-[#2a7d61] text-[#E6F4ED] border border-[#2e8b6b]/40 shadow-lg font-bold rounded-xl',
    tagDiscount: 'bg-[#784712]/90 text-[#FDE68A] border border-amber-600/30 font-bold rounded-lg',
    textPrimary: 'text-[#F1F5F9]',
    textSecondary: 'text-[#94A3B8]',
    photoBorder: 'border-white/[0.08]',
    photoBg: 'bg-[#131416]'
  }
};
