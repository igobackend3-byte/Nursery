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


# Remove the decorative pale shield/checkmark watermark - it appears in
# 3 places: each info card's bottom-right corner, the message form
# card's 3 corners, and the trust strip's 2 corners. The "Quality
# Guaranteed" / "Trusted by Thousands" perk icons also use ShieldCheck,
# but those are real solid icons inside the trust row (not a faded
# corner watermark), so they're left untouched per "keep everything
# else exactly the same".
apply(f"{ROOT}/src/pages/Contact.jsx", [
(
"""        {children}
      </div>
      <span className="ctc-info-leaf" aria-hidden="true"><Icon.ShieldCheck /></span>
    </div>""",
"""        {children}
      </div>
    </div>"""
),
(
"""    <div className="ctc-form-card">
      <span className="ctc-form-leaf ctc-form-leaf-tl" aria-hidden="true"><Icon.ShieldCheck /></span>
      <span className="ctc-form-leaf ctc-form-leaf-bl" aria-hidden="true"><Icon.ShieldCheck /></span>
      <span className="ctc-form-leaf ctc-form-leaf-br" aria-hidden="true"><Icon.ShieldCheck /></span>

      <div className="ctc-form-header-row">""",
"""    <div className="ctc-form-card">
      <div className="ctc-form-header-row">"""
),
(
"""    <div className="ctc-trust-strip">
      <span className="ctc-trust-leaf ctc-trust-leaf-tl" aria-hidden="true"><Icon.ShieldCheck /></span>
      <span className="ctc-trust-leaf ctc-trust-leaf-br" aria-hidden="true"><Icon.ShieldCheck /></span>
      <div className="ctc-trust-row">""",
"""    <div className="ctc-trust-strip">
      <div className="ctc-trust-row">"""
),
])

print("Contact.jsx: decorative shield watermarks removed")

# Drop the now-unused CSS rules for those watermarks.
apply(f"{ROOT}/src/styles/site.css", [
(
""".ctc-info-leaf {
  position: absolute;
  right: 18px;
  bottom: 14px;
  color: rgba(11, 61, 46, 0.14);
  transform: scale(1.6);
}

""",
""""""
),
(
""".ctc-form-leaf {
  position: absolute;
  color: var(--ctc-green-mid);
  opacity: 0.16;
  pointer-events: none;
}

.ctc-form-leaf-tl { top: 20px; left: 24px; transform: scale(1.6) rotate(-10deg); }
.ctc-form-leaf-bl { bottom: 16px; left: 20px; transform: scale(2.2) rotate(8deg); }
.ctc-form-leaf-br { bottom: 24px; left: 34%; transform: scale(1.4) rotate(-6deg); }

""",
""""""
),
(
""".ctc-trust-leaf {
  position: absolute;
  color: rgba(47, 106, 76, 0.08);
  z-index: 0;
  pointer-events: none;
}

.ctc-trust-leaf-tl {
  top: -10px;
  left: 20px;
  transform: scale(4);
}

.ctc-trust-leaf-br {
  bottom: -10px;
  right: 80px;
  transform: scale(4) rotate(15deg);
}

""",
""""""
),
])

print("site.css: unused decorative-watermark rules removed")
