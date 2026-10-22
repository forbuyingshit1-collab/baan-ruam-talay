# Handoff: บ้านรวมทะเล

วันที่เตรียม: 22 ตุลาคม 2026 (Asia/Bangkok)

## งานนี้คืออะไร
บอตช่วยขายอาหารทะเลแห้งผ่าน Facebook Messenger มี catalog, ราคาสินค้า, QR ชำระเงิน, ข้อมูลจัดส่ง และคำตอบจาก AI มีสองแนวทางแยกกัน: n8n workflow และบอต Express/TypeScript อย่ารันสองตัวกับ Page เดียวกันจนกว่าจะตกลงตัวหลัก เพราะอาจตอบซ้ำ เว็บ showcase เป็นเดโม ไม่ใช่หน้าจัดการบอตจริง

## สถานะที่ยืนยันได้
- ต้นทาง workflow: `C:/Users/anant/Downloads/Web ส่วนตัว/app/บ้านรวมทะเล/Bot v45.json`
- ไฟล์ v45 และ v44 ในเครื่องเหมือนกันทุก byte; ชื่อ workflow ภายในยังเป็น `Bot v44` จึงยังยืนยันไม่ได้ว่ามีการพัฒนาต่างกันระหว่างสองเวอร์ชัน
- ต้นทาง workflow แก้ไขล่าสุดตาม filesystem 22 มีนาคม 2026; ไม่ใช่หลักฐานเวอร์ชันที่รันจริง
- สำเนาใน repo ปิด active, เอา credential references, pinned execution data และ instance metadata ออก และแทน token ที่ตรวจพบด้วย placeholder
- ไม่ได้เชื่อมต่อ n8n จริง ไม่ได้ตรวจ deployment จริง และไม่ได้ส่งข้อความทดสอบหาลูกค้า
- ซอร์ส TypeScript มาจาก `C:/Users/anant/Downloads/n8n/baan-ruam-talay-bot`
- เว็บเดโมและภาพประกอบมาจากโฟลเดอร์เดียวกับ workflow

## เริ่มทำงานร่วมกัน
1. Clone repo จาก URL ที่แนบในแชต แล้วสร้าง branch เช่น `feature/catalog-update`
2. Commit เฉพาะงานของตัวเอง เปิด Pull Request อธิบายผลที่เปลี่ยนและวิธีทดสอบ
3. กำหนดคนดูแล workflow และคนดูแลข้อมูลสินค้า หลีกเลี่ยงแก้ workflow JSON พร้อมกัน
4. Export workflow โดยไม่แนบข้อมูลการรัน ตรวจ diff และลบ secrets ทุกครั้งก่อน commit
5. ให้เจ้าของ repo เพิ่มผู้ร่วมงานผ่าน GitHub Settings > Collaborators; repo ตั้งเป็น Private

## n8n: แนวทางหลักสำหรับตรวจต่อ
1. Import `workflows/bot-v45.json` เข้า workspace ทดสอบ แล้วตั้งชื่อให้ชัดเจน
2. ตั้ง credentials ใหม่ให้ Google Sheets และ Google Gemini nodes; HTTP Request ที่ส่ง Meta ต้องเปลี่ยน placeholder `REPLACE_FACEBOOK_PAGE_ACCESS_TOKEN` เป็นการอ้าง credential ที่จัดการโดย n8n
3. ตั้ง `REPLACE_WEBHOOK_VERIFY_TOKEN` ใน node Verify Webhook Token1 และตั้งค่าเดียวกันใน Meta
4. ตรวจ Webhook node path `n8n-webhook`, วิธีรับ GET/POST และ verification response ให้ตรงกับ URL ของ instance จริง
5. ตรวจ Google Sheet IDs, ชื่อแท็บ, catalog, ราคาปลีก/ส่ง, รูปสินค้า, map, QR และกติกาค่าจัดส่งกับเจ้าของร้านก่อนทดสอบ
6. ทดสอบด้วย Page/ผู้ใช้ทดสอบ: ทักทาย, ดูสินค้าทั้งหมด, ถามราคา, ขอรูป, ขอ QR, จัดส่ง และคำถามทั่วไป ตรวจว่าไม่ตอบ echo/delivery/read ซ้ำ
7. เมื่อเจ้าของตรวจรับแล้วค่อยเปิด active และสลับ webhook จริง เก็บ export เวอร์ชันก่อนหน้าไว้สำหรับ rollback

