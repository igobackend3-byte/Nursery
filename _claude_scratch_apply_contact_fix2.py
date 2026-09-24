import io

ROOT = "/sessions/rcw-013juftdpvoovh6j5geqfaq3/mnt/Nursery project/igo-nursery-website/nursery-store"

def apply(path, replacements):
    with io.open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        count = content.count(old)
        if count != 1:
            raise SystemExit(f"FAIL: {path}: expected 1 occurrence, found {count}\n---OLD---\n{old[:600]}")
        content = content.replace(old, new, 1)
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK: {path} ({len(replacements)} edits)")


# EditableElement (current API) only ever renders `children` outside editor
# mode - it does not forward arbitrary props like `dangerouslySetInnerHTML`,
# `as` or `className` through to a real DOM node. Every other EditableElement
# in this file happens to still work because it passes its text as children,
# but this one passed no children at all (relying solely on
# dangerouslySetInnerHTML), so the address text silently rendered as nothing.
# Fix: pass the HTML as real children instead.
apply(f"{ROOT}/src/pages/Contact.jsx", [
(
"""            <EditableElement as="p" className="ctc-info-note" contentKey="contactPage.infoCards" field="locText" dangerouslySetInnerHTML={{ __html: contactPage.infoCards.locText }}></EditableElement>""",
"""            <EditableElement as="p" className="ctc-info-note" contentKey="contactPage.infoCards" field="locText">
              <p className="ctc-info-note" dangerouslySetInnerHTML={{ __html: contactPage.infoCards.locText }} />
            </EditableElement>"""
),
])

print("Contact.jsx: 'Visit Us' address text fixed")
