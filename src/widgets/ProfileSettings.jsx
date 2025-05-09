import React, { useState, useEffect } from 'react';
import { fetchUserByToken } from '@/services/userServices';

function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([{ type: '', file: null }]);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetchUserByToken();
      if (response && response.data) {
        setUser(response.data.user);
      }
    };
    getUser();
  }, []);

  const addCertificate = () => {
    setCertificates([...certificates, { type: '', file: null }]);
  };

  const updateCertificate = (index, field, value) => {
    const newCertificates = [...certificates];
    newCertificates[index][field] = value;
    setCertificates(newCertificates);
  };

  const businessTypes = ["Importer", "Small Business", "Exporter", "Supplier"];

  return (
    <>
      <div className="bg-white shadow p-6 mb-6 w-full max-w-5xl flex items-center justify-between">
        <div>
          <div className="text-xl">Name: {user?.name}</div>
          <div className="text-sm mt-1 text-gray-400">Phone: {user?.contact_information}</div>
        </div>
        <button className="px-6 py-2 text-black bg-white border border-red-500 hover:bg-red-400 rounded-md shadow">
          Request Edit
        </button>
      </div>

      <div className="bg-white shadow p-6 mb-6 w-full max-w-5xl">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="mb-3 block text-black">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
            />
          </div>
          <div>
            <label className="mb-3 block text-black">ID Card</label>
            <div className="rounded-sm border border-stroke bg-white shadow-default">
              <input
                type="file"
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-3 block text-black">Faida No.</label>
            <input
              type="text"
              value={user?.faidaNo || ''}
              readOnly
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
            />
          </div>
        </form>
        <button className="mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow">
          Save
        </button>
      </div>

      <div className="bg-white shadow p-6 w-full max-w-5xl">
        <h2 className="text-lg font-semibold mb-4">Business Information</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="mb-3 block text-black">Business Name</label>
            <input
              type="text"
              value={user?.businessName || ''}
              readOnly
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
            />
          </div>
          <div>
            <label className="mb-3 block text-black">Business Type</label>
            <select
              value={user?.businessType || ''}
              disabled
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
            >
              <option value="">Select Business Type</option>
              {businessTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-3 block text-black">TIN</label>
            <input
              type="text"
              value={user?.tin || ''}
              readOnly
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
            />
          </div>
          <div>
            <label className="mb-3 block text-black">License</label>
            <div className="rounded-sm border border-stroke bg-white shadow-default">
              <input
                type="file"
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-3 block text-black">Registration</label>
            <div className="rounded-sm border border-stroke bg-white shadow-default">
              <input
                type="file"
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none"
              />
            </div>
          </div>
        </form>

        {/* Certificate Fields */}
        <h3 className="text-lg font-semibold mt-6 mb-4">Certifications Competency</h3>
        {certificates.map((certificate, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-4">
            <div>
              <label className="mb-3 block text-black">Certification Type</label>
              <select
                value={certificate.type}
                onChange={(e) => updateCertificate(index, 'type', e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
              >
                <option value="">Select Certification Type</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
              </select>
            </div>
            <div>
              <label className="mb-3 block text-black">Certificate File</label>
              <div className="rounded-sm border border-stroke bg-white shadow-default">
                <input
                  type="file"
                  onChange={(e) => updateCertificate(index, 'file', e.target.files[0])}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addCertificate}
          className="mt-2 px-4 py-2 mr-5 text-white bg-green-600 hover:bg-green-700 rounded-md shadow"
        >
          Add More Certificate
        </button>
        <button className="mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow">
          Save
        </button>
      </div>
    </>
  );
}

export default ProfileSettings;
