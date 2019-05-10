interface Iresolve {
  (x:any):void
}

interface Ireject {
  (x:any):void
}

interface IMyPromise {
  (resolve: Iresolve, reject: Ireject):void
};

class MyPromise  {
  constructor (fun:IMyPromise) {
  }
};