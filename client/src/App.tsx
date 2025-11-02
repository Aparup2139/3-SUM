import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./pages/rootlayout";
import { HomePage } from "./pages/HomePage";
import { NotificationPage } from "./pages/notificationPage";
import { BookingsPage } from "./pages/bookingsPage";
import { AuthPage } from "./components/pagesUi/authPage/authPage";
import { RootPageLayout } from "./components/landingpage/rootPageLayout";
import { LandingPage } from "./components/landingpage/landingpage";

// import { OAuthPage } from './components/pagesUi/authPage/OAuthPage'
import { EventCityPage } from "./pages/EventCityPage";
import { SpecificEventPage } from "./pages/SpecificEventPage";
import ProfilePage from "./pages/profilePage";
import { AdminPanelPage } from "./components/pagesUi/AdminPanel/adminPanel";
import { AnalyticsPage } from "./components/pagesUi/AdminPanel/analytics";
import PaymentSuccess from "./components/pagesUi/paymentStatus/paymentSuccess";
import PaymentFailure from "./components/pagesUi/paymentStatus/paymentFailure";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPageLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },

      {
        path: "auth",
        element: <AuthPage />,
      },

      // {
      //   path: "oauth",
      //   element: <OAuthPage />
      // },
    ],
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/home",
        children: [
          {
            index: true,
            element: <HomePage />,
          },

          {
            path: ":cityName",
            element: <EventCityPage />,
          },
          {
            path: "event/:eventId",
            element: <SpecificEventPage />,
          },
        ],
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/bookings",
        element: <BookingsPage />,
      },
      {
        path: "/help",
        element: <NotificationPage />,
      },
    ],
  },
  {
    path: "/admin-panel",
    children: [
      {
        index: true,
        element: <AdminPanelPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
    ],
  },
  {
    path: "/payment-success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment-failure",
    element: <PaymentFailure />,
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
