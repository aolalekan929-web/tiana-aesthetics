const DATABASE_NAME = 'tiana-aesthetics-media';
const DATABASE_VERSION = 1;
const STORE_NAME = 'media';

let databasePromise;

function openDatabase() {
  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('This browser does not support local media storage.'));
  }

  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Could not open local media storage.'));
      request.onblocked = () => reject(new Error('Close other Tiana Aesthetics tabs to finish opening local media storage.'));
    }).catch(error => {
      databasePromise = undefined;
      throw error;
    });
  }

  return databasePromise;
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `media-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function saveMediaFiles(files) {
  const database = await openDatabase();
  const records = files.map(file => ({
    id: createId(),
    blob: file,
    name: file.name,
    type: file.type || 'application/octet-stream',
  }));

  await new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    records.forEach(record => store.put(record));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error('Could not save the selected media.'));
    transaction.onabort = () => reject(transaction.error || new Error('Saving the selected media was cancelled.'));
  });

  return records.map(record => ({
    src: `idb:${record.id}`,
    kind: record.type.startsWith('video/') ? 'video' : 'image',
    name: record.name,
  }));
}

export async function loadMediaBlob(reference) {
  if (!reference?.startsWith('idb:')) return null;
  const database = await openDatabase();
  const id = reference.slice(4);

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result?.blob || null);
    request.onerror = () => reject(request.error || new Error('Could not load saved media.'));
  });
}

export async function removeMediaFiles(references) {
  const ids = [...new Set(references.filter(reference => reference?.startsWith('idb:')).map(reference => reference.slice(4)))];
  if (!ids.length) return;

  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    ids.forEach(id => store.delete(id));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error('Could not remove saved media.'));
    transaction.onabort = () => reject(transaction.error || new Error('Removing saved media was cancelled.'));
  });
}
