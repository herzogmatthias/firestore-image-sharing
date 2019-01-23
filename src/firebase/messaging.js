import { messaging } from "./firebase";

export const askForPermissionToReceiveNotifications = async () => {
    try {
        await messaging.requestPermission();
        const token = await messaging.getToken();
        return token;
    } catch (error) {
        console.log(error);
    }
}