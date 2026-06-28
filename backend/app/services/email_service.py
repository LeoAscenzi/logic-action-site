import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_email(to: str, subject: str, html: str) -> None:
    if not settings.EMAIL_USERNAME:
        return  # email not configured — silently skip in dev
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_FROM or settings.EMAIL_USERNAME
    msg["To"] = to
    msg.attach(MIMEText(html, "html"))
    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.EMAIL_HOST,
            port=settings.EMAIL_PORT,
            username=settings.EMAIL_USERNAME,
            password=settings.EMAIL_PASSWORD,
            start_tls=True,
        )
    except Exception:
        logger.exception("Failed to send email to %s", to)


def _base(content: str) -> str:
    return f"""
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#14182a">
      <img src="{settings.SITE_URL}/logo-dark-text-right.png"
           alt="Ivy Bridge" style="height:40px;margin-bottom:24px">
      {content}
      <p style="margin-top:32px;font-size:12px;color:#5b6072">
        Ivy Bridge &mdash; <a href="{settings.SITE_URL}" style="color:#c9a84c">{settings.SITE_URL}</a>
      </p>
    </div>"""


async def send_rsvp_confirmation(to_email: str, attendee_name: str, event_title: str, event_date: str) -> None:
    html = _base(f"""
    <h2 style="color:#0d1120;margin-bottom:8px">You&rsquo;re registered!</h2>
    <p>Hi {attendee_name},</p>
    <p>You&rsquo;re on the list for <strong>{event_title}</strong> on <strong>{event_date}</strong>.</p>
    <p>We&rsquo;ll follow up with details closer to the date. If you have any questions, just reply to this email.</p>
    <p>See you there!</p>""")
    await send_email(to_email, f"You're registered: {event_title}", html)


async def send_rsvp_admin_notification(event_title: str, attendee_name: str, attendee_email: str) -> None:
    if not settings.EMAIL_FROM:
        return
    html = _base(f"""
    <h2 style="color:#0d1120;margin-bottom:8px">New RSVP</h2>
    <p><strong>{attendee_name}</strong> (<a href="mailto:{attendee_email}">{attendee_email}</a>)
       has registered for <strong>{event_title}</strong>.</p>""")
    await send_email(settings.EMAIL_FROM, f"New RSVP: {event_title}", html)


async def send_invite(to_email: str, role: str, invite_token: str, expires_days: int) -> None:
    link = f"{settings.SITE_URL}/sign-up?invite={invite_token}"
    html = _base(f"""
    <h2 style="color:#0d1120;margin-bottom:8px">You&rsquo;re invited to Ivy Bridge</h2>
    <p>You&rsquo;ve been invited to create an account as a <strong>{role}</strong>.</p>
    <p style="margin:24px 0">
      <a href="{link}"
         style="background:#0d1120;color:#f5f0e8;padding:12px 24px;border-radius:8px;
                text-decoration:none;font-weight:600;font-size:14px">
        Create your account
      </a>
    </p>
    <p style="font-size:13px;color:#5b6072">
      This link expires in {expires_days} day{"s" if expires_days != 1 else ""}.
      If you weren&rsquo;t expecting this, you can safely ignore it.
    </p>""")
    await send_email(to_email, "You're invited to Ivy Bridge", html)
