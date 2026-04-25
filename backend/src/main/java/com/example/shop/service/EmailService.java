package com.example.shop.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(String toEmail, String fullName, String token) {
        String verifyLink = frontendUrl + "/verify-email?token=" + token;

        String html = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8"/>
              <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f3ef; margin: 0; padding: 0; }
                .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                .header { background: #1a1a1a; padding: 32px 40px; text-align: center; }
                .header h1 { color: #b8955a; font-size: 28px; margin: 0; letter-spacing: 4px; font-weight: 300; }
                .header span { color: #fff; font-size: 11px; letter-spacing: 6px; display: block; margin-top: 4px; opacity: 0.5; }
                .body { padding: 40px; }
                .body h2 { color: #111; font-size: 22px; margin: 0 0 16px; font-weight: 500; }
                .body p { color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 20px; }
                .btn { display: block; width: fit-content; margin: 28px auto; padding: 14px 40px; background: #1a1a1a; color: #fff !important; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; letter-spacing: 1px; }
                .footer { background: #f5f3ef; padding: 20px 40px; text-align: center; font-size: 12px; color: #aaa; }
                .note { font-size: 13px; color: #999; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="wrapper">
                <div class="header">
                  <h1>LUXE</h1>
                  <span>SHOP</span>
                </div>
                <div class="body">
                  <h2>Xin chào, %s! 👋</h2>
                  <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>LuxeShop</strong>. Để hoàn tất quá trình đăng ký, vui lòng xác thực địa chỉ email của bạn bằng cách nhấn vào nút bên dưới.</p>
                  <a href="%s" class="btn">✓ Xác Thực Email</a>
                  <div class="note">
                    <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.<br/>
                    Link xác thực sẽ hết hạn sau <strong>24 giờ</strong>.</p>
                    <p style="word-break:break-all;color:#bbb;font-size:11px;">%s</p>
                  </div>
                </div>
                <div class="footer">© 2025 LuxeShop. Bảo lưu mọi quyền.</div>
              </div>
            </body>
            </html>
            """.formatted(fullName, verifyLink, verifyLink);

        sendHtml(toEmail, "✉️ Xác thực tài khoản LuxeShop", html);
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String fullName) {
        String html = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8"/>
              <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f3ef; margin: 0; padding: 0; }
                .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                .header { background: #1a1a1a; padding: 32px 40px; text-align: center; }
                .header h1 { color: #b8955a; font-size: 28px; margin: 0; letter-spacing: 4px; font-weight: 300; }
                .body { padding: 40px; text-align: center; }
                .icon { font-size: 52px; margin-bottom: 16px; }
                .body h2 { color: #111; font-size: 22px; margin: 0 0 12px; font-weight: 500; }
                .body p { color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 20px; }
                .btn { display: inline-block; padding: 13px 36px; background: #1a1a1a; color: #fff !important; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; margin-top: 8px; }
                .footer { background: #f5f3ef; padding: 20px 40px; text-align: center; font-size: 12px; color: #aaa; }
              </style>
            </head>
            <body>
              <div class="wrapper">
                <div class="header"><h1>LUXE</h1></div>
                <div class="body">
                  <div class="icon">🎉</div>
                  <h2>Chào mừng đến với LuxeShop, %s!</h2>
                  <p>Tài khoản của bạn đã được kích hoạt thành công. Bắt đầu khám phá hàng nghìn sản phẩm cao cấp ngay hôm nay.</p>
                  <a href="%s" class="btn">Mua Sắm Ngay →</a>
                </div>
                <div class="footer">© 2025 LuxeShop. Bảo lưu mọi quyền.</div>
              </div>
            </body>
            </html>
            """.formatted(fullName, frontendUrl);

        sendHtml(toEmail, "🎉 Chào mừng đến LuxeShop!", html);
    }

    @Async
    public void sendGoogleRegisterPasswordEmail(String toEmail, String fullName, String password) {
        String html = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8"/>
              <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f3ef; margin: 0; padding: 0; }
                .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                .header { background: #1a1a1a; padding: 32px 40px; text-align: center; }
                .header h1 { color: #b8955a; font-size: 28px; margin: 0; letter-spacing: 4px; font-weight: 300; }
                .body { padding: 40px; text-align: center; }
                .icon { font-size: 52px; margin-bottom: 16px; }
                .body h2 { color: #111; font-size: 22px; margin: 0 0 12px; font-weight: 500; }
                .body p { color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 20px; }
                .password-box { display: inline-block; background: #f0f0f0; padding: 12px 24px; font-size: 20px; letter-spacing: 2px; border-radius: 6px; font-weight: bold; color: #111; margin-bottom: 20px; }
                .btn { display: inline-block; padding: 13px 36px; background: #1a1a1a; color: #fff !important; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; margin-top: 8px; }
                .footer { background: #f5f3ef; padding: 20px 40px; text-align: center; font-size: 12px; color: #aaa; }
              </style>
            </head>
            <body>
              <div class="wrapper">
                <div class="header"><h1>LUXE</h1></div>
                <div class="body">
                  <div class="icon">🚀</div>
                  <h2>Chào mừng đến với LuxeShop, %s!</h2>
                  <p>Tài khoản của bạn đã được tạo thành công thông qua đăng nhập Google.</p>
                  <p>Dưới đây là mật khẩu mặc định của bạn. Hãy sử dụng nó nếu bạn muốn đăng nhập bằng Email và Mật khẩu. Bạn có thể đổi mật khẩu này sau.</p>
                  <div class="password-box">%s</div>
                  <br>
                  <a href="%s" class="btn">Mua Sắm Ngay →</a>
                </div>
                <div class="footer">© 2025 LuxeShop. Bảo lưu mọi quyền.</div>
              </div>
            </body>
            </html>
            """.formatted(fullName, password, frontendUrl);

        sendHtml(toEmail, "🔑 Mật khẩu tài khoản LuxeShop của bạn", html);
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String fullName, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        String html = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8"/>
              <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f3ef; margin: 0; padding: 0; }
                .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                .header { background: #1a1a1a; padding: 32px 40px; text-align: center; }
                .header h1 { color: #b8955a; font-size: 28px; margin: 0; letter-spacing: 4px; font-weight: 300; }
                .body { padding: 40px; }
                .body h2 { color: #111; font-size: 22px; margin: 0 0 16px; font-weight: 500; }
                .body p { color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 20px; }
                .btn { display: block; width: fit-content; margin: 28px auto; padding: 14px 40px; background: #1a1a1a; color: #fff !important; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; letter-spacing: 1px; }
                .footer { background: #f5f3ef; padding: 20px 40px; text-align: center; font-size: 12px; color: #aaa; }
                .note { font-size: 13px; color: #999; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="wrapper">
                <div class="header"><h1>LUXE</h1></div>
                <div class="body">
                  <h2>Xin chào, %s!</h2>
                  <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>LuxeShop</strong>. Nhấn vào nút dưới đây để thiết lập mật khẩu mới.</p>
                  <a href="%s" class="btn">Đặt Lại Mật Khẩu</a>
                  <div class="note">
                    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, xin vui lòng bỏ qua email này.<br/>
                    Link này sẽ hết hạn sau <strong>15 phút</strong>.</p>
                  </div>
                </div>
                <div class="footer">© 2025 LuxeShop. Bảo lưu mọi quyền.</div>
              </div>
            </body>
            </html>
            """.formatted(fullName, resetLink);

        sendHtml(toEmail, "🔒 Đặt lại mật khẩu LuxeShop", html);
    }

    private void sendHtml(String to, String subject, String htmlContent) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(fromAddress, "LuxeShop");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(msg);
            log.info("Email sent to {}: {}", to, subject);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
