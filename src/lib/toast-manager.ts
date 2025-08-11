// Toast manager to prevent stacking notifications
class ToastManager {
  private activeToasts = new Set<string>();

  showToast(toastFn: () => void, id: string) {
    // Clear any existing toast with the same ID
    if (this.activeToasts.has(id)) {
      console.log("🔄 Preventing duplicate toast:", id);
      return;
    }

    this.activeToasts.add(id);
    toastFn();

    // Remove the toast ID after a delay
    setTimeout(() => {
      this.activeToasts.delete(id);
    }, 5000);
  }

  clear() {
    this.activeToasts.clear();
  }
}

export const toastManager = new ToastManager();