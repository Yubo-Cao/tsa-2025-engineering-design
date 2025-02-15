import {
  InstallPrompt,
  PushNotificationManager,
} from "@/components/push-notification";

export default function Home() {
  return (
    <div className="absolute inset-0 bg-slate-50">
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
}
