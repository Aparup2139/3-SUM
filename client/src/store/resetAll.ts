import { useScreenSizeStore } from './screenSizestate.store'
import { useTaskStore } from './task.store'
import { useOpenTaskUpdate } from './updateTaskSheet'
import { useUploadVideo } from './uploadVideo.store'
import { useUserStore } from './user.store'


export const resetAllStores = () => {
  useUserStore.getState().resetState()
  useTaskStore.getState().resetState()
  useScreenSizeStore.getState().resetState()
  useOpenTaskUpdate.getState().resetState()
  useUploadVideo.getState().resetState()
}
