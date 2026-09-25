import { useRef, useState } from 'react';

// Shared "upload from your computer" control used everywhere the admin used
// to take an image URL (Products, Categories, Content). Reads the chosen
// file straight into a data: URL with FileReader - no server/URL involved,
// so it works with the same in-memory/localStorage storage everything else
// here already uses. Kept under 3MB so a handful of images doesn't blow
// past what a browser's localStorage quota can hold (Content persists there).
const MAX_BYTES = 3 * 1024 * 1024;

function ImageField({ id, label, value, onChange, spanTwo }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file later
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('That image is larger than 3MB - please choose a smaller file.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className={`admin-field${spanTwo ? ' span-2' : ''}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className="admin-image-field">
        {value && <img src={value} alt="" className="admin-image-field-preview" />}
        <div className="admin-image-field-actions">
          <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => inputRef.current?.click()}>
            {value ? 'Replace image' : 'Choose image from computer'}
          </button>
          {value && (
            <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
        <input ref={inputRef} id={id} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>
      {error && <p className="admin-image-field-error">{error}</p>}
    </div>
  );
}

// Gallery version of ImageField: lets the admin add several extra photos for
// a product's detail-page thumbnail strip (see ProductDetail.jsx), each one
// picked from the computer and read the same way - no URLs involved.
function MultiImageField({ id, label, values, onChange, max = 8 }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  function handleFiles(e) {
    const files = [...(e.target.files ?? [])];
    e.target.value = '';
    if (files.length === 0) return;
    const room = max - values.length;
    if (room <= 0) {
      setError(`You can add up to ${max} extra images.`);
      return;
    }
    const toRead = files.slice(0, room);
    const bad = toRead.find((f) => !f.type.startsWith('image/'));
    if (bad) {
      setError('Please choose image files only.');
      return;
    }
    const tooBig = toRead.find((f) => f.size > MAX_BYTES);
    if (tooBig) {
      setError('One of those images is larger than 3MB - please choose a smaller file.');
      return;
    }
    setError('');
    Promise.all(toRead.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    }))).then((dataUrls) => onChange([...values, ...dataUrls]));
  }

  function removeAt(i) {
    onChange(values.filter((_, idx) => idx !== i));
  }

  return (
    <div className="admin-field span-2">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="admin-gallery-field">
        {values.map((src, i) => (
          <div className="admin-gallery-thumb" key={i}>
            <img src={src} alt="" />
            <button type="button" onClick={() => removeAt(i)} aria-label="Remove image">✕</button>
          </div>
        ))}
        {values.length < max && (
          <button type="button" className="admin-gallery-add" onClick={() => inputRef.current?.click()}>
            + Add
          </button>
        )}
        <input ref={inputRef} id={id} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
      </div>
      <p className="admin-cell-sub" style={{ marginTop: 6 }}>{values.length} of {max} extra photos for the product gallery.</p>
      {error && <p className="admin-image-field-error">{error}</p>}
    </div>
  );
}

// Local-file video picker (product demo/care clip). Same data: URL pattern,
// but with a much higher size cap since video files are naturally bigger -
// still capped so it can't silently blow past what session/localStorage can hold.
const MAX_VIDEO_BYTES = 20 * 1024 * 1024;

function VideoField({ id, label, value, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Please choose a video file.');
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setError('That video is larger than 20MB - please choose a smaller file.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="admin-field span-2">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="admin-image-field">
        {value && <video src={value} className="admin-video-field-preview" muted controls />}
        <div className="admin-image-field-actions">
          <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => inputRef.current?.click()}>
            {value ? 'Replace video' : 'Choose video from computer'}
          </button>
          {value && (
            <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
        <input ref={inputRef} id={id} type="file" accept="video/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>
      {error && <p className="admin-image-field-error">{error}</p>}
    </div>
  );
}

export default ImageField;
export { MultiImageField, VideoField };
