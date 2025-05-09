import React from "react";
import {
  Input,
  Checkbox,
  Button,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import NavStyle from "@/widgets/layout/nav_style";
const COUNTRIES = ["Ethiopia(+251)"];
const CODES = ["+251"];
export function SignUp() {
  const [country, setCountry] = React.useState(0);
  return (
    <section className="m-8 flex gap-4">
       <NavStyle />  
      <div className="w-2/5 h-full hidden lg:flex flex-col justify-center items-start rounded-3xl pt-40">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Welcome Back!</h2>
        <p className="text-base text-gray-700 leading-relaxed">
          Sign in to access your account and continue your journey with us. We're excited to have you here!
        </p>
      </div>



      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Your Phone Number
            </Typography>
            <div className="relative flex w-full">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="h-10 w-14 shrink-0 rounded-r-none border border-r-0 border-blue-gray-200 bg-transparent px-3"
                  >
                    {CODES[country]}
                  </Button>
                </MenuHandler>
                <MenuList className="max-h-[20rem] max-w-[18rem]">
                  {COUNTRIES.map((country, index) => {
                    return (
                      <MenuItem
                        key={country}
                        value={country}
                        onClick={() => setCountry(index)}
                      >
                        {country}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
              <Input
                type="tel"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={12}
                placeholder="912-345-678"
                className="appearance-none rounded-l-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0",
                }}
              />
            </div>
          </div>
          <Button className="mt-6 bg-green-600" fullWidth>
            Sign In
          </Button>

          <div className="flex items-center justify-between gap-2 mt-6"></div>
          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            By continuing you agree to Ankuaru's{" "}
            <a
              href="#"
              className="font-normalg text-black transition-colors hover:text-gray-900 underline"
            >
              Terms and Conditions
            </a>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
