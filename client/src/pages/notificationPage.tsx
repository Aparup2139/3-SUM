import { LeftContent } from "@/components/pagesUi/notificationPageUI/leftContent";
import { RightContent } from "@/components/pagesUi/notificationPageUI/rightContent";
import { PageWrapper } from "@/components/pagesWrapper/pagesWrapper";

export const NotificationPage = () => {
  return (
    <PageWrapper
      headerText="Notifications"
      leftContent={<LeftContent />}
      rightContent={<RightContent />}
    />
  );
};
