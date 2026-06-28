"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useApiFetch } from "@/app/hooks/useApiFetch";
import Section from "@/app/components/section";
import FeatureList from "@/app/components/community/FeatureList";
import CommunityLoginCard from "@/app/components/community/CommunityLoginCard";
import PostCard from "@/app/components/community/PostCard";
import CreatePostModal from "@/app/components/community/CreatePostModal";

interface Post {
	id: number;
	author_id: number;
	author_fname: string;
	author_lname: string;
	author_role: string;
	title: string;
	content: string;
	created_at: string;
	comment_count: number;
}

const PAGE_SIZE = 10;

function PostSkeleton() {
	return (
		<div className="bg-white rounded-xl border border-[var(--line)] shadow-sm px-6 py-5 animate-pulse">
			<div className="flex items-center gap-2 mb-3">
				<div className="h-3 w-24 bg-[var(--line)] rounded" />
				<div className="h-3 w-12 bg-[var(--line)] rounded" />
			</div>
			<div className="h-4 w-3/4 bg-[var(--line)] rounded mb-2" />
			<div className="space-y-1.5">
				<div className="h-3 w-full bg-[var(--line)] rounded" />
				<div className="h-3 w-full bg-[var(--line)] rounded" />
				<div className="h-3 w-2/3 bg-[var(--line)] rounded" />
			</div>
			<div className="h-3 w-16 bg-[var(--line)] rounded mt-3" />
		</div>
	);
}

export default function CommunityFeed() {
	const { user, isLoading } = useAuth();
	const apiFetch = useApiFetch();

	const [posts, setPosts]       = useState<Post[]>([]);
	const [page, setPage]         = useState(0);
	const [hasMore, setHasMore]   = useState(true);
	const [fetching, setFetching] = useState(false);
	const [initialLoad, setInitialLoad] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const sentinelRef = useRef<HTMLDivElement>(null);

	const loadPage = useCallback(async (pageNum: number, replace = false) => {
		setFetching(true);
		try {
			const data = await apiFetch<Post[]>(
				`/community/posts?skip=${pageNum * PAGE_SIZE}&limit=${PAGE_SIZE}`
			);
			if (replace) {
				setPosts(data);
			} else {
				setPosts((prev) => [...prev, ...data]);
			}
			setHasMore(data.length === PAGE_SIZE);
		} catch {
			// silently fail — feed stays as-is
		} finally {
			setFetching(false);
			setInitialLoad(false);
		}
	}, [apiFetch]);

	// Initial load when user becomes authenticated
	useEffect(() => {
		if (!user) return;
		setPage(0);
		setPosts([]);
		setHasMore(true);
		setInitialLoad(true);
		loadPage(0, true);
	}, [user]); // eslint-disable-line react-hooks/exhaustive-deps

	// Load subsequent pages when `page` increments
	useEffect(() => {
		if (page === 0) return;
		loadPage(page);
	}, [page]); // eslint-disable-line react-hooks/exhaustive-deps

	// IntersectionObserver sentinel
	useEffect(() => {
		const el = sentinelRef.current;
		if (!el || !hasMore || fetching) return;
		const obs = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) setPage((p) => p + 1); },
			{ threshold: 0.1 }
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [hasMore, fetching]);

	const handlePostSuccess = () => {
		setPage(0);
		loadPage(0, true);
	};

	if (isLoading) return null;

	if (!user) {
		return (
			<Section variant="navy">
				<div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 py-20 px-8 items-start">
					<FeatureList
						eyebrow="What's Inside"
						title="Everything your family needs, in one private space."
						items={[
							"Premium test prep resources",
							"Mentor Q&As",
							"Parent discussions",
							"Early access to IRL events",
							"Curated college admissions insights",
						]}
					/>
					<CommunityLoginCard />
				</div>
			</Section>
		);
	}

	return (
		<>
			<div className="bg-[var(--cream)] min-h-screen">
				<div className="max-w-3xl mx-auto px-4 py-10">
					<div className="flex items-center justify-between mb-6">
						<h2 className="font-playfair text-xl font-semibold text-[var(--ink)]">
							Recent Posts
						</h2>
						<button
							onClick={() => setShowModal(true)}
							className="rounded-lg bg-[var(--navy)] text-[var(--cream)] px-4 py-2 text-sm font-semibold hover:bg-[var(--navy-mid)] transition-colors"
						>
							+ New Post
						</button>
					</div>

					{initialLoad ? (
						<div className="flex flex-col gap-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<PostSkeleton key={i} />
							))}
						</div>
					) : posts.length === 0 ? (
						<div className="text-center py-16 text-[var(--ink-soft)] text-sm">
							No posts yet. Be the first to share something with the community.
						</div>
					) : (
						<div className="flex flex-col gap-3">
							{posts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>
					)}

					{hasMore && <div ref={sentinelRef} className="h-10" />}

					{fetching && !initialLoad && (
						<div className="flex justify-center py-8">
							<div className="w-5 h-5 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
						</div>
					)}

					{!hasMore && posts.length > 0 && (
						<p className="text-center text-xs text-[var(--ink-soft)] py-8">
							You&apos;re all caught up.
						</p>
					)}
				</div>
			</div>

			{showModal && (
				<CreatePostModal
					onClose={() => setShowModal(false)}
					onSuccess={handlePostSuccess}
				/>
			)}
		</>
	);
}
