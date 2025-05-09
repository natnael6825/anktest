import PropTypes from "prop-types";
import { Typography, IconButton } from "@material-tailwind/react";

export function Footer({ title, description, socials, menus }) {
  return (
    <footer className="relative px-4 pt-8 pb-6 bg-black">
      <div className="container mx-auto">
        <div className="flex flex-wrap pt-6 text-center lg:text-left">
          <div className="w-full px-4 lg:w-6/12">
            <Typography variant="h4" className="mb-4" color="white">
              {title}
            </Typography>
            <Typography className="font-normal text-blue-gray-200 lg:w-2/5">
              {description}
            </Typography>
            <div className="mx-auto mt-6 mb-8 flex justify-center gap-2 md:mb-0 lg:justify-start">
              {socials.map(({ color, name, path }) => (
                <a
                  key={name}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton color="white" className="rounded-full shadow-none bg-transparent">
                    <Typography color={color}>
                      <i className={`fa-brands fa-${name}`} />
                    </Typography>
                  </IconButton>
                </a>
              ))}
            </div>
          </div>
          <div className="mx-auto w-max lg:mt-0 lg:mr-12">
  {menus.map(({ name, items }) => (
    <div key={name}>
      <Typography
        variant="small"
        color="white"
        className="mb-2 block font-medium uppercase"
      >
        {name}
      </Typography>
      <ul className="grid text-left  grid-cols-2 gap-3 sm:grid-cols-2 lg:flex lg:flex-col lg:gap-1">
        {items.map((item) => (
          <li key={item.name}>
            <Typography
              as="a"
              href={item.path}
              variant="small"
              className="block font-normal text-blue-gray-200 hover:text-blue-gray-500"
            >
              {item.name}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>

        </div>
        <hr className="my-6 border-gray-500" />
      </div>
    </footer>
  );
}


Footer.defaultProps = {
  title: "ANKUARU",
  description:
    "Empowering businesses to connect, trade, and grow on a trusted platform.",
  socials: [
    {
      color: "white",
      name: "instagram",
      path: "https://www.instagram.com/creativetimofficial/",
    },
    {
      color: "white",
      name: "telegram",
      path: "https://t.me/EthCoffeeCommunity",
    },
    {
      color: "white",
      name: "linkedin",
      path: "https://www.linkedin.com/company/creativetimofficial/",
    },
  ],
  menus: [
    {
      name: "Useful Links",
      items: [
        { name: "About Us", path: "#" }, // Placeholder for the first link
        { name: "Terms and Conditions", path: "#" }, // Placeholder for the second link
        { name: "Privacy Policy", path: "#" }, // Placeholder for the third link
        { name: "Contact Us", path: "#" }, // Placeholder for the fourth link
      ],
    },
  ],
};

Footer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  socials: PropTypes.arrayOf(PropTypes.object),
  menus: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
