// Placeholder for sidebar sections that are planned but not built yet.
// Exists so the new sidebar structure can be honest about what's live
// today vs. what's still on the roadmap, instead of a dead link or a
// silently-empty page pretending to be finished.
function ComingSoon({ title, description }) {
  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">{title}</h1>
          <p className="admin-page-sub">{description}</p>
        </div>
      </div>
      <div className="admin-mock-banner">
        This module is planned but not built yet - it's next up in the CMS expansion roadmap.
      </div>
    </div>
  );
}

export default ComingSoon;
