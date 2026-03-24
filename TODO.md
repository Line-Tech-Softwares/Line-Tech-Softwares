# TODO.md - Fix REST Pages Consistency with index.html

## Current Progress
- [x] Analyzed files and created detailed plan
- [x] Update CSS/tools.css with new styles
- [x] Batch 1: cv-builder.html ✅
- [x] Batch 1: invoice-generator.html ✅
- [ ] Batch 1: barcode-generator.html (retry header match)
- [ ] Rest of tools
- [ ] tools.html
- [ ] Other pages
- [ ] Test
- [ ] Complete

## Steps Breakdown (Approved Plan)
1. **CSS/tools.css**: Add `.tool-hero` (reduced padding), `.back-to-tools` (prominent sticky btn).
2. **All 15 tools/*.html**:
   - Replace <header> with full index.html version (logo img/text, hamburger, mobile nav, paths adjusted).
   - Replace app-header → tool-hero (smaller).
   - Add back btn after header.
   - Add CSS links: ../../CSS/index.css, ../../CSS/Hamburgermenu.css etc.
   - Fix JS paths.
   - Standardize footer.
3. **tools.html**: Reduce hero padding/h1 size.
4. **Testing**: Open pages, check mobile hamburger, back btn, responsive.
5. **Other pages**: Spot-check/apply if inconsistent.

**Next**: Continue batch edits with exact matches. Fixed 2/15 tools. Pattern established.
