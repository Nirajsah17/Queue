// eventQueue.js
class EventQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.cancelSource = null;

    this.eventTarget = new EventTarget();
    this.eventTarget.addEventListener('enqueue', (event) => {
      const { task, onError, onProgress } = event.detail;
      this.queue.push({ task, onError, onProgress });
      this.processQueue();
    });

    this.eventTarget.addEventListener('cancelAll', () => {
      if (this.cancelSource) {
        this.cancelSource.abort('All tasks have been canceled.');
      }
      this.queue = [];
    });
  }

  async dequeue() {
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
          if (error.name === 'AbortError') {
            console.log('Task canceled:', error.message);
          } else {
            if (onError) onError(error);
            else console.error('Unhandled error in task:', error);
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
      if (this.queue.length > 0) {
        this.processQueue();
      }
    });
  }

  enqueue(task, onError, onProgress) {
    const event = new CustomEvent('enqueue', {
      detail: { task, onError, onProgress }
    });
    this.eventTarget.dispatchEvent(event);
  }

  cancelAllTasks() {
    const event = new Event('cancelAll');
    this.eventTarget.dispatchEvent(event);
  }
}

export default EventQueue;
