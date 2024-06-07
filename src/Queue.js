class Queue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.cancelSource = null;
  }

  enqueue(task, onError, onProgress) {
    this.queue.push({ task, onError, onProgress });
    this.processQueue();
  }

  dequeue() {
    if (this.queue.length === 0) return Promise.resolve();
    const { task, onError, onProgress } = this.queue.shift();
    this.cancelSource = new AbortController();
    return new Promise((resolve, reject) => {
      const progressCallback = (progress) => {
        if (onProgress) onProgress(progress);
      };
      task(progressCallback, this.cancelSource.signal)
        .then(resolve)
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("Task canceled:", error.message);
          } else {
            if (onError) onError(error);
            else console.error("Unhandled error in task:", error);
          }
          reject(error);
        })
        .finally(() => {
          this.cancelSource = null;
          this.processQueue();
        });
    });
  }

  processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;
    this.dequeue().then(() => {
      this.isProcessing = false;
    });
  }

  cancelAllTasks() {
    if (this.cancelSource) {
      this.cancelSource.abort("All tasks have been canceled.");
    }
    this.queue = [];
  }
}

export default Queue;
export { Queue };
