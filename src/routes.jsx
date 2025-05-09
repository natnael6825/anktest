import { Home, Market_information ,BuyOrSell , Posting_form_admin} from "@/pages";
import { element } from "prop-types";
import AddProduct from "./pages/adminPage/addProduct";
import CreatePost from "./pages/adminPage/createPost";
import ViewPosts from "./pages/adminPage/viewPosts";

export const routes = [
  {
    name: "home",
    path: "/home",
    element: <Home />,
  },
  {
    name: "Buy",
    path: "/buy",
    element:<BuyOrSell />,
  },
  {
    name: "Sell",
    path: "/sell",
    element:<BuyOrSell />,
  },
  {
    name: "Market Price Information",
    path: "/market_information",
    element:<Market_information />,
  },
  {
    name: "News and Others",
    path: "/home",
    element:<Home />,
  },

 
  

];

export const adminRoutes = [
  
  // {
  //   name: "Post offer",
  //   path: "/postFormAdmin",
  //   element:<Posting_form_admin />,
  // },
  {
    name: "User management",
    path: "/home",
    element:<Home />,
  },
  {
    name: "Add product",
    path: "/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR/addProduct",
    element:<AddProduct />,
  },
  {
    name: "Posting form",
    path: "/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR",
    element: <Posting_form_admin />
  },
  {
    name: "Create post",
    path: "/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR/createPost",
    element: <CreatePost />
  },
  {
    name: "View post",
    path: "/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR/ViewPosts",
    element: <ViewPosts />
  }
];


export default routes;
