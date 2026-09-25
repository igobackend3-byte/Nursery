import { useAdminData } from '../AdminDataContext';

function AdminVisitorLeads() {
  const { visitorLeads } = useAdminData();

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Visitor Leads</h1>
          <p className="admin-page-sub">{visitorLeads.length} leads captured.</p>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-empty">
          <strong>No lead-capture form exists on the site yet</strong>
          This section is for consultation requests or "talk to an expert" form submissions - the storefront doesn't
          have that form built yet, so there's genuinely nothing to show here. Once one exists (e.g. on the
          Garden Services or Plant Finder pages), submissions would list here.
        </div>
      </div>
    </div>
  );
}

export default AdminVisitorLeads;
