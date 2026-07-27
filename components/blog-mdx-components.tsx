import type { MDXRemoteProps } from "next-mdx-remote/rsc";

// @tailwindcss/typography kurulu değil; markdown çıktısını (next-mdx-remote)
// site'ın font/renk tokenlarıyla stilllemek için düz HTML etiketlerini
// burada eşliyoruz.
export const blogMdxComponents: NonNullable<MDXRemoteProps["components"]> = {
  h2: (props) => (
    <h2
      className="mt-10 mb-3 font-serif text-2xl leading-snug text-ink"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 mb-2 font-serif text-xl leading-snug text-ink"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mb-4 leading-relaxed text-ink-soft" {...props} />
  ),
  ul: (props) => (
    <ul
      className="mb-4 list-disc space-y-1.5 pl-5 text-ink-soft"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-4 list-decimal space-y-1.5 pl-5 text-ink-soft"
      {...props}
    />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  a: (props) => (
    <a
      className="text-primary underline underline-offset-2 hover:text-primary-deep"
      {...props}
    />
  ),
};
