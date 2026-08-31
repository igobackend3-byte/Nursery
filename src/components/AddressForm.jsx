import { useState } from 'react';
import { detectCurrentAddress } from '../lib/geolocation';

// Shared address entry form - used by Checkout (new address) and Account
// (add/edit address) so both get the same fields, layout and "use my
// current location" auto-fill behaviour.
function AddressForm({ value, onChange }) {
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState('');
  const [detectedOk, setDetectedOk] = useState(false);

  function set(field, val) {
    onChange({ ...value, [field]: val });
  }

  async function handleDetect() {
    setDetecting(true);
    setDetectError('');
    setDetectedOk(false);
    try {
      const detected = await detectCurrentAddress();
      onChange({ ...value, ...detected });
      setDetectedOk(true);
    } catch (err) {
      setDetectError(err.message);
    } finally {
      setDetecting(false);
    }
  }

  return (
    <div className="address-form">
      <button type="button" className="address-locate-btn" onClick={handleDetect} disabled={detecting}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" />
          <circle cx="12" cy="9" r="3" />
        </svg>
        {detecting ? 'Detecting your location…' : 'Use my current location'}
      </button>
      {detectError && <p className="address-locate-status error">{detectError}</p>}
      {detectedOk && !detectError && <p className="address-locate-status ok">Address filled from your current location - please double-check it below.</p>}

      <div className="checkout-form-grid">
        <label>
          Label
          <input value={value.label} onChange={(e) => set('label', e.target.value)} placeholder="Home / Work" />
        </label>
        <label>
          Phone
          <input value={value.phone} onChange={(e) => set('phone', e.target.value)} placeholder="Phone number" />
        </label>
        <label className="span-2">
          Address line 1
          <input value={value.line1} onChange={(e) => set('line1', e.target.value)} placeholder="House no., street" />
        </label>
        <label className="span-2">
          Address line 2 (optional)
          <input value={value.line2} onChange={(e) => set('line2', e.target.value)} placeholder="Landmark, area" />
        </label>
        <label>
          City
          <input value={value.city} onChange={(e) => set('city', e.target.value)} />
        </label>
        <label>
          State
          <input value={value.state} onChange={(e) => set('state', e.target.value)} />
        </label>
        <label>
          Pincode
          <input value={value.pincode} onChange={(e) => set('pincode', e.target.value)} />
        </label>
      </div>
    </div>
  );
}

export default AddressForm;
