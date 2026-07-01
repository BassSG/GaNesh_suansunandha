import type { Activity, ChecklistItem, DailyPlanItem, RoutineStep } from "../types";

export const examDate = "2026-07-18T08:00:00+07:00";

export const dailyPlan: DailyPlanItem[] = [
  { activityId: "listen", target: 2, minutes: 4 },
  { activityId: "thai", target: 2, minutes: 5 },
  { activityId: "math", target: 2, minutes: 6 },
  { activityId: "trace", target: 1, minutes: 4 },
  { activityId: "interview", target: 1, minutes: 3 }
];

export const activities: Activity[] = [
  {
    id: "listen",
    order: 1,
    title: "ฟังคำสั่ง",
    shortTitle: "ฟังคำสั่ง",
    color: "#27bd63",
    accent: "#e9f9ee",
    emoji: "👂",
    goal: "ฟังโจทย์ให้จบ แล้วทำตาม 2-3 ขั้นตอน",
    tasks: [
      {
        kind: "sequence",
        id: "listen-red-ball-chair",
        title: "ครูพูดว่า...",
        prompt: "แตะลูกบอลสีแดงก่อน แล้วแตะเก้าอี้",
        parentCue: "ให้เด็กฟังจนจบก่อนแตะ ไม่ต้องรีบ",
        options: [
          { id: "red-ball", label: "ลูกบอลสีแดง", emoji: "🔴" },
          { id: "chair", label: "เก้าอี้", emoji: "🪑" },
          { id: "table", label: "โต๊ะ", emoji: "🟫" },
          { id: "toy-box", label: "กล่องของเล่น", emoji: "🧸" }
        ],
        answerIds: ["red-ball", "chair"],
        success: "เยี่ยมมาก ฟังครบแล้วทำตามลำดับได้"
      },
      {
        kind: "sequence",
        id: "listen-fish-circle-pencil",
        title: "ทำ 3 ขั้นตอน",
        prompt: "แตะปลา แตะวงกลมสีฟ้า แล้วแตะดินสอ",
        parentCue: "เพิ่มเป็น 3 ขั้นตอนเมื่อเด็กเริ่มคล่อง",
        options: [
          { id: "fish", label: "ปลา", emoji: "🐟" },
          { id: "blue-circle", label: "วงกลมสีฟ้า", emoji: "🔵" },
          { id: "pencil", label: "ดินสอ", emoji: "✏️" },
          { id: "house", label: "บ้าน", emoji: "🏠" }
        ],
        answerIds: ["fish", "blue-circle", "pencil"],
        success: "เก่งมาก ทำครบสามอย่างแล้ว"
      },
      {
        kind: "choice",
        id: "listen-left",
        title: "สังเกตตำแหน่ง",
        prompt: "รูปไหนอยู่ทางซ้ายมือ",
        parentCue: "ชี้ซ้ายขวาด้วยมือจริงได้ ถ้าเด็กยังสับสน",
        options: [
          { id: "left", label: "ทางซ้าย", emoji: "🍎" },
          { id: "right", label: "ทางขวา", emoji: "🚗" },
          { id: "top", label: "ข้างบน", emoji: "⭐" },
          { id: "bottom", label: "ข้างล่าง", emoji: "🌈" }
        ],
        answerId: "left",
        success: "ถูกต้อง รู้จักทางซ้ายแล้ว"
      },
      {
        kind: "sequence",
        id: "listen-ear-nose-clap",
        title: "ฟังแล้วทำกับตัวเอง",
        prompt: "แตะหู แตะจมูก แล้วปรบมือ",
        parentCue: "เหมาะสำหรับซ้อมฟัง 3 ขั้นตอนโดยไม่รีบแตะ",
        hint: "ฟังใหม่ช้า ๆ เริ่มจากหูก่อน แล้วค่อยไปจมูก",
        options: [
          { id: "ear", label: "หู", emoji: "👂" },
          { id: "nose", label: "จมูก", emoji: "👃" },
          { id: "clap", label: "ปรบมือ", emoji: "👏" },
          { id: "mouth", label: "ปาก", emoji: "👄" }
        ],
        answerIds: ["ear", "nose", "clap"],
        success: "ฟังครบสามขั้นตอนแล้ว ทำได้ดีมาก"
      },
      {
        kind: "choice",
        id: "listen-top-star",
        title: "ตำแหน่งบนล่าง",
        prompt: "รูปไหนอยู่ข้างบน",
        parentCue: "ให้เด็กมองภาพโจทย์ก่อนตอบ ไม่ต้องอ่านตัวหนังสือ",
        hint: "ดูภาพด้านบนของกรอบก่อน แล้วแตะภาพนั้น",
        visual: {
          title: "ภาพบนคือดาว ภาพล่างคือรถ",
          items: [
            { id: "top-scene", label: "ข้างบน", emoji: "⭐" },
            { id: "bottom-scene", label: "ข้างล่าง", emoji: "🚗" }
          ]
        },
        options: [
          { id: "star", label: "ดาว", emoji: "⭐" },
          { id: "car", label: "รถ", emoji: "🚗" },
          { id: "flower", label: "ดอกไม้", emoji: "🌼" },
          { id: "book", label: "หนังสือ", emoji: "📘" }
        ],
        answerId: "star",
        success: "ใช่แล้ว ดาวอยู่ข้างบน"
      },
      {
        kind: "sequence",
        id: "listen-book-pencil-box",
        title: "เก็บของให้ครบ",
        prompt: "แตะหนังสือ แตะดินสอ แล้วแตะกล่อง",
        parentCue: "ซ้อมลำดับก่อน-หลังแบบที่เจอในห้องสอบ",
        hint: "เริ่มที่หนังสือก่อน แล้วตามด้วยดินสอ",
        options: [
          { id: "book", label: "หนังสือ", emoji: "📘" },
          { id: "pencil", label: "ดินสอ", emoji: "✏️" },
          { id: "box", label: "กล่อง", emoji: "📦" },
          { id: "ball", label: "ลูกบอล", emoji: "🔴" }
        ],
        answerIds: ["book", "pencil", "box"],
        success: "เก็บของตามลำดับครบแล้ว"
      }
    ]
  },
  {
    id: "thai",
    order: 2,
    title: "ภาษาไทย",
    shortTitle: "ภาษาไทย",
    color: "#f15b67",
    accent: "#fff0f2",
    emoji: "ก",
    goal: "ฟังเสียงต้นคำ จับคู่ภาพกับคำง่าย ๆ",
    tasks: [
      {
        kind: "choice",
        id: "thai-maw",
        title: "หาเสียงต้นคำ",
        prompt: "คำไหนขึ้นต้นด้วยเสียง มอ",
        parentCue: "ออกเสียงช้า ๆ เช่น มอ ม้า มะม่วง",
        options: [
          { id: "mango", label: "มะม่วง", emoji: "🥭" },
          { id: "fish", label: "ปลา", emoji: "🐟" },
          { id: "house", label: "บ้าน", emoji: "🏠" },
          { id: "crow", label: "กา", emoji: "🐦" }
        ],
        answerId: "mango",
        success: "ใช่เลย มะม่วงขึ้นต้นด้วยเสียง มอ"
      },
      {
        kind: "choice",
        id: "thai-pla-word",
        title: "จับคู่รูปกับคำ",
        prompt: "แตะคำว่า ปลา",
        parentCue: "ให้เด็กดูรูปปลา แล้วฟังเสียงคำซ้ำ",
        options: [
          { id: "pla", label: "ปลา", emoji: "🐟" },
          { id: "ban", label: "บ้าน", emoji: "🏠" },
          { id: "mae", label: "แม่", emoji: "👩" },
          { id: "nom", label: "นม", emoji: "🥛" }
        ],
        answerId: "pla",
        success: "ถูกต้อง นี่คือคำว่า ปลา"
      },
      {
        kind: "choice",
        id: "thai-ending",
        title: "ฟังเสียงท้าย",
        prompt: "คำว่า บ้าน ลงท้ายด้วยเสียงอะไร",
        parentCue: "ย้ำเสียงท้ายเบา ๆ บ้าน นอ หนู",
        options: [
          { id: "n", label: "น", emoji: "น" },
          { id: "m", label: "ม", emoji: "ม" },
          { id: "k", label: "ก", emoji: "ก" },
          { id: "w", label: "ว", emoji: "ว" }
        ],
        answerId: "n",
        success: "เก่งมาก บ้านลงท้ายด้วยเสียง นอ"
      },
      {
        kind: "choice",
        id: "thai-gaw",
        title: "หาเสียง กอ",
        prompt: "คำไหนขึ้นต้นด้วยเสียง กอ",
        parentCue: "ออกเสียง กอ ไก่ กอ กล้วย ให้เด็กฟังก่อนตอบ",
        hint: "ฟังเสียงแรกของคำ ถ้าเริ่ม กอ ให้แตะภาพนั้น",
        options: [
          { id: "banana", label: "กล้วย", emoji: "🍌" },
          { id: "milk", label: "นม", emoji: "🥛" },
          { id: "fish", label: "ปลา", emoji: "🐟" },
          { id: "house", label: "บ้าน", emoji: "🏠" }
        ],
        answerId: "banana",
        success: "ใช่แล้ว กล้วยขึ้นต้นด้วยเสียง กอ"
      },
      {
        kind: "choice",
        id: "thai-house-word",
        title: "จับภาพกับคำ",
        prompt: "แตะคำว่า บ้าน",
        parentCue: "ให้น้องฟังคำว่า บ้าน แล้วดูภาพประกอบ",
        hint: "บ้านคือรูปหลังคาและประตู",
        options: [
          { id: "house", label: "บ้าน", emoji: "🏠" },
          { id: "fish", label: "ปลา", emoji: "🐟" },
          { id: "mango", label: "มะม่วง", emoji: "🥭" },
          { id: "milk", label: "นม", emoji: "🥛" }
        ],
        answerId: "house",
        success: "ถูกต้อง นี่คือคำว่า บ้าน"
      },
      {
        kind: "choice",
        id: "thai-naw",
        title: "ฟังเสียง นอ",
        prompt: "คำไหนขึ้นต้นด้วยเสียง นอ",
        parentCue: "ออกเสียง นอ นม นอ หนู ช้า ๆ",
        hint: "ลองพูดว่า นอ นม แล้วมองหานม",
        options: [
          { id: "milk", label: "นม", emoji: "🥛" },
          { id: "star", label: "ดาว", emoji: "⭐" },
          { id: "car", label: "รถ", emoji: "🚗" },
          { id: "fish", label: "ปลา", emoji: "🐟" }
        ],
        answerId: "milk",
        success: "ใช่เลย นมขึ้นต้นด้วยเสียง นอ"
      }
    ]
  },
  {
    id: "math",
    order: 3,
    title: "คณิต/เชาวน์",
    shortTitle: "คณิต",
    color: "#199fd3",
    accent: "#ecf8ff",
    emoji: "123",
    goal: "นับจำนวน เปรียบเทียบ จัดคู่ และต่อแบบรูป",
    tasks: [
      {
        kind: "choice",
        id: "math-count-five",
        visual: {
          title: "นับแอปเปิลในกรอบนี้",
          items: [
            { id: "apple-1", label: "ลูกที่ 1", emoji: "🍎" },
            { id: "apple-2", label: "ลูกที่ 2", emoji: "🍎" },
            { id: "apple-3", label: "ลูกที่ 3", emoji: "🍎" },
            { id: "apple-4", label: "ลูกที่ 4", emoji: "🍎" },
            { id: "apple-5", label: "ลูกที่ 5", emoji: "🍎" }
          ]
        },
        title: "นับของจริง",
        prompt: "มีแอปเปิลกี่ลูก",
        parentCue: "ให้เด็กชี้นับทีละลูก ไม่เดาคำตอบ",
        options: [
          { id: "3", label: "3", emoji: "3" },
          { id: "4", label: "4", emoji: "4" },
          { id: "5", label: "5", emoji: "5" },
          { id: "6", label: "6", emoji: "6" }
        ],
        answerId: "5",
        success: "ใช่แล้ว มีห้าลูก"
      },
      {
        kind: "choice",
        id: "math-more",
        visual: {
          title: "ดูของในตะกร้าก่อนตอบ",
          items: [
            { id: "basket-a-scene", label: "ตะกร้า A", emoji: "🧺 🍌 🍌" },
            { id: "basket-b-scene", label: "ตะกร้า B", emoji: "🧺 🍌 🍌 🍌 🍌" }
          ]
        },
        title: "มากหรือน้อย",
        prompt: "ตะกร้าไหนมีของมากกว่า",
        parentCue: "ใช้คำว่า มากกว่า น้อยกว่า สลับกันให้คุ้น",
        options: [
          { id: "basket-a", label: "ตะกร้า A", emoji: "A" },
          { id: "basket-b", label: "ตะกร้า B", emoji: "B" },
          { id: "same", label: "เท่ากัน", emoji: "🟰" },
          { id: "empty", label: "ไม่มีของ", emoji: "⬜" }
        ],
        answerId: "basket-b",
        success: "ถูกต้อง ตะกร้า B มีมากกว่า"
      },
      {
        kind: "choice",
        id: "math-pattern",
        visual: {
          title: "ดูแบบรูป แล้วเลือกภาพถัดไป",
          items: [
            { id: "pattern-1", label: "1", emoji: "🟢" },
            { id: "pattern-2", label: "2", emoji: "🟦" },
            { id: "pattern-3", label: "3", emoji: "🟢" },
            { id: "pattern-4", label: "4", emoji: "🟦" },
            { id: "pattern-next", label: "ต่อไป", emoji: "?" }
          ]
        },
        title: "ต่อแบบรูป",
        prompt: "วงกลม สี่เหลี่ยม วงกลม สี่เหลี่ยม ต่อไปเป็นอะไร",
        parentCue: "ให้เด็กพูดแบบรูปออกเสียงก่อนตอบ",
        options: [
          { id: "circle", label: "วงกลม", emoji: "🟢" },
          { id: "square", label: "สี่เหลี่ยม", emoji: "🟦" },
          { id: "triangle", label: "สามเหลี่ยม", emoji: "🔺" },
          { id: "star", label: "ดาว", emoji: "⭐" }
        ],
        answerId: "circle",
        success: "ดีมาก แบบรูปต่อไปคือวงกลม"
      },
      {
        kind: "choice",
        id: "math-count-three",
        visual: {
          title: "นับปลาในกรอบนี้",
          items: [
            { id: "fish-1", label: "ตัวที่ 1", emoji: "🐟" },
            { id: "fish-2", label: "ตัวที่ 2", emoji: "🐟" },
            { id: "fish-3", label: "ตัวที่ 3", emoji: "🐟" }
          ]
        },
        title: "นับจำนวน 1-5",
        prompt: "มีปลากี่ตัว",
        parentCue: "ให้เด็กชี้นับจากซ้ายไปขวา",
        hint: "ชี้ปลาทีละตัว แล้วนับ หนึ่ง สอง สาม",
        options: [
          { id: "2", label: "2", emoji: "2" },
          { id: "3", label: "3", emoji: "3" },
          { id: "4", label: "4", emoji: "4" },
          { id: "5", label: "5", emoji: "5" }
        ],
        answerId: "3",
        success: "ถูกต้อง มีปลาสามตัว"
      },
      {
        kind: "choice",
        id: "math-different-shape",
        visual: {
          title: "รูปไหนไม่เหมือนเพื่อน",
          items: [
            { id: "same-1", label: "1", emoji: "🔵" },
            { id: "same-2", label: "2", emoji: "🔵" },
            { id: "different", label: "3", emoji: "🔺" },
            { id: "same-3", label: "4", emoji: "🔵" }
          ]
        },
        title: "หาภาพต่าง",
        prompt: "รูปไหนต่างจากเพื่อน",
        parentCue: "ให้เด็กเทียบทีละภาพ สีและรูปทรง",
        hint: "เพื่อนส่วนใหญ่เป็นวงกลมสีฟ้า มองหารูปที่ไม่ใช่วงกลม",
        options: [
          { id: "circle", label: "วงกลม", emoji: "🔵" },
          { id: "triangle", label: "สามเหลี่ยม", emoji: "🔺" },
          { id: "square", label: "สี่เหลี่ยม", emoji: "🟦" },
          { id: "star", label: "ดาว", emoji: "⭐" }
        ],
        answerId: "triangle",
        success: "ใช่แล้ว สามเหลี่ยมต่างจากเพื่อน"
      },
      {
        kind: "choice",
        id: "math-match-shape",
        visual: {
          title: "หารูปทรงเหมือนต้นแบบ",
          items: [
            { id: "target", label: "ต้นแบบ", emoji: "🟨" }
          ]
        },
        title: "จับคู่รูปทรง",
        prompt: "รูปไหนเหมือนต้นแบบ",
        parentCue: "ให้ดูต้นแบบก่อน แล้วหาอันที่รูปร่างเหมือนกัน",
        hint: "ต้นแบบเป็นสี่เหลี่ยมสีเหลือง มองหารูปสี่เหลี่ยม",
        options: [
          { id: "square", label: "สี่เหลี่ยม", emoji: "🟨" },
          { id: "circle", label: "วงกลม", emoji: "🟢" },
          { id: "triangle", label: "สามเหลี่ยม", emoji: "🔺" },
          { id: "heart", label: "หัวใจ", emoji: "❤️" }
        ],
        answerId: "square",
        success: "ถูกต้อง รูปนี้เหมือนต้นแบบ"
      }
    ]
  },
  {
    id: "trace",
    order: 4,
    title: "ลากเส้น",
    shortTitle: "ลากเส้น",
    color: "#ff941f",
    accent: "#fff4e7",
    emoji: "✏️",
    goal: "ฝึกนิ้วมือ จับดินสอ วงกลม ระบายสี และลากตามเส้น",
    tasks: [
      {
        kind: "trace",
        id: "trace-wave",
        title: "ลากคลื่น",
        prompt: "ใช้นิ้วลากตามเส้นคลื่นไปหาปลา",
        parentCue: "ไม่ต้องเป๊ะ ให้ดูการควบคุมนิ้วและความตั้งใจ",
        guide: "wave",
        success: "ลื่นไหลมาก นิ้วมือพร้อมขึ้นแล้ว"
      },
      {
        kind: "trace",
        id: "trace-circle",
        title: "วงกลม",
        prompt: "ลากวงกลมรอบลูกบอลสีแดง",
        parentCue: "ชวนจับข้อมือให้นิ่งและวนจากซ้ายไปขวา",
        guide: "circle",
        success: "สวยมาก วงกลมเริ่มมั่นคงแล้ว"
      },
      {
        kind: "trace",
        id: "trace-zigzag",
        title: "เส้นทางดินสอ",
        prompt: "ลากเส้นตามทางซิกแซกไปหาดาว",
        parentCue: "ฝึกหยุด เลี้ยว และทำต่อจนจบ",
        guide: "zigzag",
        success: "เก่งมาก ทำงานจนจบได้"
      },
      {
        kind: "trace",
        id: "trace-rainbow-wave",
        title: "ทางไปสายรุ้ง",
        prompt: "ลากเส้นคลื่นจากดาวไปหาสายรุ้ง",
        parentCue: "ซ้อมควบคุมนิ้วให้ไหลต่อเนื่อง",
        hint: "ค่อย ๆ ลากตามเส้น ไม่ต้องรีบ",
        guide: "wave",
        startEmoji: "⭐",
        endEmoji: "🌈",
        success: "ลื่นไหลดีมาก นิ้วมือพร้อมขึ้นแล้ว"
      },
      {
        kind: "trace",
        id: "trace-sun-circle",
        title: "วงกลมรอบพระอาทิตย์",
        prompt: "ลากวงกลมรอบพระอาทิตย์",
        parentCue: "ฝึกวนข้อมือให้ต่อเนื่องและไม่กดจอแรง",
        hint: "เริ่มช้า ๆ แล้ววนรอบภาพให้ครบ",
        guide: "circle",
        startEmoji: "☀️",
        endEmoji: "☀️",
        success: "วงกลมสวยมาก ควบคุมนิ้วได้ดี"
      },
      {
        kind: "trace",
        id: "trace-mountain-zigzag",
        title: "ทางภูเขา",
        prompt: "ลากเส้นซิกแซกไปหาธง",
        parentCue: "ดูการหยุด เลี้ยว และไปต่ออย่างตั้งใจ",
        hint: "หยุดที่มุมก่อน แล้วค่อยเลี้ยวไปเส้นต่อไป",
        guide: "zigzag",
        startEmoji: "⛰️",
        endEmoji: "🚩",
        success: "หยุดและเลี้ยวได้ดีมาก"
      }
    ]
  },
  {
    id: "interview",
    order: 5,
    title: "สัมภาษณ์",
    shortTitle: "สัมภาษณ์",
    color: "#8a64cf",
    accent: "#f5efff",
    emoji: "🎤",
    goal: "ตอบชื่อ อายุ ครอบครัว ความชอบ และสถานการณ์ง่าย ๆ",
    tasks: [
      {
        kind: "interview",
        id: "interview-name",
        title: "แนะนำตัว",
        prompt: "หนูชื่ออะไร อายุเท่าไหร่ เรียนที่ไหน",
        parentCue: "มองหน้า พูดพอดีเสียง ตอบชัดทีละประโยค",
        sampleAnswer: "หนูชื่อกาเนส อายุห้าขวบครับ",
        success: "พูดแนะนำตัวได้ดีมาก"
      },
      {
        kind: "interview",
        id: "interview-like",
        title: "ความชอบ",
        prompt: "หนูชอบทำอะไร เพราะอะไร",
        parentCue: "รับคำตอบสั้น ๆ ได้ เน้นเหตุผลง่าย ๆ",
        sampleAnswer: "หนูชอบวาดรูป เพราะสนุกครับ",
        success: "ตอบพร้อมเหตุผลได้แล้ว"
      },
      {
        kind: "interview",
        id: "interview-social",
        title: "สถานการณ์",
        prompt: "ถ้าเพื่อนแย่งของเล่น หนูจะทำอย่างไร",
        parentCue: "มองหาคำตอบที่รู้จักขอความช่วยเหลือ ไม่ใช้ความรุนแรง",
        sampleAnswer: "หนูจะบอกเพื่อนดี ๆ หรือบอกคุณครูครับ",
        success: "เยี่ยมมาก รู้จักพูดและขอความช่วยเหลือ"
      },
      {
        kind: "interview",
        id: "interview-teacher-help",
        title: "ขอความช่วยเหลือ",
        prompt: "ถ้าหนูไม่เข้าใจ หนูจะทำอย่างไร",
        parentCue: "ฝึกให้เด็กกล้าขอให้ครูพูดซ้ำอย่างสุภาพ",
        hint: "ตอบได้ว่า ขอให้คุณครูพูดอีกครั้ง",
        sampleAnswer: "หนูจะยกมือ แล้วบอกคุณครูว่า ขอฟังอีกครั้งครับ",
        success: "ดีมาก กล้าขอความช่วยเหลืออย่างสุภาพ"
      },
      {
        kind: "interview",
        id: "interview-breakfast",
        title: "เรื่องใกล้ตัว",
        prompt: "ตอนเช้าหนูกินอะไรมา",
        parentCue: "ให้ตอบสั้น ชัด และเป็นเรื่องจริง",
        hint: "ตอบชื่ออาหารง่าย ๆ เช่น ข้าว ไข่ นม หรือผลไม้",
        sampleAnswer: "หนูกินข้าวกับไข่ และดื่มนมครับ",
        success: "ตอบเรื่องใกล้ตัวได้ชัดเจนมาก"
      },
      {
        kind: "interview",
        id: "interview-good-manners",
        title: "มารยาท",
        prompt: "ถ้าคุณครูให้ของ หนูควรพูดว่าอะไร",
        parentCue: "ฝึกคำสุภาพ ขอบคุณครับ และยิ้มไหว้ได้",
        hint: "คำตอบคือ ขอบคุณครับ",
        sampleAnswer: "หนูจะพูดว่า ขอบคุณครับ",
        success: "สุภาพมาก พร้อมคุยกับคุณครูแล้ว"
      }
    ]
  }
];

