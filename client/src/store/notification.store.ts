import { type NotificationType } from '@/types/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface notificationStore {
    notifications: Partial<NotificationType>[],
    setState: (newState: Partial<NotificationType>[]) => void,
    appendState: (newNotification: Partial<NotificationType>) => void,
    DeleteState: (notificationId: number) => void,
    updateStateById: (notificationId: number, updatedNotification: Partial<NotificationType>) => void,
    resetState: () => void,
}

export const useNotificationStore = create<notificationStore>()(
    persist(
        (set, _) => ({
            notifications: [],
            setState: (newState) => set(() => ({ notifications: newState })),
            appendState: (newNotification) => set((state) => ({ notifications: [newNotification, ...state.notifications] })),
            DeleteState: (notificationId: number) => set((state) => ({ notifications: state.notifications.filter(notification => notification.id !== notificationId) })),
            resetState: () => {
                set(() => ({ notifications: [] }));
                localStorage.removeItem('notification-storage');
            },
            updateStateById: (notificationId, updatedNotification) => set((state) => ({
                notifications: state.notifications.map(notification =>
                    notification.id === notificationId ? { ...notification, ...updatedNotification } : notification
                ),
            })),
        }),
        {
            name: 'notification-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)



