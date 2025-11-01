import { LeftContent } from "@/components/pagesUi/notificationPageUI/leftContent";
import { PageWrapper } from "@/components/pagesWrapper/pagesWrapper";

export const NotificationPage = () => {
  return (
    <PageWrapper
      headerText="Help & FAQs"
      leftContent={<LeftContent />}
      rightContent={<></>}
    />
  );
};
