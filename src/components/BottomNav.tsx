import { BookOpen, Home, Star, Trophy, Users } from "lucide-react";

type BottomNavProps = {
  activeView: string;
  onChange: (view: "home" | "mission" | "stars" | "library" | "parent") => void;
};

const items = [
  { id: "home", label: "หน้าหลัก", icon: Home },
  { id: "mission", label: "ภารกิจ", icon: Star },
  { id: "stars", label: "สะสมดาว", icon: Trophy },
  { id: "library", label: "คลังความรู้", icon: BookOpen },
  { id: "parent", label: "ผู้ปกครอง", icon: Users }
] as const;

export function BottomNav({ activeView, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="เมนูหลัก">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            className={activeView === item.id ? "is-current" : ""}
            onClick={() => onChange(item.id)}
          >
            <Icon size={28} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
