import BookingsRightContent from "../BookingsRightContent";
import { PageWrapper } from "../pagesWrapper/pagesWrapper";
import { AppSidebar } from "../sidebar/sidebar";

const Bookings = () => {
  return (
    <PageWrapper
      headerText="Bookings"
      leftContent={<AppSidebar />}
      rightContent={<BookingsRightContent />}
    />
  );
};

export default Bookings;
