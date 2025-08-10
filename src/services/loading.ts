// Global loading state management
class LoadingService {
  private requestCount = 0;
  private listeners: Array<(isLoading: boolean) => void> = [];

  startLoading() {
    this.requestCount++;
    this.notifyListeners();
  }

  stopLoading() {
    this.requestCount = Math.max(0, this.requestCount - 1);
    this.notifyListeners();
  }

  get isLoading() {
    return this.requestCount > 0;
  }

  subscribe(listener: (isLoading: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.isLoading));
  }
}

export const loadingService = new LoadingService();
