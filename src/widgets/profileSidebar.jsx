import React from "react";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Drawer,
  Card,
} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const SidebarContent = ({ open, handleOpen, onSelect }) => (
  <Card color="transparent" shadow={false} className="h-full w-fit p-4 lg:border-r-4 fixed bg-white">
    <List>
      {/* Profile Setting Item */}
      <ListItem onClick={() => onSelect("profile")} className="cursor-pointer">
        <ListItemPrefix>
          <UserCircleIcon className="h-5 w-5" />
        </ListItemPrefix>
        Profile Setting
      </ListItem>

      {/* Offer Setting Dropdown */}
      <Accordion
        open={open === 1}
        icon={
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`mx-auto h-4 w-4 transition-transform ${
              open === 1 ? "rotate-180" : ""
            }`}
          />
        }
      >
        <ListItem className="p-0" selected={open === 1}>
          <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
            <Typography color="blue-gray" className="mr-auto font-normal">
              Offer Management
            </Typography>
          </AccordionHeader>
        </ListItem>
        <AccordionBody className="py-1">
          <List className="p-0">
            <ListItem onClick={() => onSelect("offer")} className="cursor-pointer">
              <ListItemPrefix>
                
              </ListItemPrefix>
              My Offers
            </ListItem>
          </List>
        </AccordionBody>
      </Accordion>
    </List>
  </Card>
);

export function ProfileSidebar({ onSelect }) {
  const [open, setOpen] = React.useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* Hamburger icon: Only visible on smaller screens */}
      <div className="lg:hidden">
        <IconButton variant="text" size="lg" onClick={openDrawer}>
          {isDrawerOpen ? (
            <XMarkIcon className="h-8 w-8 stroke-2" />
          ) : (
            <Bars3Icon className="h-8 w-8 stroke-2" />
          )}
        </IconButton>
      </div>

      <div className="hidden lg:block">
        <Card color="transparent" shadow={false} className="h-screen w-64 p-4">
          <SidebarContent open={open} handleOpen={handleOpen} onSelect={onSelect} />
        </Card>
      </div>

      <Drawer open={isDrawerOpen} onClose={closeDrawer} className="lg:hidden">
        <Card color="transparent" shadow={false} className="h-[calc(100vh-2rem)] w-full p-4">
          <SidebarContent open={open} handleOpen={handleOpen} onSelect={onSelect} />
        </Card>
      </Drawer>
    </>
  );
}
