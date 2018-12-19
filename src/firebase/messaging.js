import { messaging } from "./firebase";

export const askForPermissionToReceiveNotifications = async () => {
    try {
        console.log(messaging);
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
}