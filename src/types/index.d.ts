type UserChoice = Promise<{
  outcome: 'accepted' | 'dismissed';
  platform: string;
}>;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: UserChoice;
  prompt(): Promise<UserChoice>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