export const routine: RoutineStep[] = [
  { minutes: 5, title: "Warm-up", detail: "คุยเรื่องวันนี้ เพลงสั้น เกมนับนิ้ว หรือหายใจลึก ๆ" },
  { minutes: 8, title: "ภาษาไทย", detail: "บัตรภาพคำง่าย อ่านนิทาน 1 หน้า จับเสียงต้นคำ" },
  { minutes: 8, title: "คณิต/เชาวน์", detail: "นับของจริง จับคู่รูปทรง หาภาพต่าง ต่อแบบรูป" },
  { minutes: 5, title: "คำสั่งและมัดเล็ก", detail: "ลากเส้น วงกลม ระบายสี ตัดแปะ ทำตามคำสั่ง 2-3 ขั้นตอน" },
  { minutes: 4, title: "สัมภาษณ์สั้น", detail: "ถามตอบ 2-3 คำถาม เช่น ชอบอะไร วันนี้สนุกตรงไหน" }
];

export const checklist: ChecklistItem[] = [
  { id: "time", icon: "🕘", label: "ตรวจวัน เวลา สถานที่ และช่องทางเข้าประเมิน" },
  { id: "sleep", icon: "🛌", label: "นอนให้พอ 10-13 ชั่วโมง" },
  { id: "food", icon: "🍽️", label: "กินอาหารเช้าที่คุ้นเคย ไม่หนักเกินไป" },
  { id: "docs", icon: "📄", label: "เตรียมเอกสารสมัครและสำเนาตามที่โรงเรียนกำหนด" },
  { id: "tools", icon: "🎒", label: "เตรียมดินสอ ยางลบ สี หรืออุปกรณ์ที่โรงเรียนแจ้ง" },
  { id: "route", icon: "🚗", label: "ซ้อมเส้นทางและเผื่อเวลาให้เด็กปรับตัว" },
  { id: "positive", icon: "💚", label: "ใช้คำพูดเชิงบวก ไม่ขู่เรื่องสอบตก" },
  { id: "review", icon: "⭐", label: "หลังสอบชมความพยายามก่อนถามคะแนนหรือผลลัพธ์" }
];
