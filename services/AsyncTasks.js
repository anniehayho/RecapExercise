export class AsyncTask {
  constructor(onPreExecute, doInBackground, onPostExecute, onProgressUpdate) {
    this.onPreExecute = onPreExecute || (() => {});
    this.doInBackground = doInBackground || (() => {});
    this.onPostExecute = onPostExecute || (() => {});
    this.onProgressUpdate = onProgressUpdate || (() => {});
    this.isCancelled = false;
  }

  execute(...params) {
    this.onPreExecute();

    setTimeout(() => {
      if (this.isCancelled) return;

      const result = this.doInBackground(...params);

      this.onPostExecute(result);
    }, 0);
  }

  publishProgress(progress) {
    if (this.isCancelled) return;
    this.onProgressUpdate(progress);
  }

  cancel() {
    this.isCancelled = true;
  }
}

export class Coroutine {
  constructor() {
    this.isCancelled = false;
    this.activePromises = [];
  }

  async launch(asyncFunction, ...params) {
    try {
      if (this.isCancelled) return;
      
      const promise = asyncFunction(...params);
      this.activePromises.push(promise);
      
      const result = await promise;
      
      if (this.isCancelled) return;
      this.activePromises = this.activePromises.filter(p => p !== promise);
      
      return result;
    } catch (error) {
      console.error('Coroutine error:', error);
      throw error;
    }
  }

  cancel() {
    this.isCancelled = true;
    this.activePromises = [];
  }
}

export const createCountingTask = (onProgress, onComplete) => {
  return new AsyncTask(
    () => {
      console.log('Starting counting task...');
    },
    (maxCount = 10) => {
      let count = 0;
      const results = [];
      
      for (let i = 0; i < maxCount; i++) {
        count++;
        results.push(count);
        
        onProgress && onProgress({
          progress: Math.floor((count / maxCount) * 100),
          currentCount: count
        });
      }
      
      return results;
    },
    (results) => {
      console.log('Counting task completed:', results);
      onComplete && onComplete(results);
    }
  );
};

export const countWithCoroutine = async (maxCount = 10, onProgress, onComplete) => {
  const coroutine = new Coroutine();
  
  try {
    await coroutine.launch(async () => {
      const results = [];
      
      for (let i = 0; i < maxCount; i++) {
        if (coroutine.isCancelled) break;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        results.push(i + 1);
        
        onProgress && onProgress({
          progress: Math.floor(((i + 1) / maxCount) * 100),
          currentCount: i + 1
        });
      }
      
      if (!coroutine.isCancelled) {
        onComplete && onComplete(results);
      }
      
      return results;
    });
  } catch (error) {
    console.error('Coroutine counting error:', error);
  }
  
  return coroutine;
}; 