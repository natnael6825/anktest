import React, { useState, useEffect } from 'react';
import NavStyle from "@/widgets/layout/nav_style";
import { Footer } from '@/widgets/layout';
import { fetchUserByToken } from '@/services/userServices';
import { ProfileSidebar } from '@/widgets/profileSidebar';
import ProfileSettings from '@/widgets/ProfileSettings';
import OfferSettings from '@/widgets/OfferSettings';
import { FlagIcon } from "@heroicons/react/24/solid";
import { Button, Typography } from "@material-tailwind/react";

function Profile() {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([{ type: '', file: null }]);
  const [selectedView, setSelectedView] = useState("profile");

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
    <div className="bg-whiten min-h-screen">
      <NavStyle />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Pass the onSelect callback so sidebar clicks update the view */}
        <ProfileSidebar onSelect={setSelectedView} />
        <div className="flex-1 flex p-5 flex-col mb-20 items-center lg:items-start lg:ml-40">
        {selectedView === "profile" && <ProfileSettings />}
          {selectedView === "offer" && <OfferSettings />}
        </div>
      </div>
      <Footer />
    </div>
  )
{/* <div className="h-screen mx-auto grid place-items-center text-center px-8">
          <div>
            <FlagIcon className="w-20 h-20 mx-auto" />
            <Typography
              variant="h1"
              color="blue-gray"
              className="mt-10 !text-3xl !leading-snug md:!text-4xl"
            >
              404 Page not Found <br />
            </Typography>
            <Typography className="mt-8 mb-14 text-[25px] font-normal text-gray-500 mx-auto md:max-w-sm">
              
            </Typography>
          
          </div>
        </div> */}
}

export default Profile;
