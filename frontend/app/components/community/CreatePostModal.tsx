"use client";
import { FormEvent, useState } from "react";
import { useApiFetch } from "@/app/hooks/useApiFetch";

const inputCls =
	"w-full rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 text-sm text-[var(--ink)] " +
	"placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]";
const labelCls = "text-[var(--ink)] text-xs font-semibold";

interface Props {
	onClose: () => void;
	onSuccess: () => void;
}

export default function CreatePostModal({ onClose, onSuccess }: Props) {
	const apiFetch = useApiFetch();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			await apiFetch("/community/posts", {
				method: "POST",
				body: JSON.stringify({ title, content }),
			});
			onSuccess();
			onClose();
		} catch {
			setError("Failed to publish post. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			onClick={onClose}
		>
			<div
				className="bg-[var(--cream)] rounded-2xl max-w-lg w-full p-8 shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between mb-6">
					<h2 className="font-playfair text-xl font-semibold text-[var(--ink)]">New Post</h2>
					<button
						onClick={onClose}
						className="text-[var(--ink-soft)] hover:text-[var(--ink)] text-xl leading-none transition-colors"
						aria-label="Close"
					>
						✕
					</button>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label className={labelCls}>Title</label>
						<input
							className={inputCls}
							placeholder="Give your post a title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							maxLength={256}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className={labelCls}>Content</label>
						<textarea
							className={`${inputCls} h-32 resize-none`}
							placeholder="What's on your mind?"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
						/>
					</div>

					{error && <p className="text-red-500 text-xs">{error}</p>}

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-[var(--navy)] text-[var(--cream)] py-2.5 text-sm font-semibold hover:bg-[var(--navy-mid)] transition-colors disabled:opacity-50 mt-1"
					>
						{loading ? "Publishing…" : "Publish Post"}
					</button>
				</form>
			</div>
		</div>
	);
}
