import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Modal, { ModalCloseButton } from "./ui/Modal";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";

export default function MatchModal({ isOpen, matchUser, onClose }) {
  if (!matchUser) return null;
  const name = `${matchUser.firstName || ""} ${matchUser.lastName || ""}`.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-10 text-center">
      <div className="absolute inset-0 bg-linear-to-br from-brand-50 via-white to-violet-50 -z-10" />
      <ModalCloseButton onClose={onClose} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
        className="text-5xl mb-4"
      >
        🎉
      </motion.div>
      <h2 className="text-2xl font-bold tracking-tight">It&apos;s a match!</h2>
      <p className="text-[15px] text-text-secondary mt-2">
        You and <strong className="text-text-primary">{name}</strong> are ready to build together.
      </p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        className="flex justify-center my-8"
      >
        <Avatar src={matchUser.photoUrl} alt={name} size="xl" />
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/app/inbox" className="flex-1" onClick={onClose}>
          <Button className="w-full" magnetic>Send a message</Button>
        </Link>
        <Button variant="secondary" className="flex-1" onClick={onClose}>Keep exploring</Button>
      </div>
    </Modal>
  );
}
