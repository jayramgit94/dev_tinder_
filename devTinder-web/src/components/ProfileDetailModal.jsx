import Modal, { ModalCloseButton } from "./ui/Modal";
import Avatar from "./ui/Avatar";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

export default function ProfileDetailModal({ user, open, onClose, onConnect, onPass, onSuper, onBlock, onReport, compatibility }) {
  if (!user) return null;

  const links = [
    { label: "GitHub", url: user.githubUrl },
    { label: "LinkedIn", url: user.linkedinUrl },
    { label: "Portfolio", url: user.portfolioUrl },
    { label: "Calendly", url: user.calendlyUrl },
  ].filter((l) => l.url);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalCloseButton onClose={onClose} />
      <div className="p-6 pt-8">
        <div className="space-y-4">
          <Avatar src={user.photoUrl} alt={user.firstName} size="xl" />
          <div>
            <p className="text-sm text-text-secondary">{[user.age, user.gender, user.city].filter(Boolean).join(" · ")}</p>
            {(compatibility ?? user.compatibility) > 0 && <Badge className="mt-2">{compatibility ?? user.compatibility}% skill match</Badge>}
          </div>
        </div>
        {user.about && <p className="text-sm leading-relaxed text-text-secondary">{user.about}</p>}
        {user.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">{user.skills.map((s) => <Badge key={s} variant="neutral">{s}</Badge>)}</div>
        )}
        {user.lookingFor?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-text-muted mb-1.5">Looking for</p>
            <div className="flex flex-wrap gap-1.5">{user.lookingFor.map((g) => <Badge key={g}>{g}</Badge>)}</div>
          </div>
        )}
        {links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map((l) => (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                className="text-xs font-medium text-brand-600 hover:underline">{l.label} ↗</a>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          {onPass && <Button variant="secondary" size="sm" onClick={() => { onPass(user); onClose(); }}>Pass</Button>}
          {onConnect && <Button size="sm" onClick={() => { onConnect(user); onClose(); }}>Connect</Button>}
          {onSuper && <Button size="sm" variant="secondary" onClick={() => { onSuper(user); onClose(); }}>⭐ Super</Button>}
          {onBlock && <Button variant="ghost" size="sm" onClick={() => { onBlock(user); onClose(); }}>Block</Button>}
          {onReport && <Button variant="danger" size="sm" onClick={() => { onReport(user); onClose(); }}>Report</Button>}
        </div>
      </div>
    </Modal>
  );
}
