import { useAdminData } from '../AdminDataContext';

function AdminCustomers() {
  const { customers } = useAdminData();

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Customers</h1>
          <p className="admin-page-sub">{customers.length} registered customers.</p>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-empty">
          <strong>No customer records yet</strong>
          The storefront's OTP login doesn't currently write a profile anywhere admin can read. Once Firebase is
          connected, signed-up customers (with their saved addresses and order history) will list here.
        </div>
      </div>
    </div>
  );
}

export default AdminCustomers;
