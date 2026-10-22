# บ้านรวมทะเล — Collaboration handoff

รวบรวมสำเนางานเดิมสำหรับร่วมพัฒนา ณ 22 ตุลาคม 2026 โดยไม่แก้ต้นฉบับ

| ส่วน | ตำแหน่ง | สถานะ |
|---|---|---|
| n8n workflow | `workflows/bot-v45.json` | 49 nodes, ปิด active, ต้องตั้ง credentials ใหม่ |
| ตัวอย่าง nodes แยก | `workflows/updated-nodes/` | เก็บเพื่ออ้างอิง ไม่ใช่ workflow หลัก |
| เว็บนำเสนอ | `showcase/` | React/Vite, build ผ่าน, ข้อมูลจำลอง |
| บอตทางเลือก | `bot/` | Express/TypeScript, build ยังไม่ผ่าน 2 จุด |

เริ่มที่ [HANDOFF.md](HANDOFF.md) สำหรับการติดตั้ง ขอบเขตงาน ข้อมูลที่ต้องขอจากเจ้าของ และผลตรวจ

```powershell
cd showcase
npm ci
npm run dev
```

ห้าม commit token หรือไฟล์ `.env` ลง repo ใช้ credentials ของ n8n หรือ secret ของระบบ deploy
