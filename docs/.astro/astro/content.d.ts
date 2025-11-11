declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"docs": {
"api.md": {
	id: "api.md";
  slug: "api";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"architecture.md": {
	id: "architecture.md";
  slug: "architecture";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"deployment.md": {
	id: "deployment.md";
  slug: "deployment";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"development.md": {
	id: "development.md";
  slug: "development";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"github-workflows/architecture-summary.md": {
	id: "github-workflows/architecture-summary.md";
  slug: "github-workflows/architecture-summary";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"github-workflows/cleanup-old-releases.md": {
	id: "github-workflows/cleanup-old-releases.md";
  slug: "github-workflows/cleanup-old-releases";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"github-workflows/cycle-prevention-fix.md": {
	id: "github-workflows/cycle-prevention-fix.md";
  slug: "github-workflows/cycle-prevention-fix";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"github-workflows/index.md": {
	id: "github-workflows/index.md";
  slug: "github-workflows";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"github-workflows/overview.md": {
	id: "github-workflows/overview.md";
  slug: "github-workflows/overview";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"github-workflows/setup-guide.md": {
	id: "github-workflows/setup-guide.md";
  slug: "github-workflows/setup-guide";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"github-workflows/squash-merge-configuration.md": {
	id: "github-workflows/squash-merge-configuration.md";
  slug: "github-workflows/squash-merge-configuration";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"onboarding.md": {
	id: "onboarding.md";
  slug: "onboarding";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"pipeline.md": {
	id: "pipeline.md";
  slug: "pipeline";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"schemas/index.md": {
	id: "schemas/index.md";
  slug: "schemas";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"test.md": {
	id: "test.md";
  slug: "test";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"troubleshooting.md": {
	id: "troubleshooting.md";
  slug: "troubleshooting";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"user-guide.md": {
	id: "user-guide.md";
  slug: "user-guide";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
"validate-schema.md": {
	id: "validate-schema.md";
  slug: "validate-schema";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
