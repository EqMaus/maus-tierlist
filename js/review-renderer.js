(function () {
  'use strict';

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function slug(value) {
    return String(value || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'seccion';
  }

  function inlineMarkdown(value) {
    let html = esc(value);
    html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return html;
  }

  function normalizeSections(sections) {
    if (!Array.isArray(sections)) return [];
    return sections.map((section, index) => {
      if (!section || typeof section !== 'object') return null;
      const verdict = Boolean(section.verdict);
      const title = verdict ? 'Veredicto final' : String(section.title || `Sección ${index + 1}`).trim();
      let paragraphs = Array.isArray(section.paragraphs)
        ? section.paragraphs.map((paragraph) => String(paragraph || '').replace(/\r/g, '').trim()).filter(Boolean)
        : [];
      if (!paragraphs.length && section.text) {
        paragraphs = String(section.text).replace(/\r/g, '').split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
      }
      if (!paragraphs.length) return null;
      return { title, verdict, paragraphs };
    }).filter(Boolean);
  }

  function sectionId(section, index, prefix) {
    return `${prefix || 'review'}-${index + 1}-${slug(section.title)}`;
  }

  function renderSection(section, index, options) {
    const id = sectionId(section, index, options.idPrefix);
    if (section.verdict) {
      return `<section id="${esc(id)}" class="review-verdict review-render-section" data-review-render-index="${index}"><span>Veredicto final</span><div class="review-verdict-body">${section.paragraphs.map((paragraph) => inlineMarkdown(paragraph).replace(/\n/g, '<br>')).join('<div class="review-verdict-gap" aria-hidden="true"></div>')}</div></section>`;
    }
    return `<section id="${esc(id)}" class="review-section review-render-section" data-review-render-index="${index}"><div class="review-section-head">${esc(section.title)}</div><div class="review-copy">${section.paragraphs.map((paragraph) => `<p>${inlineMarkdown(paragraph).replace(/\n/g, '<br>')}</p>`).join('')}</div></section>`;
  }

  function renderNavigator(sections, options) {
    if (options.navigator === false || sections.length < 2) return '';
    return `<nav class="review-section-nav" aria-label="Secciones de la review"><div class="review-section-nav-track">${sections.map((section, index) => {
      const id = sectionId(section, index, options.idPrefix);
      return `<button type="button" data-review-jump="${esc(id)}" data-review-nav-index="${index}" class="review-section-nav-button${section.verdict ? ' is-verdict' : ''}">${esc(section.verdict ? 'Veredicto' : section.title)}</button>`;
    }).join('')}</div></nav>`;
  }

  function render(sections, options = {}) {
    const normalized = normalizeSections(sections);
    if (!normalized.length) return '<div class="review-render-root"><div class="review-layout"><p class="empty-review">Sin review todavía.</p></div></div>';
    return `<div class="review-render-root">${renderNavigator(normalized, options)}<div class="review-layout">${normalized.map((section, index) => renderSection(section, index, options)).join('')}</div></div>`;
  }

  function legacyText(sections) {
    return normalizeSections(sections)
      .flatMap((section) => section.paragraphs)
      .join('\n\n')
      .trim();
  }

  window.MausReviewRenderer = {
    esc,
    slug,
    inlineMarkdown,
    normalizeSections,
    render,
    legacyText,
    sectionId
  };
})();