Credentials ที่ต้องขอผ่านช่องทางส่วนตัว: Meta Page access token/สิทธิ์แอปและ Page, webhook verify token ใหม่, Google Sheets access และ Gemini credentials; ไม่ส่งผ่าน PR หรือ commit

## เว็บ showcase
```powershell
cd showcase
npm ci
npm run dev
npm run build
```
- Build ผ่านเมื่อจัด handoff นี้
- UI ใช้ข้อมูลจำลองและไม่เชื่อมบอตจริง

## บอต TypeScript ทางเลือก
```powershell
cd bot
npm ci
Copy-Item .env.example .env
# กรอกค่าจริงเฉพาะใน .env
npm run dev
```
อ่าน `bot/src/config/index.ts` เป็นแหล่งอ้างอิง env; ต้องมี Facebook token, verify token, Sheet ID, map URL และ QR URL และตั้ง Google service account/AI ตามที่ใช้จริง

Endpoints: `GET /health`, `GET /webhook` สำหรับ verify, `POST /webhook` สำหรับ Messenger

ผล `npm run build` ณ วัน handoff: ไม่ผ่าน 2 จุดเดิม
- `bot/src/services/google-sheets.service.ts:78`: ส่ง `string | undefined` ให้ parameter ที่ต้องเป็น `string`
- `bot/src/utils/logger.ts:7`: annotation ของ formatter บังคับ `timestamp` แต่ Winston TransformableInfo ไม่รับประกัน field นี้

งานแรกของผู้รับช่วง: แก้สองจุดนี้และ build ใหม่ก่อนพิจารณา deploy ตัว TypeScript ไม่มีผลทดสอบการเชื่อม Meta/Google/AI ในรอบนี้ และยังไม่มีชุด automated tests ที่ยืนยัน end-to-end

ข้อจำกัดที่เห็นจากโค้ด: webhook POST ยังไม่มีการตรวจ Meta request signature และยังไม่มีการ deduplicate event แบบถาวร ควรตรวจและเติมก่อนเลือกใช้เป็น production

## ข้อมูลบน Google Drive
- บ้านรวมทะเล(Dev): https://docs.google.com/spreadsheets/d/1TvMjoDcneHTFTstQMOkMiabV4mgIn_mAbDU9Juyl7AA/edit
- Bot Config: https://docs.google.com/spreadsheets/d/1UihB5vCTwEuwxmcW0rTwFxFeaUCNUfk20eZq84MtK5c/edit

ไม่ได้คัดลอกข้อมูลลูกค้าหรือเนื้อหา Sheets ลง repo; สิทธิ์ Drive ต้องให้เจ้าของอนุญาตแยกต่างหาก และยังต้องยืนยันว่าไฟล์ใดใช้กับระบบจริง

## การตรวจและงานค้าง
- ตรวจ JSON ทุกไฟล์ใน workflows: parse ผ่าน
- ตรวจ placeholder แทน token ที่พบ; ไม่ commit `.env`, node_modules, dist หรือ `.claude`
- Showcase production build: ผ่าน
- TypeScript build: ไม่ผ่านตามรายละเอียดด้านบน
- ยังไม่ทดสอบ import ใน n8n หรือการส่งข้อความจริง
- ต้นฉบับมี token ฝังไว้ เจ้าของควรเปลี่ยน token นั้นก่อนใช้ credential ใหม่ร่วมทีม
