import io

ROOT = "/sessions/rcw-013juftdpvoovh6j5geqfaq3/mnt/Nursery project/igo-nursery-website/nursery-store"

def apply(path, replacements):
    with io.open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        count = content.count(old)
        if count != 1:
            raise SystemExit(f"FAIL: {path}: expected 1 occurrence, found {count}\n---OLD---\n{old[:400]}")
        content = content.replace(old, new, 1)
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK: {path} ({len(replacements)} edits)")

# Fix: outside the editor (live site, or admin preview with editor mode
# off) EditableElement renders ONLY its children - no wrapper div at all -
# so `wrapperStyle` (which only exists on that wrapper) never applies
# there. The decorative icon's span needs its OWN inline top/left in that
# case, same as the original FloatingLeaf; inside the editor the wrapper
# carries that position instead, so the span itself must NOT also set it
# (that would double the offset).
apply(f"{ROOT}/src/pages/About.jsx", [
(
"""          <span className="abt-leaf" aria-hidden="true">
            <DecorativeIconComp width={16} height={16} />
          </span>""",
"""          <span className="abt-leaf" style={isEditorMode ? undefined : { top: '58%', left: '2%' }} aria-hidden="true">
            <DecorativeIconComp width={16} height={16} />
          </span>"""
),
])

print("Decorative icon position fix applied")
