# Queue

[![SLSA 3](https://img.shields.io/badge/Queue-JS-blue)](https://slsa.dev)
[![SLSA 3](https://img.shields.io/badge/node-v20-red)](https://slsa.dev)
[![SLSA 3](https://img.shields.io/badge/npm-10.2.4-green)](https://slsa.dev)

**Queue Management** provides a Queue class that helps you manage multiple concurrent tasks efficiently without blocking the main thread. It allows you to enqueue tasks, handle errors gracefully, track progress, and cancel all tasks if needed.

The EventQueue module provides a flexible and event-driven way to manage tasks in a browser environment. By using this module, you can handle long-running operations, progress updates, error handling, and task cancellation in a clean and efficient manner.

### Features

- **Enqueue Task**: Enqueue tasks and execute them sequentially without blocking the main thread
- **Handle errors**: Handle errors for each task with custom error handling functions
- **Track progress**: Track progress for each task with custom progress handling functions
- **Cancel all tasks**: Cancel all tasks in the queue, including the currently running task
- **Event-Driven**: Utilizes the `EventTarget` interface for handling task-related events, making it flexible and decoupled from direct method calls.
- **Task Enqueuing**: Easily enqueue tasks with optional error and progress handlers.
- **Progress Updates**: Supports real-time progress updates for each task.
- **Task Cancellation**: Allows for cancellation of individual tasks or all tasks in the queue.
- **Error Handling**: Provides a mechanism to handle errors within tasks gracefully.
- **Promise-Based**: Uses Promises for task execution, making it easy to handle asynchronous operations.
- **Compatibility**: Designed to work in modern browsers with support for ES6 modules and the `EventTarget` interface.

> Note : Since this module is designed for a browser environment, ensure you have a way to include ES6 modules. You can use tools like Webpack, Parcel, or simply include it in a script tag if your browser supports ES6 modules natively.

### Installation

```bash
  npm install Queue
```

### Usage [Queue]

1. Create an instance of the `Queue` class:

```javascript
const queue = new Queue();
```

2. Define your task functions. These functions should return a Promise and optionally accept `onProgress` and `signal` callbacks for progress tracking and task cancellation, respectively:

```javascript
function apiRequest(onProgress, signal) {
  return new Promise((resolve, reject) => {
    // Your API request logic here
    // Call onProgress with progress information
    // Check signal.aborted to handle cancellation
  });
}

function convertVideoToFrames(onProgress, signal) {
  return new Promise((resolve, reject) => {
    // Your video conversion logic here
    // Call onProgress with progress information
    // Check signal.aborted to handle cancellation
  });
}
```

3. Define error handling and progress handling functions (optional):

```javascript
function handleApiRequestError(error) {
  // Handle API request error
}

function handleVideoConversionError(error) {
  // Handle video conversion error
}

function handleApiRequestProgress(progress) {
  // Handle API request progress
}

function handleVideoConversionProgress(progress) {
  // Handle video conversion progress
}
```

4. Enqueue tasks with optional error handling and progress tracking functions:

```javascript
queue.enqueue(apiRequest, handleApiRequestError, handleApiRequestProgress);
queue.enqueue(
  convertVideoToFrames,
  handleVideoConversionError,
  handleVideoConversionProgress
);
```

5. To cancel all tasks in the queue, including the currently running task, call the `cancelAllTasks` method:

```javascript
queue.cancelAllTasks();
```

### Example

#### Basic Example

```javascript
import { Queue } from "Queue";

const queue = new Queue();

function apiRequest() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("API request completed");
      resolve();
    }, 2000);
  });
}

function convertVideoToFrames() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Video converted to frames");
      resolve();
    }, 5000);
  });
}

queue.enqueue(apiRequest);
queue.enqueue(convertVideoToFrames);
queue.enqueue(apiRequest);
queue.enqueue(convertVideoToFrames);
```

In this example, we enqueue two API request tasks and two video conversion tasks. The tasks will be executed sequentially without blocking the main thread.

#### Example with Error Handling

```javascript
import { Queue } from "Queue";

const queue = new Queue();

function apiRequest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        console.log("API request completed");
        resolve();
      } else {
        reject(new Error("API request failed"));
      }
    }, 2000);
  });
}

function convertVideoToFrames() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        console.log("Video converted to frames");
        resolve();
      } else {
        reject(new Error("Video conversion failed"));
      }
    }, 5000);
  });
}

function handleApiRequestError(error) {
  console.error("API request error:", error);
  // Implement your error handling logic here
}

function handleVideoConversionError(error) {
  console.error("Video conversion error:", error);
  // Implement your error handling logic here
}

queue.enqueue(apiRequest, handleApiRequestError);
queue.enqueue(convertVideoToFrames, handleVideoConversionError);
queue.enqueue(apiRequest, handleApiRequestError);
queue.enqueue(convertVideoToFrames, handleVideoConversionError);
```

In this example, we define error handling functions for API requests and video conversions. If any task fails, the corresponding error handling function will be called with the error object.

#### Example with Progress Tracking

```javascript
import { Queue } from "Queue";

const queue = new Queue();

function apiRequest(onProgress) {
  return new Promise((resolve, reject) => {
    const totalSteps = 5;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      onProgress((currentStep / totalSteps) * 100);
      if (currentStep === totalSteps) {
        clearInterval(interval);
        const success = Math.random() > 0.5;
        if (success) {
          console.log("API request completed");
          resolve();
        } else {
          reject(new Error("API request failed"));
        }
      }
    }, 1000);
  });
}

function convertVideoToFrames(onProgress) {
  return new Promise((resolve, reject) => {
    const totalSteps = 10;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      onProgress((currentStep / totalSteps) * 100);
      if (currentStep === totalSteps) {
        clearInterval(interval);
        const success = Math.random() > 0.5;
        if (success) {
          console.log("Video converted to frames");
          resolve();
        } else {
          reject(new Error("Video conversion failed"));
        }
      }
    }, 500);
  });
}

function handleApiRequestError(error) {
  console.error("API request error:", error);
  // Implement your error handling logic here
}

function handleVideoConversionError(error) {
  console.error("Video conversion error:", error);
  // Implement your error handling logic here
}

function handleApiRequestProgress(progress) {
  console.log(`API request progress: ${progress}%`);
}

function handleVideoConversionProgress(progress) {
  console.log(`Video conversion progress: ${progress}%`);
}

queue.enqueue(apiRequest, handleApiRequestError, handleApiRequestProgress);
queue.enqueue(
  convertVideoToFrames,
  handleVideoConversionError,
  handleVideoConversionProgress
);
queue.enqueue(apiRequest, handleApiRequestError, handleApiRequestProgress);
queue.enqueue(
  convertVideoToFrames,
  handleVideoConversionError,
  handleVideoConversionProgress
);
```

In this example, we define progress handling functions for API requests and video conversions. The task functions call the `onProgress` callback periodically with the current progress value. The corresponding progress handling function will be called with the progress information, allowing you to update your user interface or perform any other actions based on the progress.

#### Example with Task Cancellation

```javascript
const Queue = require("./queue");

const queue = new Queue();

function apiRequest(onProgress, signal) {
  return new Promise((resolve, reject) => {
    const totalSteps = 5;
    let currentStep = 0;
    const interval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(interval);
        reject(new DOMException("AbortError", "Task has been canceled."));
      } else {
        currentStep++;
        onProgress((currentStep / totalSteps) * 100);
        if (currentStep === totalSteps) {
          clearInterval(interval);
          const success = Math.random() > 0.5;
          if (success) {
            console.log("API request completed");
            resolve();
          } else {
            reject(new Error("API request failed"));
          }
        }
      }
    }, 1000);
  });
}

function convertVideoToFrames(onProgress, signal) {
  return new Promise((resolve, reject) => {
    const totalSteps = 10;
    let currentStep = 0;
    const interval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(interval);
        reject(new DOMException("AbortError", "Task has been canceled."));
      } else {
        currentStep++;
        onProgress((currentStep / totalSteps) * 100);
        if (currentStep === totalSteps) {
          clearInterval(interval);
          const success = Math.random() > 0.5;
          if (success) {
            console.log("Video converted to frames");
            resolve();
          } else {
            reject(new Error("Video conversion failed"));
          }
        }
      }
    }, 500);
  });
}

function handleApiRequestError(error) {
  console.error("API request error:", error);
  // Implement your error handling logic here
}

function handleVideoConversionError(error) {
  console.error("Video conversion error:", error);
  // Implement your error handling logic here
}

function handleApiRequestProgress(progress) {
  console.log(`API request progress: ${progress}%`);
}

function handleVideoConversionProgress(progress) {
  console.log(`Video conversion progress: ${progress}%`);
}

queue.enqueue(apiRequest, handleApiRequestError, handleApiRequestProgress);
queue.enqueue(
  convertVideoToFrames,
  handleVideoConversionError,
  handleVideoConversionProgress
);
queue.enqueue(apiRequest, handleApiRequestError, handleApiRequestProgress);
queue.enqueue(
  convertVideoToFrames,
  handleVideoConversionError,
  handleVideoConversionProgress
);

// Cancel all tasks after 5 seconds
setTimeout(() => {
  queue.cancelAllTasks();
}, 5000);
```

n this example, we've updated the apiRequest and convertVideoToFrames functions to accept a signal argument. This signal is used to check if the task has been canceled (signal.aborted). If the task is canceled, we clear the interval and reject the Promise with a DOMException of type AbortError.
Additionally, we've added a setTimeout function that calls queue.cancelAllTasks() after 5 seconds. This will cancel all tasks in the queue, including the currently running task.
When you run this code, you'll see that tasks start executing, and after 5 seconds, all tasks are canceled. The output might look something like this:

## Usage [EventQueue]

### Importing EventQueue

```javascript
import { EventQueue } from "Queue";
```

**Creating an EventQueue Instance**

```javascript
const queue = new EventQueue();
```

**Enqueuing Tasks**

Tasks can be enqueued with optional error and progress handlers.

```javascript
const task = (progressCallback, signal) => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(interval);
        reject(new Error("Task aborted"));
      } else {
        progress += 10;
        progressCallback(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve("Task completed");
        }
      }
    }, 100);
  });
};

queue.enqueue(
  task,
  (error) => console.error("Task failed:", error),
  (progress) => console.log("Task progress:", progress)
);
```

**Cancelling All Tasks**

You can cancel all tasks in the queue:

```javascript
queue.cancelAllTasks();
```

### Examples

**Simple Counter Task**

```javascript
const simpleCounterTask = (progressCallback, signal) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const interval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(interval);
        reject(new Error("Task aborted"));
      } else {
        count += 10;
        progressCallback(count);
        if (count >= 100) {
          clearInterval(interval);
          resolve("Simple Counter Task completed");
        }
      }
    }, 100);
  });
};

queue.enqueue(
  simpleCounterTask,
  (error) => console.error("Simple Counter Task failed:", error),
  (progress) => console.log("Simple Counter Task progress:", progress)
);
```

**Network Request Simulation**

```javascript
const networkRequestTask = (progressCallback, signal) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (signal.aborted) {
        reject(new Error("Task aborted"));
      } else {
        progressCallback(100);
        resolve("Network Request Task completed");
      }
    }, 2000);
  });
};

queue.enqueue(
  networkRequestTask,
  (error) => console.error("Network Request Task failed:", error),
  (progress) => console.log("Network Request Task progress:", progress)
);
```

**File Upload Simulation**

```javascript
const fileUploadTask = (progressCallback, signal) => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(interval);
        reject(new Error("Task aborted"));
      } else {
        progress += 20;
        progressCallback(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve("File Upload Task completed");
        }
      }
    }, 500);
  });
};

queue.enqueue(
  fileUploadTask,
  (error) => console.error("File Upload Task failed:", error),
  (progress) => console.log("File Upload Task progress:", progress)
);
```

**Task with Error Handling**

```javascript
const errorHandlingTask = (progressCallback, signal) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (signal.aborted) {
        reject(new Error("Task aborted"));
      } else {
        reject(new Error("Task failed due to an error"));
      }
    }, 1000);
  });
};

queue.enqueue(
  errorHandlingTask,
  (error) => console.error("Error Handling Task failed:", error),
  (progress) => console.log("Error Handling Task progress:", progress)
);
```

**Task Cancellation**

```javascript
const cancellationTask = (progressCallback, signal) => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(interval);
        reject(new Error("Task aborted"));
      } else {
        progress += 10;
        progressCallback(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve("Cancellation Task completed");
        }
      }
    }, 100);
  });
};

queue.enqueue(
  cancellationTask,
  (error) => console.error("Cancellation Task failed:", error),
  (progress) => console.log("Cancellation Task progress:", progress)
);
```

**Cancelling All Tasks After a Delay**

```javascript
setTimeout(() => {
  queue.cancelAllTasks();
}, 3000);
```
