import { User } from "@prisma/client";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
export function generateHtml(otpCode: number): string {
  return `
      <div style="max-width: 500px; margin: auto; padding: 25px; border-radius: 8px; background-color: #ffffff; font-family: Arial, sans-serif; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); border: 1px solid #eee;">
        <div style="text-align: center;">
          <img src="https://i.imgur.com/QkG8OVG.png" alt="Botify Logo" style="width: 80px; margin-bottom: 10px;" />
          <h2 style="color: #2c3e50;">Botify</h2>
        </div>
        <p style="font-size: 16px; color: #333;">Salom!</p>
        <p style="font-size: 15px; color: #555;">
          Hisobingizni tasdiqlash uchun quyidagi <strong>6 xonali kod</strong>ni kiriting. Kod 5 daqiqa ichida amal qiladi:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #1e90ff;">${otpCode}</span>
        </div>
        <p style="font-size: 14px; color: #888;">Agar bu siz bolmasangiz, iltimos bu xabarni e’tiborsiz qoldiring.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 13px; color: #aaa; text-align: center;">
          © ${new Date().getFullYear()} Botify. Barcha huquqlar himoyalangan.
        </p>
      </div>
    `;
}


