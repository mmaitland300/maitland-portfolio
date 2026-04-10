import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="text-2xl font-bold mt-10 mb-4 scroll-mt-24 text-foreground"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl font-semibold mt-8 mb-3 scroll-mt-24 text-foreground"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="text-lg font-semibold mt-6 mb-2 scroll-mt-24 text-foreground"
      {...props}
    />
  ),
  p: (props) => (
    <p className="text-muted-foreground leading-relaxed mb-4" {...props} />
  ),
  ul: (props) => (
    <ul
      className="list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-inside text-muted-foreground space-y-1 mb-4 ml-4"
      {...props}
    />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: (props) => (
    <a
      className="text-brand-violet hover:text-brand-violet-hover underline underline-offset-4 transition-colors"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-brand-violet/50 pl-4 italic text-muted-foreground my-4"
      {...props}
    />
  ),
  code: (props) => {
    const isInline =
      typeof props.className === "undefined" ||
      !props.className?.includes("language-");
    if (isInline) {
      return (
        <code
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-brand-violet-muted"
          {...props}
        />
      );
    }
    return <code {...props} />;
  },
  pre: (props) => (
    <pre
      className="bg-[#0d1117] border border-border rounded-lg p-4 overflow-x-auto my-6 text-sm [&>code]:bg-transparent [&>code]:p-0"
      {...props}
    />
  ),
  hr: () => <hr className="border-border my-8" />,
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}
