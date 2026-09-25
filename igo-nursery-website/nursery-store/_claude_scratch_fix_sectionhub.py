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

# Fix: SectionHub.jsx (which renders /plants, /category/*, etc.) uses
# <EditableSection> three times but never imports it - a pre-existing bug
# (not introduced by any of the About page work), throwing
# "ReferenceError: EditableSection is not defined" and crashing the whole
# page to a blank screen the moment React tries to render it.
apply(f"{ROOT}/src/pages/SectionHub.jsx", [
(
"""import { Link } from 'react-router-dom';
import { useCatalogue } from '../context/CatalogueContext';
import { useSiteContent } from '../hooks/useSiteContent';
import ProductCard from '../components/ProductCard';
import CategoryIllustration from '../components/CategoryIllustration';""",
"""import { Link } from 'react-router-dom';
import { useCatalogue } from '../context/CatalogueContext';
import { useSiteContent } from '../hooks/useSiteContent';
import ProductCard from '../components/ProductCard';
import CategoryIllustration from '../components/CategoryIllustration';
import EditableSection from '../admin/editor/EditableSection';"""
),
])

print("SectionHub.jsx import fix applied")
