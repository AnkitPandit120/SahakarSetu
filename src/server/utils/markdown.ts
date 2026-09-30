import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: false, // Security: sanitize HTML tags
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  typographer: true,
});

// Customize link opening in new tab
const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, _env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
  tokens[idx].attrSet('target', '_blank');
  tokens[idx].attrSet('rel', 'noopener noreferrer');
  tokens[idx].attrSet('class', 'text-blue-600 underline font-medium hover:text-blue-800');
  return defaultRender(tokens, idx, options, env, self);
};

export function renderMarkdownToHtml(markdownText: string): string {
  if (!markdownText) return '';
  return md.render(markdownText);
}
