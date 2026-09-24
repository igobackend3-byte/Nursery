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

apply(f"{ROOT}/src/admin/editor/EditableElement.jsx", [
(
"""export default function EditableElement({ sectionKey, field, type = 'text', label = 'Content', fields, hideDelete = false, fill = false, children }) {""",
"""export default function EditableElement({ sectionKey, field, type = 'text', label = 'Content', fields, hideDelete = false, fill = false, wrapperStyle, children }) {"""
),
(
"  return (\n    <div \n      className={`editable-element-wrap${fill ? ' editable-element-fill' : ''}`}\n      onMouseEnter={() => setIsHovered(true)}",
"  return (\n    <div \n      className={`editable-element-wrap${fill ? ' editable-element-fill' : ''}`}\n      style={wrapperStyle}\n      onMouseEnter={() => setIsHovered(true)}"
),
])

print("EditableElement.jsx patched")
