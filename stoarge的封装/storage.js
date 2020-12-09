class CacheItem {
  constructor(data, timeout) {
    this.data = JSON.stringify(data);
    this.timeout = timeout * 1000;
    this.createTime = +new Date();
  }
}

class Storage {
  set(key, data, timeout = 0) {
    const storageCell = new CacheItem(data, timeout);
    sessionStorage.setItem(key, JSON.stringify(storageCell));
  }

  get(key) {
    let storageCell = sessionStorage.getItem(key);
    if (!storageCell) return null;
    storageCell = storageCell && JSON.parse(storageCell);
    const nowTime = +new Date();
    const createTime = storageCell.createTime;
    const timeout = storageCell.timeout;
    if (timeout === 0 || nowTime - createTime < timeout) {
      return JSON.parse(storageCell.data);
    }
    this.remove(key);
    return null;
  }

  remove(key) {
    sessionStorage.removeItem(key);
  }

  clear() {
    sessionStorage.clear();
  }
}

export default new Storage();
