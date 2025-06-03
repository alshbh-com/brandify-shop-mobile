
export interface Theme {
  id: number;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  gradients: {
    header: string;
    card: string;
    button: string;
  };
  preview: string;
}

export const themes: Theme[] = [
  {
    id: 1,
    name: "البنفسجي الكلاسيكي",
    colors: {
      primary: "#8B5CF6",
      secondary: "#A78BFA",
      accent: "#F3E8FF",
      background: "#F9FAFB",
      surface: "#FFFFFF",
      text: "#1F2937",
      textSecondary: "#6B7280"
    },
    gradients: {
      header: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
      card: "linear-gradient(135deg, #F3E8FF 0%, #E0E7FF 100%)",
      button: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
    },
    preview: "من البنفسجي إلى الأزرق"
  },
  {
    id: 2,
    name: "الأخضر الطبيعي",
    colors: {
      primary: "#10B981",
      secondary: "#34D399",
      accent: "#D1FAE5",
      background: "#F0FDF4",
      surface: "#FFFFFF",
      text: "#065F46",
      textSecondary: "#047857"
    },
    gradients: {
      header: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      card: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
      button: "linear-gradient(135deg, #10B981 0%, #059669 100%)"
    },
    preview: "تصميم طبيعي أخضر"
  },
  {
    id: 3,
    name: "الوردي الأنيق",
    colors: {
      primary: "#EC4899",
      secondary: "#F472B6",
      accent: "#FCE7F3",
      background: "#FDF2F8",
      surface: "#FFFFFF",
      text: "#831843",
      textSecondary: "#BE185D"
    },
    gradients: {
      header: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
      card: "linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)",
      button: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)"
    },
    preview: "تصميم وردي راقي"
  },
  {
    id: 4,
    name: "الذهبي الفاخر",
    colors: {
      primary: "#F59E0B",
      secondary: "#FBBF24",
      accent: "#FEF3C7",
      background: "#FFFBEB",
      surface: "#FFFFFF",
      text: "#92400E",
      textSecondary: "#D97706"
    },
    gradients: {
      header: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      card: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
      button: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
    },
    preview: "تصميم ذهبي فاخر"
  },
  {
    id: 5,
    name: "الأزرق المحيطي",
    colors: {
      primary: "#0EA5E9",
      secondary: "#38BDF8",
      accent: "#E0F2FE",
      background: "#F0F9FF",
      surface: "#FFFFFF",
      text: "#0C4A6E",
      textSecondary: "#0369A1"
    },
    gradients: {
      header: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
      card: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
      button: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)"
    },
    preview: "تصميم أزرق هادئ"
  },
  {
    id: 6,
    name: "الأحمر الجريء",
    colors: {
      primary: "#EF4444",
      secondary: "#F87171",
      accent: "#FEE2E2",
      background: "#FEF2F2",
      surface: "#FFFFFF",
      text: "#7F1D1D",
      textSecondary: "#DC2626"
    },
    gradients: {
      header: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
      card: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
      button: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
    },
    preview: "تصميم أحمر قوي"
  },
  {
    id: 7,
    name: "البرتقالي النابض",
    colors: {
      primary: "#F97316",
      secondary: "#FB923C",
      accent: "#FED7AA",
      background: "#FFF7ED",
      surface: "#FFFFFF",
      text: "#9A3412",
      textSecondary: "#EA580C"
    },
    gradients: {
      header: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
      card: "linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)",
      button: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)"
    },
    preview: "تصميم برتقالي حيوي"
  },
  {
    id: 8,
    name: "البني الدافئ",
    colors: {
      primary: "#92400E",
      secondary: "#B45309",
      accent: "#FED7AA",
      background: "#FFFBEB",
      surface: "#FFFFFF",
      text: "#451A03",
      textSecondary: "#78350F"
    },
    gradients: {
      header: "linear-gradient(135deg, #92400E 0%, #78350F 100%)",
      card: "linear-gradient(135deg, #FED7AA 0%, #FDE68A 100%)",
      button: "linear-gradient(135deg, #92400E 0%, #78350F 100%)"
    },
    preview: "تصميم بني كلاسيكي"
  },
  {
    id: 9,
    name: "الرمادي العصري",
    colors: {
      primary: "#6B7280",
      secondary: "#9CA3AF",
      accent: "#F3F4F6",
      background: "#F9FAFB",
      surface: "#FFFFFF",
      text: "#1F2937",
      textSecondary: "#4B5563"
    },
    gradients: {
      header: "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)",
      card: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
      button: "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)"
    },
    preview: "تصميم رمادي أنيق"
  },
  {
    id: 10,
    name: "الداكن الليلي",
    colors: {
      primary: "#6366F1",
      secondary: "#8B5CF6",
      accent: "#1F2937",
      background: "#111827",
      surface: "#1F2937",
      text: "#F9FAFB",
      textSecondary: "#D1D5DB"
    },
    gradients: {
      header: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
      card: "linear-gradient(135deg, #374151 0%, #1F2937 100%)",
      button: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)"
    },
    preview: "تصميم ليلي داكن"
  }
];

export const getThemeById = (id: number): Theme => {
  return themes.find(theme => theme.id === id) || themes[0];
};
