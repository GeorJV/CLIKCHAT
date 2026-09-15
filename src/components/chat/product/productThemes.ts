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
    botBubble: 'bg-[#2c2a2a] border border-[#423e3e] text-zinc-100 rounded-2xl shadow-lg shadow-black/60',
    userBubble: 'bg-[#2c2a2a]/30 backdrop-blur-[1px] border border-white/[0.16] text-[#D7BA7D] rounded-2xl font-medium shadow-md',
    inputFooterBg: 'bg-[#1c1a1a] border-[#363333]',
    inputBoxBg: 'bg-[#282626]',
    inputBoxBorder: 'border-[#423e3e] focus-within:border-emerald-500',
    inputTextColor: 'text-white',
    inputPlaceholder: 'placeholder:text-zinc-500',
    sendBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    sendIconColor: 'text-white',
    benefitsBtn: 'border border-[#3e3b3b] bg-[#282626] text-zinc-200 hover:bg-gradient-to-r hover:from-[#FFB800] hover:to-[#FFA000] hover:text-zinc-950 hover:border-[#FFA000] rounded-xl shadow-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200',
    specsBtn: 'border border-[#3e3b3b] bg-[#282626] text-zinc-200 hover:bg-gradient-to-r hover:from-[#FFB800] hover:to-[#FFA000] hover:text-zinc-950 hover:border-[#FFA000] rounded-xl shadow-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200',
    buyNowBtn: 'cuadro-amarillo-tornasol cursor-pointer',
    buyNowIconColor: 'text-[#FFD700]',
    buyNowTextColor: 'text-[#FFD700]',
    tagDiscount: 'bg-gradient-to-r from-[#FFB800] to-[#FFA000] text-zinc-950 font-black border border-[#FFA000]/40 rounded-lg shadow-md',
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
    botBubble: 'bg-[#2A2E31]/95 backdrop-blur-md border border-white/[0.12] text-[#F1F5F9] rounded-2xl shadow-lg shadow-black/60',
    userBubble: 'bg-[#2A2E31]/30 backdrop-blur-[1px] border border-white/[0.16] text-[#D7BA7D] rounded-2xl font-medium shadow-md',
    inputFooterBg: 'bg-[#181A1D] border-t border-white/[0.08]',
    inputBoxBg: 'bg-[#131517]',
    inputBoxBorder: 'border-white/[0.08] focus-within:border-[#D79F4C]/60',
    inputTextColor: 'text-[#F1F5F9]',
    inputPlaceholder: 'placeholder:text-[#64748B]',
    sendBtn: 'bg-[#D79F4C] hover:bg-[#E5A83B] text-[#2A1E14] font-bold shadow-sm',
    sendIconColor: 'text-[#2A1E14]',
    benefitsBtn: 'border border-white/[0.1] bg-[#181B1D] text-zinc-200 hover:bg-gradient-to-r hover:from-[#FFB800] hover:to-[#FFA000] hover:text-zinc-950 hover:border-[#FFA000] rounded-xl shadow-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200',
    specsBtn: 'border border-white/[0.1] bg-[#181B1D] text-zinc-200 hover:bg-gradient-to-r hover:from-[#FFB800] hover:to-[#FFA000] hover:text-zinc-950 hover:border-[#FFA000] rounded-xl shadow-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200',
    buyNowBtn: 'cuadro-amarillo-tornasol cursor-pointer',
    buyNowIconColor: 'text-[#FFD700]',
    buyNowTextColor: 'text-[#FFD700]',
    tagDiscount: 'bg-gradient-to-r from-[#FFB800] to-[#FFA000] text-zinc-950 font-black border border-[#FFA000]/40 rounded-lg shadow-md',
    textPrimary: 'text-[#F1F5F9]',
    textSecondary: 'text-[#94A3B8]',
    photoBorder: 'border-white/[0.08]',
    photoBg: 'bg-[#16191B]'
  }
};
