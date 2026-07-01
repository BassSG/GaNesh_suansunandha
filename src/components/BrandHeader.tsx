import { Settings, Star, Volume2 } from "lucide-react";

type BrandHeaderProps = {
  daysLeft: number;
  stars: number;
  completedToday: number;
  logoSrc: string;
  onSpeakIntro: () => void;
};

export function BrandHeader({ daysLeft, stars, completedToday, logoSrc, onSpeakIntro }: BrandHeaderProps) {
  const dayText = daysLeft > 0 ? `เหลือ ${daysLeft} วัน` : daysLeft === 0 ? "วันนี้สอบ" : "ผ่านวันสอบแล้ว";

  return (
    <header className="brand-header">
      <div className="brand-lockup">
        <img src={logoSrc} alt="โลโก้กาเนส" className="app-logo" />
        <div>
          <p className="brand-name">กาเนส</p>
          <h1>พร้อมสอบ ป.1</h1>
        </div>
      </div>

      <button className="listen-chip" type="button" onClick={onSpeakIntro} aria-label="ฟังคำชวนเริ่มฝึก">
        <Volume2 size={24} />
        <span>ฟังเริ่มฝึก</span>
      </button>

      <div className="top-stats" aria-label="ความคืบหน้าวันนี้">
        <div className="countdown-pill">
          <span>18 ก.ค. 2569</span>
          <strong>{dayText}</strong>
        </div>
        <div className="star-meter">
          <Star size={24} fill="#ffd45a" />
          <div>
            <span>ดาววันนี้</span>
            <strong>{stars}/20</strong>
          </div>
          <div className="meter-track" aria-hidden="true">
            <span style={{ width: `${Math.min(100, (stars / 20) * 100)}%` }} />
          </div>
        </div>
        <div className="profile-bubble" aria-label={`ทำแล้ว ${completedToday} ข้อ`}>
          <span>😊</span>
          <strong>{completedToday}</strong>
        </div>
        <button className="icon-button" type="button" aria-label="ตั้งค่าเสียง">
          <Settings size={24} />
        </button>
      </div>
    </header>
  );
}
