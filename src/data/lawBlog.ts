export type LawBlogPost = {
	id: string;
	date: string;
	title: string;
	body: string;
	/** States or bills that changed, if any. */
	changed: string[];
};

/** Newest first. Daily law-watch automation prepends entries here. */
export const LAW_BLOG: LawBlogPost[] = [];
